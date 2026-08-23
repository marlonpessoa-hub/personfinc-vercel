import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as FixedExpenseForm } from "./fixed-expense-form-DXxzH6xj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fixas.nova-Q8u0_0m_.js
var import_jsx_runtime = require_jsx_runtime();
function NovaFixa() {
	const navigate = useNavigate();
	const { addFixedExpense, categories } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixedExpenseForm, {
		title: "Nova Despesa Fixa",
		categories: categories.filter((c) => c.kind === "despesa"),
		onCancel: () => navigate({ to: "/fixas" }),
		onSubmit: async (data) => {
			await addFixedExpense(data);
			toast.success("Despesa fixa criada");
			navigate({ to: "/fixas" });
		}
	});
}
//#endregion
export { NovaFixa as component };
