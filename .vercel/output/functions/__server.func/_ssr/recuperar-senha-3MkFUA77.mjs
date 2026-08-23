import { t as supabase } from "./client-B6yKsI_N.mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as AuthShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recuperar-senha-3MkFUA77.js
var import_jsx_runtime = require_jsx_runtime();
function Recuperar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-sm mb-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "p-2 rounded-full hover:bg-surface-container-low",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined",
						children: "arrow_back"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "flex-1 text-center font-headline-md text-headline-md text-primary pr-10",
					children: "Recuperar Senha"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body-lg text-body-lg text-on-surface-variant text-center mb-lg",
				children: "Informe seu e-mail e enviaremos um link para redefinir sua senha."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: async (e) => {
					e.preventDefault();
					const email = String(new FormData(e.currentTarget).get("email") ?? "");
					const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` });
					if (error) {
						toast.error(error.message);
						return;
					}
					toast.success("E-mail de recuperação enviado");
				},
				className: "space-y-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
						children: "E-mail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						name: "email",
						type: "email",
						placeholder: "voce@email.com",
						className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
					children: "Enviar link de recuperação"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-lg text-center font-body-sm text-body-sm text-on-surface-variant",
				children: [
					"Lembrou a senha?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-primary font-semibold hover:underline",
						children: "Fazer login"
					})
				]
			})
		]
	}) });
}
//#endregion
export { Recuperar as component };
