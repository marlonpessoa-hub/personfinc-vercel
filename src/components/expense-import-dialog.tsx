import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useStore } from "../lib/store";
import { MonthSelector } from "./month-selector";
import { dateInMonth, formatMonthLabel, monthKeyOf } from "../lib/month";
import { formatBRL } from "../lib/format";
import { imageToDataUrl, parseCSV, parsePDF, pdfPageImages } from "../lib/file-import";
import { extractExpensesFromImages } from "../lib/expense-extract.functions";

type Draft = {
  key: string;
  description: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  categoryId: string;
  selected: boolean;
  paymentMethod: "cash" | "credit";
  cardId: string;
  payer: string;
  installments: number;
};

const isImage = (f: File) => /\.(jpe?g|png)$/i.test(f.name) || f.type.startsWith("image/");
const isPdf = (f: File) => /\.pdf$/i.test(f.name) || f.type === "application/pdf";

/** Move a data para o mês de destino preservando o dia. */
const toMonth = (iso: string, monthKey: string) => dateInMonth(monthKey, Number(iso.slice(8, 10)));

export function ExpenseImportDialog({ onClose }: { onClose: () => void }) {
  const { month, categories, addTransactions, addCardPurchase, cards } = useStore();
  const extract = useServerFn(extractExpensesFromImages);

  const creditCards = useMemo(() => cards.filter((c) => c.kind === "credito"), [cards]);

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.kind === "despesa"),
    [categories],
  );

  const [step, setStep] = useState<"upload" | "review">("upload");
  const [targetMonth, setTargetMonth] = useState(month);
  const [drafts, setDraftsRaw] = useState<Draft[]>([]);
  const [past, setPast] = useState<Draft[][]>([]);
  const [future, setFuture] = useState<Draft[][]>([]);
  const [baseline, setBaseline] = useState<Draft[] | null>(null);
  const lastTag = useRef<{ tag: string; at: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkCard, setBulkCard] = useState("");
  const [bulkPayer, setBulkPayer] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const defaultCategory = expenseCategories[0]?.id ?? "";

  /** Aplica uma mudança registrando o estado anterior no histórico (com coalescência por tag). */
  function commit(updater: (prev: Draft[]) => Draft[], tag?: string) {
    const now = Date.now();
    const coalesce =
      !!tag && lastTag.current?.tag === tag && now - (lastTag.current?.at ?? 0) < 900;
    lastTag.current = tag ? { tag, at: now } : null;

    setDraftsRaw((prev) => {
      if (!coalesce) setPast((p) => [...p, prev].slice(-100));
      return updater(prev);
    });
    setFuture([]);
  }

  function undo() {
    lastTag.current = null;
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1]!;
      setDraftsRaw((cur) => {
        setFuture((f) => [cur, ...f]);
        return previous;
      });
      return p.slice(0, -1);
    });
  }

  function redo() {
    lastTag.current = null;
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0]!;
      setDraftsRaw((cur) => {
        setPast((p) => [...p, cur]);
        return next;
      });
      return f.slice(1);
    });
  }

  function restoreOriginal() {
    if (!baseline) return;
    lastTag.current = null;
    commit(() => baseline.map((d) => ({ ...d })));
    toast.success("Lista restaurada como importada.");
  }

  function toDrafts(
    rows: { description: string; amount: number; date: string | null }[],
    monthKey: string,
  ): Draft[] {
    return rows.map((r, i) => ({
      key: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      description: r.description || "Despesa importada",
      amount: Math.abs(r.amount),
      date: dateInMonth(monthKey, r.date ? Number(r.date.slice(8, 10)) || 1 : 1),
      categoryId: defaultCategory,
      selected: true,
      paymentMethod: "cash",
      cardId: "",
      payer: "",
      installments: 1,
    }));
  }

  function changeMonth(next: string) {
    setTargetMonth(next);
    commit((prev) => prev.map((d) => ({ ...d, date: toMonth(d.date, next) })));
  }


  async function handleFile(file: File) {
    setBusy(true);
    setStatus(`Lendo ${file.name}…`);
    try {
      let rows: { description: string; amount: number; date: string | null }[] = [];

      if (isImage(file)) {
        setStatus("Extraindo despesas da imagem com IA…");
        const dataUrl = await imageToDataUrl(file);
        rows = (await extract({ data: { images: [dataUrl] } })).rows;
      } else if (isPdf(file)) {
        const parsed = await parsePDF(file);
        rows = parsed.map((p) => ({ description: p.description, amount: p.amount, date: p.date }));
        if (rows.length === 0) {
          setStatus("PDF sem texto reconhecido — lendo as páginas com IA…");
          const images = await pdfPageImages(file);
          if (images.length > 0) rows = (await extract({ data: { images } })).rows;
        }
      } else {
        const parsed = parseCSV(await file.text());
        rows = parsed.map((p) => ({ description: p.description, amount: p.amount, date: p.date }));
      }

      const normalized = rows
        .map((r) => ({ ...r, amount: Math.abs(r.amount) }))
        .filter((r) => r.amount > 0);

      if (normalized.length === 0) {
        toast.error("Nenhuma despesa reconhecida no arquivo.");
        return;
      }

      const added = toDrafts(normalized, targetMonth);
      commit((prev) => [...prev, ...added]);
      setBaseline((b) => [...(b ?? []), ...added.map((d) => ({ ...d }))]);

      setStep("review");
      toast.success(`${normalized.length} despesa(s) encontradas. Revise antes de lançar.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao ler o arquivo.");
    } finally {
      setBusy(false);
      setStatus(null);
      if (fileRef.current) fileRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  }

  const selected = drafts.filter((d) => d.selected);
  const allSelected = drafts.length > 0 && selected.length === drafts.length;
  const outOfMonth = selected.filter((d) => monthKeyOf(d.date) !== targetMonth).length;

  async function handleSave() {
    if (selected.length === 0) {
      toast.error("Selecione pelo menos uma despesa.");
      return;
    }

    const creditRows = selected.filter((d) => d.paymentMethod === "credit");
    const cashRows = selected.filter((d) => d.paymentMethod !== "credit");

    if (creditRows.some((d) => !d.cardId)) {
      toast.error("Escolha o cartão das despesas marcadas como cartão de crédito.");
      return;
    }

    setSaving(true);
    try {
      let count = 0;

      if (cashRows.length > 0) {
        count += await addTransactions(
          cashRows.map((d) => ({
            description: d.description.trim() || "Despesa importada",
            amount: -Math.abs(d.amount),
            categoryId: d.categoryId,
            date: d.date,
            paid: false,
            payer: d.payer || undefined,
          })),
        );
      }

      for (const d of creditRows) {
        count += await addCardPurchase({
          cardId: d.cardId,
          description: d.description.trim() || "Compra importada",
          total: Math.abs(d.amount),
          installments: Math.max(1, Math.round(d.installments || 1)),
          date: d.date,
          payer: d.payer || undefined,
          categoryId: d.categoryId,
        });
      }

      toast.success(`${count} lançamento(s) criados em ${formatMonthLabel(targetMonth)}.`);
      onClose();
    } catch (e) {
      if (e instanceof Error && e.message.includes("somente leitura")) return;
      toast.error(e instanceof Error ? e.message : "Falha ao salvar as despesas.");
    } finally {
      setSaving(false);
    }
  }

  const update = (key: string, patch: Partial<Draft>) =>
    commit(
      (prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)),
      `${key}:${Object.keys(patch).join(",")}`,
    );

  const remove = (key: string) => {
    commit((prev) => prev.filter((d) => d.key !== key));
    toast("Despesa removida da revisão.", {
      action: { label: "Desfazer", onClick: () => undo() },
    });
  };


  const inputCls =
    "h-11 rounded-lg border border-outline bg-surface-container-lowest px-sm outline-none focus:border-primary font-body-lg text-body-lg text-on-surface";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-lg">
      <div className="bg-surface-container-lowest w-full md:max-w-3xl max-h-[92vh] rounded-t-2xl md:rounded-2xl border border-outline-variant overflow-hidden flex flex-col">
        <div className="p-md border-b border-outline-variant flex items-center gap-md">
          <div className="flex-1">
            <h2 className="font-body-lg text-body-lg text-primary font-medium">
              {step === "upload" ? "Importar despesas" : "Revisar despesas importadas"}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {step === "upload"
                ? "Envie um arquivo ou use a câmera"
                : "Edite descrição, valor, data e categoria antes de confirmar"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-md space-y-md overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-sm">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase">
              Mês de destino
            </span>
            <MonthSelector value={targetMonth} onChange={changeMonth} />
          </div>

          {step === "upload" ? (
            <div className="border border-dashed border-outline rounded-lg p-lg text-center space-y-sm">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {busy ? (status ?? "Processando…") : "Envie PDF, CSV, JPEG ou PNG"}
              </p>
              <div className="flex flex-wrap justify-center gap-sm">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-xs px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined !text-[18px]">upload_file</span>
                  Selecionar arquivo
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => cameraRef.current?.click()}
                  className="md:hidden inline-flex items-center gap-xs px-5 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-60"
                >
                  <span className="material-symbols-outlined !text-[18px]">photo_camera</span>
                  Usar câmera
                </button>
                {drafts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="inline-flex items-center gap-xs px-5 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
                  >
                    Revisar ({drafts.length})
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-sm">
                <button
                  type="button"
                  onClick={() => commit((prev) => prev.map((d) => ({ ...d, selected: !allSelected })))}
                  className="px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
                >
                  {allSelected ? "Desmarcar todas" : "Selecionar todas"}
                </button>
                <select
                  value={bulkCategory}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBulkCategory(v);
                    if (v)
                      commit((prev) => prev.map((d) => (d.selected ? { ...d, categoryId: v } : d)));
                  }}
                  className={inputCls}
                >
                  <option value="">Aplicar categoria às selecionadas…</option>
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Aplicar cartão às selecionadas"
                  value={bulkCard}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBulkCard(v);
                    commit((prev) =>
                      prev.map((d) =>
                        d.selected
                          ? v === ""
                            ? { ...d, paymentMethod: "cash" as const, cardId: "" }
                            : { ...d, paymentMethod: "credit" as const, cardId: v }
                          : d,
                      ),
                    );
                  }}
                  className={inputCls}
                >
                  <option value="">Pagamento à vista (todas)</option>
                  {creditCards.map((c) => (
                    <option key={c.id} value={c.id}>
                      Cartão: {c.name}
                      {c.last4 ? ` (**** ${c.last4})` : ""}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Aplicar responsável às selecionadas"
                  placeholder="Responsável (todas)"
                  value={bulkPayer}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBulkPayer(v);
                    commit(
                      (prev) => prev.map((d) => (d.selected ? { ...d, payer: v } : d)),
                      "bulk:payer",
                    );
                  }}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
                >
                  Adicionar outro arquivo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-sm">
                <button
                  type="button"
                  onClick={undo}
                  disabled={past.length === 0}
                  className="inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined !text-[18px]">undo</span>
                  Desfazer{past.length > 0 ? ` (${past.length})` : ""}
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={future.length === 0}
                  className="inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined !text-[18px]">redo</span>
                  Refazer{future.length > 0 ? ` (${future.length})` : ""}
                </button>
                <button
                  type="button"
                  onClick={restoreOriginal}
                  disabled={!baseline || baseline.length === 0}
                  className="inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined !text-[18px]">restart_alt</span>
                  Restaurar original
                </button>
              </div>


              {outOfMonth > 0 && (
                <p className="font-body-sm text-body-sm text-error">
                  {outOfMonth} despesa(s) selecionada(s) estão fora de{" "}
                  {formatMonthLabel(targetMonth)} e serão lançadas na data informada.
                </p>
              )}

              {drafts.length === 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-lg">
                  Nenhuma despesa para revisar.
                </p>
              ) : (
                <div className="divide-y divide-outline-variant/60 border border-outline-variant rounded-lg">
                  {drafts.map((d) => (
                    <div
                      key={d.key}
                      className={`p-md space-y-sm ${d.selected ? "" : "opacity-55"}`}
                    >
                      <div className="flex items-start gap-sm">
                        <input
                          type="checkbox"
                          aria-label="Incluir no lançamento"
                          checked={d.selected}
                          onChange={(e) => update(d.key, { selected: e.target.checked })}
                          className="w-5 h-5 mt-3 accent-[var(--color-primary,currentColor)] shrink-0"
                        />
                        <input
                          value={d.description}
                          aria-label="Descrição"
                          onChange={(e) => update(d.key, { description: e.target.value })}
                          className={`flex-1 ${inputCls}`}
                        />
                        <button
                          type="button"
                          aria-label="Remover"
                          onClick={() => remove(d.key)}
                          className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low shrink-0"
                        >
                          <span className="material-symbols-outlined !text-[20px]">delete</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-sm pl-7">
                        <label className="flex items-center gap-xs">
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={d.amount}
                            onChange={(e) => update(d.key, { amount: Number(e.target.value) })}
                            className={`w-32 ${inputCls}`}
                          />
                        </label>
                        <input
                          type="date"
                          aria-label="Data"
                          value={d.date}
                          onChange={(e) =>
                            update(d.key, { date: e.target.value || dateInMonth(targetMonth, 1) })
                          }
                          className={inputCls}
                        />
                        <select
                          aria-label="Categoria"
                          value={d.categoryId}
                          onChange={(e) => update(d.key, { categoryId: e.target.value })}
                          className={inputCls}
                        >
                          <option value="">Sem categoria</option>
                          {expenseCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Forma de Pagamento"
                          value={d.paymentMethod}
                          onChange={(e) => update(d.key, { paymentMethod: e.target.value as "cash" | "credit" })}
                          className={inputCls}
                        >
                          <option value="cash">À vista / Pix</option>
                          <option value="credit">Cartão de Crédito</option>
                        </select>
                        {d.paymentMethod === "credit" && (
                          <>
                            <select
                              aria-label="Cartão"
                              value={d.cardId}
                              onChange={(e) => update(d.key, { cardId: e.target.value })}
                              className={inputCls}
                            >
                              <option value="">Selecionar cartão…</option>
                              {creditCards.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} {c.last4 ? `(**** ${c.last4})` : ""}
                                </option>
                              ))}
                            </select>
                            <label className="flex items-center gap-xs">
                              <input
                                type="number"
                                min={1}
                                max={48}
                                aria-label="Parcelas"
                                value={d.installments}
                                onChange={(e) =>
                                  update(d.key, {
                                    installments: Math.max(1, Number(e.target.value) || 1),
                                  })
                                }
                                className={`w-20 ${inputCls}`}
                              />
                              <span className="font-body-sm text-body-sm text-on-surface-variant">
                                x
                              </span>
                            </label>
                          </>
                        )}
                        <input
                          placeholder="Responsável (opcional)"
                          aria-label="Responsável"
                          value={d.payer}
                          onChange={(e) => update(d.key, { payer: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.csv,.txt,.ofx,.jpg,.jpeg,.png,application/pdf,text/csv,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
        </div>

        <div className="p-md border-t border-outline-variant flex items-center gap-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant flex-1">
            {selected.length} selecionada(s) ·{" "}
            {formatBRL(selected.reduce((s, d) => s + Math.abs(d.amount), 0))}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
          >
            Cancelar
          </button>
          {step === "review" && (
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || selected.length === 0}
              className="px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Lançando…" : "Confirmar lançamento"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
