import { useState } from "react";
import { AppShell } from "./app-shell";
import type { Goal } from "../lib/mock-data";

const ICONS = [
  "directions_car",
  "flight",
  "home",
  "school",
  "shield",
  "diamond",
  "beach_access",
  "cake",
  "sports_esports",
];

type Data = Omit<Goal, "id">;

export function GoalForm({
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
  const [name, setName] = useState(initial?.title ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? ICONS[0]);
  const [target, setTarget] = useState(initial?.target?.toString() ?? "");
  const [saved, setSaved] = useState(initial?.saved?.toString() ?? "0");
  const [deadline, setDeadline] = useState(initial?.deadline ?? new Date().toISOString().slice(0, 10));

  return (
    <AppShell title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            title: name,
            icon,
            target: parseFloat(target || "0"),
            saved: parseFloat(saved || "0"),
            deadline,
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
              Nome da meta
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Viagem à Europa"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </label>

          <div>
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              Ícone
            </span>
            <div className="grid grid-cols-5 md:grid-cols-9 gap-sm">
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={
                    "aspect-square rounded-lg flex items-center justify-center border " +
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <label className="block">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
                Valor alvo (R$)
              </span>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
              />
            </label>
            <label className="block">
              <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
                Já guardado (R$)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
              />
            </label>
          </div>

          <label className="block">
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              Prazo
            </span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </label>
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
