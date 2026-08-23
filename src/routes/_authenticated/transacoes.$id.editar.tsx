import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TransactionForm } from "../../components/transaction-form";
import { useStore } from "../../lib/store";
import type { TxKind } from "../../lib/mock-data";

export const Route = createFileRoute("/_authenticated/transacoes/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Lançamento — PersonFinc" },
      { name: "description", content: "Editar uma transação existente." },
    ],
  }),
  component: EditarLancamento,
});

function EditarLancamento() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { allTransactions, updateTransaction, removeTransaction, categories, cards } = useStore();
  const tx = allTransactions.find((t) => t.id === id);
  const [kind, setKind] = useState<TxKind>(tx && tx.amount >= 0 ? "receita" : "despesa");
  const isParcel = Boolean(tx?.purchaseId);

  if (!tx) {
    return (
      <div className="p-xl text-center">
        <p className="text-on-surface-variant">Transação não encontrada.</p>
      </div>
    );
  }

  const parcelSuffix =
    tx.installmentNo && tx.installments ? ` (${tx.installmentNo}/${tx.installments})` : "";

  return (
    <TransactionForm
      title="Editar Lançamento"
      kind={kind}
      onKindChange={setKind}
      categories={categories.filter((c) => c.kind === kind)}
      cards={cards}
      notice={
        isParcel
          ? `Esta é a parcela${parcelSuffix} de uma compra no cartão — as demais parcelas não são alteradas. Para editar a compra inteira, use a página Cartões.`
          : undefined
      }
      cardLocked={isParcel}
      initial={{
        description: tx.description,
        amount: Math.abs(tx.amount),
        categoryId: tx.categoryId,
        date: tx.date,
        note: tx.note ?? "",
        paid: tx.paid ?? false,
        cardId: tx.cardId ?? "",
        payer: tx.payer ?? "",
      }}
      onCancel={() => navigate({ to: "/transacoes" })}
      onDelete={() => {
        removeTransaction(tx.id);
        toast.success("Lançamento excluído");
        navigate({ to: "/transacoes" });
      }}
      onSubmit={(data) => {
        updateTransaction(tx.id, {
          description: data.description,
          amount: kind === "despesa" ? -Math.abs(data.amount) : Math.abs(data.amount),
          categoryId: data.categoryId,
          date: data.date,
          note: data.note,
          paid: kind === "despesa" ? data.paid : false,
          paidAt: kind === "despesa" && data.paid ? (tx.paidAt ?? undefined) : undefined,
          cardId:
            kind === "despesa"
              ? isParcel
                ? tx.cardId
                : data.cardId
              : undefined,
          payer: kind === "despesa" ? data.payer : undefined,
        });
        toast.success("Lançamento atualizado");
        navigate({ to: "/transacoes" });
      }}
    />
  );
}
