import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TransactionForm } from "../../components/transaction-form";
import { useStore } from "../../lib/store";
import type { TxKind } from "../../lib/mock-data";

export const Route = createFileRoute("/_authenticated/transacoes/novo")({
  head: () => ({
    meta: [
      { title: "Novo Lançamento — PersonFinc" },
      { name: "description", content: "Adicione uma nova receita ou despesa." },
    ],
  }),
  component: NovoLancamento,
});

function NovoLancamento() {
  const navigate = useNavigate();
  const { addTransaction, categories, cards, month } = useStore();
  const [kind, setKind] = useState<TxKind>("despesa");

  return (
    <TransactionForm
      title="Novo Lançamento"
      kind={kind}
      onKindChange={setKind}
      categories={categories.filter((c) => c.kind === kind)}
      cards={cards}
      initial={{
        description: "",
        amount: 0,
        categoryId: "",
        date:
          month === new Date().toISOString().slice(0, 7)
            ? new Date().toISOString().slice(0, 10)
            : `${month}-01`,
        note: "",
        paid: false,
        cardId: "",
      }}
      onCancel={() => navigate({ to: "/transacoes" })}
      onSubmit={(data) => {
        addTransaction({
          description: data.description,
          amount: kind === "despesa" ? -Math.abs(data.amount) : Math.abs(data.amount),
          categoryId: data.categoryId,
          date: data.date,
          note: data.note,
          paid: kind === "despesa" ? data.paid : false,
          cardId: kind === "despesa" ? data.cardId : undefined,
        });
        toast.success("Lançamento criado com sucesso");
        navigate({ to: "/transacoes" });
      }}
    />
  );
}
