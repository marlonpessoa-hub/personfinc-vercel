import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category-form-BNAx0ue-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXPENSE_ICONS = [
	"shopping_cart",
	"restaurant",
	"directions_car",
	"home",
	"movie",
	"favorite",
	"school",
	"flight",
	"sports_esports",
	"pets",
	"shopping_bag",
	"receipt_long"
];
var INCOME_ICONS = [
	"work",
	"payments",
	"attach_money",
	"savings",
	"laptop_mac",
	"trending_up",
	"account_balance",
	"card_giftcard",
	"handshake",
	"storefront",
	"local_taxi",
	"redeem"
];
var COLORS = [
	"bg-secondary-container text-on-secondary-container",
	"bg-error-container text-on-error-container",
	"bg-primary-container text-on-primary",
	"bg-surface-variant text-on-surface-variant",
	"bg-tertiary-fixed text-on-tertiary-fixed"
];
function CategoryForm({ title, initial, onSubmit, onCancel, onDelete }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [kind, setKind] = (0, import_react.useState)(initial?.kind ?? "despesa");
	const [icon, setIcon] = (0, import_react.useState)(initial?.icon ?? (initial?.kind === "receita" ? INCOME_ICONS[0] : EXPENSE_ICONS[0]));
	const icons = (0, import_react.useMemo)(() => {
		const base = kind === "receita" ? INCOME_ICONS : EXPENSE_ICONS;
		return base.includes(icon) ? base : [icon, ...base];
	}, [kind, icon]);
	const changeKind = (k) => {
		setKind(k);
		const base = k === "receita" ? INCOME_ICONS : EXPENSE_ICONS;
		if (!base.includes(icon)) setIcon(base[0]);
	};
	const [color, setColor] = (0, import_react.useState)(initial?.color ?? COLORS[0]);
	const [budget, setBudget] = (0, import_react.useState)(initial?.budget?.toString() ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit({
					name,
					kind,
					icon,
					color,
					budget: budget ? parseFloat(budget) : void 0
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Ex: Alimentação",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
							children: "Tipo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex bg-surface-container rounded-full p-1",
							children: ["despesa", "receita"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => changeKind(k),
								className: "px-5 py-2 rounded-full font-label-md text-label-md capitalize " + (kind === k ? "bg-primary text-on-primary" : "text-on-surface-variant"),
								children: k
							}, k))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
							children: "Ícone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-6 gap-sm",
							children: icons.map((ic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIcon(ic),
								className: "aspect-square rounded-lg flex items-center justify-center border transition-all " + (icon === ic ? "border-primary bg-primary/5" : "border-outline-variant hover:bg-surface-container-low"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-primary",
									children: ic
								})
							}, ic))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
							children: "Cor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-sm flex-wrap",
							children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setColor(c),
								className: "w-10 h-10 rounded-full flex items-center justify-center " + c + (color === c ? " ring-2 ring-primary ring-offset-2" : ""),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined !text-[18px]",
									children: icon
								})
							}, c))
						})] }),
						kind === "despesa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
								children: "Limite mensal (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.01",
								min: "0",
								value: budget,
								onChange: (e) => setBudget(e.target.value),
								placeholder: "0,00",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
							})]
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
//#endregion
export { CategoryForm as t };
