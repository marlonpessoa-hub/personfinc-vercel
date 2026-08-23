import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as formatMonthLabel, s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { t as formatBRL } from "./format-DeTY0EH_.mjs";
import { t as MonthSelector } from "./month-selector-4biM8GL6.mjs";
import { n as ReminderSettingsCard } from "./reminder-settings-6K8BfRoE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fixas.index-B34_aj6F.js
var import_jsx_runtime = require_jsx_runtime();
function FixasList() {
	const { fixedExpenses, categoryById, month, setMonth, isFixedLaunched, launchFixedExpense, launchAllFixedExpenses } = useStore();
	const total = fixedExpenses.filter((f) => f.active).reduce((a, b) => a + b.amount, 0);
	const pendentes = fixedExpenses.filter((f) => f.active && !isFixedLaunched(f.id, month));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Despesas Fixas",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/fixas/nova",
			className: "p-2 rounded-full bg-primary text-on-primary",
			"aria-label": "Nova despesa fixa",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined",
				children: "add"
			})
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center gap-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary flex-1",
							children: "Despesas Fixas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSelector, {
							value: month,
							onChange: setMonth
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/fixas/nova",
							className: "hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined !text-[18px]",
								children: "add"
							}), "Nova"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex flex-col md:flex-row md:items-center gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant",
							children: ["Total fixo mensal · ", formatMonthLabel(month)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-numeric-data text-numeric-data text-error mt-xs",
							children: formatBRL(total)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: pendentes.length === 0,
						onClick: async () => {
							const n = await launchAllFixedExpenses(month);
							toast.success(n > 0 ? `${n} despesa(s) lançada(s) em ${formatMonthLabel(month)}` : "Todas já estão lançadas neste mês");
						},
						className: "px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-40",
						children: [
							"Lançar pendentes (",
							pendentes.length,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReminderSettingsCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden",
					children: fixedExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-xl text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-on-surface-variant !text-[48px]",
							children: "event_repeat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-sm font-body-lg text-body-lg text-on-surface-variant",
							children: "Nenhuma despesa fixa cadastrada."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-outline-variant/60",
						children: fixedExpenses.map((f) => {
							const cat = categoryById(f.categoryId);
							const launched = isFixedLaunched(f.id, month);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col md:flex-row md:items-center md:justify-between gap-sm md:gap-md p-md min-h-[64px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/fixas/$id/editar",
									params: { id: f.id },
									className: "flex items-center gap-md flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full flex items-center justify-center shrink-0 " + (cat?.color ?? "bg-surface-variant text-on-surface-variant"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined",
											children: cat?.icon ?? "event_repeat"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-body-lg text-body-lg text-primary font-medium break-words",
											children: [f.description, !f.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-sm font-label-md text-label-md text-on-surface-variant",
												children: "(inativa)"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: [
												"Todo dia ",
												f.dayOfMonth,
												" · ",
												cat?.name ?? "Sem categoria"
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between md:justify-end gap-md md:shrink-0 pl-[56px] md:pl-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-numeric-data text-numeric-data text-error whitespace-nowrap",
										children: formatBRL(f.amount)
									}), launched ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-xs font-label-md text-label-md px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[16px]",
											children: "check"
										}), "Lançada"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: async () => {
											await launchFixedExpense(f.id, month);
											toast.success(`Lançada em ${formatMonthLabel(month)}`);
										},
										className: "font-label-md text-label-md px-3 py-1.5 rounded-full border border-outline text-primary hover:bg-surface-container-low",
										children: "Lançar"
									})]
								})]
							}, f.id);
						})
					})
				})
			]
		})
	});
}
//#endregion
export { FixasList as component };
