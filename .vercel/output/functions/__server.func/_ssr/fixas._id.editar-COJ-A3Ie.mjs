import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as Route } from "./fixas._id.editar-CXffPDB8.mjs";
import { t as FixedExpenseForm } from "./fixed-expense-form-DXxzH6xj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fixas._id.editar-COJ-A3Ie.js
var import_jsx_runtime = require_jsx_runtime();
function EditarFixa() {
	const navigate = useNavigate();
	const { id } = Route.useParams();
	const { fixedExpenses, updateFixedExpense, removeFixedExpense, categories } = useStore();
	const fx = fixedExpenses.find((f) => f.id === id);
	if (!fx) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-xl text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-on-surface-variant",
			children: "Despesa fixa não encontrada."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixedExpenseForm, {
		title: "Editar Despesa Fixa",
		categories: categories.filter((c) => c.kind === "despesa"),
		initial: {
			description: fx.description,
			amount: fx.amount,
			categoryId: fx.categoryId,
			dayOfMonth: fx.dayOfMonth,
			active: fx.active,
			note: fx.note ?? ""
		},
		onCancel: () => navigate({ to: "/fixas" }),
		onDelete: async () => {
			await removeFixedExpense(fx.id);
			toast.success("Despesa fixa excluída");
			navigate({ to: "/fixas" });
		},
		onSubmit: async (data) => {
			await updateFixedExpense(fx.id, data);
			toast.success("Despesa fixa atualizada");
			navigate({ to: "/fixas" });
		}
	});
}
//#endregion
export { EditarFixa as component };
