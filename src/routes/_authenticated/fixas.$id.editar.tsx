import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FixedExpenseForm } from "../../components/fixed-expense-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/fixas/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Despesa Fixa — PersonFinc" },
      { name: "description", content: "Edite uma despesa fixa recorrente." },
      { property: "og:title", content: "Editar Despesa Fixa — PersonFinc" },
      { property: "og:description", content: "Edite uma despesa fixa recorrente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditarFixa,
});

function EditarFixa() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { fixedExpenses, updateFixedExpense, removeFixedExpense, categories } = useStore();
  const fx = fixedExpenses.find((f) => f.id === id);

  if (!fx) {
    return (
      <div className="p-xl text-center">
        <p className="text-on-surface-variant">Despesa fixa não encontrada.</p>
      </div>
    );
  }

  return (
    <FixedExpenseForm
      title="Editar Despesa Fixa"
      categories={categories.filter((c) => c.kind === "despesa")}
      initial={{
        description: fx.description,
        amount: fx.amount,
        categoryId: fx.categoryId,
        dayOfMonth: fx.dayOfMonth,
        active: fx.active,
        note: fx.note ?? "",
      }}
      onCancel={() => navigate({ to: "/fixas" })}
      onDelete={async () => {
        await removeFixedExpense(fx.id);
        toast.success("Despesa fixa excluída");
        navigate({ to: "/fixas" });
      }}
      onSubmit={async (data) => {
        await updateFixedExpense(fx.id, data);
        toast.success("Despesa fixa atualizada");
        navigate({ to: "/fixas" });
      }}
    />
  );
}
