import { useState } from "react";
import { AppShell } from "./app-shell";
import type { Category, PaymentCard, TxKind } from "../lib/mock-data";

type Initial = {
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  paid: boolean;
  cardId?: string;
  payer?: string;
};

export function TransactionForm({
  title,
  kind,
  onKindChange,
  categories,
  cards = [],
  initial,
  onSubmit,
  onCancel,
  onDelete,
}: {
  title: string;
  kind: TxKind;
  onKindChange: (k: TxKind) => void;
  categories: Category[];
  cards?: PaymentCard[];
  initial?: Initial;
  onSubmit: (data: Initial) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(initial?.amount ? initial.amount.toString() : "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || categories[0]?.id || "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initial?.note ?? "");
  const [paid, setPaid] = useState(initial?.paid ?? false);
  const [cardId, setCardId] = useState(initial?.cardId ?? "");
  const [payer, setPayer] = useState(initial?.payer ?? "");

  return (
    <AppShell title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            description,
            amount: parseFloat(amount || "0"),
            categoryId,
            date,
            note,
            paid,
            cardId,
            payer,
          });
        }}
        className="max-w-2xl mx-auto space-y-lg"
      >
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
          {title}
        </h1>

        {/* Kind toggle */}
        <div className="inline-flex bg-surface-container rounded-full p-1">
          {(["despesa", "receita"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKindChange(k)}
              className={
                "px-5 py-2 rounded-full font-label-md text-label-md capitalize transition-colors " +
                (kind === k
                  ? k === "receita"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-error-container text-on-error-container"
                  : "text-on-surface-variant")
              }
            >
              {k}
            </button>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md">
          <Field label="Descrição">
            <input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado Extra"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </Field>

          <Field label="Valor (R$)">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
            />
          </Field>

          <Field label="Categoria">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Data">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </Field>

          {kind === "despesa" && cards.length > 0 && (
            <Field label="Cartão (opcional)">
              <select
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
              >
                <option value="">Sem cartão / dinheiro</option>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.last4 ? ` ····${c.last4}` : ""} · {c.kind === "credito" ? "Crédito" : "Débito"}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {kind === "despesa" && (
            <Field label="Responsável pela compra (opcional)">
              <input
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                placeholder="Ex: Marlon"
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
              />
            </Field>
          )}

          {kind === "despesa" && (
            <label className="flex items-center justify-between gap-md rounded-lg border border-outline px-md py-sm cursor-pointer">
              <span>
                <span className="block font-label-md text-label-md text-on-surface-variant uppercase">
                  Quitado
                </span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">
                  Marque quando a despesa já foi paga — antes ou depois da data.
                </span>
              </span>
              <input
                type="checkbox"
                checked={paid}
                onChange={(e) => setPaid(e.target.checked)}
                className="w-5 h-5 accent-[var(--color-primary,currentColor)] text-primary"
              />
            </label>
          )}

          <Field label="Observação (opcional)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Adicione uma nota..."
              className="w-full rounded-lg border border-outline bg-surface-container-lowest px-md py-sm outline-none focus:border-primary resize-none"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:justify-between gap-sm">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center justify-center gap-sm px-4 py-3 rounded-full text-error font-label-md text-label-md hover:bg-error-container"
            >
              <span className="material-symbols-outlined !text-[18px]">delete</span>
              Excluir
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse md:flex-row gap-sm">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
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
