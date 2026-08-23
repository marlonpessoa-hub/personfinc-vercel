import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GoalForm } from "../../components/goal-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/metas/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Meta — PersonFinc" },
      { name: "description", content: "Edite uma meta financeira." },
    ],
  }),
  component: EditarMeta,
});

function EditarMeta() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { goals, updateGoal, removeGoal } = useStore();
  const g = goals.find((x) => x.id === id);
  if (!g) return <div className="p-xl text-center text-on-surface-variant">Meta não encontrada.</div>;

  return (
    <GoalForm
      title="Editar Meta"
      initial={g}
      onCancel={() => navigate({ to: "/metas" })}
      onDelete={() => {
        removeGoal(g.id);
        toast.success("Meta excluída");
        navigate({ to: "/metas" });
      }}
      onSubmit={(data) => {
        updateGoal(g.id, data);
        toast.success("Meta atualizada");
        navigate({ to: "/metas" });
      }}
    />
  );
}
