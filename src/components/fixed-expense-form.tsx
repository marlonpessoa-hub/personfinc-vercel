import { useState } from "react";
import { AppShell } from "./app-shell";
import type { Category, FixedExpense } from "../lib/mock-data";

type Data = Omit<FixedExpense, "id">;

export function FixedExpenseForm({
  title,
  categories,
  initial,
  onSubmit,
  onCancel,
  onDelete,
}: {
  title: string;
  categories: Category[];
  initial?: Data;
  onSubmit: (d: Data) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [dayOfMonth, setDayOfMonth] = useState((initial?.dayOfMonth ?? 5).toString());
  const [active, setActive] = useState(initial?.active ?? true);
  const [note, setNote] = useState(initial?.note ?? "");

  return (
    <AppShell title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            description,
            amount: Math.abs(parseFloat(amount || "0")),
            categoryId,
            dayOfMonth: Math.min(31, Math.max(1, parseInt(dayOfMonth || "1", 10))),
            active,
            note,
          });
        }}
        className="max-w-2xl mx-auto space-y-lg"
      >
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
          {title}
        </h1>

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md">
          <Field label="Descrição">
            <input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </Field>

          <Field label="Valor mensal (R$)">
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

          <Field label="Dia do vencimento">
            <input
              type="number"
              min="1"
              max="31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
            />
          </Field>

          <label className="flex items-center justify-between gap-md py-sm">
            <span className="font-body-lg text-body-lg text-primary">
              Ativa
              <span className="block font-body-sm text-body-sm text-on-surface-variant">
                Despesas ativas ficam disponíveis para lançar em qualquer mês
              </span>
            </span>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-5 h-5 accent-[var(--color-primary,currentColor)]"
            />
          </label>

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
