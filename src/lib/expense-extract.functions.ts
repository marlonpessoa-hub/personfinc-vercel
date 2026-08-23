import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  images: z.array(z.string().min(20)).min(1).max(5),
});

export type ExtractedExpense = {
  description: string;
  amount: number;
  date: string | null;
};

export const extractExpensesFromImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const geminiKey = process.env["GEMINI_API_KEY"];
    if (!lovableKey && !geminiKey) throw new Error("IA indisponível no momento. Configure o GEMINI_API_KEY ou LOVABLE_API_KEY.");

    let endpoint: string;
    let fetchOptions: RequestInit;

    if (geminiKey) {
      // Usar a API NATIVA do Gemini (resolve bugs da camada OpenAI Compatibility)
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiKey}`;
      
      const parts: any[] = [{ text: "Extraia as despesas destas imagens." }];
      for (const url of data.images) {
        const match = url.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        } else {
          parts.push({ text: url });
        }
      }

      fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "Você extrai despesas de comprovantes, extratos e faturas em português do Brasil. Responda somente chamando a ferramenta registrar_despesas. Valores sempre positivos em reais (ponto decimal). Datas em YYYY-MM-DD quando visíveis, senão null. Ignore saldos, totais acumulados, limites e receitas." }]
          },
          contents: [{ role: "user", parts }],
          tools: [{
            functionDeclarations: [{
              name: "registrar_despesas",
              description: "Registra as despesas encontradas",
              parameters: {
                type: "object",
                properties: {
                  despesas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        amount: { type: "number" },
                        date: { type: "string" },
                      },
                      required: ["description", "amount"]
                    }
                  }
                },
                required: ["despesas"]
              }
            }]
          }],
          toolConfig: {
            functionCallingConfig: {
              mode: "ANY",
              allowedFunctionNames: ["registrar_despesas"]
            }
          }
        }),
      };
    } else {
      // Fallback para Lovable (formato OpenAI)
      endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
      fetchOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-1.5-flash",
          messages: [
            {
              role: "system",
              content: "Você extrai despesas de comprovantes, extratos e faturas em português do Brasil. Responda somente chamando a ferramenta registrar_despesas. Valores sempre positivos em reais (ponto decimal). Datas em YYYY-MM-DD quando visíveis, senão null. Ignore saldos, totais acumulados, limites e receitas.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Extraia as despesas destas imagens." },
                ...data.images.map((url) => ({ type: "image_url", image_url: { url } })),
              ],
            },
          ],
          tools: [{
            type: "function",
            function: {
              name: "registrar_despesas",
              description: "Registra as despesas encontradas",
              parameters: {
                type: "object",
                properties: {
                  despesas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        amount: { type: "number" },
                        date: { type: "string" },
                      },
                      required: ["description", "amount"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["despesas"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "registrar_despesas" } },
        }),
      };
    }

    const res = await fetch(endpoint, fetchOptions);

    if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em instantes.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados no workspace Lovable.");
    if (!res.ok) {
      const errorText = await res.text().catch(() => "Sem detalhes");
      console.error("Gemini API Falhou:", res.status, errorText);
      throw new Error(`Falha na leitura por IA (${res.status}): ${errorText}`);
    }

    const json = await res.json();
    let argsStr: string | undefined;

    if (geminiKey) {
      const funcCall = json.candidates?.[0]?.content?.parts?.[0]?.functionCall;
      if (funcCall?.name === "registrar_despesas" && funcCall.args) {
        argsStr = JSON.stringify(funcCall.args);
      }
    } else {
      argsStr = (json as any).choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    }

    if (!argsStr) return { rows: [] as ExtractedExpense[] };

    let parsed: unknown;
    try {
      parsed = JSON.parse(argsStr);
    } catch {
      return { rows: [] as ExtractedExpense[] };
    }

    const shape = z.object({
      despesas: z.array(
        z.object({
          description: z.string().default("Despesa importada"),
          amount: z.number(),
          date: z.string().optional().nullable(),
        }),
      ),
    });
    const safe = shape.safeParse(parsed);
    if (!safe.success) return { rows: [] as ExtractedExpense[] };

    const rows: ExtractedExpense[] = safe.data.despesas
      .filter((d) => Number.isFinite(d.amount) && Math.abs(d.amount) > 0)
      .map((d) => ({
        description: d.description.slice(0, 200) || "Despesa importada",
        amount: Math.abs(d.amount),
        date: d.date && /^\d{4}-\d{2}-\d{2}$/.test(d.date) ? d.date : null,
      }));

    return { rows };
  });
