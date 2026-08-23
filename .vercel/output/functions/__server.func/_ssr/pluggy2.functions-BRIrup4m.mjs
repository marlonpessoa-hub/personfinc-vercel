import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D4K1-VYU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { i as stringType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pluggy2.functions-BRIrup4m.js
/** Gera o token usado pelo widget Pluggy Connect. */
var createPluggyConnectToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ itemId: stringType().optional() }).parse(input ?? {})).handler(createSsrRpc("aba05a0b79d87e87213462c839fe9160f6c0b4185df8fa25a09ca126cbf0d5a4"));
/** Salva o item conectado e suas contas/cartões. */
var savePluggyItem = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ itemId: stringType().min(1) }).parse(input)).handler(createSsrRpc("4cf8fcc8b90a13415d44fb862394c0ba8f6ca93e4e746b610693e4653d2239a9"));
/** Busca extrato e faturas e coloca os itens na fila de revisão. */
var syncPluggyConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ connectionId: stringType().uuid() }).parse(input)).handler(createSsrRpc("c345966d09bad3f530d6dc12a2f845f50542cbbbcedc28eb9dd4f578865fcd02"));
/** Converte itens revisados em lançamentos do app. */
var importStagedTransactions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ items: arrayType(objectType({
	id: stringType().uuid(),
	categoryId: stringType().uuid().nullable()
})).min(1) }).parse(input)).handler(createSsrRpc("93b1794bddcb3f06b81131c67ee2e8e25542bef5ce9c22cc23a9a5e921598120"));
//#endregion
export { syncPluggyConnection as i, importStagedTransactions as n, savePluggyItem as r, createPluggyConnectToken as t };
