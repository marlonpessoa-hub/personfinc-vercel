import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { t as formatBRL } from "./format-DeTY0EH_.mjs";
import { n as useServerFn } from "./createSsrRpc-D4K1-VYU.mjs";
import { i as syncPluggyConnection, r as savePluggyItem, t as createPluggyConnectToken } from "./pluggy2.functions-BRIrup4m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conexoes-C8BqH3vZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLUGGY_SCRIPT = "https://cdn.pluggy.ai/pluggy-connect/v2.9.2/pluggy-connect.js";
function loadPluggyScript() {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined") return reject(/* @__PURE__ */ new Error("sem navegador"));
		if (window.PluggyConnect) return resolve();
		const existing = document.querySelector(`script[src="${PLUGGY_SCRIPT}"]`);
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () => reject(/* @__PURE__ */ new Error("falha ao carregar widget")));
			return;
		}
		const el = document.createElement("script");
		el.src = PLUGGY_SCRIPT;
		el.async = true;
		el.onload = () => resolve();
		el.onerror = () => reject(/* @__PURE__ */ new Error("falha ao carregar widget"));
		document.head.appendChild(el);
	});
}
function Conexoes() {
	const { canWrite } = useStore();
	const [connections, setConnections] = (0, import_react.useState)([]);
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const getToken = useServerFn(createPluggyConnectToken);
	const saveItem = useServerFn(savePluggyItem);
	const syncConn = useServerFn(syncPluggyConnection);
	const refresh = (0, import_react.useCallback)(async () => {
		const [connRes, accRes, pendRes] = await Promise.all([
			supabase.from("bank_connections").select("id, institution_name, institution_image_url, status, last_synced_at, pluggy_item_id").order("created_at"),
			supabase.from("bank_accounts").select("*").order("name"),
			supabase.from("staged_transactions").select("id", {
				count: "exact",
				head: true
			}).eq("status", "pendente")
		]);
		setConnections(connRes.data ?? []);
		setAccounts((accRes.data ?? []).map((a) => ({
			...a,
			balance: Number(a.balance),
			credit_limit: a.credit_limit == null ? null : Number(a.credit_limit)
		})));
		setPending(pendRes.count ?? 0);
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	async function connect(itemId) {
		if (!canWrite) {
			toast.error("Modo somente leitura — ative uma chave de acesso no Perfil.");
			return;
		}
		setBusy("connect");
		try {
			const [{ connectToken }] = await Promise.all([getToken({ data: itemId ? { itemId } : {} }), loadPluggyScript()]);
			const Ctor = window.PluggyConnect;
			new Ctor({
				connectToken,
				includeSandbox: true,
				onSuccess: async (payload) => {
					try {
						const res = await saveItem({ data: { itemId: payload.item.id } });
						toast.success(`Banco conectado (${res.accounts} conta(s))`);
						await refresh();
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Falha ao salvar conexão");
					}
				},
				onError: () => toast.error("Não foi possível concluir a conexão")
			}).init();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao abrir o Open Finance");
		} finally {
			setBusy(null);
		}
	}
	async function sync(id) {
		setBusy(id);
		try {
			const res = await syncConn({ data: { connectionId: id } });
			toast.success(res.inserted > 0 ? `${res.inserted} novo(s) item(ns) para revisar` : "Nenhum item novo encontrado");
			await refresh();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao sincronizar");
		} finally {
			setBusy(null);
		}
	}
	async function remove(id) {
		if (!confirm("Remover esta conexão e os itens ainda não importados?")) return;
		const { error } = await supabase.from("bank_connections").delete().eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Conexão removida");
		await refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Contas conectadas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center gap-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
							children: "Contas conectadas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant mt-xs",
							children: "Open Finance via Pluggy — extrato bancário e fatura do cartão."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void connect(),
						disabled: busy === "connect",
						className: "inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[18px]",
							children: "account_balance"
						}), busy === "connect" ? "Abrindo…" : "Conectar banco"]
					})]
				}),
				pending > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/importar",
					className: "flex items-center gap-md p-md rounded-xl bg-secondary-container text-on-secondary-container",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined",
							children: "inbox"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1 font-body-lg text-body-lg",
							children: [pending, " item(ns) aguardando revisão"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined",
							children: "chevron_right"
						})
					]
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-body-lg text-body-lg text-on-surface-variant",
					children: "Carregando…"
				}) : connections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-xl text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-on-surface-variant !text-[48px]",
						children: "account_balance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-sm font-body-lg text-body-lg text-on-surface-variant",
						children: "Nenhum banco conectado ainda."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-md",
					children: connections.map((c) => {
						const accs = accounts.filter((a) => a.connection_id === c.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
								className: "flex items-center gap-md p-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden",
										children: c.institution_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: c.institution_image_url,
											alt: "",
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined",
											children: "account_balance"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body-lg text-body-lg text-primary font-medium truncate",
											children: c.institution_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-body-sm text-body-sm text-on-surface-variant",
											children: c.last_synced_at ? `Atualizado em ${new Date(c.last_synced_at).toLocaleString("pt-BR")}` : "Nunca sincronizado"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void sync(c.id),
										disabled: busy === c.id,
										className: "px-3 py-2 rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container disabled:opacity-60",
										children: busy === c.id ? "Atualizando…" : "Atualizar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void remove(c.id),
										"aria-label": "Remover conexão",
										className: "w-10 h-10 rounded-full text-error hover:bg-error-container flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[20px]",
											children: "delete"
										})
									})
								]
							}), accs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-outline-variant/60 border-t border-outline-variant/60",
								children: accs.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-md p-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined text-on-surface-variant",
											children: a.type === "CREDIT" ? "credit_card" : "savings"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-body-lg text-body-lg text-primary truncate",
												children: a.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-body-sm text-body-sm text-on-surface-variant",
												children: [a.type === "CREDIT" ? `Cartão${a.due_day ? ` • vence dia ${a.due_day}` : ""}` : "Conta", a.number ? ` • ${a.number}` : ""]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-numeric-data text-numeric-data text-primary",
											children: formatBRL(a.balance)
										})
									]
								}, a.id))
							})]
						}, c.id);
					})
				})
			]
		})
	});
}
//#endregion
export { Conexoes as component };
