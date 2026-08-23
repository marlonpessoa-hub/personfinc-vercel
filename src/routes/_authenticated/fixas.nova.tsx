import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FixedExpenseForm } from "../../components/fixed-expense-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/fixas/nova")({
  head: () => ({
    meta: [
      { title: "Nova Despesa Fixa — PersonFinc" },
      { name: "description", content: "Cadastre uma despesa fixa recorrente." },
      { property: "og:title", content: "Nova Despesa Fixa — PersonFinc" },
      { property: "og:description", content: "Cadastre uma despesa fixa recorrente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NovaFixa,
});

function NovaFixa() {
  const navigate = useNavigate();
  const { addFixedExpense, categories } = useStore();

  return (
    <FixedExpenseForm
      title="Nova Despesa Fixa"
      categories={categories.filter((c) => c.kind === "despesa")}
      onCancel={() => navigate({ to: "/fixas" })}
      onSubmit={async (data) => {
        await addFixedExpense(data);
        toast.success("Despesa fixa criada");
        navigate({ to: "/fixas" });
      }}
    />
  );
}
