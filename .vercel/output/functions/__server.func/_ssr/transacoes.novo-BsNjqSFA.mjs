import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as TransactionForm } from "./transaction-form-BOCdTe10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transacoes.novo-BsNjqSFA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NovoLancamento() {
	const navigate = useNavigate();
	const { addTransaction, categories, cards, month } = useStore();
	const [kind, setKind] = (0, import_react.useState)("despesa");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionForm, {
		title: "Novo Lançamento",
		kind,
		onKindChange: setKind,
		categories: categories.filter((c) => c.kind === kind),
		cards,
		initial: {
			description: "",
			amount: 0,
			categoryId: "",
			date: month === (/* @__PURE__ */ new Date()).toISOString().slice(0, 7) ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : `${month}-01`,
			note: "",
			paid: false,
			cardId: ""
		},
		onCancel: () => navigate({ to: "/transacoes" }),
		onSubmit: (data) => {
			addTransaction({
				description: data.description,
				amount: kind === "despesa" ? -Math.abs(data.amount) : Math.abs(data.amount),
				categoryId: data.categoryId,
				date: data.date,
				note: data.note,
				paid: kind === "despesa" ? data.paid : false,
				cardId: kind === "despesa" ? data.cardId : void 0
			});
			toast.success("Lançamento criado com sucesso");
			navigate({ to: "/transacoes" });
		}
	});
}
//#endregion
export { NovoLancamento as component };
