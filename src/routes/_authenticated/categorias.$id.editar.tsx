import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CategoryForm } from "../../components/category-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/categorias/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Categoria — PersonFinc" },
      { name: "description", content: "Edite uma categoria." },
    ],
  }),
  component: EditarCategoria,
});

function EditarCategoria() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { categories, updateCategory, removeCategory } = useStore();
  const cat = categories.find((c) => c.id === id);

  if (!cat) {
    return <div className="p-xl text-center text-on-surface-variant">Categoria não encontrada.</div>;
  }

  return (
    <CategoryForm
      title="Editar Categoria"
      initial={cat}
      onCancel={() => navigate({ to: "/categorias" })}
      onDelete={async () => {
        try {
          await removeCategory(cat.id);
        } catch {
          return;
        }
        toast.success("Categoria excluída");
        navigate({ to: "/categorias" });
      }}
      onSubmit={async (data) => {
        try {
          await updateCategory(cat.id, data);
        } catch {
          return;
        }
        toast.success("Categoria atualizada");
        navigate({ to: "/categorias" });
      }}
    />
  );
}
