import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useStore } from "../lib/store";
import { formatBRL } from "../lib/format";
import { formatMonthLabel, monthKeyOf, shiftMonth } from "../lib/month";
import type { CardPurchase } from "../lib/mock-data";
import { createPortal } from "react-dom";

export function CardPurchaseDialog({
  cardId: initialCardId,
  purchase,
  onClose,
}: {
  cardId?: string;
  purchase?: CardPurchase;
  onClose: () => void;
}) {
  const { cards, categories, addCardPurchase, updateCardPurchase, payers } = useStore();
  const expenseCats = categories.filter((c) => c.kind === "despesa");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [cardId, setCardId] = useState(
    purchase?.cardId ?? initialCardId ?? cards[0]?.id ?? "",
  );
  const [description, setDescription] = useState(purchase?.description ?? "");
  const [total, setTotal] = useState(purchase ? String(purchase.total) : "");
  const [installments, setInstallments] = useState(
    purchase ? String(purchase.installments) : "1",
  );
  const [date, setDate] = useState(
    purchase?.date ?? new Date().toISOString().slice(0, 10),
  );
  const initialPayer = purchase?.payer ?? "";
  const [payer, setPayer] = useState(initialPayer);
  const [isNewPayer, setIsNewPayer] = useState(
    payers.length === 0 || (initialPayer !== "" && !payers.includes(initialPayer))
  );
  const [categoryId, setCategoryId] = useState(
    purchase?.categoryId || expenseCats[0]?.id || "",
  );
  const [saving, setSaving] = useState(false);

  const n = Math.max(1, Math.round(Number(installments) || 1));
  const value = Math.abs(Number(total.replace(',', '.')) || 0);

  const preview = useMemo(() => {
    if (!value) return [];
    const cents = Math.round(value * 100);
    const base = Math.floor(cents / n);
    const rest = cents - base * n;
    const start = monthKeyOf(date);
    return Array.from({ length: Math.min(n, 12) }, (_, i) => ({
      label: formatMonthLabel(shiftMonth(start, i)),
      amount: (base + (i < rest ? 1 : 0)) / 100,
      idx: i + 1,
    }));
  }, [value, n, date]);

  if (!mounted) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId) {
      toast.error("Selecione um cartão");
      return;
    }
    if (!value) {
      toast.error("Informe o valor total");
      return;
    }
    setSaving(true);
    try {
      if (purchase) {
        await updateCardPurchase(purchase.purchaseId, {
          description: description.trim(),
          categoryId,
          payer: payer.trim() || undefined,
          cardId,
        });
        toast.success("Compra atualizada");
      } else {
        const count = await addCardPurchase({
          cardId,
          description,
          total: value,
          installments: n,
          date,
          payer: payer.trim() || undefined,
          categoryId,
        });
        toast.success(
          count > 1 ? `${count} parcelas lançadas` : "Compra lançada",
        );
      }
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const dialogContent = (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-end md:items-center justify-center p-0 md:p-lg"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-t-2xl md:rounded-2xl border border-outline-variant max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-md border-b border-outline-variant shrink-0 bg-surface-container-lowest">
          <h2 className="font-title-lg text-title-lg text-on-surface">
            {purchase ? "Editar compra no cartão" : "Nova compra no cartão"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-md space-y-md overflow-y-auto flex-1 min-h-0">
          <Field label="Cartão">
            <select
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.last4 ? ` ····${c.last4}` : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Descrição">
            <input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Notebook"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </Field>

          <div className="grid grid-cols-2 gap-md">
            <Field label="Valor total (R$)">
              <input
                required
                type="text"
                inputMode="decimal"
                value={total}
                onChange={(e) => setTotal(e.target.value.replace(/[^\d.,]/g, ""))}
                disabled={!!purchase}
                placeholder="0,00"
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary disabled:opacity-60"
              />
            </Field>
            <Field label="Parcelas">
              <input
                type="number"
                min="1"
                max="48"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                disabled={!!purchase}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary disabled:opacity-60"
              />
            </Field>
          </div>

          {purchase && (
            <p className="font-body-sm text-body-sm text-on-surface-variant -mt-sm">
              Valor, parcelas e data não podem ser alterados. Se precisar, exclua a compra e lance novamente.
            </p>
          )}

          <div className="grid grid-cols-2 gap-md">
            <Field label="Data da compra">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!!purchase}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary disabled:opacity-60"
              />
            </Field>
            <Field label="Responsável">
              {isNewPayer ? (
                <div className="flex gap-2">
                  <input
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    placeholder="Ex: Nome da pessoa"
                    className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
                  />
                  {payers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewPayer(false);
                        setPayer("");
                      }}
                      className="px-3 h-12 rounded-lg border border-outline text-on-surface-variant hover:bg-surface-container flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined !text-[20px]">close</span>
                    </button>
                  )}
                </div>
              ) : (
                <select
                  value={payer}
                  onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                      setIsNewPayer(true);
                      setPayer("");
                    } else {
                      setPayer(e.target.value);
                    }
                  }}
                  className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
                >
                  <option value="">Selecione...</option>
                  {payers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="__NEW__">+ Adicionar...</option>
                </select>
              )}
            </Field>
          </div>

          <Field label="Categoria">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            >
              {expenseCats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          {preview.length > 0 && !purchase && (
            <div className="rounded-lg border border-outline-variant p-md space-y-xs">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">
                Parcelas geradas
              </p>
              {preview.map((p) => (
                <div key={p.idx} className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">
                    {description || "Compra"} ({p.idx}/{n}) · {p.label}
                  </span>
                  <span className="text-on-surface">{formatBRL(p.amount)}</span>
                </div>
              ))}
              {n > 12 && (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  + {n - 12} parcela(s)…
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-md border-t border-outline-variant flex justify-end gap-sm shrink-0 bg-surface-container-lowest">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60"
          >
            {saving ? "Salvando…" : purchase ? "Salvar alterações" : "Lançar compra"}
          </button>
        </div>
      </form>
    </div>
  );

  return createPortal(dialogContent, document.body);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
