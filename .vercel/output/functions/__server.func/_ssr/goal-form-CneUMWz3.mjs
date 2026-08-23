import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goal-form-CneUMWz3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = [
	"directions_car",
	"flight",
	"home",
	"school",
	"shield",
	"diamond",
	"beach_access",
	"cake",
	"sports_esports"
];
function GoalForm({ title, initial, onSubmit, onCancel, onDelete }) {
	const [name, setName] = (0, import_react.useState)(initial?.title ?? "");
	const [icon, setIcon] = (0, import_react.useState)(initial?.icon ?? ICONS[0]);
	const [target, setTarget] = (0, import_react.useState)(initial?.target?.toString() ?? "");
	const [saved, setSaved] = (0, import_react.useState)(initial?.saved?.toString() ?? "0");
	const [deadline, setDeadline] = (0, import_react.useState)(initial?.deadline ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit({
					title: name,
					icon,
					target: parseFloat(target || "0"),
					saved: parseFloat(saved || "0"),
					deadline
				});
			},
			className: "max-w-2xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
								children: "Nome da meta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Ex: Viagem à Europa",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
							children: "Ícone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 md:grid-cols-9 gap-sm",
							children: ICONS.map((ic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIcon(ic),
								className: "aspect-square rounded-lg flex items-center justify-center border " + (icon === ic ? "border-primary bg-primary/5" : "border-outline-variant hover:bg-surface-container-low"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-primary",
									children: ic
								})
							}, ic))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
									children: "Valor alvo (R$)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "number",
									step: "0.01",
									min: "0",
									value: target,
									onChange: (e) => setTarget(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
									children: "Já guardado (R$)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.01",
									min: "0",
									value: saved,
									onChange: (e) => setSaved(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
								children: "Prazo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: deadline,
								onChange: (e) => setDeadline(e.target.value),
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse md:flex-row md:justify-between gap-sm",
					children: [onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onDelete,
						className: "inline-flex items-center justify-center gap-sm px-4 py-3 rounded-full text-error font-label-md text-label-md hover:bg-error-container",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined !text-[18px]",
							children: "delete"
						}), "Excluir"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse md:flex-row gap-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onCancel,
							className: "px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
							children: "Salvar"
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { GoalForm as t };
