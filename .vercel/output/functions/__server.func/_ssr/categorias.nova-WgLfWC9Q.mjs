import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as CategoryForm } from "./category-form-BNAx0ue-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categorias.nova-WgLfWC9Q.js
var import_jsx_runtime = require_jsx_runtime();
function NovaCategoria() {
	const navigate = useNavigate();
	const { addCategory } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryForm, {
		title: "Nova Categoria",
		onCancel: () => navigate({ to: "/categorias" }),
		onSubmit: async (data) => {
			try {
				await addCategory(data);
			} catch {
				return;
			}
			toast.success("Categoria criada");
			navigate({ to: "/categorias" });
		}
	});
}
//#endregion
export { NovaCategoria as component };
