import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { r as formatDateShort, t as formatBRL } from "./format-DeTY0EH_.mjs";
import { n as useServerFn } from "./createSsrRpc-D4K1-VYU.mjs";
import { n as importStagedTransactions } from "./pluggy2.functions-BRIrup4m.mjs";
import { r as parseImportFile } from "./file-import-CgWmic9Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/importar-DvGsSDva.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FileImportCard({ onImported }) {
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)(null);
	async function stage(rows) {
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) throw new Error("Sessão expirada. Entre novamente.");
		const payload = rows.map((r) => ({
			user_id: userId,
			pluggy_transaction_id: `arquivo:${crypto.randomUUID()}`,
			description: r.description.slice(0, 200),
			amount: r.amount,
			date: r.date,
			kind: "arquivo",
			status: "pendente"
		}));
		const { error } = await supabase.from("staged_transactions").insert(payload);
		if (error) throw new Error(error.message);
	}
	async function handleFile(file) {
		setBusy(true);
		setFileName(file.name);
		try {
			const rows = await parseImportFile(file);
			if (rows.length === 0) {
				toast.error("Nenhum lançamento reconhecido no arquivo.");
				return;
			}
			await stage(rows);
			toast.success(`${rows.length} lançamento(s) prontos para revisão.`);
			await onImported();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao ler o arquivo.");
		} finally {
			setBusy(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined text-primary",
				children: "upload_file"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-body-lg text-body-lg text-primary font-medium",
						children: "Importar arquivo (CSV, OFX texto ou PDF)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-body-sm text-body-sm text-on-surface-variant mt-xs",
						children: "Envie o extrato ou a fatura do cartão. Os lançamentos entram na fila de revisão abaixo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragOver: (e) => e.preventDefault(),
						onDrop: (e) => {
							e.preventDefault();
							const f = e.dataTransfer.files?.[0];
							if (f) handleFile(f);
						},
						className: "mt-md border border-dashed border-outline rounded-lg p-lg text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-body-sm text-body-sm text-on-surface-variant",
								children: busy ? `Lendo ${fileName ?? "arquivo"}…` : "Arraste o arquivo aqui ou"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => inputRef.current?.click(),
								className: "mt-sm px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
								children: "Selecionar arquivo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: inputRef,
								type: "file",
								accept: ".csv,.txt,.ofx,.pdf,text/csv,application/pdf",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) handleFile(f);
								}
							})
						]
					})
				]
			})]
		})
	});
}
function Importar() {
	const navigate = useNavigate();
	const doImport = useServerFn(importStagedTransactions);
	const [staged, setStaged] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [selectedCategories, setSelectedCategories] = (0, import_react.useState)({});
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		{
			const [stagedRes, catRes] = await Promise.all([supabase.from("staged_transactions").select("id, description, amount, date, kind, suggested_category_id, status").eq("status", "pendente").order("date", { ascending: false }), supabase.from("categories").select("id, name, icon, kind, color").order("name")]);
			const stagedData = stagedRes.data ?? [];
			const catData = catRes.data ?? [];
			setStaged(stagedData);
			setCategories(catData);
			const initialCategories = {};
			const initialIds = /* @__PURE__ */ new Set();
			stagedData.forEach((s) => {
				const kind = Number(s.amount) > 0 ? "receita" : "despesa";
				const fallback = catData.find((c) => c.kind === kind)?.id ?? null;
				initialCategories[s.id] = s.suggested_category_id ?? fallback;
				initialIds.add(s.id);
			});
			setSelectedCategories(initialCategories);
			setSelectedIds(initialIds);
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const filteredCategories = (kind) => categories.filter((c) => c.kind === kind);
	async function handleImport() {
		if (selectedIds.size === 0) {
			toast.error("Selecione pelo menos um lançamento.");
			return;
		}
		const items = Array.from(selectedIds).map((id) => ({
			id,
			categoryId: selectedCategories[id] ?? null
		}));
		setImporting(true);
		try {
			const res = await doImport({ data: { items } });
			toast.success(`${res.imported} lançamento(s) importado(s).`);
			await navigate({ to: "/transacoes" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao importar.");
		} finally {
			setImporting(false);
		}
	}
	const toggleAll = (checked) => {
		setSelectedIds(checked ? new Set(staged.map((s) => s.id)) : /* @__PURE__ */ new Set());
	};
	const allSelected = staged.length > 0 && selectedIds.size === staged.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Importar lançamentos",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col md:flex-row md:items-center gap-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
							children: "Revisar importações"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant mt-xs",
							children: "Confira e ajuste a categoria antes de importar para o app."
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImportCard, { onImported: load }),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-body-lg text-body-lg text-on-surface-variant",
					children: "Carregando…"
				}) : staged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-xl text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-on-surface-variant !text-[48px]",
						children: "inbox"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-sm font-body-lg text-body-lg text-on-surface-variant",
						children: "Nenhum lançamento aguardando revisão."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-md border-b border-outline-variant/60 flex items-center gap-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-sm cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: allSelected,
								onChange: (e) => toggleAll(e.target.checked),
								className: "w-5 h-5 accent-[var(--color-primary,currentColor)] text-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-label-md text-label-md text-on-surface-variant uppercase",
								children: "Selecionar todos"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-body-sm text-body-sm text-on-surface-variant ml-auto",
							children: [
								selectedIds.size,
								" de ",
								staged.length
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-outline-variant/60",
						children: staged.map((s) => {
							const kind = Number(s.amount) > 0 ? "receita" : "despesa";
							const kindLabel = kind === "receita" ? "Receita" : "Despesa";
							const kindClass = kind === "receita" ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container";
							const pool = filteredCategories(kind);
							const selected = selectedIds.has(s.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-md transition-colors ${selected ? "bg-surface-container-low" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: selected,
										onChange: (e) => {
											const next = new Set(selectedIds);
											if (e.target.checked) next.add(s.id);
											else next.delete(s.id);
											setSelectedIds(next);
										},
										className: "w-5 h-5 mt-1 accent-[var(--color-primary,currentColor)] text-primary shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-md",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-body-lg text-body-lg text-primary font-medium truncate",
													children: s.description
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-sm shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `font-label-md text-label-md px-2 py-[2px] rounded-full ${kindClass}`,
														children: kindLabel
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-label-md text-label-md px-2 py-[2px] rounded-full bg-surface-container text-on-surface-variant uppercase",
														children: s.kind
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-md mt-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-body-sm text-body-sm text-on-surface-variant",
													children: formatDateShort(s.date)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: `font-numeric-data text-numeric-data ${Number(s.amount) >= 0 ? "text-secondary" : "text-error"}`,
													children: formatBRL(Number(s.amount))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-md",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block font-label-md text-label-md text-on-surface-variant uppercase mb-xs",
													children: "Categoria"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: selectedCategories[s.id] ?? "",
													onChange: (e) => {
														setSelectedCategories((prev) => ({
															...prev,
															[s.id]: e.target.value || null
														}));
													},
													className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-body-lg text-body-lg",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Sem categoria"
													}), pool.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: c.id,
														children: c.name
													}, c.id))]
												})]
											})
										]
									})]
								})
							}, s.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse md:flex-row justify-end gap-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void navigate({ to: "/conexoes" }),
						className: "px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
						children: "Voltar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void handleImport(),
						disabled: importing || selectedIds.size === 0,
						className: "px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
						children: importing ? "Importando…" : "Importar selecionados"
					})]
				})] })
			]
		})
	});
}
//#endregion
export { Importar as component };
