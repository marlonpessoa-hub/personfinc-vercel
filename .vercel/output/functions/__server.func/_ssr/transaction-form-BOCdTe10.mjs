import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transaction-form-BOCdTe10.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TransactionForm({ title, kind, onKindChange, categories, cards = [], initial, onSubmit, onCancel, onDelete }) {
	const [description, setDescription] = (0, import_react.useState)(initial?.description ?? "");
	const [amount, setAmount] = (0, import_react.useState)(initial?.amount ? initial.amount.toString() : "");
	const [categoryId, setCategoryId] = (0, import_react.useState)(initial?.categoryId || categories[0]?.id || "");
	const [date, setDate] = (0, import_react.useState)(initial?.date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [note, setNote] = (0, import_react.useState)(initial?.note ?? "");
	const [paid, setPaid] = (0, import_react.useState)(initial?.paid ?? false);
	const [cardId, setCardId] = (0, import_react.useState)(initial?.cardId ?? "");
	const [payer, setPayer] = (0, import_react.useState)(initial?.payer ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit({
					description,
					amount: parseFloat(amount || "0"),
					categoryId,
					date,
					note,
					paid,
					cardId,
					payer
				});
			},
			className: "max-w-2xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex bg-surface-container rounded-full p-1",
					children: ["despesa", "receita"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onKindChange(k),
						className: "px-5 py-2 rounded-full font-label-md text-label-md capitalize transition-colors " + (kind === k ? k === "receita" ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container" : "text-on-surface-variant"),
						children: k
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Descrição",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Ex: Supermercado Extra",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Valor (R$)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.01",
								min: "0",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: "0,00",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Categoria",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: categoryId,
								onChange: (e) => setCategoryId(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary",
								children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Data",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})
						}),
						kind === "despesa" && cards.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cartão (opcional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: cardId,
								onChange: (e) => setCardId(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Sem cartão / dinheiro"
								}), cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										c.name,
										c.last4 ? ` ····${c.last4}` : "",
										" · ",
										c.kind === "credito" ? "Crédito" : "Débito"
									]
								}, c.id))]
							})
						}),
						kind === "despesa" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Responsável pela compra (opcional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: payer,
								onChange: (e) => setPayer(e.target.value),
								placeholder: "Ex: Marlon",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})
						}),
						kind === "despesa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-md rounded-lg border border-outline px-md py-sm cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-label-md text-label-md text-on-surface-variant uppercase",
								children: "Quitado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-body-sm text-body-sm text-on-surface-variant",
								children: "Marque quando a despesa já foi paga — antes ou depois da data."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: paid,
								onChange: (e) => setPaid(e.target.checked),
								className: "w-5 h-5 accent-[var(--color-primary,currentColor)] text-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Observação (opcional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: note,
								onChange: (e) => setNote(e.target.value),
								rows: 3,
								placeholder: "Adicione uma nota...",
								className: "w-full rounded-lg border border-outline bg-surface-container-lowest px-md py-sm outline-none focus:border-primary resize-none"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse md:flex-row md:justify-between gap-sm",
					children: [onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onDelete,
						className: "inline-flex items-center justify-center gap-sm px-4 py-3 rounded-full text-error font-label-md text-label-md hover:bg-error-container",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[18px]",
							children: "delete"
						}), "Excluir"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse md:flex-row gap-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onCancel,
							className: "px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
							children: "Salvar"
						})]
					})]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
			children: label
		}), children]
	});
}
//#endregion
export { TransactionForm as t };
