import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as currentMonthKey, r as dateInMonth, s as useStore } from "./store-DhZ7fAxm.mjs";
import { t as formatBRL } from "./format-DeTY0EH_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reminder-settings-6K8BfRoE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SETTINGS_KEY = "personfinc.reminders";
var SENT_KEY = "personfinc.reminders.sent";
var defaultReminderSettings = {
	enabled: false,
	leadDays: 3
};
function loadReminderSettings() {
	if (typeof window === "undefined") return defaultReminderSettings;
	try {
		const raw = window.localStorage.getItem(SETTINGS_KEY);
		if (!raw) return defaultReminderSettings;
		const parsed = JSON.parse(raw);
		return {
			enabled: Boolean(parsed.enabled),
			leadDays: Math.min(15, Math.max(0, Number(parsed.leadDays ?? 3)))
		};
	} catch {
		return defaultReminderSettings;
	}
}
function saveReminderSettings(s) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
var todayISO = () => {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
var daysBetween = (fromISO, toISO) => {
	const [fy, fm, fd] = fromISO.split("-").map(Number);
	const [ty, tm, td] = toISO.split("-").map(Number);
	const a = Date.UTC(fy, fm - 1, fd);
	const b = Date.UTC(ty, tm - 1, td);
	return Math.round((b - a) / 864e5);
};
/** Despesas fixas ativas ainda não lançadas cujo vencimento está próximo ou vencido. */
function getDueFixedExpenses(fixedExpenses, isFixedLaunched, leadDays) {
	const month = currentMonthKey();
	const today = todayISO();
	return fixedExpenses.filter((f) => f.active && !isFixedLaunched(f.id, month)).map((f) => {
		const dueDate = dateInMonth(month, f.dayOfMonth);
		return {
			expense: f,
			dueDate,
			daysUntil: daysBetween(today, dueDate)
		};
	}).filter((d) => d.daysUntil <= leadDays).sort((a, b) => a.daysUntil - b.daysUntil);
}
function dueLabel(daysUntil) {
	if (daysUntil < 0) return `vencida há ${Math.abs(daysUntil)} dia(s)`;
	if (daysUntil === 0) return "vence hoje";
	if (daysUntil === 1) return "vence amanhã";
	return `vence em ${daysUntil} dias`;
}
/** Evita repetir a mesma notificação mais de uma vez por dia. */
function alreadyNotified(id) {
	if (typeof window === "undefined") return true;
	const key = `${todayISO()}:${id}`;
	try {
		return JSON.parse(window.localStorage.getItem(SENT_KEY) ?? "[]").includes(key);
	} catch {
		return false;
	}
}
function markNotified(id) {
	if (typeof window === "undefined") return;
	const key = `${todayISO()}:${id}`;
	try {
		const sent = JSON.parse(window.localStorage.getItem(SENT_KEY) ?? "[]");
		const today = todayISO();
		const kept = sent.filter((k) => k.startsWith(today));
		kept.push(key);
		window.localStorage.setItem(SENT_KEY, JSON.stringify(kept));
	} catch {
		window.localStorage.setItem(SENT_KEY, JSON.stringify([key]));
	}
}
function notificationsSupported() {
	return typeof window !== "undefined" && "Notification" in window;
}
function getNotificationPermission() {
	if (!notificationsSupported()) return "denied";
	return Notification.permission;
}
async function requestNotificationPermission() {
	if (!notificationsSupported()) return "denied";
	if (Notification.permission === "granted") return "granted";
	if (Notification.permission === "denied") return "denied";
	return Notification.requestPermission();
}
/** Tenta abrir as configurações de notificação do app no Android/Capacitor. */
async function openNotificationSettings() {
	try {
		const { App } = await import("../_libs/capacitor__app+capacitor__core.mjs").then((n) => n.t);
		const url = `intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;S.android.provider.extra.APP_PACKAGE=${(await App.getInfo()).id};end`;
		window.location.href = url;
	} catch {}
}
var HOUR = 3600 * 1e3;
/** Verifica vencimentos de despesas fixas e dispara notificações do sistema. */
function useDueReminders() {
	const { fixedExpenses, isFixedLaunched, loading } = useStore();
	const [settings, setSettings] = (0, import_react.useState)(() => loadReminderSettings());
	const [permission, setPermission] = (0, import_react.useState)("default");
	const [due, setDue] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (notificationsSupported()) setPermission(getNotificationPermission());
	}, []);
	const update = (0, import_react.useCallback)((notify) => {
		const items = getDueFixedExpenses(fixedExpenses, isFixedLaunched, settings.leadDays);
		setDue(items);
		if (!notify || !settings.enabled) return;
		const canNotify = notificationsSupported() && getNotificationPermission() === "granted";
		for (const item of items) {
			if (alreadyNotified(item.expense.id)) continue;
			markNotified(item.expense.id);
			const title = `${item.expense.description} ${dueLabel(item.daysUntil)}`;
			const body = `${formatBRL(item.expense.amount)} · dia ${item.expense.dayOfMonth}`;
			if (canNotify) try {
				new Notification(title, {
					body,
					icon: "/favicon.ico",
					tag: item.expense.id
				});
			} catch {
				toast.warning(title, { description: body });
			}
			else toast.warning(title, { description: body });
		}
	}, [
		fixedExpenses,
		isFixedLaunched,
		settings
	]);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		update(true);
		const id = window.setInterval(() => update(true), HOUR);
		const onFocus = () => update(true);
		window.addEventListener("focus", onFocus);
		return () => {
			window.clearInterval(id);
			window.removeEventListener("focus", onFocus);
		};
	}, [loading, update]);
	return {
		settings,
		persist: (0, import_react.useCallback)((next) => {
			saveReminderSettings(next);
			setSettings(next);
		}, []),
		permission,
		setPermission,
		due
	};
}
/** Roda em segundo plano: verifica vencimentos e dispara as notificações. */
function DueRemindersWatcher() {
	useDueReminders();
	return null;
}
function ReminderSettingsCard() {
	const { settings, persist, permission, setPermission, due } = useDueReminders();
	const supported = notificationsSupported();
	const currentPermission = supported ? permission : "denied";
	const enable = async () => {
		const result = await requestNotificationPermission();
		setPermission(result);
		persist({
			...settings,
			enabled: true
		});
		if (result === "granted") {
			toast.success("Lembretes de vencimento ativados");
			try {
				new Notification("PersonFinc", {
					body: "Notificações de lembrete ativadas.",
					icon: "/favicon.ico"
				});
			} catch {}
		} else if (result === "denied") toast.info("Sem permissão do sistema — os avisos aparecerão dentro do app.");
		else toast.info("Permissão pendente — os avisos aparecerão dentro do app.");
	};
	const retryPermission = async () => {
		const fresh = getNotificationPermission();
		setPermission(fresh);
		if (fresh === "granted") toast.success("Permissão concedida!");
		else if (fresh === "denied") {
			toast.info("A permissão está bloqueada. Abra as configurações do app para liberar notificações.");
			await openNotificationSettings();
		} else await enable();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow space-y-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-md min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined text-primary",
						children: "notifications_active"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-lg text-body-lg text-primary font-medium",
							children: "Lembretes de vencimento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body-sm text-body-sm text-on-surface-variant",
							children: "Avisamos quando uma despesa fixa está perto de vencer e ainda não foi lançada."
						})]
					})]
				}), settings.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						persist({
							...settings,
							enabled: false
						});
						toast.info("Lembretes desativados");
					},
					className: "shrink-0 px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
					children: "Desativar"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: enable,
					className: "shrink-0 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
					children: "Ativar"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center justify-between gap-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-label-md text-label-md text-on-surface-variant uppercase",
					children: "Avisar com antecedência"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: settings.leadDays,
					onChange: (e) => persist({
						...settings,
						leadDays: Number(e.target.value)
					}),
					className: "h-10 rounded-lg border border-outline bg-surface-container-lowest px-sm outline-none focus:border-primary",
					children: [
						0,
						1,
						2,
						3,
						5,
						7,
						10,
						15
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: d,
						children: d === 0 ? "No dia" : `${d} dia(s) antes`
					}, d))
				})]
			}),
			settings.enabled && supported && currentPermission !== "granted" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-surface-container-low rounded-lg p-md space-y-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-body-sm text-body-sm text-on-surface-variant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-on-surface",
								children: "Permissão de notificação não concedida."
							}),
							" ",
							"Os lembretes continuarão aparecendo dentro do app, mas para recebê-los na barra de notificações do aparelho é preciso liberar a permissão."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: retryPermission,
							className: "px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90",
							children: currentPermission === "denied" ? "Abrir configurações" : "Permitir notificações"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								persist({
									...settings,
									enabled: false
								});
								toast.info("Lembretes desativados");
							},
							className: "px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low",
							children: "Manter só no app"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-body-sm text-body-sm text-on-surface-variant/80",
						children: [
							"Dica: em Android, vá em ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Configurações → Apps → PersonFinc → Notificações" }),
							" e ative. No iPhone, em ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Ajustes → Notificações → PersonFinc" }),
							"."
						]
					})
				]
			}),
			due.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-outline-variant/60 border-t border-outline-variant/60 pt-sm",
				children: due.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-md py-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-body-lg text-body-lg text-primary truncate",
						children: [d.expense.description, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-body-sm text-body-sm " + (d.daysUntil < 0 ? "text-error" : "text-on-surface-variant"),
							children: [
								dueLabel(d.daysUntil),
								" · dia ",
								d.expense.dayOfMonth
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-numeric-data text-numeric-data text-error shrink-0",
						children: formatBRL(d.expense.amount)
					})]
				}, d.expense.id))
			})
		]
	});
}
//#endregion
export { ReminderSettingsCard as n, DueRemindersWatcher as t };
