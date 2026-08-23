import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as monthKeyOf, i as formatMonthLabel, o as shiftMonth, s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { r as formatDateShort, t as formatBRL } from "./format-DeTY0EH_.mjs";
import { t as CreditCardVisual } from "./credit-card-visual-6qIjJWO4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cartoes.index-Ds7SYHBg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CardPurchaseDialog({ cardId: initialCardId, onClose }) {
	const { cards, categories, addCardPurchase } = useStore();
	const expenseCats = categories.filter((c) => c.kind === "despesa");
	const [cardId, setCardId] = (0, import_react.useState)(initialCardId ?? cards[0]?.id ?? "");
	const [description, setDescription] = (0, import_react.useState)("");
	const [total, setTotal] = (0, import_react.useState)("");
	const [installments, setInstallments] = (0, import_react.useState)("1");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [payer, setPayer] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)(expenseCats[0]?.id ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const n = Math.max(1, Math.round(Number(installments) || 1));
	const value = Math.abs(Number(total) || 0);
	const preview = (0, import_react.useMemo)(() => {
		if (!value) return [];
		const cents = Math.round(value * 100);
		const base = Math.floor(cents / n);
		const rest = cents - base * n;
		const start = monthKeyOf(date);
		return Array.from({ length: Math.min(n, 12) }, (_, i) => ({
			label: formatMonthLabel(shiftMonth(start, i)),
			amount: (base + (i < rest ? 1 : 0)) / 100,
			idx: i + 1
		}));
	}, [
		value,
		n,
		date
	]);
	const submit = async (e) => {
		e.preventDefault();
		if (!cardId) {
			toast.error("Selecione um cartão");
			return;
		}
		if (!value) {
			toast.error("Informe o valor total");
			return;
		}
		setSaving(true);
		try {
			const count = await addCardPurchase({
				cardId,
				description,
				total: value,
				installments: n,
				date,
				payer: payer.trim() || void 0,
				categoryId
			});
			toast.success(count > 1 ? `${count} parcelas lançadas` : "Compra lançada");
			onClose();
		} catch {} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "bg-surface-container-lowest w-full md:max-w-lg rounded-t-2xl md:rounded-2xl border border-outline-variant max-h-[92vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-md border-b border-outline-variant sticky top-0 bg-surface-container-lowest",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-title-lg text-title-lg text-on-surface",
						children: "Nova compra no cartão"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Fechar",
						className: "p-2 rounded-full hover:bg-surface-container",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined",
							children: "close"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-md space-y-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cartão",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: cardId,
								onChange: (e) => setCardId(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary",
								children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [c.name, c.last4 ? ` ····${c.last4}` : ""]
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Descrição",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Ex: Notebook",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Valor total (R$)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "number",
									step: "0.01",
									min: "0",
									value: total,
									onChange: (e) => setTotal(e.target.value),
									placeholder: "0,00",
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Parcelas",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "1",
									max: "48",
									value: installments,
									onChange: (e) => setInstallments(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Data da compra",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Responsável",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: payer,
									onChange: (e) => setPayer(e.target.value),
									placeholder: "Ex: Marlon",
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Categoria",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: categoryId,
								onChange: (e) => setCategoryId(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary",
								children: expenseCats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))
							})
						}),
						preview.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-outline-variant p-md space-y-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-label-md text-label-md text-on-surface-variant uppercase",
									children: "Parcelas geradas"
								}),
								preview.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-body-sm text-body-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-on-surface-variant",
										children: [
											description || "Compra",
											" (",
											p.idx,
											"/",
											n,
											") · ",
											p.label
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-on-surface",
										children: formatBRL(p.amount)
									})]
								}, p.idx)),
								n > 12 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-body-sm text-body-sm text-on-surface-variant",
									children: [
										"+ ",
										n - 12,
										" parcela(s)…"
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-md border-t border-outline-variant flex justify-end gap-sm sticky bottom-0 bg-surface-container-lowest",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saving,
						className: "px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60",
						children: saving ? "Salvando…" : "Lançar compra"
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
function CardsList() {
	const { cards, cardPurchases, allTransactions, categoryById, removeCardPurchase } = useStore();
	const [purchaseCard, setPurchaseCard] = (0, import_react.useState)(null);
	const cardById = (id) => cards.find((c) => c.id === id);
	const limiteTotal = cards.filter((c) => c.kind === "credito").reduce((a, b) => a + (b.creditLimit ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Cartões",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/cartoes/novo",
			className: "p-2 rounded-full bg-primary text-on-primary",
			"aria-label": "Novo cartão",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined",
				children: "add"
			})
		}),
		children: [purchaseCard !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardPurchaseDialog, {
			cardId: purchaseCard || void 0,
			onClose: () => setPurchaseCard(null)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary flex-1",
						children: "Cartões"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cartoes/novo",
						className: "hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[18px]",
							children: "add"
						}), "Novo cartão"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-body-sm text-body-sm text-on-surface-variant",
						children: [
							"Limite total de crédito · ",
							cards.length,
							" cartão(ões)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-numeric-data text-numeric-data text-primary mt-xs",
						children: formatBRL(limiteTotal)
					})]
				}),
				cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-on-surface-variant !text-[48px]",
							children: "credit_card"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-sm font-body-lg text-body-lg text-on-surface-variant",
							children: "Nenhum cartão cadastrado."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cartoes/novo",
							className: "inline-flex mt-md items-center gap-sm bg-primary text-on-primary px-5 py-3 rounded-full font-label-md text-label-md hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined !text-[18px]",
								children: "add"
							}), "Cadastrar cartão"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg",
					children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCardVisual, { card: c }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/cartoes/$id/editar",
										params: { id: c.id },
										className: "inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px]",
											children: "edit"
										}), "Editar"]
									}),
									c.kind === "credito" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPurchaseCard(c.id),
										className: "inline-flex items-center gap-xs px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px]",
											children: "add_shopping_cart"
										}), "Nova compra"]
									}),
									c.kind === "credito" && c.dueDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-body-sm text-body-sm text-on-surface-variant",
										children: ["Vence dia ", c.dueDay]
									}) : null
								]
							}),
							(() => {
								const moves = allTransactions.filter((t) => t.cardId === c.id).slice(0, 5);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-outline-variant bg-surface-container-lowest p-md space-y-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-label-md text-label-md text-on-surface-variant uppercase",
										children: ["Movimentações · em aberto ", formatBRL(allTransactions.filter((t) => t.cardId === c.id && !t.paid && t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0))]
									}), moves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-body-sm text-body-sm text-on-surface-variant",
										children: "Nenhuma movimentação neste cartão."
									}) : moves.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/transacoes/$id/editar",
										params: { id: t.id },
										className: "flex items-center justify-between gap-sm py-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-body-sm text-body-sm text-on-surface truncate",
											children: [t.description, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-on-surface-variant",
												children: [
													" · ",
													formatDateShort(t.date),
													t.payer ? ` · ${t.payer}` : ""
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-body-sm text-body-sm text-on-surface shrink-0",
											children: formatBRL(Math.abs(t.amount))
										})]
									}, t.id))]
								});
							})()
						]
					}, c.id))
				}),
				cardPurchases.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-title-lg text-title-lg text-on-surface",
						children: "Compras no cartão"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow divide-y divide-outline-variant/60",
						children: cardPurchases.map((p) => {
							const card = cardById(p.cardId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-md flex items-start gap-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined",
											children: categoryById(p.categoryId)?.icon ?? "credit_card"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body-lg text-body-lg text-on-surface break-words",
											children: p.description
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: [
												formatDateShort(p.date),
												" · ",
												card?.name ?? "Cartão",
												p.payer ? ` · ${p.payer}` : "",
												" · ",
												p.installments,
												"x"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-numeric-data text-numeric-data text-on-surface",
											children: formatBRL(p.total)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: async () => {
												if (!confirm("Excluir a compra e todas as parcelas?")) return;
												await removeCardPurchase(p.purchaseId);
												toast.success("Compra excluída");
											},
											className: "font-label-md text-label-md text-error hover:underline",
											children: "Excluir"
										})]
									})
								]
							}, p.purchaseId);
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { CardsList as component };
