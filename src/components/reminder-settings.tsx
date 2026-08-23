import { toast } from "sonner";
import { useDueReminders } from "../hooks/use-due-reminders";
import {
  dueLabel,
  getNotificationPermission,
  notificationsSupported,
  openNotificationSettings,
  requestNotificationPermission,
} from "../lib/reminders";
import { formatBRL } from "../lib/format";

/** Roda em segundo plano: verifica vencimentos e dispara as notificações. */
export function DueRemindersWatcher() {
  useDueReminders();
  return null;
}

export function ReminderSettingsCard() {
  const { settings, persist, permission, setPermission, due } = useDueReminders();
  const supported = notificationsSupported();
  const currentPermission = supported ? permission : "denied";

  const enable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    persist({ ...settings, enabled: true });
    if (result === "granted") {
      toast.success("Lembretes de vencimento ativados");
      try {
        new Notification("PersonFinc", {
          body: "Notificações de lembrete ativadas.",
          icon: "/favicon.ico",
        });
      } catch {
        // ignore
      }
    } else if (result === "denied") {
      toast.info("Sem permissão do sistema — os avisos aparecerão dentro do app.");
    } else {
      toast.info("Permissão pendente — os avisos aparecerão dentro do app.");
    }
  };

  const retryPermission = async () => {
    const fresh = getNotificationPermission();
    setPermission(fresh);
    if (fresh === "granted") {
      toast.success("Permissão concedida!");
    } else if (fresh === "denied") {
      toast.info("A permissão está bloqueada. Abra as configurações do app para liberar notificações.");
      await openNotificationSettings();
    } else {
      // default — tenta solicitar novamente
      await enable();
    }
  };


  return (
    <section className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow space-y-md">
      <div className="flex items-start justify-between gap-md">
        <div className="flex items-start gap-md min-w-0">
          <span className="material-symbols-outlined text-primary">notifications_active</span>
          <div className="min-w-0">
            <p className="font-body-lg text-body-lg text-primary font-medium">
              Lembretes de vencimento
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Avisamos quando uma despesa fixa está perto de vencer e ainda não foi lançada.
            </p>
          </div>
        </div>
        {settings.enabled ? (
          <button
            type="button"
            onClick={() => {
              persist({ ...settings, enabled: false });
              toast.info("Lembretes desativados");
            }}
            className="shrink-0 px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
          >
            Desativar
          </button>
        ) : (
          <button
            type="button"
            onClick={enable}
            className="shrink-0 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
          >
            Ativar
          </button>
        )}
      </div>

      <label className="flex items-center justify-between gap-md">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase">
          Avisar com antecedência
        </span>
        <select
          value={settings.leadDays}
          onChange={(e) => persist({ ...settings, leadDays: Number(e.target.value) })}
          className="h-10 rounded-lg border border-outline bg-surface-container-lowest px-sm outline-none focus:border-primary"
        >
          {[0, 1, 2, 3, 5, 7, 10, 15].map((d) => (
            <option key={d} value={d}>
              {d === 0 ? "No dia" : `${d} dia(s) antes`}
            </option>
          ))}
        </select>
      </label>

      {settings.enabled && supported && currentPermission !== "granted" && (
        <div className="bg-surface-container-low rounded-lg p-md space-y-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <strong className="text-on-surface">Permissão de notificação não concedida.</strong>{" "}
            Os lembretes continuarão aparecendo dentro do app, mas para recebê-los na barra de
            notificações do aparelho é preciso liberar a permissão.
          </p>
          <div className="flex flex-wrap gap-sm">
            <button
              type="button"
              onClick={retryPermission}
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
            >
              {currentPermission === "denied" ? "Abrir configurações" : "Permitir notificações"}
            </button>
            <button
              type="button"
              onClick={() => {
                persist({ ...settings, enabled: false });
                toast.info("Lembretes desativados");
              }}
              className="px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
            >
              Manter só no app
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant/80">
            Dica: em Android, vá em <em>Configurações → Apps → PersonFinc → Notificações</em> e ative. No
            iPhone, em <em>Ajustes → Notificações → PersonFinc</em>.
          </p>
        </div>
      )}


      {due.length > 0 && (
        <ul className="divide-y divide-outline-variant/60 border-t border-outline-variant/60 pt-sm">
          {due.map((d) => (
            <li key={d.expense.id} className="flex items-center justify-between gap-md py-sm">
              <span className="font-body-lg text-body-lg text-primary truncate">
                {d.expense.description}
                <span
                  className={
                    "block font-body-sm text-body-sm " +
                    (d.daysUntil < 0 ? "text-error" : "text-on-surface-variant")
                  }
                >
                  {dueLabel(d.daysUntil)} · dia {d.expense.dayOfMonth}
                </span>
              </span>
              <span className="font-numeric-data text-numeric-data text-error shrink-0">
                {formatBRL(d.expense.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
