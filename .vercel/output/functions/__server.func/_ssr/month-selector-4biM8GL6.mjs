import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatMonthLabel, o as shiftMonth } from "./store-DhZ7fAxm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/month-selector-4biM8GL6.js
var import_jsx_runtime = require_jsx_runtime();
function MonthSelector({ value, onChange, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-xs bg-surface-container rounded-full p-1 " + className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(shiftMonth(value, -1)),
				"aria-label": "Mês anterior",
				className: "w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined !text-[20px]",
					children: "chevron_left"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-[140px] text-center font-label-md text-label-md text-primary",
				children: formatMonthLabel(value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(shiftMonth(value, 1)),
				"aria-label": "Próximo mês",
				className: "w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined !text-[20px]",
					children: "chevron_right"
				})
			})
		]
	});
}
//#endregion
export { MonthSelector as t };
