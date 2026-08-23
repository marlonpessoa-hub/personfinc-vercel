import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GoalForm } from "../../components/goal-form";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/metas/nova")({
  head: () => ({
    meta: [
      { title: "Nova Meta — PersonFinc" },
      { name: "description", content: "Crie uma nova meta financeira." },
    ],
  }),
  component: NovaMeta,
});

function NovaMeta() {
  const navigate = useNavigate();
  const { addGoal } = useStore();
  return (
    <GoalForm
      title="Nova Meta"
      onCancel={() => navigate({ to: "/metas" })}
      onSubmit={(data) => {
        addGoal(data);
        toast.success("Meta criada");
        navigate({ to: "/metas" });
      }}
    />
  );
}
