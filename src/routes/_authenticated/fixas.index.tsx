import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "../../components/app-shell";
import { MonthSelector } from "../../components/month-selector";
import { ReminderSettingsCard } from "../../components/reminder-settings";
import { useStore } from "../../lib/store";
import { formatBRL } from "../../lib/format";
import { formatMonthLabel } from "../../lib/month";

export const Route = createFileRoute("/_authenticated/fixas/")({
  head: () => ({
    meta: [
      { title: "Despesas Fixas — PersonFinc" },
      {
        name: "description",
        content: "Cadastre despesas fixas e lance em qualquer mês com um clique.",
      },
      { property: "og:title", content: "Despesas Fixas — PersonFinc" },
      {
        property: "og:description",
        content: "Cadastre despesas fixas e lance em qualquer mês com um clique.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FixasList,
});

function FixasList() {
  const {
    fixedExpenses,
    categoryById,
    month,
    setMonth,
    isFixedLaunched,
    launchFixedExpense,
    launchAllFixedExpenses,
  } = useStore();

  const total = fixedExpenses.filter((f) => f.active).reduce((a, b) => a + b.amount, 0);
  const pendentes = fixedExpenses.filter((f) => f.active && !isFixedLaunched(f.id, month));

  return (
    <AppShell
      title="Despesas Fixas"
      action={
        <Link
          to="/fixas/nova"
          className="p-2 rounded-full bg-primary text-on-primary"
          aria-label="Nova despesa fixa"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      }
    >
      <div className="space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-md">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary flex-1">
            Despesas Fixas
          </h1>
          <MonthSelector value={month} onChange={setMonth} />
          <Link
            to="/fixas/nova"
            className="hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90"
          >
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Nova
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex flex-col md:flex-row md:items-center gap-md">
          <div className="flex-1">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Total fixo mensal · {formatMonthLabel(month)}
            </p>
            <p className="font-numeric-data text-numeric-data text-error mt-xs">
              {formatBRL(total)}
            </p>
          </div>
          <button
            type="button"
            disabled={pendentes.length === 0}
            onClick={async () => {
              const n = await launchAllFixedExpenses(month);
              toast.success(
                n > 0
                  ? `${n} despesa(s) lançada(s) em ${formatMonthLabel(month)}`
                  : "Todas já estão lançadas neste mês",
              );
            }}
            className="px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-40"
          >
            Lançar pendentes ({pendentes.length})
          </button>
        </div>

        <ReminderSettingsCard />



        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
          {fixedExpenses.length === 0 ? (
            <div className="p-xl text-center">
              <span className="material-symbols-outlined text-on-surface-variant !text-[48px]">
                event_repeat
              </span>
              <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
                Nenhuma despesa fixa cadastrada.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/60">
              {fixedExpenses.map((f) => {
                const cat = categoryById(f.categoryId);
                const launched = isFixedLaunched(f.id, month);
                return (
                  <div
                    key={f.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm md:gap-md p-md min-h-[64px]"
                  >
                    <Link
                      to="/fixas/$id/editar"
                      params={{ id: f.id }}
                      className="flex items-center gap-md flex-1 min-w-0"
                    >
                      <div
                        className={
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 " +
                          (cat?.color ?? "bg-surface-variant text-on-surface-variant")
                        }
                      >
                        <span className="material-symbols-outlined">
                          {cat?.icon ?? "event_repeat"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body-lg text-body-lg text-primary font-medium break-words">
                          {f.description}
                          {!f.active && (
                            <span className="ml-sm font-label-md text-label-md text-on-surface-variant">
                              (inativa)
                            </span>
                          )}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Todo dia {f.dayOfMonth} · {cat?.name ?? "Sem categoria"}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between md:justify-end gap-md md:shrink-0 pl-[56px] md:pl-0">
                      <p className="font-numeric-data text-numeric-data text-error whitespace-nowrap">
                        {formatBRL(f.amount)}
                      </p>
                      {launched ? (
                        <span className="inline-flex items-center gap-xs font-label-md text-label-md px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container">
                          <span className="material-symbols-outlined !text-[16px]">check</span>
                          Lançada
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            await launchFixedExpense(f.id, month);
                            toast.success(`Lançada em ${formatMonthLabel(month)}`);
                          }}
                          className="font-label-md text-label-md px-3 py-1.5 rounded-full border border-outline text-primary hover:bg-surface-container-low"
                        >
                          Lançar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
