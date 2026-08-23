import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { MonthSelector } from "../../components/month-selector";
import { TitheCard } from "../../components/tithe-card";
import { CategoryChart } from "../../components/category-chart";
import { useStore } from "../../lib/store";
import { formatMonthLabel, shiftMonth } from "../../lib/month";
import { formatBRL, formatDateShort, formatSignedBRL } from "../../lib/format";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "PersonFinc — Gestor de Finanças Pessoais" },
      {
        name: "description",
        content: "Painel de finanças pessoais: saldo, transações recentes e metas.",
      },
      { property: "og:title", content: "PersonFinc — Painel" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { transactions, allTransactions, goals, categoryById, month, setMonth } = useStore();
  const [firstName, setFirstName] = useState("");
  const [titheEnabled, setTitheEnabled] = useState(true);
  const [tithePercent, setTithePercent] = useState(10);

  useEffect(() => {
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, tithe_enabled, tithe_percent")
        .eq("id", auth.user.id)
        .maybeSingle();
      const name =
        profile?.full_name ??
        (auth.user.user_metadata?.full_name as string | undefined) ??
        auth.user.email ??
        "";
      setFirstName(name.split(" ")[0] || "Minha conta");
      setTitheEnabled(profile?.tithe_enabled ?? true);
      const percent = Number(profile?.tithe_percent ?? 10);
      setTithePercent(Number.isFinite(percent) ? percent : 10);
    })();
  }, []);

  const income = transactions.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter((t) => t.amount < 0).reduce((a, b) => a + b.amount, 0);
  const balance = income + expense;

  const prevMonth = shiftMonth(month, -1);
  const prevIncome = allTransactions
    .filter((t) => t.date.startsWith(prevMonth) && t.amount > 0)
    .reduce((a, b) => a + b.amount, 0);
  const prevExpense = allTransactions
    .filter((t) => t.date.startsWith(prevMonth) && t.amount < 0)
    .reduce((a, b) => a + b.amount, 0);
  const prevBalance = prevIncome + prevExpense;
  const balanceDelta = balance - prevBalance;
  const balanceDeltaPercent = prevBalance !== 0 ? (balanceDelta / Math.abs(prevBalance)) * 100 : 0;

  const featuredGoal = goals.find((g) => g.is_featured) ?? goals[0];

  const recent = transactions.slice(0, 5);

  return (
    <AppShell title={firstName ? `Olá, ${firstName}` : "Olá"}>

      <div className="space-y-lg">
        <div className="flex items-center justify-between gap-md flex-wrap">
          <h1 className="font-headline-md text-headline-md text-primary">
            Resumo de {formatMonthLabel(month)}
          </h1>
          <MonthSelector value={month} onChange={setMonth} />
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Balance */}
          <div className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow relative overflow-hidden animate-fade-in-up stagger-1 flex flex-col justify-between">
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">Saldo do mês</p>
              <h2 className={`font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl ${balance >= 0 ? "text-secondary" : "text-error"}`}>
                {formatBRL(balance)}
              </h2>
              {prevBalance !== 0 && (
                <div className="flex items-center gap-xs mt-sm">
                  <span className={`material-symbols-outlined !text-[16px] ${balanceDelta >= 0 ? "text-secondary" : "text-error"}`}>
                    {balanceDelta >= 0 ? "trending_up" : "trending_down"}
                  </span>
                  <span className={`font-body-sm text-body-sm ${balanceDelta >= 0 ? "text-secondary" : "text-error"}`}>
                    {formatSignedBRL(balanceDelta)} ({Math.abs(balanceDeltaPercent).toFixed(1)}%) vs {formatMonthLabel(prevMonth)}
                  </span>
                </div>
              )}
              {prevBalance === 0 && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                  Sem dados de {formatMonthLabel(prevMonth)}
                </p>
              )}
            </div>
            <div className="flex gap-md pt-md mt-lg border-t border-outline-variant/60">
              <div className="flex-1">
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary !text-[16px]">
                    arrow_upward
                  </span>{" "}
                  Renda
                </p>
                <p className="font-numeric-data text-numeric-data text-secondary mt-xs">
                  {formatSignedBRL(income)}
                </p>
              </div>
              <div className="w-px bg-outline-variant/60" />
              <div className="flex-1">
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-error !text-[16px]">
                    arrow_downward
                  </span>{" "}
                  Despesas
                </p>
                <p className="font-numeric-data text-numeric-data text-error mt-xs">
                  {formatSignedBRL(expense)}
                </p>
              </div>
            </div>
          </div>

          {/* Featured goal */}
          {featuredGoal && (
            <Link
              to="/metas"
              className="col-span-1 bg-primary rounded-xl p-md text-on-primary shadow-lg flex flex-col justify-between animate-fade-in-up stagger-2"
            >
              <div>
                <h3 className="font-headline-md text-headline-md mb-xs">Meta em destaque</h3>
                <p className="font-body-sm text-body-sm text-inverse-primary">
                  {featuredGoal.title}
                </p>
              </div>
              <div className="mt-md">
                <p className="font-numeric-data text-numeric-data mb-xs">
                  {formatBRL(featuredGoal.saved)} / {formatBRL(featuredGoal.target)}
                </p>
                <div className="w-full bg-primary-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary-container h-full rounded-full animate-fill-bar"
                    style={{ width: `${Math.min(100, (featuredGoal.saved / featuredGoal.target) * 100)}%` }}
                  />
                </div>
              </div>
            </Link>
          )}
        </div>

        {titheEnabled && (
          <TitheCard
            income={income}
            enabled={titheEnabled}
            percent={tithePercent}
            onToggle={setTitheEnabled}
            onPercentChange={setTithePercent}
          />
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <Link
            to="/transacoes/novo"
            className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low"
          >
            <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">add</span>
            </span>
            <span className="font-label-md text-label-md text-primary">Novo lançamento</span>
          </Link>
          <Link
            to="/categorias"
            className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low"
          >
            <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined">category</span>
            </span>
            <span className="font-label-md text-label-md text-primary">Categorias</span>
          </Link>
          <Link
            to="/metas"
            className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low"
          >
            <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined">track_changes</span>
            </span>
            <span className="font-label-md text-label-md text-primary">Metas</span>
          </Link>
          <Link
            to="/transacoes"
            className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow flex items-center gap-sm hover:bg-surface-container-low"
          >
            <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined">receipt_long</span>
            </span>
            <span className="font-label-md text-label-md text-primary">Ver todas</span>
          </Link>
        </div>

        {/* Category chart */}
        <CategoryChart transactions={transactions} categories={[]} categoryById={categoryById} />

        {/* Recent transactions */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
          <div className="p-md border-b border-outline-variant/60 flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-primary">
              Transações do mês
            </h3>
            <Link
              to="/transacoes"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-full hover:bg-surface-container-low"
            >
              Ver Todas
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/60">
            {recent.map((tx) => {
              const cat = categoryById(tx.categoryId);
              return (
                <Link
                  key={tx.id}
                  to="/transacoes/$id/editar"
                  params={{ id: tx.id }}
                  className="flex items-center justify-between p-md hover:bg-surface-container-low min-h-[56px]"
                >
                  <div className="flex items-center gap-md">
                    <div
                      className={
                        "w-10 h-10 rounded-full flex items-center justify-center " +
                        (cat?.color ?? "bg-surface-variant text-on-surface-variant")
                      }
                    >
                      <span className="material-symbols-outlined">{cat?.icon ?? "payments"}</span>
                    </div>
                    <div>
                      <p className="font-body-lg text-body-lg text-primary font-medium">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-sm mt-xs">
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
                      </div>
                    </div>
                  </div>
                  <p
                    className={
                      "font-numeric-data text-numeric-data " +
                      (tx.amount >= 0 ? "text-secondary" : "text-error")
                    }
                  >
                    {formatSignedBRL(tx.amount)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
