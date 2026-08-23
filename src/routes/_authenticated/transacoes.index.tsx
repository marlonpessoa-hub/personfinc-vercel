import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "../../components/app-shell";
import { MonthSelector } from "../../components/month-selector";
import { useStore } from "../../lib/store";
import { formatBRL, formatDateShort, formatSignedBRL } from "../../lib/format";
import type { TxKind } from "../../lib/mock-data";
import { ExpenseImportDialog } from "../../components/expense-import-dialog";

export const Route = createFileRoute("/_authenticated/transacoes/")({
  head: () => ({
    meta: [
      { title: "Transações — PersonFinc" },
      { name: "description", content: "Lista completa de receitas e despesas." },
      { property: "og:title", content: "Transações — PersonFinc" },
    ],
  }),
  component: TransacoesList,
});

function TransacoesList() {
  const { transactions, categoryById, month, setMonth, setTransactionPaid } = useStore();
  const [filter, setFilter] = useState<"todas" | TxKind>("todas");
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (filter === "todas" ? true : filter === "receita" ? t.amount > 0 : t.amount < 0))
      .filter((t) => t.description.toLowerCase().includes(query.toLowerCase()));
  }, [transactions, filter, query]);

  return (
    <AppShell
      title="Transações"
      action={
        <Link
          to="/transacoes/novo"
          className="p-2 rounded-full bg-primary text-on-primary"
          aria-label="Novo lançamento"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      }
    >
      {importOpen && <ExpenseImportDialog onClose={() => setImportOpen(false)} />}
      <div className="space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-md">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary flex-1">
            Transações
          </h1>
          <MonthSelector value={month} onChange={setMonth} />
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center justify-center gap-sm border border-outline text-on-surface px-4 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined !text-[18px]">document_scanner</span>
            Importar despesas
          </button>
          <Link
            to="/transacoes/novo"
            className="hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90"
          >
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Novo Lançamento
          </Link>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-md">
          <div className="flex-1 flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-full px-md h-12">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar transação"
              className="flex-1 bg-transparent outline-none font-body-lg text-body-lg text-on-surface"
            />
          </div>
          <div className="inline-flex bg-surface-container rounded-full p-1 self-start md:self-auto">
            {(["todas", "receita", "despesa"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-4 py-2 rounded-full font-label-md text-label-md capitalize transition-colors " +
                  (filter === f
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-primary")
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-xl text-center">
              <span className="material-symbols-outlined text-on-surface-variant !text-[48px]">
                receipt_long
              </span>
              <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
                Nenhuma transação encontrada.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/60">
              {filtered.map((tx) => {
                const cat = categoryById(tx.categoryId);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-sm p-md hover:bg-surface-container-low min-h-[64px]"
                  >
                    <Link
                      to="/transacoes/$id/editar"
                      params={{ id: tx.id }}
                      className="flex flex-col gap-xs flex-1 min-w-0 sm:flex-row sm:items-center sm:justify-between sm:gap-md"
                    >
                      <div className="flex items-start gap-sm min-w-0 flex-1">
                        <div
                          className={
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 " +
                            (cat?.color ?? "bg-surface-variant text-on-surface-variant")
                          }
                        >
                          <span className="material-symbols-outlined">
                            {cat?.icon ?? "payments"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-body-lg text-body-lg text-primary font-medium break-words">
                            {tx.description}
                          </p>

                          <div className="flex items-center gap-sm mt-xs flex-wrap">
                            <span
                              className={
                                "font-label-md text-label-md px-2 py-[2px] rounded-full " +
                                (cat?.color ?? "bg-surface-container text-on-surface-variant")
                              }
                            >
                              {cat?.name ?? "Sem categoria"}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              {formatDateShort(tx.date)}
                            </span>
                            {tx.amount < 0 && (
                              <span
                                className={
                                  "font-label-md text-label-md px-2 py-[2px] rounded-full " +
                                  (tx.paid
                                    ? "bg-secondary-container text-on-secondary-container"
                                    : "bg-surface-container text-on-surface-variant")
                                }
                              >
                                {tx.paid ? "Quitado" : "Em aberto"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p
                        className={
                          "font-numeric-data text-numeric-data shrink-0 whitespace-nowrap text-right " +
                          (tx.amount >= 0 ? "text-secondary" : "text-error")
                        }
                      >
                        {formatSignedBRL(tx.amount)}
                      </p>


                    </Link>
                    {tx.amount < 0 && (
                      <button
                        type="button"
                        aria-label={tx.paid ? "Marcar como em aberto" : "Marcar como quitado"}
                        title={tx.paid ? "Marcar como em aberto" : "Marcar como quitado"}
                        onClick={() => {
                          void setTransactionPaid(tx.id, !tx.paid)
                            .then(() => toast.success(tx.paid ? "Marcado como em aberto" : "Lançamento quitado"))
                            .catch(() => {});
                        }}
                        className={
                          "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors " +
                          (tx.paid
                            ? "bg-secondary-container text-on-secondary-container"
                            : "border border-outline text-on-surface-variant hover:bg-surface-container")
                        }
                      >
                        <span className="material-symbols-outlined !text-[20px]">
                          {tx.paid ? "task_alt" : "radio_button_unchecked"}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid grid-cols-2 gap-md">
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Total de receitas</p>
            <p className="font-numeric-data text-numeric-data text-secondary mt-xs">
              {formatBRL(filtered.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0))}
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Total de despesas</p>
            <p className="font-numeric-data text-numeric-data text-error mt-xs">
              {formatBRL(Math.abs(filtered.filter((t) => t.amount < 0).reduce((a, b) => a + b.amount, 0)))}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
