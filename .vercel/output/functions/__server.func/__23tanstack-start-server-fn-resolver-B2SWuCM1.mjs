//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B2SWuCM1.js
var manifest = {
	"0cad7ceba856d8e8a4c69c5e81edda02af45d5c3df5d678f813918d7d7718053": {
		functionName: "extractExpensesFromImages_createServerFn_handler",
		importer: () => import("./_ssr/expense-extract.functions-CPRk4PJx.mjs")
	},
	"4cf8fcc8b90a13415d44fb862394c0ba8f6ca93e4e746b610693e4653d2239a9": {
		functionName: "savePluggyItem_createServerFn_handler",
		importer: () => import("./_ssr/pluggy.functions-DIpML61p.mjs")
	},
	"93b1794bddcb3f06b81131c67ee2e8e25542bef5ce9c22cc23a9a5e921598120": {
		functionName: "importStagedTransactions_createServerFn_handler",
		importer: () => import("./_ssr/pluggy.functions-DIpML61p.mjs")
	},
	"aba05a0b79d87e87213462c839fe9160f6c0b4185df8fa25a09ca126cbf0d5a4": {
		functionName: "createPluggyConnectToken_createServerFn_handler",
		importer: () => import("./_ssr/pluggy.functions-DIpML61p.mjs")
	},
	"c345966d09bad3f530d6dc12a2f845f50542cbbbcedc28eb9dd4f578865fcd02": {
		functionName: "syncPluggyConnection_createServerFn_handler",
		importer: () => import("./_ssr/pluggy.functions-DIpML61p.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
