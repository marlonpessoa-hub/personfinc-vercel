import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as CardForm } from "./card-form-C6v_3HXJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cartoes.novo-CSe0l_f7.js
var import_jsx_runtime = require_jsx_runtime();
function NovoCartao() {
	const navigate = useNavigate();
	const { addCard } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardForm, {
		title: "Novo Cartão",
		onCancel: () => navigate({ to: "/cartoes" }),
		onSubmit: async (data) => {
			await addCard(data);
			toast.success("Cartão cadastrado");
			navigate({ to: "/cartoes" });
		}
	});
}
//#endregion
export { NovoCartao as component };
