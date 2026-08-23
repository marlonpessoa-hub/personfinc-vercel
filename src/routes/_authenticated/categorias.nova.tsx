import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CategoryForm } from "../../components/category-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/categorias/nova")({
  head: () => ({
    meta: [
      { title: "Nova Categoria — PersonFinc" },
      { name: "description", content: "Crie uma nova categoria de receita ou despesa." },
    ],
  }),
  component: NovaCategoria,
});

function NovaCategoria() {
  const navigate = useNavigate();
  const { addCategory } = useStore();
  return (
    <CategoryForm
      title="Nova Categoria"
      onCancel={() => navigate({ to: "/categorias" })}
      onSubmit={async (data) => {
        try {
          await addCategory(data);
        } catch {
          return;
        }
        toast.success("Categoria criada");
        navigate({ to: "/categorias" });
      }}
    />
  );
}
