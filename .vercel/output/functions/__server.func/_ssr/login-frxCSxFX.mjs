import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as logo_png_asset_default, r as AuthShell } from "./app-shell-zcgA_t_N.mjs";
import { i as signInWithGoogleNative, n as isNativeApp, r as listenNativeAuthRedirect } from "./native-auth-BbLFzfeM.mjs";
import { t as PasswordInput } from "./password-input-Cv_IkCOX.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-frxCSxFX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		...opts,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function Login() {
	const [tab, setTab] = (0, import_react.useState)("login");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	async function handleSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const email = String(form.get("email") ?? "");
		const password = String(form.get("password") ?? "");
		setLoading(true);
		try {
			if (tab === "login") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Login realizado");
				navigate({ to: "/" });
			} else {
				if (password !== String(form.get("confirm") ?? "")) {
					toast.error("As senhas não coincidem");
					return;
				}
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: String(form.get("name") ?? "") }
					}
				});
				if (error) throw error;
				toast.success("Conta criada! Verifique seu e-mail para confirmar.");
				setTab("login");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível continuar");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => listenNativeAuthRedirect(() => navigate({ to: "/definir-senha" })), [navigate]);
	async function handleGoogle() {
		if (isNativeApp()) {
			try {
				await signInWithGoogleNative();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Não foi possível entrar com o Google");
			}
			return;
		}
		try {
			const result = await lovable.auth.signInWithOAuth("google", {
				redirect_uri: window.location.origin,
				extraParams: { prompt: "select_account" }
			});
			if (result.error) throw result.error;
			if (result.redirected) return;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível entrar com o Google");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center p-md border-b border-outline-variant gap-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: logo_png_asset_default.url,
					alt: "PersonFinc Logo",
					className: "w-48 h-48 object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "w-full text-center font-bold font-headline-md text-headline-md text-primary",
					children: tab === "login" ? "Bem-vindo de volta" : "Crie sua conta"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex border-b border-outline-variant",
				children: ["login", "cadastro"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: "flex-1 py-4 text-sm font-bold border-b-[3px] transition-colors capitalize " + (tab === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:bg-surface-container-low"),
					children: t === "login" ? "Entrar" : "Cadastrar"
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-lg space-y-md",
				children: [
					tab === "cadastro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						label: "Nome Completo",
						type: "text",
						placeholder: "Ex: João Silva"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "email",
						label: "E-mail",
						type: "email",
						placeholder: "voce@email.com",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						name: "password",
						label: "Senha",
						placeholder: "••••••••",
						required: true,
						minLength: 6
					}),
					tab === "cadastro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						name: "confirm",
						label: "Confirme a senha",
						placeholder: "••••••••",
						required: true,
						minLength: 6
					}),
					tab === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/recuperar-senha",
							className: "font-body-sm text-body-sm text-primary hover:underline",
							children: "Esqueceu a senha?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
						children: loading ? "Aguarde…" : tab === "login" ? "Entrar" : "Criar conta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-outline-variant" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-body-sm text-body-sm text-on-surface-variant",
								children: "ou"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-outline-variant" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleGoogle,
						className: "w-full py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low flex items-center justify-center gap-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[18px]",
							children: "login"
						}), "Continuar com Google"]
					})
				]
			})
		]
	}) });
}
function Input({ label, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			...rest,
			className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
		})]
	});
}
//#endregion
export { Login as component };
