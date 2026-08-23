import { useState } from "react";
import { AppShell } from "./app-shell";
import { CreditCardVisual } from "./credit-card-visual";
import type { PaymentCard } from "../lib/mock-data";

type Data = Omit<PaymentCard, "id">;

export const CARD_BRANDS: { value: PaymentCard["brand"]; label: string }[] = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "elo", label: "Elo" },
  { value: "amex", label: "American Express" },
  { value: "hipercard", label: "Hipercard" },
  { value: "outro", label: "Outro" },
];

export const CARD_COLORS = [
  { value: "from-primary to-tertiary", label: "Padrão" },
  { value: "from-tertiary to-primary", label: "Invertido" },
  { value: "from-secondary to-primary", label: "Oceano" },
  { value: "from-error to-tertiary", label: "Coral" },
  { value: "from-on-surface to-on-surface-variant", label: "Grafite" },
];

/** Cores oficiais dos principais bancos/emissores do mercado. */
export const BANK_COLORS = [
  { value: "from-[#820AD1] to-[#4B0082]", label: "Nubank", match: ["nubank", "nu bank", "roxinho"] },
  { value: "from-[#FAE128] to-[#0038A8]", label: "Banco do Brasil", match: ["banco do brasil", "bb"] },
  { value: "from-[#EC7000] to-[#8A4500]", label: "Itaú", match: ["itau", "itaú"] },
  { value: "from-[#CC092F] to-[#7A0016]", label: "Bradesco", match: ["bradesco"] },
  { value: "from-[#EC0000] to-[#8B0000]", label: "Santander", match: ["santander"] },
  { value: "from-[#00A868] to-[#005C3A]", label: "Caixa", match: ["caixa"] },
  { value: "from-[#FF7A00] to-[#B35400]", label: "Inter", match: ["inter"] },
  { value: "from-[#00E7A0] to-[#00825A]", label: "C6 Bank", match: ["c6"] },
  { value: "from-[#FFD100] to-[#B39100]", label: "Banco Pan", match: ["pan"] },
  { value: "from-[#00AEEF] to-[#005B7F]", label: "Next", match: ["next"] },
  { value: "from-[#32BCAD] to-[#1B6B63]", label: "PicPay/Pix", match: ["picpay", "pix"] },
  { value: "from-[#111111] to-[#3A3A3A]", label: "Black", match: ["black", "infinite"] },
];

export function suggestCardColor(name: string): string | undefined {
  const n = name.toLowerCase();
  return BANK_COLORS.find((b) => b.match.some((m) => n.includes(m)))?.value;
}

export function CardForm({
  title,
  initial,
  onSubmit,
  onCancel,
  onDelete,
}: {
  title: string;
  initial?: Data;
  onSubmit: (d: Data) => void | Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [brand, setBrand] = useState<PaymentCard["brand"]>(initial?.brand ?? "visa");
  const [kind, setKind] = useState<PaymentCard["kind"]>(initial?.kind ?? "credito");
  const [last4, setLast4] = useState(initial?.last4 ?? "");
  const [creditLimit, setCreditLimit] = useState(initial?.creditLimit?.toString() ?? "");
  const [closingDay, setClosingDay] = useState(initial?.closingDay?.toString() ?? "");
  const [dueDay, setDueDay] = useState(initial?.dueDay?.toString() ?? "");
  const [color, setColor] = useState(initial?.color ?? CARD_COLORS[0].value);
  const [colorTouched, setColorTouched] = useState(Boolean(initial?.color));

  const pickColor = (v: string) => {
    setColor(v);
    setColorTouched(true);
  };

  const handleName = (v: string) => {
    setName(v);
    if (!colorTouched) {
      const suggested = suggestCardColor(v);
      if (suggested) setColor(suggested);
    }
  };

  const clampDay = (v: string) =>
    v === "" ? undefined : Math.min(31, Math.max(1, parseInt(v, 10) || 1));

  return (
    <AppShell title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit({
            name,
            brand,
            kind,
            last4: last4.replace(/\D/g, "").slice(-4),
            creditLimit:
              kind === "credito" && creditLimit !== ""
                ? Math.abs(parseFloat(creditLimit))
                : undefined,
            closingDay: kind === "credito" ? clampDay(closingDay) : undefined,
            dueDay: kind === "credito" ? clampDay(dueDay) : undefined,
            color,
          });
        }}
        className="max-w-2xl mx-auto space-y-lg"
      >
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
          {title}
        </h1>

        <CreditCardVisual
          card={{
            id: "preview",
            name: name || "Meu cartão",
            brand,
            kind,
            last4: last4.replace(/\D/g, "").slice(-4),
            creditLimit: creditLimit ? parseFloat(creditLimit) : undefined,
            closingDay: clampDay(closingDay),
            dueDay: clampDay(dueDay),
            color,
          }}
        />

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant card-shadow space-y-md">
          <Field label="Nome do cartão">
            <input
              required
              value={name}
              onChange={(e) => handleName(e.target.value)}
              placeholder="Ex: Nubank Roxinho"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <Field label="Bandeira">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as PaymentCard["brand"])}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
              >
                {CARD_BRANDS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tipo">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as PaymentCard["kind"])}
                className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
              >
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
              </select>
            </Field>
          </div>

          <Field label="Últimos 4 dígitos">
            <input
              inputMode="numeric"
              maxLength={4}
              value={last4}
              onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
            />
          </Field>

          {kind === "credito" ? (
            <>
              <Field label="Limite (R$)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="0,00"
                  className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
                />
              </Field>

              <div className="grid grid-cols-2 gap-md">
                <Field label="Dia de fechamento">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
                  />
                </Field>
                <Field label="Dia de vencimento">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary font-numeric-data text-numeric-data"
                  />
                </Field>
              </div>
            </>
          ) : null}

          <Field label="Cor do cartão">
            <div className="flex flex-wrap gap-sm">
              {CARD_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => pickColor(c.value)}
                  aria-label={c.label}
                  title={c.label}
                  className={
                    "w-12 h-8 rounded-lg bg-gradient-to-br " +
                    c.value +
                    (color === c.value ? " ring-2 ring-offset-2 ring-primary" : "")
                  }
                />
              ))}
            </div>
          </Field>

          <Field label="Cores de bancos">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
              {BANK_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => pickColor(c.value)}
                  title={c.label}
                  className={
                    "flex items-center gap-sm rounded-lg border p-xs text-left " +
                    (color === c.value
                      ? "border-primary ring-2 ring-primary"
                      : "border-outline-variant hover:bg-surface-container-low")
                  }
                >
                  <span className={"w-8 h-6 rounded-md bg-gradient-to-br shrink-0 " + c.value} />
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
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
