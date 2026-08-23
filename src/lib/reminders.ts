import type { FixedExpense } from "./mock-data";
import { currentMonthKey, dateInMonth } from "./month";

export type ReminderSettings = {
  enabled: boolean;
  /** Quantos dias antes do vencimento avisar */
  leadDays: number;
};

const SETTINGS_KEY = "personfinc.reminders";
const SENT_KEY = "personfinc.reminders.sent";

export const defaultReminderSettings: ReminderSettings = { enabled: false, leadDays: 3 };

export function loadReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return defaultReminderSettings;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultReminderSettings;
    const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
    return {
      enabled: Boolean(parsed.enabled),
      leadDays: Math.min(15, Math.max(0, Number(parsed.leadDays ?? 3))),
    };
  } catch {
    return defaultReminderSettings;
  }
}

export function saveReminderSettings(s: ReminderSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const daysBetween = (fromISO: string, toISO: string) => {
  const [fy, fm, fd] = fromISO.split("-").map(Number);
  const [ty, tm, td] = toISO.split("-").map(Number);
  const a = Date.UTC(fy, fm - 1, fd);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((b - a) / 86400000);
};

export type DueItem = {
  expense: FixedExpense;
  dueDate: string;
  /** negativo = vencida */
  daysUntil: number;
};

/** Despesas fixas ativas ainda não lançadas cujo vencimento está próximo ou vencido. */
export function getDueFixedExpenses(
  fixedExpenses: FixedExpense[],
  isFixedLaunched: (id: string, month: string) => boolean,
  leadDays: number,
): DueItem[] {
  const month = currentMonthKey();
  const today = todayISO();
  return fixedExpenses
    .filter((f) => f.active && !isFixedLaunched(f.id, month))
    .map((f) => {
      const dueDate = dateInMonth(month, f.dayOfMonth);
      return { expense: f, dueDate, daysUntil: daysBetween(today, dueDate) };
    })
    .filter((d) => d.daysUntil <= leadDays)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export function dueLabel(daysUntil: number) {
  if (daysUntil < 0) return `vencida há ${Math.abs(daysUntil)} dia(s)`;
  if (daysUntil === 0) return "vence hoje";
  if (daysUntil === 1) return "vence amanhã";
  return `vence em ${daysUntil} dias`;
}

/** Evita repetir a mesma notificação mais de uma vez por dia. */
export function alreadyNotified(id: string) {
  if (typeof window === "undefined") return true;
  const key = `${todayISO()}:${id}`;
  try {
    const sent = JSON.parse(window.localStorage.getItem(SENT_KEY) ?? "[]") as string[];
    return sent.includes(key);
  } catch {
    return false;
  }
}

export function markNotified(id: string) {
  if (typeof window === "undefined") return;
  const key = `${todayISO()}:${id}`;
  try {
    const sent = JSON.parse(window.localStorage.getItem(SENT_KEY) ?? "[]") as string[];
    const today = todayISO();
    const kept = sent.filter((k) => k.startsWith(today));
    kept.push(key);
    window.localStorage.setItem(SENT_KEY, JSON.stringify(kept));
  } catch {
    window.localStorage.setItem(SENT_KEY, JSON.stringify([key]));
  }
}

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!notificationsSupported()) return "denied";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  // Se já foi negado, não re-solicita automaticamente (evita spam); o usuário deve ir nas configurações.
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

/** Tenta abrir as configurações de notificação do app no Android/Capacitor. */
export async function openNotificationSettings() {
  try {
    const { App } = await import("@capacitor/app");
    // @capacitor/app não tem abrir configurações nativamente; usamos intent genérico via Browser quando possível.
    const pkg = (await App.getInfo()).id;
    const url = `intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;S.android.provider.extra.APP_PACKAGE=${pkg};end`;
    window.location.href = url;
  } catch {
    // Fallback: instruções manuais via toast/UI.
  }
}

