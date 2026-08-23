import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B5jSrpHm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fmt = (iso) => iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";
function Admin() {
	const { isAdmin, loading } = useStore();
	const navigate = useNavigate();
	const [keys, setKeys] = (0, import_react.useState)([]);
	const [days, setDays] = (0, import_react.useState)(30);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && !isAdmin) navigate({
			to: "/",
			replace: true
		});
	}, [
		loading,
		isAdmin,
		navigate
	]);
	const load = (0, import_react.useCallback)(async () => {
		const { data, error } = await supabase.from("access_keys").select("*").order("created_at", { ascending: false });
		if (error) {
			toast.error("Não foi possível carregar as chaves");
			return;
		}
		setKeys(data ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		if (isAdmin) load();
	}, [isAdmin, load]);
	async function generate() {
		setBusy(true);
		const { data, error } = await supabase.rpc("generate_access_key", {
			_valid_days: days,
			_note: note || void 0
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		const created = data;
		setNote("");
		await load();
		try {
			await navigator.clipboard.writeText(created.code);
			toast.success(`Chave ${created.code} gerada e copiada`);
		} catch {
			toast.success(`Chave gerada: ${created.code}`);
		}
	}
	async function revoke(id) {
		const { error } = await supabase.rpc("revoke_access_key", { _key_id: id });
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Chave revogada");
		await load();
	}
	function status(k) {
		if (k.revoked_at) return {
			label: "Revogada",
			cls: "bg-error-container text-on-error-container"
		};
		if (!k.redeemed_by) return {
			label: "Disponível",
			cls: "bg-secondary-container text-on-secondary-container"
		};
		if (k.expires_at && new Date(k.expires_at).getTime() < Date.now()) return {
			label: "Expirada",
			cls: "bg-surface-container text-on-surface-variant"
		};
		return {
			label: "Ativa",
			cls: "bg-primary-container text-on-primary"
		};
	}
	if (!isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Administração",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-headline-md text-headline-md text-primary",
					children: "Chaves de acesso"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow space-y-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-body-lg text-body-lg text-primary font-medium",
						children: "Gerar nova chave"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: days,
								onChange: (e) => setDays(Number(e.target.value)),
								className: "h-12 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 30,
										children: "30 dias"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 90,
										children: "90 dias"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 180,
										children: "180 dias"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 365,
										children: "365 dias"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 3650,
										children: "10 anos"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Observação (ex.: nome do usuário)",
								className: "flex-1 h-12 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: generate,
								disabled: busy,
								className: "h-12 px-lg rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60",
								children: busy ? "Gerando..." : "Gerar chave"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden divide-y divide-outline-variant/60",
					children: [keys.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-md font-body-sm text-body-sm text-on-surface-variant",
						children: "Nenhuma chave gerada ainda."
					}), keys.map((k) => {
						const s = status(k);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-md flex items-center justify-between gap-md flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-numeric-data text-numeric-data text-primary",
								children: k.code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-body-sm text-body-sm text-on-surface-variant",
								children: [
									k.valid_days,
									" dias · criada em ",
									fmt(k.created_at),
									k.note ? ` · ${k.note}` : "",
									k.redeemed_at ? ` · resgatada em ${fmt(k.redeemed_at)}` : "",
									k.expires_at ? ` · expira em ${fmt(k.expires_at)}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-label-md text-label-md px-3 py-1 rounded-full " + s.cls,
										children: s.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void navigator.clipboard.writeText(k.code),
										className: "p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low",
										"aria-label": "Copiar chave",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[20px]",
											children: "content_copy"
										})
									}),
									!k.revoked_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void revoke(k.id),
										className: "p-2 rounded-full text-error hover:bg-error-container",
										"aria-label": "Revogar chave",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[20px]",
											children: "block"
										})
									})
								]
							})]
						}, k.id);
					})]
				})
			]
		})
	});
}
//#endregion
export { Admin as component };
