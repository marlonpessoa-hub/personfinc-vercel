import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/password-input-Cv_IkCOX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Campo de senha com botão para mostrar/ocultar o texto digitado. */
function PasswordInput({ label, className, ...rest }) {
	const [visible, setVisible] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				...rest,
				type: visible ? "text" : "password",
				className: className ?? "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest pl-md pr-12 outline-none focus:border-primary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setVisible((v) => !v),
				"aria-label": visible ? "Ocultar senha" : "Mostrar senha",
				className: "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined !text-[20px]",
					children: visible ? "visibility_off" : "visibility"
				})
			})]
		})]
	});
}
//#endregion
export { PasswordInput as t };
