import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "../../components/app-shell";
import { useStore } from "../../lib/store";
import { formatBRL, formatDateLong } from "../../lib/format";

export const Route = createFileRoute("/_authenticated/metas/")({
  head: () => ({
    meta: [
      { title: "Minhas Metas — PersonFinc" },
      { name: "description", content: "Acompanhe suas metas financeiras." },
    ],
  }),
  component: MetasList,
});

function MetasList() {
  const { goals, setFeaturedGoal, canWrite } = useStore();
  const activeCount = goals.length;

  return (
    <AppShell
      title="Metas"
      action={
        <Link to="/metas/nova" className="p-2 rounded-full bg-primary text-on-primary" aria-label="Nova meta">
          <span className="material-symbols-outlined">add</span>
        </Link>
      }
    >
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
              Minhas Metas
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              {activeCount} meta{activeCount !== 1 ? "s" : ""} ativa{activeCount !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/metas/nova"
            className="hidden md:inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90"
          >
            <span className="material-symbols-outlined !text-[18px]">add</span>
            Nova Meta
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {goals.map((g) => {
            const pct = Math.min(100, (g.saved / g.target) * 100);
            const remaining = Math.max(0, g.target - g.saved);
            const isFeatured = g.is_featured;
            return (
              <Link
                key={g.id}
                to="/metas/$id/editar"
                params={{ id: g.id }}
                className={`relative bg-surface-container-lowest rounded-xl p-md border card-shadow hover:-translate-y-0.5 transition-transform ${
                  isFeatured ? "border-primary ring-2 ring-primary/20" : "border-outline-variant"
                }`}
              >
                {isFeatured && (
                  <span className="absolute top-2 right-2 material-symbols-outlined text-primary" title="Meta em destaque">
                    stars
                  </span>
                )}
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">{g.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-headline-md text-headline-md text-primary pr-6">{g.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Prazo: {formatDateLong(g.deadline)}
                    </p>
                  </div>
                </div>
                <div className="mt-md">
                  <div className="flex items-baseline justify-between">
                    <span className="font-numeric-data text-numeric-data text-primary">
                      {formatBRL(g.saved)}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      de {formatBRL(g.target)}
                    </span>
                  </div>
                  <div className="mt-sm w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full animate-fill-bar"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-sm flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-secondary-container bg-secondary-container px-2 py-[2px] rounded-full">
                      {pct.toFixed(0)}%
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Falta {formatBRL(remaining)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!canWrite) {
                      toast.error("Ative uma chave de acesso para alterar a meta em destaque.");
                      return;
                    }
                    await setFeaturedGoal(isFeatured ? null : g.id);
                    toast.success(isFeatured ? "Meta removida do destaque" : "Meta em destaque definida");
                  }}
                  className={`mt-md w-full inline-flex items-center justify-center gap-sm px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${
                    isFeatured
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined !text-[18px]">{isFeatured ? "star" : "star_border"}</span>
                  {isFeatured ? "Em destaque" : "Destacar no painel"}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
