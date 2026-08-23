import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { t as formatBRL } from "./format-DeTY0EH_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categorias.index-BMCzBKux.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriasList() {
	const { categories, transactions } = useStore();
	const [tab, setTab] = (0, import_react.useState)("despesa");
	const filtered = categories.filter((c) => c.kind === tab);
	const spentByCategory = (id) => Math.abs(transactions.filter((t) => t.categoryId === id && t.amount < 0).reduce((a, b) => a + b.amount, 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Categorias",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/categorias/nova",
			className: "p-2 rounded-full bg-primary text-on-primary",
			"aria-label": "Nova categoria",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined",
				children: "add"
			})
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
						children: "Categorias"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/categorias/nova",
						className: "hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[18px]",
							children: "add"
						}), "Nova Categoria"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex bg-surface-container rounded-full p-1",
					children: ["despesa", "receita"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(k),
						className: "px-5 py-2 rounded-full font-label-md text-label-md capitalize " + (tab === k ? "bg-primary text-on-primary" : "text-on-surface-variant"),
						children: k === "despesa" ? "Despesas" : "Receitas"
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md",
					children: filtered.map((cat) => {
						const spent = spentByCategory(cat.id);
						const pct = cat.budget ? Math.min(100, spent / cat.budget * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/categorias/$id/editar",
							params: { id: cat.id },
							className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow hover:-translate-y-0.5 transition-transform",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-12 h-12 rounded-full flex items-center justify-center " + cat.color,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined",
											children: cat.icon
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body-lg text-body-lg text-primary font-medium",
											children: cat.name
										}), cat.kind === "despesa" && cat.budget ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: [
												formatBRL(spent),
												" de ",
												formatBRL(cat.budget)
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body-sm text-body-sm text-on-surface-variant capitalize",
											children: cat.kind
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined text-on-surface-variant",
										children: "chevron_right"
									})
								]
							}), cat.kind === "despesa" && cat.budget ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-md w-full bg-surface-container h-2 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full " + (pct >= 90 ? "bg-error" : "bg-primary"),
									style: { width: `${pct}%` }
								})
							}) : null]
						}, cat.id);
					})
				})
			]
		})
	});
}
//#endregion
export { CategoriasList as component };
