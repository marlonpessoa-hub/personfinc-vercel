import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AppShell } from "./app-shell-zcgA_t_N.mjs";
import { t as CreditCardVisual } from "./credit-card-visual-6qIjJWO4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-form-C6v_3HXJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CARD_BRANDS = [
	{
		value: "visa",
		label: "Visa"
	},
	{
		value: "mastercard",
		label: "Mastercard"
	},
	{
		value: "elo",
		label: "Elo"
	},
	{
		value: "amex",
		label: "American Express"
	},
	{
		value: "hipercard",
		label: "Hipercard"
	},
	{
		value: "outro",
		label: "Outro"
	}
];
var CARD_COLORS = [
	{
		value: "from-primary to-tertiary",
		label: "Padrão"
	},
	{
		value: "from-tertiary to-primary",
		label: "Invertido"
	},
	{
		value: "from-secondary to-primary",
		label: "Oceano"
	},
	{
		value: "from-error to-tertiary",
		label: "Coral"
	},
	{
		value: "from-on-surface to-on-surface-variant",
		label: "Grafite"
	}
];
/** Cores oficiais dos principais bancos/emissores do mercado. */
var BANK_COLORS = [
	{
		value: "from-[#820AD1] to-[#4B0082]",
		label: "Nubank",
		match: [
			"nubank",
			"nu bank",
			"roxinho"
		]
	},
	{
		value: "from-[#FAE128] to-[#0038A8]",
		label: "Banco do Brasil",
		match: ["banco do brasil", "bb"]
	},
	{
		value: "from-[#EC7000] to-[#8A4500]",
		label: "Itaú",
		match: ["itau", "itaú"]
	},
	{
		value: "from-[#CC092F] to-[#7A0016]",
		label: "Bradesco",
		match: ["bradesco"]
	},
	{
		value: "from-[#EC0000] to-[#8B0000]",
		label: "Santander",
		match: ["santander"]
	},
	{
		value: "from-[#00A868] to-[#005C3A]",
		label: "Caixa",
		match: ["caixa"]
	},
	{
		value: "from-[#FF7A00] to-[#B35400]",
		label: "Inter",
		match: ["inter"]
	},
	{
		value: "from-[#00E7A0] to-[#00825A]",
		label: "C6 Bank",
		match: ["c6"]
	},
	{
		value: "from-[#FFD100] to-[#B39100]",
		label: "Banco Pan",
		match: ["pan"]
	},
	{
		value: "from-[#00AEEF] to-[#005B7F]",
		label: "Next",
		match: ["next"]
	},
	{
		value: "from-[#32BCAD] to-[#1B6B63]",
		label: "PicPay/Pix",
		match: ["picpay", "pix"]
	},
	{
		value: "from-[#111111] to-[#3A3A3A]",
		label: "Black",
		match: ["black", "infinite"]
	}
];
function suggestCardColor(name) {
	const n = name.toLowerCase();
	return BANK_COLORS.find((b) => b.match.some((m) => n.includes(m)))?.value;
}
function CardForm({ title, initial, onSubmit, onCancel, onDelete }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [brand, setBrand] = (0, import_react.useState)(initial?.brand ?? "visa");
	const [kind, setKind] = (0, import_react.useState)(initial?.kind ?? "credito");
	const [last4, setLast4] = (0, import_react.useState)(initial?.last4 ?? "");
	const [creditLimit, setCreditLimit] = (0, import_react.useState)(initial?.creditLimit?.toString() ?? "");
	const [closingDay, setClosingDay] = (0, import_react.useState)(initial?.closingDay?.toString() ?? "");
	const [dueDay, setDueDay] = (0, import_react.useState)(initial?.dueDay?.toString() ?? "");
	const [color, setColor] = (0, import_react.useState)(initial?.color ?? CARD_COLORS[0].value);
	const [colorTouched, setColorTouched] = (0, import_react.useState)(Boolean(initial?.color));
	const pickColor = (v) => {
		setColor(v);
		setColorTouched(true);
	};
	const handleName = (v) => {
		setName(v);
		if (!colorTouched) {
			const suggested = suggestCardColor(v);
			if (suggested) setColor(suggested);
		}
	};
	const clampDay = (v) => v === "" ? void 0 : Math.min(31, Math.max(1, parseInt(v, 10) || 1));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit({
					name,
					brand,
					kind,
					last4: last4.replace(/\D/g, "").slice(-4),
					creditLimit: kind === "credito" && creditLimit !== "" ? Math.abs(parseFloat(creditLimit)) : void 0,
					closingDay: kind === "credito" ? clampDay(closingDay) : void 0,
					dueDay: kind === "credito" ? clampDay(dueDay) : void 0,
					color
				});
			},
			className: "max-w-2xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCardVisual, { card: {
					id: "preview",
					name: name || "Meu cartão",
					brand,
					kind,
					last4: last4.replace(/\D/g, "").slice(-4),
					creditLimit: creditLimit ? parseFloat(creditLimit) : void 0,
					closingDay: clampDay(closingDay),
					dueDay: clampDay(dueDay),
					color
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nome do cartão",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: name,
								onChange: (e) => handleName(e.target.value),
								placeholder: "Ex: Nubank Roxinho",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Bandeira",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: brand,
									onChange: (e) => setBrand(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary",
									children: CARD_BRANDS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: b.value,
										children: b.label
									}, b.value))
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tipo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: kind,
									onChange: (e) => setKind(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "credito",
										children: "Crédito"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "debito",
										children: "Débito"
									})]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Últimos 4 dígitos",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "numeric",
								maxLength: 4,
								value: last4,
								onChange: (e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4)),
								placeholder: "1234",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
							})
						}),
						kind === "credito" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Limite (R$)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.01",
								min: "0",
								value: creditLimit,
								onChange: (e) => setCreditLimit(e.target.value),
								placeholder: "0,00",
								className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Dia de fechamento",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "1",
									max: "31",
									value: closingDay,
									onChange: (e) => setClosingDay(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Dia de vencimento",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "1",
									max: "31",
									value: dueDay,
									onChange: (e) => setDueDay(e.target.value),
									className: "w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
								})
							})]
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cor do cartão",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-sm",
								children: CARD_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => pickColor(c.value),
									"aria-label": c.label,
									title: c.label,
									className: "w-12 h-8 rounded-lg bg-gradient-to-br " + c.value + (color === c.value ? " ring-2 ring-offset-2 ring-primary" : "")
								}, c.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cores de bancos",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-sm",
								children: BANK_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => pickColor(c.value),
									title: c.label,
									className: "flex items-center gap-sm rounded-lg border p-xs text-left " + (color === c.value ? "border-primary ring-2 ring-primary" : "border-outline-variant hover:bg-surface-container-low"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-6 rounded-md bg-gradient-to-br shrink-0 " + c.value }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-label-md text-label-md text-on-surface truncate",
										children: c.label
									})]
								}, c.value))
							})
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
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-label-md text-label-md text-on-surface-variant mb-xs uppercase",
			children: label
		}), children]
	});
}
//#endregion
export { CardForm as t };
