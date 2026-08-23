import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { i as stringType, n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expense-extract.functions-CPRk4PJx.js
var inputSchema = objectType({ images: arrayType(stringType().min(20)).min(1).max(5) });
var extractExpensesFromImages_createServerFn_handler = createServerRpc({
	id: "0cad7ceba856d8e8a4c69c5e81edda02af45d5c3df5d678f813918d7d7718053",
	name: "extractExpensesFromImages",
	filename: "src/lib/expense-extract.functions.ts"
}, (opts) => extractExpensesFromImages.__executeServer(opts));
var extractExpensesFromImages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => inputSchema.parse(input)).handler(extractExpensesFromImages_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new Error("IA indisponível no momento.");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: "google/gemini-2.5-flash",
			messages: [{
				role: "system",
				content: "Você extrai despesas de comprovantes, extratos e faturas em português do Brasil. Responda somente chamando a ferramenta registrar_despesas. Valores sempre positivos em reais (ponto decimal). Datas em YYYY-MM-DD quando visíveis, senão null. Ignore saldos, totais acumulados, limites e receitas."
			}, {
				role: "user",
				content: [{
					type: "text",
					text: "Extraia as despesas destas imagens."
				}, ...data.images.map((url) => ({
					type: "image_url",
					image_url: { url }
				}))]
			}],
			tools: [{
				type: "function",
				function: {
					name: "registrar_despesas",
					description: "Registra as despesas encontradas",
					parameters: {
						type: "object",
						properties: { despesas: {
							type: "array",
							items: {
								type: "object",
								properties: {
									description: { type: "string" },
									amount: { type: "number" },
									date: { type: "string" }
								},
								required: ["description", "amount"],
								additionalProperties: false
							}
						} },
						required: ["despesas"],
						additionalProperties: false
					}
				}
			}],
			tool_choice: {
				type: "function",
				function: { name: "registrar_despesas" }
			}
		})
	});
	if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em instantes.");
	if (res.status === 402) throw new Error("Créditos de IA esgotados no workspace Lovable.");
	if (!res.ok) throw new Error(`Falha na leitura por IA (${res.status}).`);
	const args = (await res.json()).choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
	if (!args) return { rows: [] };
	let parsed;
	try {
		parsed = JSON.parse(args);
	} catch {
		return { rows: [] };
	}
	const safe = objectType({ despesas: arrayType(objectType({
		description: stringType().default("Despesa importada"),
		amount: numberType(),
		date: stringType().optional().nullable()
	})) }).safeParse(parsed);
	if (!safe.success) return { rows: [] };
	return { rows: safe.data.despesas.filter((d) => Number.isFinite(d.amount) && Math.abs(d.amount) > 0).map((d) => ({
		description: d.description.slice(0, 200) || "Despesa importada",
		amount: Math.abs(d.amount),
		date: d.date && /^\d{4}-\d{2}-\d{2}$/.test(d.date) ? d.date : null
	})) };
});
//#endregion
export { extractExpensesFromImages_createServerFn_handler };
