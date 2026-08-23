import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { n as formatDateLong, t as formatBRL } from "./format-DeTY0EH_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metas.index-IbXokdO3.js
var import_jsx_runtime = require_jsx_runtime();
function MetasList() {
	const { goals, setFeaturedGoal, canWrite } = useStore();
	const activeCount = goals.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Metas",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/metas/nova",
			className: "p-2 rounded-full bg-primary text-on-primary",
			"aria-label": "Nova meta",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined",
				children: "add"
			})
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
					children: "Minhas Metas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-body-sm text-body-sm text-on-surface-variant mt-xs",
					children: [
						activeCount,
						" meta",
						activeCount !== 1 ? "s" : "",
						" ativa",
						activeCount !== 1 ? "s" : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/metas/nova",
					className: "hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined !text-[18px]",
						children: "add"
					}), "Nova Meta"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-md",
				children: goals.map((g) => {
					const pct = Math.min(100, g.saved / g.target * 100);
					const remaining = Math.max(0, g.target - g.saved);
					const isFeatured = g.is_featured;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/metas/$id/editar",
						params: { id: g.id },
						className: `relative bg-surface-container-lowest rounded-xl p-md border card-shadow hover:-translate-y-0.5 transition-transform ${isFeatured ? "border-primary ring-2 ring-primary/20" : "border-outline-variant"}`,
						children: [
							isFeatured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-2 right-2 material-symbols-outlined text-primary",
								title: "Meta em destaque",
								children: "stars"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined",
										children: g.icon
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-headline-md text-headline-md text-primary pr-6",
										children: g.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-body-sm text-body-sm text-on-surface-variant",
										children: ["Prazo: ", formatDateLong(g.deadline)]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-numeric-data text-numeric-data text-primary",
											children: formatBRL(g.saved)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: ["de ", formatBRL(g.target)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-sm w-full bg-surface-container h-2 rounded-full overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-secondary h-full rounded-full animate-fill-bar",
											style: { width: `${pct}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-sm flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-label-md text-label-md text-on-secondary-container bg-secondary-container px-2 py-[2px] rounded-full",
											children: [pct.toFixed(0), "%"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: ["Falta ", formatBRL(remaining)]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: async (e) => {
									e.preventDefault();
									e.stopPropagation();
									if (!canWrite) {
										toast.error("Ative uma chave de acesso para alterar a meta em destaque.");
										return;
									}
									await setFeaturedGoal(isFeatured ? null : g.id);
									toast.success(isFeatured ? "Meta removida do destaque" : "Meta em destaque definida");
								},
								className: `mt-md w-full inline-flex items-center justify-center gap-sm px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${isFeatured ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined !text-[18px]",
									children: isFeatured ? "star" : "star_border"
								}), isFeatured ? "Em destaque" : "Destacar no painel"]
							})
						]
					}, g.id);
				})
			})]
		})
	});
}
//#endregion
export { MetasList as component };
