import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fixed-expense-form-DXxzH6xj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FixedExpenseForm({ title, categories, initial, onSubmit, onCancel, onDelete }) {
	const [description, setDescription] = (0, import_react.useState)(initial?.description ?? "");
	const [amount, setAmount] = (0, import_react.useState)(initial?.amount?.toString() ?? "");
	const [categoryId, setCategoryId] = (0, import_react.useState)(initial?.categoryId ?? categories[0]?.id ?? "");
	const [dayOfMonth, setDayOfMonth] = (0, import_react.useState)((initial?.dayOfMonth ?? 5).toString());
	const [active, setActive] = (0, import_react.useState)(initial?.active ?? true);
	const [note, setNote] = (0, import_react.useState)(initial?.note ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit({
					description,
					amount: Math.abs(parseFloat(amount || "0")),
					categoryId,
					dayOfMonth: Math.min(31, Math.max(1, parseInt(dayOfMonth || "1", 10))),
					active,
					note
				});
			},
			className: "max-w-2xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
					children: title
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
								placeholder: "Ex: Aluguel",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Valor mensal (R$)",
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
							label: "Dia do vencimento",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "1",
								max: "31",
								value: dayOfMonth,
								onChange: (e) => setDayOfMonth(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-md py-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-body-lg text-body-lg text-primary",
								children: ["Ativa", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-body-sm text-body-sm text-on-surface-variant",
									children: "Despesas ativas ficam disponíveis para lançar em qualquer mês"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: active,
								onChange: (e) => setActive(e.target.checked),
								className: "w-5 h-5 accent-[var(--color-primary,currentColor)]"
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
export { FixedExpenseForm as t };
