import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CardPurchaseDialog } from "../../components/card-purchase-dialog";
import { formatDateShort } from "../../lib/format";
import { AppShell } from "../../components/app-shell";
import { CreditCardVisual } from "../../components/credit-card-visual";
import { useStore } from "../../lib/store";
import { formatBRL } from "../../lib/format";
import type { CardPurchase } from "../../lib/mock-data";

export const Route = createFileRoute("/_authenticated/cartoes/")({
  head: () => ({
    meta: [
      { title: "Cartões — PersonFinc" },
      {
        name: "description",
        content: "Cadastre e gerencie seus cartões de crédito e débito no PersonFinc.",
      },
      { property: "og:title", content: "Cartões — PersonFinc" },
      {
        property: "og:description",
        content: "Cadastre e gerencie seus cartões de crédito e débito no PersonFinc.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CardsList,
});

function CardsList() {
  const { cards, cardPurchases, allTransactions, categoryById, removeCardPurchase } = useStore();
  const [purchaseCard, setPurchaseCard] = useState<string | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<CardPurchase | null>(null);
  const [selectedPayer, setSelectedPayer] = useState<string>("");

  const cardById = (id: string) => cards.find((c) => c.id === id);
  const limiteTotal = cards
    .filter((c) => c.kind === "credito")
    .reduce((a, b) => a + (b.creditLimit ?? 0), 0);

  const payers = useMemo(() => {
    const list = Array.from(
      new Set(allTransactions.filter((t) => t.cardId && t.payer).map((t) => t.payer!))
    );
    list.sort();
    return list;
  }, [allTransactions]);

  const payerTransactions = useMemo(() => {
    if (!selectedPayer) return [];
    return allTransactions
      .filter((t) => t.cardId && t.payer === selectedPayer)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allTransactions, selectedPayer]);

  return (
    <>
      <AppShell
        title="Cartões"
        action={
          <Link
            to="/cartoes/novo"
            className="p-2 rounded-full bg-primary text-on-primary"
            aria-label="Novo cartão"
          >
            <span className="material-symbols-outlined">add</span>
          </Link>
        }
      >
        <div className="space-y-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-md">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary flex-1">
              Cartões
            </h1>
            <Link
              to="/cartoes/novo"
              className="hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90"
            >
              <span className="material-symbols-outlined !text-[18px]">add</span>
              Novo cartão
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Limite total de crédito · {cards.length} cartão(ões)
            </p>
            <p className="font-numeric-data text-numeric-data text-primary mt-xs">
              {formatBRL(limiteTotal)}
            </p>
          </div>

          {cards.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-xl text-center">
              <span className="material-symbols-outlined text-on-surface-variant !text-[48px]">
                credit_card
              </span>
              <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
                Nenhum cartão cadastrado.
              </p>
              <Link
                to="/cartoes/novo"
                className="inline-flex mt-md items-center gap-sm bg-primary text-on-primary px-5 py-3 rounded-full font-label-md text-label-md hover:opacity-90"
              >
                <span className="material-symbols-outlined !text-[18px]">add</span>
                Cadastrar cartão
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
              {cards.map((c) => (
                <div key={c.id} className="space-y-sm">
                  <CreditCardVisual card={c} />
                  <div className="flex items-center gap-sm">
                    <Link
                      to="/cartoes/$id/editar"
                      params={{ id: c.id }}
                      className="inline-flex items-center gap-xs px-4 py-2 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined !text-[18px]">edit</span>
                      Editar
                    </Link>
                    {c.kind === "credito" && (
                      <button
                        type="button"
                        onClick={() => setPurchaseCard(c.id)}
                        className="inline-flex items-center gap-xs px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
                      >
                        <span className="material-symbols-outlined !text-[18px]">add_shopping_cart</span>
                        Nova compra
                      </button>
                    )}
                    {c.kind === "credito" && c.dueDay ? (
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Vence dia {c.dueDay}
                      </span>
                    ) : null}
                  </div>

                  {(() => {
                    const moves = allTransactions
                      .filter((t) => t.cardId === c.id)
                      .slice(0, 5);
                    const usado = allTransactions
                      .filter((t) => t.cardId === c.id && !t.paid && t.amount < 0)
                      .reduce((a, b) => a + Math.abs(b.amount), 0);
                    return (
                      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md space-y-xs">
                        <p className="font-label-md text-label-md text-on-surface-variant uppercase">
                          Movimentações · em aberto {formatBRL(usado)}
                        </p>
                        {moves.length === 0 ? (
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Nenhuma movimentação neste cartão.
                          </p>
                        ) : (
                          moves.map((t) => (
                            <Link
                              key={t.id}
                              to="/transacoes/$id/editar"
                              params={{ id: t.id }}
                              className="flex items-center justify-between gap-sm py-xs"
                            >
                              <span className="font-body-sm text-body-sm text-on-surface truncate">
                                {t.description}
                                <span className="text-on-surface-variant">
                                  {" · "}
                                  {formatDateShort(t.date)}
                                  {t.payer ? ` · ${t.payer}` : ""}
                                </span>
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface shrink-0">
                                {formatBRL(Math.abs(t.amount))}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}

          {cardPurchases.length > 0 && (
            <section className="space-y-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface">Compras no cartão</h2>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow divide-y divide-outline-variant/60">
                {cardPurchases.map((p) => {
                  const card = cardById(p.cardId);
                  const cat = categoryById(p.categoryId);
                  return (
                    <div key={p.purchaseId} className="p-md flex items-start gap-md">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">{cat?.icon ?? "credit_card"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-lg text-body-lg text-on-surface break-words">
                          {p.description}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {formatDateShort(p.date)} · {card?.name ?? "Cartão"}
                          {p.payer ? ` · ${p.payer}` : ""} · {p.installments}x
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-numeric-data text-numeric-data text-on-surface">
                          {formatBRL(p.total)}
                        </p>
                        <div className="flex flex-col items-end gap-xs mt-xs">
                          <button
                            type="button"
                            onClick={() => setEditingPurchase(p)}
                            className="font-label-md text-label-md text-primary hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm("Excluir a compra e todas as parcelas?")) return;
                              await removeCardPurchase(p.purchaseId);
                              toast.success("Compra excluída");
                            }}
                            className="font-label-md text-label-md text-error hover:underline"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {payers.length > 0 && (
            <section className="space-y-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
                <h2 className="font-title-lg text-title-lg text-on-surface">Pagamentos por Responsável</h2>
                <select
                  value={selectedPayer}
                  onChange={(e) => setSelectedPayer(e.target.value)}
                  className="h-10 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary text-on-surface font-body-md"
                >
                  <option value="">Selecione um responsável</option>
                  {payers.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPayer && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow divide-y divide-outline-variant/60">
                  {payerTransactions.length === 0 ? (
                    <div className="p-md text-center text-on-surface-variant font-body-md">
                      Nenhuma transação encontrada.
                    </div>
                  ) : (
                    payerTransactions.map((t) => {
                      const card = cardById(t.cardId!);
                      const cat = categoryById(t.categoryId);
                      return (
                        <div key={t.id} className="p-md flex items-start gap-md">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">{cat?.icon ?? "receipt"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body-lg text-body-lg text-on-surface break-words">
                              {t.description}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {formatDateShort(t.date)} · {card?.name ?? "Cartão"}
                              {t.installments ? ` · Parcela ${t.installmentNo}/${t.installments}` : ""}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-numeric-data text-numeric-data text-on-surface">
                              {formatBRL(Math.abs(t.amount))}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {payerTransactions.length > 0 && (
                    <div className="p-md bg-surface-container-low flex justify-between items-center rounded-b-xl border-t border-outline-variant">
                      <span className="font-title-md text-title-md text-on-surface">Total</span>
                      <span className="font-numeric-data text-numeric-data text-primary">
                        {formatBRL(
                          payerTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0)
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </AppShell>
      {purchaseCard !== null && (
        <CardPurchaseDialog
          cardId={purchaseCard || undefined}
          onClose={() => setPurchaseCard(null)}
        />
      )}
      {editingPurchase && (
        <CardPurchaseDialog
          purchase={editingPurchase}
          onClose={() => setEditingPurchase(null)}
        />
      )}
    </>
  );
}
