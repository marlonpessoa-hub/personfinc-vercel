import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as Route } from "./transacoes._id.editar-NKyReIiu.mjs";
import { t as TransactionForm } from "./transaction-form-BOCdTe10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transacoes._id.editar-CVWYpZ3_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditarLancamento() {
	const navigate = useNavigate();
	const { id } = Route.useParams();
	const { allTransactions, updateTransaction, removeTransaction, categories, cards } = useStore();
	const tx = allTransactions.find((t) => t.id === id);
	const [kind, setKind] = (0, import_react.useState)(tx && tx.amount >= 0 ? "receita" : "despesa");
	if (!tx) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-xl text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-on-surface-variant",
			children: "Transação não encontrada."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionForm, {
		title: "Editar Lançamento",
		kind,
		onKindChange: setKind,
		categories: categories.filter((c) => c.kind === kind),
		cards,
		initial: {
			description: tx.description,
			amount: Math.abs(tx.amount),
			categoryId: tx.categoryId,
			date: tx.date,
			note: tx.note ?? "",
			paid: tx.paid ?? false,
			cardId: tx.cardId ?? "",
			payer: tx.payer ?? ""
		},
		onCancel: () => navigate({ to: "/transacoes" }),
		onDelete: () => {
			removeTransaction(tx.id);
			toast.success("Lançamento excluído");
			navigate({ to: "/transacoes" });
		},
		onSubmit: (data) => {
			updateTransaction(tx.id, {
				description: data.description,
				amount: kind === "despesa" ? -Math.abs(data.amount) : Math.abs(data.amount),
				categoryId: data.categoryId,
				date: data.date,
				note: data.note,
				paid: kind === "despesa" ? data.paid : false,
				paidAt: kind === "despesa" && data.paid ? tx.paidAt ?? void 0 : void 0,
				cardId: kind === "despesa" ? data.cardId : void 0,
				payer: kind === "despesa" ? data.payer : void 0
			});
			toast.success("Lançamento atualizado");
			navigate({ to: "/transacoes" });
		}
	});
}
//#endregion
export { EditarLancamento as component };
