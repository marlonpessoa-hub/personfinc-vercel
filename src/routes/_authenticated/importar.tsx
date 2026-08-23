import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "../../components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL, formatDateShort } from "../../lib/format";
import { importStagedTransactions } from "../../lib/pluggy.functions";
import { FileImportCard } from "../../components/file-import-card";

type Staged = {
  id: string;
  description: string;
  amount: number;
  date: string;
  kind: string;
  suggested_category_id: string | null;
  status: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  kind: string;
  color: string;
};

export const Route = createFileRoute("/_authenticated/importar")({
  head: () => ({
    meta: [
      { title: "Importar lançamentos — PersonFinc" },
      {
        name: "description",
        content: "Revise e categorize lançamentos importados via Open Finance.",
      },
      { property: "og:title", content: "Importar lançamentos — PersonFinc" },
      {
        property: "og:description",
        content: "Revise e categorize lançamentos importados via Open Finance.",
      },
    ],
  }),
  component: Importar,
});

function Importar() {
  const navigate = useNavigate();
  const doImport = useServerFn(importStagedTransactions);

  const [staged, setStaged] = useState<Staged[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string | null>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    {
      const [stagedRes, catRes] = await Promise.all([
        supabase
          .from("staged_transactions")
          .select("id, description, amount, date, kind, suggested_category_id, status")
          .eq("status", "pendente")
          .order("date", { ascending: false }),
        supabase.from("categories").select("id, name, icon, kind, color").order("name"),
      ]);

      const stagedData = (stagedRes.data ?? []) as Staged[];
      const catData = (catRes.data ?? []) as Category[];

      setStaged(stagedData);
      setCategories(catData);

      const initialCategories: Record<string, string | null> = {};
      const initialIds = new Set<string>();
      stagedData.forEach((s) => {
        const kind = Number(s.amount) > 0 ? "receita" : "despesa";
        const fallback = catData.find((c) => c.kind === kind)?.id ?? null;
        initialCategories[s.id] = s.suggested_category_id ?? fallback;
        initialIds.add(s.id);
      });
      setSelectedCategories(initialCategories);
      setSelectedIds(initialIds);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredCategories = (kind: "receita" | "despesa") =>
    categories.filter((c) => c.kind === kind);

  async function handleImport() {
    if (selectedIds.size === 0) {
      toast.error("Selecione pelo menos um lançamento.");
      return;
    }

    const items = Array.from(selectedIds).map((id) => ({
      id,
      categoryId: selectedCategories[id] ?? null,
    }));

    setImporting(true);
    try {
      const res = await doImport({ data: { items } });
      toast.success(`${res.imported} lançamento(s) importado(s).`);
      await navigate({ to: "/transacoes" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao importar.");
    } finally {
      setImporting(false);
    }
  }

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(staged.map((s) => s.id)) : new Set());
  };

  const allSelected = staged.length > 0 && selectedIds.size === staged.length;

  return (
    <AppShell title="Importar lançamentos">
      <div className="max-w-3xl mx-auto space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-md">
          <div className="flex-1">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
              Revisar importações
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Confira e ajuste a categoria antes de importar para o app.
            </p>
          </div>
        </div>

        <FileImportCard onImported={load} />

        {loading ? (
          <p className="font-body-lg text-body-lg text-on-surface-variant">Carregando…</p>
        ) : staged.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-xl text-center">
            <span className="material-symbols-outlined text-on-surface-variant !text-[48px]">
              inbox
            </span>
            <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
              Nenhum lançamento aguardando revisão.
            </p>
          </div>
        ) : (
          <>
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
              <div className="p-md border-b border-outline-variant/60 flex items-center gap-md">
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleAll(e.target.checked)}
                    className="w-5 h-5 accent-[var(--color-primary,currentColor)] text-primary"
                  />
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                    Selecionar todos
                  </span>
                </label>
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-auto">
                  {selectedIds.size} de {staged.length}
                </span>
              </div>

              <div className="divide-y divide-outline-variant/60">
                {staged.map((s) => {
                  const kind = Number(s.amount) > 0 ? "receita" : "despesa";
                  const kindLabel = kind === "receita" ? "Receita" : "Despesa";
                  const kindClass =
                    kind === "receita"
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-error-container text-on-error-container";
                  const pool = filteredCategories(kind);
                  const selected = selectedIds.has(s.id);

                  return (
                    <div
                      key={s.id}
                      className={`p-md transition-colors ${selected ? "bg-surface-container-low" : ""}`}
                    >
                      <div className="flex items-start gap-md">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) next.add(s.id);
                            else next.delete(s.id);
                            setSelectedIds(next);
                          }}
                          className="w-5 h-5 mt-1 accent-[var(--color-primary,currentColor)] text-primary shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-md">
                            <p className="font-body-lg text-body-lg text-primary font-medium truncate">
                              {s.description}
                            </p>
                            <div className="flex items-center gap-sm shrink-0">
                              <span className={`font-label-md text-label-md px-2 py-[2px] rounded-full ${kindClass}`}>
                                {kindLabel}
                              </span>
                              <span className="font-label-md text-label-md px-2 py-[2px] rounded-full bg-surface-container text-on-surface-variant uppercase">
                                {s.kind}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-md mt-sm">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {formatDateShort(s.date)}
                            </p>
                            <p
                              className={`font-numeric-data text-numeric-data ${
                                Number(s.amount) >= 0 ? "text-secondary" : "text-error"
                              }`}
                            >
                              {formatBRL(Number(s.amount))}
                            </p>
                          </div>
                          <div className="mt-md">
                            <label className="block font-label-md text-label-md text-on-surface-variant uppercase mb-xs">
                              Categoria
                            </label>
                            <select
                              value={selectedCategories[s.id] ?? ""}
                              onChange={(e) => {
                                setSelectedCategories((prev) => ({
                                  ...prev,
                                  [s.id]: e.target.value || null,
                                }));
                              }}
                              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-body-lg text-body-lg"
                            >
                              <option value="">Sem categoria</option>
                              {pool.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-col-reverse md:flex-row justify-end gap-sm">
              <button
                type="button"
                onClick={() => void navigate({ to: "/conexoes" })}
                className="px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => void handleImport()}
                disabled={importing || selectedIds.size === 0}
                className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
              >
                {importing ? "Importando…" : "Importar selecionados"}
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
