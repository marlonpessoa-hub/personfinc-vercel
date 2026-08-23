import { useMemo, useState } from "react";
import { AppShell } from "./app-shell";
import type { Category, TxKind } from "../lib/mock-data";

const EXPENSE_ICONS = [
  "shopping_cart",
  "restaurant",
  "directions_car",
  "home",
  "movie",
  "favorite",
  "school",
  "flight",
  "sports_esports",
  "pets",
  "shopping_bag",
  "receipt_long",
];

const INCOME_ICONS = [
  "work",
  "payments",
  "attach_money",
  "savings",
  "laptop_mac",
  "trending_up",
  "account_balance",
  "card_giftcard",
  "handshake",
  "storefront",
  "local_taxi",
  "redeem",
];

const COLORS = [
  "bg-secondary-container text-on-secondary-container",
  "bg-error-container text-on-error-container",
  "bg-primary-container text-on-primary",
  "bg-surface-variant text-on-surface-variant",
  "bg-tertiary-fixed text-on-tertiary-fixed",
];

type Data = Omit<Category, "id">;

export function CategoryForm({
  title,
  initial,
  onSubmit,
  onCancel,
  onDelete,
}: {
  title: string;
  initial?: Data;
  onSubmit: (d: Data) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<TxKind>(initial?.kind ?? "despesa");
  const [icon, setIcon] = useState(
    initial?.icon ?? (initial?.kind === "receita" ? INCOME_ICONS[0] : EXPENSE_ICONS[0]),
  );

  const icons = useMemo(() => {
    const base = kind === "receita" ? INCOME_ICONS : EXPENSE_ICONS;
    return base.includes(icon) ? base : [icon, ...base];
  }, [kind, icon]);

  const changeKind = (k: TxKind) => {
    setKind(k);
    const base = k === "receita" ? INCOME_ICONS : EXPENSE_ICONS;
    if (!base.includes(icon)) setIcon(base[0]);
  };
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [budget, setBudget] = useState(initial?.budget?.toString() ?? "");

  return (
    <AppShell title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            name,
            kind,
            icon,
            color,
            budget: budget ? parseFloat(budget) : undefined,
          });
        }}
        className="max-w-2xl mx-auto space-y-lg"
      >
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
          {title}
        </h1>

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md">
          <label className="block">
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              Nome
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentação"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </label>

          <div>
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              Tipo
            </span>
            <div className="inline-flex bg-surface-container rounded-full p-1">
              {(["despesa", "receita"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => changeKind(k)}
                  className={
                    "px-5 py-2 rounded-full font-label-md text-label-md capitalize " +
                    (kind === k ? "bg-primary text-on-primary" : "text-on-surface-variant")
                  }
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              Ícone
            </span>
            <div className="grid grid-cols-6 gap-sm">
              {icons.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={
                    "aspect-square rounded-lg flex items-center justify-center border transition-all " +
                    (icon === ic
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:bg-surface-container-low")
                  }
                >
                  <span className="material-symbols-outlined text-primary">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              Cor
            </span>
            <div className="flex gap-sm flex-wrap">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={
                    "w-10 h-10 rounded-full flex items-center justify-center " +
                    c +
                    (color === c ? " ring-2 ring-primary ring-offset-2" : "")
                  }
                >
                  <span className="material-symbols-outlined !text-[18px]">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {kind === "despesa" && (
            <label className="block">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
                Limite mensal (opcional)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0,00"
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
              />
            </label>
          )}
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
