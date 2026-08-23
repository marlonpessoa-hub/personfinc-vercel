import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as AuthShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/senha-alterada-D-9obxnh.js
var import_jsx_runtime = require_jsx_runtime();
function SenhaAlterada() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface-container-lowest rounded-xl p-lg md:p-xl border border-outline-variant text-center flex flex-col items-center card-shadow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-lg relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center success-checkmark-bounce",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-on-secondary-container !text-[48px]",
						children: "check_circle"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-md",
				children: "Senha alterada!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[320px]",
				children: "Sua senha foi redefinida com sucesso. Agora você já pode acessar sua conta com a nova senha."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/login",
				className: "w-full bg-primary text-on-primary font-label-md text-label-md py-md px-lg rounded-lg flex items-center justify-center gap-sm hover:opacity-90",
				children: ["Ir para o Login", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined !text-[18px]",
					children: "arrow_forward"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-lg font-body-sm text-body-sm text-outline",
				children: [
					"Problemas para acessar?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-secondary font-semibold hover:underline",
						href: "#",
						children: "Fale com o suporte"
					})
				]
			})
		]
	}) });
}
//#endregion
export { SenhaAlterada as component };
