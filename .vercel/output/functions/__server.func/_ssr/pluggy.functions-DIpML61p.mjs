import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { i as stringType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pluggy.functions-DIpML61p.js
/** Gera o token usado pelo widget Pluggy Connect. */
var createPluggyConnectToken_createServerFn_handler = createServerRpc({
	id: "aba05a0b79d87e87213462c839fe9160f6c0b4185df8fa25a09ca126cbf0d5a4",
	name: "createPluggyConnectToken",
	filename: "src/lib/pluggy.functions.ts"
}, (opts) => createPluggyConnectToken.__executeServer(opts));
var createPluggyConnectToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ itemId: stringType().optional() }).parse(input ?? {})).handler(createPluggyConnectToken_createServerFn_handler, async ({ data }) => {
	const { pluggyApiKey, pluggyFetch } = await import("./pluggy.server-kqKe6brC.mjs");
	return { connectToken: (await pluggyFetch(await pluggyApiKey(), "/connect_token", {
		method: "POST",
		body: data.itemId ? { itemId: data.itemId } : {}
	})).accessToken };
});
var savePluggyItem_createServerFn_handler = createServerRpc({
	id: "4cf8fcc8b90a13415d44fb862394c0ba8f6ca93e4e746b610693e4653d2239a9",
	name: "savePluggyItem",
	filename: "src/lib/pluggy.functions.ts"
}, (opts) => savePluggyItem.__executeServer(opts));
var savePluggyItem = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ itemId: stringType().min(1) }).parse(input)).handler(savePluggyItem_createServerFn_handler, async ({ data, context }) => {
	const { pluggyApiKey, pluggyFetch } = await import("./pluggy.server-kqKe6brC.mjs");
	const apiKey = await pluggyApiKey();
	const item = await pluggyFetch(apiKey, `/items/${data.itemId}`);
	const { data: conn, error: connErr } = await context.supabase.from("bank_connections").upsert({
		user_id: context.userId,
		pluggy_item_id: item.id,
		institution_name: item.connector?.name ?? "Banco",
		institution_image_url: item.connector?.imageUrl ?? null,
		status: item.status ?? "UPDATED"
	}, { onConflict: "user_id,pluggy_item_id" }).select("id").single();
	if (connErr) throw new Error(connErr.message);
	const accounts = await pluggyFetch(apiKey, `/accounts?itemId=${item.id}`);
	if (accounts.results.length > 0) {
		const rows = accounts.results.map((a) => ({
			user_id: context.userId,
			connection_id: conn.id,
			pluggy_account_id: a.id,
			name: a.name ?? "Conta",
			type: a.type ?? "BANK",
			number: a.number ?? null,
			balance: a.balance ?? 0,
			credit_limit: a.creditData?.creditLimit ?? null,
			due_day: a.creditData?.balanceDueDate ? Number(a.creditData.balanceDueDate.slice(8, 10)) : null
		}));
		const { error } = await context.supabase.from("bank_accounts").upsert(rows, { onConflict: "user_id,pluggy_account_id" });
		if (error) throw new Error(error.message);
	}
	return {
		connectionId: conn.id,
		accounts: accounts.results.length
	};
});
var syncPluggyConnection_createServerFn_handler = createServerRpc({
	id: "c345966d09bad3f530d6dc12a2f845f50542cbbbcedc28eb9dd4f578865fcd02",
	name: "syncPluggyConnection",
	filename: "src/lib/pluggy.functions.ts"
}, (opts) => syncPluggyConnection.__executeServer(opts));
var syncPluggyConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ connectionId: stringType().uuid() }).parse(input)).handler(syncPluggyConnection_createServerFn_handler, async ({ data, context }) => {
	const { pluggyApiKey, pluggyFetch, suggestCategory } = await import("./pluggy.server-kqKe6brC.mjs");
	const apiKey = await pluggyApiKey();
	const { data: conn, error: connErr } = await context.supabase.from("bank_connections").select("id, pluggy_item_id, last_synced_at").eq("id", data.connectionId).single();
	if (connErr || !conn) throw new Error("Conexão não encontrada");
	const { data: accounts, error: accErr } = await context.supabase.from("bank_accounts").select("id, pluggy_account_id, type").eq("connection_id", conn.id);
	if (accErr) throw new Error(accErr.message);
	const { data: categories } = await context.supabase.from("categories").select("id, name, kind");
	const from = conn.last_synced_at ? new Date(conn.last_synced_at).toISOString().slice(0, 10) : (/* @__PURE__ */ new Date(Date.now() - 90 * 864e5)).toISOString().slice(0, 10);
	let inserted = 0;
	for (const acc of accounts ?? []) {
		const txs = await pluggyFetch(apiKey, `/transactions?accountId=${acc.pluggy_account_id}&from=${from}&pageSize=500`);
		if (txs.results.length === 0) continue;
		const rows = txs.results.map((t) => ({
			user_id: context.userId,
			connection_id: conn.id,
			account_id: acc.id,
			pluggy_transaction_id: t.id,
			description: t.description ?? "Lançamento",
			amount: t.amount ?? 0,
			date: (t.date ?? (/* @__PURE__ */ new Date()).toISOString()).slice(0, 10),
			kind: acc.type === "CREDIT" ? "fatura" : "extrato",
			suggested_category_id: suggestCategory(t.description ?? "", t.amount ?? 0, categories ?? []),
			status: "pendente"
		}));
		const { data: ins, error } = await context.supabase.from("staged_transactions").upsert(rows, {
			onConflict: "user_id,pluggy_transaction_id",
			ignoreDuplicates: true
		}).select("id");
		if (error) throw new Error(error.message);
		inserted += ins?.length ?? 0;
	}
	await context.supabase.from("bank_connections").update({ last_synced_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", conn.id);
	return { inserted };
});
var importStagedTransactions_createServerFn_handler = createServerRpc({
	id: "93b1794bddcb3f06b81131c67ee2e8e25542bef5ce9c22cc23a9a5e921598120",
	name: "importStagedTransactions",
	filename: "src/lib/pluggy.functions.ts"
}, (opts) => importStagedTransactions.__executeServer(opts));
var importStagedTransactions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ items: arrayType(objectType({
	id: stringType().uuid(),
	categoryId: stringType().uuid().nullable()
})).min(1) }).parse(input)).handler(importStagedTransactions_createServerFn_handler, async ({ data, context }) => {
	const ids = data.items.map((i) => i.id);
	const { data: staged, error } = await context.supabase.from("staged_transactions").select("id, description, amount, date, pluggy_transaction_id, status").in("id", ids).eq("status", "pendente");
	if (error) throw new Error(error.message);
	let imported = 0;
	for (const s of staged ?? []) {
		const categoryId = data.items.find((i) => i.id === s.id)?.categoryId ?? null;
		const amount = Number(s.amount);
		const { data: tx, error: txErr } = await context.supabase.from("transactions").insert({
			user_id: context.userId,
			description: s.description,
			amount,
			category_id: categoryId,
			date: s.date,
			source: "pluggy",
			external_id: s.pluggy_transaction_id,
			paid: amount < 0,
			paid_at: amount < 0 ? (/* @__PURE__ */ new Date()).toISOString() : null
		}).select("id").single();
		if (txErr) {
			if (!txErr.message.includes("duplicate")) throw new Error(txErr.message);
			await context.supabase.from("staged_transactions").update({ status: "importado" }).eq("id", s.id);
			continue;
		}
		await context.supabase.from("staged_transactions").update({
			status: "importado",
			transaction_id: tx.id
		}).eq("id", s.id);
		imported += 1;
	}
	return { imported };
});
//#endregion
export { createPluggyConnectToken_createServerFn_handler, importStagedTransactions_createServerFn_handler, savePluggyItem_createServerFn_handler, syncPluggyConnection_createServerFn_handler };
