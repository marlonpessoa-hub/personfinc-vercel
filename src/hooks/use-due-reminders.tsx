import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "../lib/store";
import { formatBRL } from "../lib/format";
import {
  alreadyNotified,
  dueLabel,
  getDueFixedExpenses,
  getNotificationPermission,
  loadReminderSettings,
  markNotified,
  notificationsSupported,
  saveReminderSettings,
  type DueItem,
  type ReminderSettings,
} from "../lib/reminders";


const HOUR = 60 * 60 * 1000;

/** Verifica vencimentos de despesas fixas e dispara notificações do sistema. */
export function useDueReminders() {
  const { fixedExpenses, isFixedLaunched, loading } = useStore();
  const [settings, setSettings] = useState<ReminderSettings>(() => loadReminderSettings());
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [due, setDue] = useState<DueItem[]>([]);

  useEffect(() => {
    if (notificationsSupported()) setPermission(getNotificationPermission());
  }, []);

  const update = useCallback(
    (notify: boolean) => {
      const items = getDueFixedExpenses(fixedExpenses, isFixedLaunched, settings.leadDays);
      setDue(items);
      if (!notify || !settings.enabled) return;
      const canNotify = notificationsSupported() && getNotificationPermission() === "granted";

      for (const item of items) {
        if (alreadyNotified(item.expense.id)) continue;
        markNotified(item.expense.id);
        const title = `${item.expense.description} ${dueLabel(item.daysUntil)}`;
        const body = `${formatBRL(item.expense.amount)} · dia ${item.expense.dayOfMonth}`;
        if (canNotify) {
          try {
            new Notification(title, { body, icon: "/favicon.ico", tag: item.expense.id });
          } catch {
            toast.warning(title, { description: body });
          }
        } else {
          toast.warning(title, { description: body });
        }
      }
    },
    [fixedExpenses, isFixedLaunched, settings],
  );

  useEffect(() => {
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

  const persist = useCallback((next: ReminderSettings) => {
    saveReminderSettings(next);
    setSettings(next);
  }, []);

  return { settings, persist, permission, setPermission, due };
}
