import { t as supabase } from "./client-B6yKsI_N.mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as AuthShell } from "./app-shell-zcgA_t_N.mjs";
import { t as PasswordInput } from "./password-input-Cv_IkCOX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/redefinir-senha-Cwvnf901.js
var import_jsx_runtime = require_jsx_runtime();
function Redefinir() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center font-headline-md text-headline-md text-primary mb-md",
				children: "Redefinir Senha"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body-lg text-body-lg text-on-surface-variant text-center mb-lg",
				children: "Crie uma senha forte com pelo menos 8 caracteres."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					const password = String(form.get("password") ?? "");
					if (password !== String(form.get("confirm") ?? "")) {
						toast.error("As senhas não coincidem");
						return;
					}
					const { error } = await supabase.auth.updateUser({ password });
					if (error) {
						toast.error(error.message);
						return;
					}
					toast.success("Senha redefinida");
					navigate({ to: "/senha-alterada" });
				},
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
						label: "Confirmar nova senha",
						minLength: 8,
						placeholder: "••••••••"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
						children: "Redefinir senha"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-lg text-center font-body-sm text-body-sm text-on-surface-variant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "text-primary font-semibold hover:underline",
					children: "Voltar ao login"
				})
			})
		]
	}) });
}
//#endregion
export { Redefinir as component };
