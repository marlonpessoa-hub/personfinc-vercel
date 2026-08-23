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

/** Lê despesas de imagens (foto/print/página de PDF) usando IA de visão. */
export const extractExpensesFromImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("IA indisponível no momento.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "Você extrai despesas de comprovantes, extratos e faturas em português do Brasil. " +
              "Responda somente chamando a ferramenta registrar_despesas. " +
              "Valores sempre positivos em reais (ponto decimal). Datas em YYYY-MM-DD quando visíveis, senão null. " +
              "Ignore saldos, totais acumulados, limites e receitas.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extraia as despesas destas imagens." },
              ...data.images.map((url) => ({ type: "image_url", image_url: { url } })),
            ],
          },
        ],
        tools: [
          {
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
          },
        ],
        tool_choice: { type: "function", function: { name: "registrar_despesas" } },
      }),
    });

    if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em instantes.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados no workspace Lovable.");
    if (!res.ok) throw new Error(`Falha na leitura por IA (${res.status}).`);

    const json = (await res.json()) as {
      choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
    };
    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return { rows: [] as ExtractedExpense[] };

    let parsed: unknown;
    try {
      parsed = JSON.parse(args);
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
