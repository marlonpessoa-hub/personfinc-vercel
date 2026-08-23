import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as Route } from "./cartoes._id.editar-Cpp5WGgD.mjs";
import { t as CardForm } from "./card-form-C6v_3HXJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cartoes._id.editar-LYc0kwz3.js
var import_jsx_runtime = require_jsx_runtime();
function EditarCartao() {
	const navigate = useNavigate();
	const { id } = Route.useParams();
	const { cards, updateCard, removeCard } = useStore();
	const card = cards.find((c) => c.id === id);
	if (!card) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-xl text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-on-surface-variant",
			children: "Cartão não encontrado."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardForm, {
		title: "Editar Cartão",
		initial: {
			name: card.name,
			brand: card.brand,
			kind: card.kind,
			last4: card.last4,
			creditLimit: card.creditLimit,
			closingDay: card.closingDay,
			dueDay: card.dueDay,
			color: card.color
		},
		onCancel: () => navigate({ to: "/cartoes" }),
		onDelete: async () => {
			await removeCard(card.id);
			toast.success("Cartão excluído");
			navigate({ to: "/cartoes" });
		},
		onSubmit: async (data) => {
			await updateCard(card.id, data);
			toast.success("Cartão atualizado");
			navigate({ to: "/cartoes" });
		}
	});
}
//#endregion
export { EditarCartao as component };
