import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CardForm } from "../../components/card-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/cartoes/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Cartão — PersonFinc" },
      { name: "description", content: "Edite ou exclua um cartão cadastrado." },
      { property: "og:title", content: "Editar Cartão — PersonFinc" },
      { property: "og:description", content: "Edite ou exclua um cartão cadastrado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditarCartao,
});

function EditarCartao() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { cards, updateCard, removeCard } = useStore();
  const card = cards.find((c) => c.id === id);

  if (!card) {
    return (
      <div className="p-xl text-center">
        <p className="text-on-surface-variant">Cartão não encontrado.</p>
      </div>
    );
  }

  return (
    <CardForm
      title="Editar Cartão"
      initial={{
        name: card.name,
        brand: card.brand,
        kind: card.kind,
        last4: card.last4,
        creditLimit: card.creditLimit,
        closingDay: card.closingDay,
        dueDay: card.dueDay,
        color: card.color,
      }}
      onCancel={() => navigate({ to: "/cartoes" })}
      onDelete={async () => {
        await removeCard(card.id);
        toast.success("Cartão excluído");
        navigate({ to: "/cartoes" });
      }}
      onSubmit={async (data) => {
        await updateCard(card.id, data);
        toast.success("Cartão atualizado");
        navigate({ to: "/cartoes" });
      }}
    />
  );
}
