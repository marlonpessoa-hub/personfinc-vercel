import { i as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { i as formatMonthLabel, o as shiftMonth, s as useStore } from "./_ssr/store-DhZ7fAxm.mjs";
import { n as AppShell } from "./_ssr/app-shell-zcgA_t_N.mjs";
import { i as formatSignedBRL, r as formatDateShort, t as formatBRL } from "./_ssr/format-DeTY0EH_.mjs";
import { t as MonthSelector } from "./_ssr/month-selector-4biM8GL6.mjs";
import { a as Bar, c as Legend, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-Bts7zprh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Cartão de dízimo: calcula uma porcentagem da receita do mês. */
function TitheCard({ income, enabled, percent, onToggle, onPercentChange }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(String(percent));
	const [userId, setUserId] = (0, import_react.useState)(null);
	async function loadUser() {
		if (userId) return userId;
		const { data: auth } = await supabase.auth.getUser();
		if (!auth.user) return null;
		setUserId(auth.user.id);
		return auth.user.id;
	}
	async function savePercent() {
		const value = Number(draft.replace(",", "."));
		if (!Number.isFinite(value) || value < 0 || value > 100) {
			toast.error("Informe uma porcentagem entre 0 e 100");
			return;
		}
		const uid = await loadUser();
		if (!uid) return;
		const { error } = await supabase.from("profiles").update({ tithe_percent: value }).eq("id", uid);
		if (error) {
			toast.error("Não foi possível salvar a porcentagem");
			return;
		}
		onPercentChange(value);
		setEditing(false);
	}
	async function toggleEnabled() {
		const uid = await loadUser();
		if (!uid) return;
		const next = !enabled;
		const { error } = await supabase.from("profiles").update({ tithe_enabled: next }).eq("id", uid);
		if (error) {
			toast.error("Não foi possível alterar o dízimo");
			return;
		}
		onToggle(next);
		toast.success(next ? "Dízimo ativado" : "Dízimo desativado");
	}
	const amount = income * percent / 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow ${enabled ? "" : "opacity-70"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-primary",
						children: "church"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-headline-md text-headline-md text-primary",
						children: "Dízimo"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => void toggleEnabled(),
						className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-secondary" : "bg-surface-variant"}`,
						"aria-label": enabled ? "Desativar dízimo" : "Ativar dízimo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-on-secondary transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}` })
					}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								max: 100,
								step: "0.1",
								value: draft,
								onChange: (e) => setDraft(e.target.value),
								className: "w-20 h-10 px-sm rounded-lg border border-outline bg-surface text-right font-body-lg text-body-lg text-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-body-lg text-body-lg text-on-surface-variant",
								children: "%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void savePercent(),
								className: "p-2 rounded-full text-secondary hover:bg-surface-container-low",
								"aria-label": "Salvar porcentagem",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "check"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setDraft(String(percent));
									setEditing(false);
								},
								className: "p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low",
								"aria-label": "Cancelar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "close"
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setEditing(true),
						className: "flex items-center gap-xs text-on-surface-variant hover:text-primary",
						"aria-label": "Editar porcentagem do dízimo",
						disabled: !enabled,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-body-lg text-body-lg",
							children: [percent.toLocaleString("pt-BR", { maximumFractionDigits: 2 }), "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[20px]",
							children: "edit"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body-sm text-body-sm text-on-surface-variant mt-sm",
				children: enabled ? "Sobre a receita do mês" : "Dízimo desativado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg ${enabled ? "text-primary" : "text-on-surface-variant"}`,
				children: formatBRL(enabled ? amount : 0)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-sm mt-xs pt-xs border-t border-outline-variant/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-body-sm text-body-sm text-on-surface-variant",
					children: "Receitas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-numeric-data text-numeric-data text-on-surface-variant",
					children: formatBRL(income)
				})]
			})
		]
	});
}
function CategoryChart({ transactions, categoryById }) {
	const data = (0, import_react.useMemo)(() => {
		const byCategory = {};
		for (const tx of transactions) {
			const key = categoryById(tx.categoryId)?.name ?? "Sem categoria";
			if (!byCategory[key]) byCategory[key] = {
				name: key,
				color: "#75777d",
				income: 0,
				expense: 0
			};
			if (tx.amount > 0) byCategory[key].income += tx.amount;
			else byCategory[key].expense += Math.abs(tx.amount);
		}
		return Object.values(byCategory).sort((a, b) => b.expense - a.expense);
	}, [transactions, categoryById]);
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow h-64 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-body-sm text-body-sm text-on-surface-variant text-center",
			children: "Nenhuma transação no mês para exibir no gráfico."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-headline-md text-headline-md text-primary mb-md",
			children: "Receitas e despesas por categoria"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						top: 8,
						right: 8,
						bottom: 8,
						left: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-outline-variant)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "name",
							tick: {
								fill: "var(--color-on-surface-variant)",
								fontSize: 12
							},
							interval: 0,
							angle: -30,
							textAnchor: "end",
							height: 60
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tick: {
								fill: "var(--color-on-surface-variant)",
								fontSize: 12
							},
							tickFormatter: (value) => value >= 1e3 ? `R$${(value / 1e3).toFixed(1)}k` : `R$${value}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							formatter: (value, name) => [formatBRL(value), name === "expense" ? "Despesas" : "Receitas"],
							contentStyle: {
								backgroundColor: "var(--color-surface-container-lowest)",
								border: "1px solid var(--color-outline-variant)",
								borderRadius: "12px",
								color: "var(--color-on-surface)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							formatter: (value) => value === "expense" ? "Despesas" : "Receitas",
							wrapperStyle: { paddingTop: 8 }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "income",
							name: "income",
							fill: "#006c49",
							radius: [
								4,
								4,
								0,
								0
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "expense",
							name: "expense",
							fill: "#ba1a1a",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				})
			})
		})]
	});
}
function Dashboard() {
	const { transactions, allTransactions, goals, categoryById, month, setMonth } = useStore();
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [titheEnabled, setTitheEnabled] = (0, import_react.useState)(true);
	const [tithePercent, setTithePercent] = (0, import_react.useState)(10);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			const { data: profile } = await supabase.from("profiles").select("full_name, tithe_enabled, tithe_percent").eq("id", auth.user.id).maybeSingle();
			const name = profile?.full_name ?? auth.user.user_metadata?.full_name ?? auth.user.email ?? "";
			setFirstName(name.split(" ")[0] || "Minha conta");
			setTitheEnabled(profile?.tithe_enabled ?? true);
			const percent = Number(profile?.tithe_percent ?? 10);
			setTithePercent(Number.isFinite(percent) ? percent : 10);
		})();
	}, []);
	const income = transactions.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
	const expense = transactions.filter((t) => t.amount < 0).reduce((a, b) => a + b.amount, 0);
	const balance = income + expense;
	const prevMonth = shiftMonth(month, -1);
	const prevBalance = allTransactions.filter((t) => t.date.startsWith(prevMonth) && t.amount > 0).reduce((a, b) => a + b.amount, 0) + allTransactions.filter((t) => t.date.startsWith(prevMonth) && t.amount < 0).reduce((a, b) => a + b.amount, 0);
	const balanceDelta = balance - prevBalance;
	const balanceDeltaPercent = prevBalance !== 0 ? balanceDelta / Math.abs(prevBalance) * 100 : 0;
	const featuredGoal = goals.find((g) => g.is_featured) ?? goals[0];
	const recent = transactions.slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: firstName ? `Olá, ${firstName}` : "Olá",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-md flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-headline-md text-headline-md text-primary",
						children: ["Resumo de ", formatMonthLabel(month)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSelector, {
						value: month,
						onChange: setMonth
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-1 md:col-span-2 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow relative overflow-hidden animate-fade-in-up stagger-1 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-body-sm text-body-sm text-on-surface-variant mb-sm",
								children: "Saldo do mês"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: `font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl ${balance >= 0 ? "text-secondary" : "text-error"}`,
								children: formatBRL(balance)
							}),
							prevBalance !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-xs mt-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `material-symbols-outlined !text-[16px] ${balanceDelta >= 0 ? "text-secondary" : "text-error"}`,
									children: balanceDelta >= 0 ? "trending_up" : "trending_down"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `font-body-sm text-body-sm ${balanceDelta >= 0 ? "text-secondary" : "text-error"}`,
									children: [
										formatSignedBRL(balanceDelta),
										" (",
										Math.abs(balanceDeltaPercent).toFixed(1),
										"%) vs ",
										formatMonthLabel(prevMonth)
									]
								})]
							}),
							prevBalance === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-body-sm text-body-sm text-on-surface-variant mt-sm",
								children: ["Sem dados de ", formatMonthLabel(prevMonth)]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-md pt-md mt-lg border-t border-outline-variant/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined text-secondary !text-[16px]",
												children: "arrow_upward"
											}),
											" ",
											"Renda"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-numeric-data text-numeric-data text-secondary mt-xs",
										children: formatSignedBRL(income)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px bg-outline-variant/60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined text-error !text-[16px]",
												children: "arrow_downward"
											}),
											" ",
											"Despesas"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-numeric-data text-numeric-data text-error mt-xs",
										children: formatSignedBRL(expense)
									})]
								})
							]
						})]
					}), featuredGoal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/metas",
						className: "col-span-1 bg-primary rounded-xl p-md text-on-primary shadow-lg flex flex-col justify-between animate-fade-in-up stagger-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-md text-headline-md mb-xs",
							children: "Meta em destaque"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-inverse-primary",
							children: featuredGoal.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-numeric-data text-numeric-data mb-xs",
								children: [
									formatBRL(featuredGoal.saved),
									" / ",
									formatBRL(featuredGoal.target)
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-primary-container h-2 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-secondary-container h-full rounded-full animate-fill-bar",
									style: { width: `${Math.min(100, featuredGoal.saved / featuredGoal.target * 100)}%` }
								})
							})]
						})]
					})]
				}),
				titheEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitheCard, {
					income,
					enabled: titheEnabled,
					percent: tithePercent,
					onToggle: setTitheEnabled,
					onPercentChange: setTithePercent
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/transacoes/novo",
							className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "add"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-md text-label-md text-primary",
								children: "Novo lançamento"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/categorias",
							className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "category"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-md text-label-md text-primary",
								children: "Categorias"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/metas",
							className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "track_changes"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-md text-label-md text-primary",
								children: "Metas"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/transacoes",
							className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "receipt_long"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-md text-label-md text-primary",
								children: "Ver todas"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChart, {
					transactions,
					categories: [],
					categoryById
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-md border-b border-outline-variant/60 flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-headline-md text-headline-md text-primary",
							children: "Transações do mês"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/transacoes",
							className: "font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-full hover:bg-surface-container-low",
							children: "Ver Todas"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-outline-variant/60",
						children: recent.map((tx) => {
							const cat = categoryById(tx.categoryId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/transacoes/$id/editar",
								params: { id: tx.id },
								className: "flex items-center justify-between p-md hover:bg-surface-container-low min-h-[56px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full flex items-center justify-center " + (cat?.color ?? "bg-surface-variant text-on-surface-variant"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined",
											children: cat?.icon ?? "payments"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-body-lg text-body-lg text-primary font-medium",
										children: tx.description
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-sm mt-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-label-md text-label-md px-2 py-[2px] rounded-full " + (cat?.color ?? "bg-surface-container text-on-surface-variant"),
											children: cat?.name ?? "Sem categoria"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: formatDateShort(tx.date)
										})]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-numeric-data text-numeric-data " + (tx.amount >= 0 ? "text-secondary" : "text-error"),
									children: formatSignedBRL(tx.amount)
								})]
							}, tx.id);
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { Dashboard as component };
