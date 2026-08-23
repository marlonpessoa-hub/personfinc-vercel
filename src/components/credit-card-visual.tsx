import type { PaymentCard } from "../lib/mock-data";
import { formatBRL } from "../lib/format";

const BRAND_LABEL: Record<PaymentCard["brand"], string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  elo: "Elo",
  amex: "AMEX",
  hipercard: "Hipercard",
  outro: "Cartão",
};

export function CreditCardVisual({ card }: { card: PaymentCard }) {
  return (
    <div
      className={
        "relative w-full aspect-[1.68/1] max-w-[380px] rounded-2xl p-md md:p-lg text-on-primary bg-gradient-to-br card-shadow overflow-hidden " +
        card.color
      }
    >
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -left-12 bottom-[-3rem] w-40 h-40 rounded-full bg-white/10" />

      <div className="relative flex flex-col h-full justify-between">
        <div className="flex items-start justify-between gap-sm">
          <div className="min-w-0">
            <p className="font-label-md text-label-md opacity-80 uppercase">
              {card.kind === "credito" ? "Crédito" : "Débito"}
            </p>
            <p className="font-headline-md text-headline-md font-bold break-words">{card.name}</p>
          </div>
          <span className="font-label-md text-label-md font-bold shrink-0">
            {BRAND_LABEL[card.brand]}
          </span>
        </div>

        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined !text-[28px] opacity-90">credit_card</span>
          <p className="font-numeric-data text-numeric-data tracking-[0.2em]">
            •••• •••• •••• {card.last4 || "••••"}
          </p>
        </div>

        <div className="flex items-end justify-between gap-sm">
          {card.kind === "credito" ? (
            <>
              <div>
                <p className="font-label-md text-label-md opacity-80 uppercase">Limite</p>
                <p className="font-body-lg text-body-lg font-semibold">
                  {card.creditLimit != null ? formatBRL(card.creditLimit) : "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-label-md text-label-md opacity-80 uppercase">Fecha / Vence</p>
                <p className="font-body-lg text-body-lg font-semibold">
                  {card.closingDay ?? "—"} / {card.dueDay ?? "—"}
                </p>
              </div>
            </>
          ) : (
            <p className="font-body-sm text-body-sm opacity-80">Cartão de débito</p>
          )}
        </div>
      </div>
    </div>
  );
}
