import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as Route } from "./metas._id.editar-BGDxoW9r.mjs";
import { t as GoalForm } from "./goal-form-CneUMWz3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metas._id.editar-CoCQNeF8.js
var import_jsx_runtime = require_jsx_runtime();
function EditarMeta() {
	const navigate = useNavigate();
	const { id } = Route.useParams();
	const { goals, updateGoal, removeGoal } = useStore();
	const g = goals.find((x) => x.id === id);
	if (!g) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-xl text-center text-on-surface-variant",
		children: "Meta não encontrada."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalForm, {
		title: "Editar Meta",
		initial: g,
		onCancel: () => navigate({ to: "/metas" }),
		onDelete: () => {
			removeGoal(g.id);
			toast.success("Meta excluída");
			navigate({ to: "/metas" });
		},
		onSubmit: (data) => {
			updateGoal(g.id, data);
			toast.success("Meta atualizada");
			navigate({ to: "/metas" });
		}
	});
}
//#endregion
export { EditarMeta as component };
