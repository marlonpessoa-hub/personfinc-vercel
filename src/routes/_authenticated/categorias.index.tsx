import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "../../components/app-shell";
import { useStore } from "../../lib/store";
import type { TxKind } from "../../lib/mock-data";
import { formatBRL } from "../../lib/format";

export const Route = createFileRoute("/_authenticated/categorias/")({
  head: () => ({
    meta: [
      { title: "Categorias — PersonFinc" },
      { name: "description", content: "Gerencie categorias de receitas e despesas." },
    ],
  }),
  component: CategoriasList,
});

function CategoriasList() {
  const { categories, transactions } = useStore();
  const [tab, setTab] = useState<TxKind>("despesa");

  const filtered = categories.filter((c) => c.kind === tab);

  const spentByCategory = (id: string) =>
    Math.abs(
      transactions
        .filter((t) => t.categoryId === id && t.amount < 0)
        .reduce((a, b) => a + b.amount, 0),
    );

  return (
    <AppShell
      title="Categorias"
      action={
        <Link
          to="/categorias/nova"
          className="p-2 rounded-full bg-primary text-on-primary"
          aria-label="Nova categoria"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      }
    >
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
            Categorias
          </h1>
          <Link
            to="/categorias/nova"
            className="hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90"
          >
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Nova Categoria
          </Link>
        </div>

        <div className="inline-flex bg-surface-container rounded-full p-1">
          {(["despesa", "receita"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={
                "px-5 py-2 rounded-full font-label-md text-label-md capitalize " +
                (tab === k ? "bg-primary text-on-primary" : "text-on-surface-variant")
              }
            >
              {k === "despesa" ? "Despesas" : "Receitas"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filtered.map((cat) => {
            const spent = spentByCategory(cat.id);
            const pct = cat.budget ? Math.min(100, (spent / cat.budget) * 100) : 0;
            return (
              <Link
                key={cat.id}
                to="/categorias/$id/editar"
                params={{ id: cat.id }}
                className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex items-center gap-md">
                  <div
                    className={
                      "w-12 h-12 rounded-full flex items-center justify-center " + cat.color
                    }
                  >
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-lg text-body-lg text-primary font-medium">
                      {cat.name}
                    </p>
                    {cat.kind === "despesa" && cat.budget ? (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {formatBRL(spent)} de {formatBRL(cat.budget)}
                      </p>
                    ) : (
                      <p className="font-body-sm text-body-sm text-on-surface-variant capitalize">
                        {cat.kind}
                      </p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    chevron_right
                  </span>
                </div>
                {cat.kind === "despesa" && cat.budget ? (
                  <div className="mt-md w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div
                      className={
                        "h-full rounded-full " +
                        (pct >= 90 ? "bg-error" : "bg-primary")
                      }
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
