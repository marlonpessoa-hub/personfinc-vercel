import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as formatBRL } from "./format-DeTY0EH_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/credit-card-visual-6qIjJWO4.js
var import_jsx_runtime = require_jsx_runtime();
var BRAND_LABEL = {
	visa: "VISA",
	mastercard: "Mastercard",
	elo: "Elo",
	amex: "AMEX",
	hipercard: "Hipercard",
	outro: "Cartão"
};
function CreditCardVisual({ card }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full aspect-[1.68/1] max-w-[380px] rounded-2xl p-md md:p-lg text-on-primary bg-gradient-to-br card-shadow overflow-hidden " + card.color,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-12 bottom-[-3rem] w-40 h-40 rounded-full bg-white/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col h-full justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-label-md text-label-md opacity-80 uppercase",
								children: card.kind === "credito" ? "Crédito" : "Débito"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-headline-md text-headline-md font-bold break-words",
								children: card.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-label-md text-label-md font-bold shrink-0",
							children: BRAND_LABEL[card.brand]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[28px] opacity-90",
							children: "credit_card"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-numeric-data text-numeric-data tracking-[0.2em]",
							children: ["•••• •••• •••• ", card.last4 || "••••"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end justify-between gap-sm",
						children: card.kind === "credito" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-label-md text-label-md opacity-80 uppercase",
							children: "Limite"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-lg text-body-lg font-semibold",
							children: card.creditLimit != null ? formatBRL(card.creditLimit) : "—"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-label-md text-label-md opacity-80 uppercase",
								children: "Fecha / Vence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-body-lg text-body-lg font-semibold",
								children: [
									card.closingDay ?? "—",
									" / ",
									card.dueDay ?? "—"
								]
							})]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm opacity-80",
							children: "Cartão de débito"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { CreditCardVisual as t };
