import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as Route } from "./categorias._id.editar-ssfy6Hhq.mjs";
import { t as CategoryForm } from "./category-form-BNAx0ue-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categorias._id.editar-nrL1V7qy.js
var import_jsx_runtime = require_jsx_runtime();
function EditarCategoria() {
	const navigate = useNavigate();
	const { id } = Route.useParams();
	const { categories, updateCategory, removeCategory } = useStore();
	const cat = categories.find((c) => c.id === id);
	if (!cat) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-xl text-center text-on-surface-variant",
		children: "Categoria não encontrada."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryForm, {
		title: "Editar Categoria",
		initial: cat,
		onCancel: () => navigate({ to: "/categorias" }),
		onDelete: async () => {
			try {
				await removeCategory(cat.id);
			} catch {
				return;
			}
			toast.success("Categoria excluída");
			navigate({ to: "/categorias" });
		},
		onSubmit: async (data) => {
			try {
				await updateCategory(cat.id, data);
			} catch {
				return;
			}
			toast.success("Categoria atualizada");
			navigate({ to: "/categorias" });
		}
	});
}
//#endregion
export { EditarCategoria as component };
