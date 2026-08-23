import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as AuthShell } from "./app-shell-zcgA_t_N.mjs";
import { t as needsPasswordSetup } from "./password-setup-Cf9AFU7C.mjs";
import { t as PasswordInput } from "./password-input-Cv_IkCOX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/definir-senha-SU-6Zj0Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DefinirSenha() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!active) return;
			if (!data.user) {
				navigate({ to: "/login" });
				return;
			}
			if (!needsPasswordSetup(data.user)) {
				navigate({ to: "/" });
				return;
			}
			setEmail(data.user.email ?? "");
			setChecking(false);
		})();
		return () => {
			active = false;
		};
	}, [navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const password = String(form.get("password") ?? "");
		if (password !== String(form.get("confirm") ?? "")) {
			toast.error("As senhas não coincidem");
			return;
		}
		setSaving(true);
		try {
			const { error } = await supabase.auth.updateUser({
				password,
				data: { password_set: true }
			});
			if (error) throw error;
			toast.success("Senha definida! Agora você também pode entrar com e-mail e senha.");
			navigate({ to: "/" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível definir a senha");
		} finally {
			setSaving(false);
		}
	}
	async function handleSkip() {
		await supabase.auth.updateUser({ data: { password_set: true } }).catch(() => {});
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center font-headline-md text-headline-md text-primary mb-md",
				children: "Definir senha"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body-lg text-body-lg text-on-surface-variant text-center mb-lg",
				children: checking ? "Verificando sua conta…" : `Você entrou com o Google${email ? ` como ${email}` : ""}. Crie uma senha para também poder entrar com e-mail e senha.`
			}),
			!checking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						required: true,
						name: "password",
						label: "Nova senha",
						minLength: 8,
						placeholder: "••••••••"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
						required: true,
						name: "confirm",
						label: "Confirmar senha",
						minLength: 8,
						placeholder: "••••••••"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saving,
						className: "w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60",
						children: saving ? "Salvando…" : "Salvar senha"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: handleSkip,
				className: "mt-md w-full py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
				children: "Agora não"
			})] })
		]
	}) });
}
//#endregion
export { DefinirSenha as component };
