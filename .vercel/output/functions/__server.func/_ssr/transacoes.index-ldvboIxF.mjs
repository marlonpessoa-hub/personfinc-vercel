import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as monthKeyOf, i as formatMonthLabel, r as dateInMonth, s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { i as formatSignedBRL, r as formatDateShort, t as formatBRL } from "./format-DeTY0EH_.mjs";
import { t as MonthSelector } from "./month-selector-4biM8GL6.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-D4K1-VYU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { i as stringType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { a as pdfPageImages, i as parsePDF, n as parseCSV, t as imageToDataUrl } from "./file-import-CgWmic9Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transacoes.index-ldvboIxF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputSchema = objectType({ images: arrayType(stringType().min(20)).min(1).max(5) });
/** Lê despesas de imagens (foto/print/página de PDF) usando IA de visão. */
var extractExpensesFromImages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => inputSchema.parse(input)).handler(createSsrRpc("0cad7ceba856d8e8a4c69c5e81edda02af45d5c3df5d678f813918d7d7718053"));
var isImage = (f) => /\.(jpe?g|png)$/i.test(f.name) || f.type.startsWith("image/");
var isPdf = (f) => /\.pdf$/i.test(f.name) || f.type === "application/pdf";
/** Move a data para o mês de destino preservando o dia. */
var toMonth = (iso, monthKey) => dateInMonth(monthKey, Number(iso.slice(8, 10)));
function ExpenseImportDialog({ onClose }) {
	const { month, categories, addTransactions, addCardPurchase, cards } = useStore();
	const extract = useServerFn(extractExpensesFromImages);
	const creditCards = (0, import_react.useMemo)(() => cards.filter((c) => c.kind === "credito"), [cards]);
	const expenseCategories = (0, import_react.useMemo)(() => categories.filter((c) => c.kind === "despesa"), [categories]);
	const [step, setStep] = (0, import_react.useState)("upload");
	const [targetMonth, setTargetMonth] = (0, import_react.useState)(month);
	const [drafts, setDraftsRaw] = (0, import_react.useState)([]);
	const [past, setPast] = (0, import_react.useState)([]);
	const [future, setFuture] = (0, import_react.useState)([]);
	const [baseline, setBaseline] = (0, import_react.useState)(null);
	const lastTag = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [bulkCategory, setBulkCategory] = (0, import_react.useState)("");
	const [bulkCard, setBulkCard] = (0, import_react.useState)("");
	const [bulkPayer, setBulkPayer] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const defaultCategory = expenseCategories[0]?.id ?? "";
	/** Aplica uma mudança registrando o estado anterior no histórico (com coalescência por tag). */
	function commit(updater, tag) {
		const now = Date.now();
		const coalesce = !!tag && lastTag.current?.tag === tag && now - (lastTag.current?.at ?? 0) < 900;
		lastTag.current = tag ? {
			tag,
			at: now
		} : null;
		setDraftsRaw((prev) => {
			if (!coalesce) setPast((p) => [...p, prev].slice(-100));
			return updater(prev);
		});
		setFuture([]);
	}
	function undo() {
		lastTag.current = null;
		setPast((p) => {
			if (p.length === 0) return p;
			const previous = p[p.length - 1];
			setDraftsRaw((cur) => {
				setFuture((f) => [cur, ...f]);
				return previous;
			});
			return p.slice(0, -1);
		});
	}
	function redo() {
		lastTag.current = null;
		setFuture((f) => {
			if (f.length === 0) return f;
			const next = f[0];
			setDraftsRaw((cur) => {
				setPast((p) => [...p, cur]);
				return next;
			});
			return f.slice(1);
		});
	}
	function restoreOriginal() {
		if (!baseline) return;
		lastTag.current = null;
		commit(() => baseline.map((d) => ({ ...d })));
		toast.success("Lista restaurada como importada.");
	}
	function toDrafts(rows, monthKey) {
		return rows.map((r, i) => ({
			key: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
			description: r.description || "Despesa importada",
			amount: Math.abs(r.amount),
			date: dateInMonth(monthKey, r.date ? Number(r.date.slice(8, 10)) || 1 : 1),
			categoryId: defaultCategory,
			selected: true,
			paymentMethod: "cash",
			cardId: "",
			payer: "",
			installments: 1
		}));
	}
	function changeMonth(next) {
		setTargetMonth(next);
		commit((prev) => prev.map((d) => ({
			...d,
			date: toMonth(d.date, next)
		})));
	}
	async function handleFile(file) {
		setBusy(true);
		setStatus(`Lendo ${file.name}…`);
		try {
			let rows = [];
			if (isImage(file)) {
				setStatus("Extraindo despesas da imagem com IA…");
				const dataUrl = await imageToDataUrl(file);
				rows = (await extract({ data: { images: [dataUrl] } })).rows;
			} else if (isPdf(file)) {
				rows = (await parsePDF(file)).map((p) => ({
					description: p.description,
					amount: p.amount,
					date: p.date
				}));
				if (rows.length === 0) {
					setStatus("PDF sem texto reconhecido — lendo as páginas com IA…");
					const images = await pdfPageImages(file);
					if (images.length > 0) rows = (await extract({ data: { images } })).rows;
				}
			} else rows = parseCSV(await file.text()).map((p) => ({
				description: p.description,
				amount: p.amount,
				date: p.date
			}));
			const normalized = rows.map((r) => ({
				...r,
				amount: Math.abs(r.amount)
			})).filter((r) => r.amount > 0);
			if (normalized.length === 0) {
				toast.error("Nenhuma despesa reconhecida no arquivo.");
				return;
			}
			const added = toDrafts(normalized, targetMonth);
			commit((prev) => [...prev, ...added]);
			setBaseline((b) => [...b ?? [], ...added.map((d) => ({ ...d }))]);
			setStep("review");
			toast.success(`${normalized.length} despesa(s) encontradas. Revise antes de lançar.`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao ler o arquivo.");
		} finally {
			setBusy(false);
			setStatus(null);
			if (fileRef.current) fileRef.current.value = "";
			if (cameraRef.current) cameraRef.current.value = "";
		}
	}
	const selected = drafts.filter((d) => d.selected);
	const allSelected = drafts.length > 0 && selected.length === drafts.length;
	const outOfMonth = selected.filter((d) => monthKeyOf(d.date) !== targetMonth).length;
	async function handleSave() {
		if (selected.length === 0) {
			toast.error("Selecione pelo menos uma despesa.");
			return;
		}
		const creditRows = selected.filter((d) => d.paymentMethod === "credit");
		const cashRows = selected.filter((d) => d.paymentMethod !== "credit");
		if (creditRows.some((d) => !d.cardId)) {
			toast.error("Escolha o cartão das despesas marcadas como cartão de crédito.");
			return;
		}
		setSaving(true);
		try {
			let count = 0;
			if (cashRows.length > 0) count += await addTransactions(cashRows.map((d) => ({
				description: d.description.trim() || "Despesa importada",
				amount: -Math.abs(d.amount),
				categoryId: d.categoryId,
				date: d.date,
				paid: false,
				payer: d.payer || void 0
			})));
			for (const d of creditRows) count += await addCardPurchase({
				cardId: d.cardId,
				description: d.description.trim() || "Compra importada",
				total: Math.abs(d.amount),
				installments: Math.max(1, Math.round(d.installments || 1)),
				date: d.date,
				payer: d.payer || void 0,
				categoryId: d.categoryId
			});
			toast.success(`${count} lançamento(s) criados em ${formatMonthLabel(targetMonth)}.`);
			onClose();
		} catch (e) {
			if (e instanceof Error && e.message.includes("somente leitura")) return;
			toast.error(e instanceof Error ? e.message : "Falha ao salvar as despesas.");
		} finally {
			setSaving(false);
		}
	}
	const update = (key, patch) => commit((prev) => prev.map((d) => d.key === key ? {
		...d,
		...patch
	} : d), `${key}:${Object.keys(patch).join(",")}`);
	const remove = (key) => {
		commit((prev) => prev.filter((d) => d.key !== key));
		toast("Despesa removida da revisão.", { action: {
			label: "Desfazer",
			onClick: () => undo()
		} });
	};
	const inputCls = "h-11 rounded-lg border border-outline bg-surface-container-lowest px-sm outline-none focus:border-primary font-body-lg text-body-lg text-on-surface";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-surface-container-lowest w-full md:max-w-3xl max-h-[92vh] rounded-t-2xl md:rounded-2xl border border-outline-variant overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-md border-b border-outline-variant flex items-center gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-body-lg text-body-lg text-primary font-medium",
							children: step === "upload" ? "Importar despesas" : "Revisar despesas importadas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant",
							children: step === "upload" ? "Envie um arquivo ou use a câmera" : "Edite descrição, valor, data e categoria antes de confirmar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Fechar",
						className: "w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined",
							children: "close"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-md space-y-md overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center gap-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-md text-label-md text-on-surface-variant uppercase",
								children: "Mês de destino"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSelector, {
								value: targetMonth,
								onChange: changeMonth
							})]
						}),
						step === "upload" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-dashed border-outline rounded-lg p-lg text-center space-y-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-body-sm text-body-sm text-on-surface-variant",
								children: busy ? status ?? "Processando…" : "Envie PDF, CSV, JPEG ou PNG"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-center gap-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: busy,
										onClick: () => fileRef.current?.click(),
										className: "inline-flex items-center gap-xs px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px]",
											children: "upload_file"
										}), "Selecionar arquivo"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: busy,
										onClick: () => cameraRef.current?.click(),
										className: "md:hidden inline-flex items-center gap-xs px-5 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px]",
											children: "photo_camera"
										}), "Usar câmera"]
									}),
									drafts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setStep("review"),
										className: "inline-flex items-center gap-xs px-5 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
										children: [
											"Revisar (",
											drafts.length,
											")"
										]
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => commit((prev) => prev.map((d) => ({
											...d,
											selected: !allSelected
										}))),
										className: "px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
										children: allSelected ? "Desmarcar todas" : "Selecionar todas"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: bulkCategory,
										onChange: (e) => {
											const v = e.target.value;
											setBulkCategory(v);
											if (v) commit((prev) => prev.map((d) => d.selected ? {
												...d,
												categoryId: v
											} : d));
										},
										className: inputCls,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Aplicar categoria às selecionadas…"
										}), expenseCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c.name
										}, c.id))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": "Aplicar cartão às selecionadas",
										value: bulkCard,
										onChange: (e) => {
											const v = e.target.value;
											setBulkCard(v);
											commit((prev) => prev.map((d) => d.selected ? v === "" ? {
												...d,
												paymentMethod: "cash",
												cardId: ""
											} : {
												...d,
												paymentMethod: "credit",
												cardId: v
											} : d));
										},
										className: inputCls,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Pagamento à vista (todas)"
										}), creditCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: c.id,
											children: [
												"Cartão: ",
												c.name,
												c.last4 ? ` (**** ${c.last4})` : ""
											]
										}, c.id))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Aplicar responsável às selecionadas",
										placeholder: "Responsável (todas)",
										value: bulkPayer,
										onChange: (e) => {
											const v = e.target.value;
											setBulkPayer(v);
											commit((prev) => prev.map((d) => d.selected ? {
												...d,
												payer: v
											} : d), "bulk:payer");
										},
										className: inputCls
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setStep("upload"),
										className: "px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
										children: "Adicionar outro arquivo"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: undo,
										disabled: past.length === 0,
										className: "inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined !text-[18px]",
												children: "undo"
											}),
											"Desfazer",
											past.length > 0 ? ` (${past.length})` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: redo,
										disabled: future.length === 0,
										className: "inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined !text-[18px]",
												children: "redo"
											}),
											"Refazer",
											future.length > 0 ? ` (${future.length})` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: restoreOriginal,
										disabled: !baseline || baseline.length === 0,
										className: "inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px]",
											children: "restart_alt"
										}), "Restaurar original"]
									})
								]
							}),
							outOfMonth > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-body-sm text-body-sm text-error",
								children: [
									outOfMonth,
									" despesa(s) selecionada(s) estão fora de",
									" ",
									formatMonthLabel(targetMonth),
									" e serão lançadas na data informada."
								]
							}),
							drafts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-body-sm text-body-sm text-on-surface-variant text-center py-lg",
								children: "Nenhuma despesa para revisar."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-outline-variant/60 border border-outline-variant rounded-lg",
								children: drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-md space-y-sm ${d.selected ? "" : "opacity-55"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												"aria-label": "Incluir no lançamento",
												checked: d.selected,
												onChange: (e) => update(d.key, { selected: e.target.checked }),
												className: "w-5 h-5 mt-3 accent-[var(--color-primary,currentColor)] shrink-0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: d.description,
												"aria-label": "Descrição",
												onChange: (e) => update(d.key, { description: e.target.value }),
												className: `flex-1 ${inputCls}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Remover",
												onClick: () => remove(d.key),
												className: "w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "material-symbols-outlined !text-[20px]",
													children: "delete"
												})
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-sm pl-7",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-body-sm text-body-sm text-on-surface-variant",
													children: "R$"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													step: "0.01",
													min: 0,
													value: d.amount,
													onChange: (e) => update(d.key, { amount: Number(e.target.value) }),
													className: `w-32 ${inputCls}`
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												"aria-label": "Data",
												value: d.date,
												onChange: (e) => update(d.key, { date: e.target.value || dateInMonth(targetMonth, 1) }),
												className: inputCls
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Categoria",
												value: d.categoryId,
												onChange: (e) => update(d.key, { categoryId: e.target.value }),
												className: inputCls,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Sem categoria"
												}), expenseCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c.id,
													children: c.name
												}, c.id))]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Forma de Pagamento",
												value: d.paymentMethod,
												onChange: (e) => update(d.key, { paymentMethod: e.target.value }),
												className: inputCls,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "cash",
													children: "À vista / Pix"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "credit",
													children: "Cartão de Crédito"
												})]
											}),
											d.paymentMethod === "credit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Cartão",
												value: d.cardId,
												onChange: (e) => update(d.key, { cardId: e.target.value }),
												className: inputCls,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Selecionar cartão…"
												}), creditCards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: c.id,
													children: [
														c.name,
														" ",
														c.last4 ? `(**** ${c.last4})` : ""
													]
												}, c.id))]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 1,
													max: 48,
													"aria-label": "Parcelas",
													value: d.installments,
													onChange: (e) => update(d.key, { installments: Math.max(1, Number(e.target.value) || 1) }),
													className: `w-20 ${inputCls}`
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-body-sm text-body-sm text-on-surface-variant",
													children: "x"
												})]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												placeholder: "Responsável (opcional)",
												"aria-label": "Responsável",
												value: d.payer,
												onChange: (e) => update(d.key, { payer: e.target.value }),
												className: inputCls
											})
										]
									})]
								}, d.key))
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: ".pdf,.csv,.txt,.ofx,.jpg,.jpeg,.png,application/pdf,text/csv,image/*",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) handleFile(f);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: cameraRef,
							type: "file",
							accept: "image/*",
							capture: "environment",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) handleFile(f);
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-md border-t border-outline-variant flex items-center gap-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-body-sm text-body-sm text-on-surface-variant flex-1",
							children: [
								selected.length,
								" selecionada(s) ·",
								" ",
								formatBRL(selected.reduce((s, d) => s + Math.abs(d.amount), 0))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "px-5 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
							children: "Cancelar"
						}),
						step === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void handleSave(),
							disabled: saving || selected.length === 0,
							className: "px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
							children: saving ? "Lançando…" : "Confirmar lançamento"
						})
					]
				})
			]
		})
	});
}
function TransacoesList() {
	const { transactions, categoryById, month, setMonth, setTransactionPaid } = useStore();
	const [filter, setFilter] = (0, import_react.useState)("todas");
	const [query, setQuery] = (0, import_react.useState)("");
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		return transactions.filter((t) => filter === "todas" ? true : filter === "receita" ? t.amount > 0 : t.amount < 0).filter((t) => t.description.toLowerCase().includes(query.toLowerCase()));
	}, [
		transactions,
		filter,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Transações",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/transacoes/novo",
			className: "p-2 rounded-full bg-primary text-on-primary",
			"aria-label": "Novo lançamento",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined",
				children: "add"
			})
		}),
		children: [importOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseImportDialog, { onClose: () => setImportOpen(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center gap-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary flex-1",
							children: "Transações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSelector, {
							value: month,
							onChange: setMonth
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setImportOpen(true),
							className: "inline-flex items-center justify-center gap-sm border border-outline text-on-surface px-4 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container-low",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined !text-[18px]",
								children: "document_scanner"
							}), "Importar despesas"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/transacoes/novo",
							className: "hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined !text-[18px]",
								children: "add"
							}), "Novo Lançamento"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-full px-md h-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-on-surface-variant",
							children: "search"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Buscar transação",
							className: "flex-1 bg-transparent outline-none font-body-lg text-body-lg text-on-surface"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex bg-surface-container rounded-full p-1 self-start md:self-auto",
						children: [
							"todas",
							"receita",
							"despesa"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilter(f),
							className: "px-4 py-2 rounded-full font-label-md text-label-md capitalize transition-colors " + (filter === f ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-primary"),
							children: f
						}, f))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-xl text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-on-surface-variant !text-[48px]",
							children: "receipt_long"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-sm font-body-lg text-body-lg text-on-surface-variant",
							children: "Nenhuma transação encontrada."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-outline-variant/60",
						children: filtered.map((tx) => {
							const cat = categoryById(tx.categoryId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-sm p-md hover:bg-surface-container-low min-h-[64px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/transacoes/$id/editar",
									params: { id: tx.id },
									className: "flex flex-col gap-xs flex-1 min-w-0 sm:flex-row sm:items-center sm:justify-between sm:gap-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-sm min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-full flex items-center justify-center shrink-0 " + (cat?.color ?? "bg-surface-variant text-on-surface-variant"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "material-symbols-outlined",
												children: cat?.icon ?? "payments"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-body-lg text-body-lg text-primary font-medium break-words",
												children: tx.description
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-sm mt-xs flex-wrap",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-label-md text-label-md px-2 py-[2px] rounded-full " + (cat?.color ?? "bg-surface-container text-on-surface-variant"),
														children: cat?.name ?? "Sem categoria"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-body-sm text-body-sm text-on-surface-variant",
														children: formatDateShort(tx.date)
													}),
													tx.amount < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-label-md text-label-md px-2 py-[2px] rounded-full " + (tx.paid ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant"),
														children: tx.paid ? "Quitado" : "Em aberto"
													})
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-numeric-data text-numeric-data shrink-0 whitespace-nowrap text-right " + (tx.amount >= 0 ? "text-secondary" : "text-error"),
										children: formatSignedBRL(tx.amount)
									})]
								}), tx.amount < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": tx.paid ? "Marcar como em aberto" : "Marcar como quitado",
									title: tx.paid ? "Marcar como em aberto" : "Marcar como quitado",
									onClick: () => {
										setTransactionPaid(tx.id, !tx.paid).then(() => toast.success(tx.paid ? "Marcado como em aberto" : "Lançamento quitado")).catch(() => {});
									},
									className: "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors " + (tx.paid ? "bg-secondary-container text-on-secondary-container" : "border border-outline text-on-surface-variant hover:bg-surface-container"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined !text-[20px]",
										children: tx.paid ? "task_alt" : "radio_button_unchecked"
									})
								})]
							}, tx.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant",
							children: "Total de receitas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-numeric-data text-numeric-data text-secondary mt-xs",
							children: formatBRL(filtered.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant",
							children: "Total de despesas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-numeric-data text-numeric-data text-error mt-xs",
							children: formatBRL(Math.abs(filtered.filter((t) => t.amount < 0).reduce((a, b) => a + b.amount, 0)))
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { TransacoesList as component };
