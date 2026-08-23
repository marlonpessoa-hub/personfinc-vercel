import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CardForm } from "../../components/card-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/cartoes/novo")({
  head: () => ({
    meta: [
      { title: "Novo Cartão — PersonFinc" },
      { name: "description", content: "Cadastre um cartão de crédito ou débito." },
      { property: "og:title", content: "Novo Cartão — PersonFinc" },
      { property: "og:description", content: "Cadastre um cartão de crédito ou débito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NovoCartao,
});

function NovoCartao() {
  const navigate = useNavigate();
  const { addCard } = useStore();

  return (
    <CardForm
      title="Novo Cartão"
      onCancel={() => navigate({ to: "/cartoes" })}
      onSubmit={async (data) => {
        await addCard(data);
        toast.success("Cartão cadastrado");
        navigate({ to: "/cartoes" });
      }}
    />
  );
}
