import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "../lib/format";

interface TitheCardProps {
  income: number;
  enabled: boolean;
  percent: number;
  onToggle: (enabled: boolean) => void;
  onPercentChange: (percent: number) => void;
}

/** Cartão de dízimo: calcula uma porcentagem da receita do mês. */
export function TitheCard({ income, enabled, percent, onToggle, onPercentChange }: TitheCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(percent));
  const [userId, setUserId] = useState<string | null>(null);

  async function loadUser() {
    if (userId) return userId;
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return null;
    setUserId(auth.user.id);
    return auth.user.id;
  }

  async function savePercent() {
    const value = Number(draft.replace(",", "."));
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      toast.error("Informe uma porcentagem entre 0 e 100");
      return;
    }
    const uid = await loadUser();
    if (!uid) return;
    const { error } = await supabase
      .from("profiles")
      .update({ tithe_percent: value })
      .eq("id", uid);
    if (error) {
      toast.error("Não foi possível salvar a porcentagem");
      return;
    }
    onPercentChange(value);
    setEditing(false);
  }

  async function toggleEnabled() {
    const uid = await loadUser();
    if (!uid) return;
    const next = !enabled;
    const { error } = await supabase
      .from("profiles")
      .update({ tithe_enabled: next })
      .eq("id", uid);
    if (error) {
      toast.error("Não foi possível alterar o dízimo");
      return;
    }
    onToggle(next);
    toast.success(next ? "Dízimo ativado" : "Dízimo desativado");
  }

  const amount = (income * percent) / 100;

  return (
    <section className={`bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow ${enabled ? "" : "opacity-70"}`}>
      <div className="flex items-center justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">church</span>
          <h3 className="font-headline-md text-headline-md text-primary">Dízimo</h3>
        </div>
        <div className="flex items-center gap-xs">
          <button
            onClick={() => void toggleEnabled()}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-secondary" : "bg-surface-variant"}`}
            aria-label={enabled ? "Desativar dízimo" : "Ativar dízimo"}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-on-secondary transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          {editing ? (
            <div className="flex items-center gap-xs">
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-20 h-10 px-sm rounded-lg border border-outline bg-surface text-right font-body-lg text-body-lg text-primary"
              />
              <span className="font-body-lg text-body-lg text-on-surface-variant">%</span>
              <button
                onClick={() => void savePercent()}
                className="p-2 rounded-full text-secondary hover:bg-surface-container-low"
                aria-label="Salvar porcentagem"
              >
                <span className="material-symbols-outlined">check</span>
              </button>
              <button
                onClick={() => {
                  setDraft(String(percent));
                  setEditing(false);
                }}
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low"
                aria-label="Cancelar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-xs text-on-surface-variant hover:text-primary"
              aria-label="Editar porcentagem do dízimo"
              disabled={!enabled}
            >
              <span className="font-body-lg text-body-lg">
                {percent.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
              </span>
              <span className="material-symbols-outlined !text-[20px]">edit</span>
            </button>
          )}
        </div>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
        {enabled ? "Sobre a receita do mês" : "Dízimo desativado"}
      </p>
      <p className={`font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg ${enabled ? "text-primary" : "text-on-surface-variant"}`}>
        {formatBRL(enabled ? amount : 0)}
      </p>
      <div className="flex items-center justify-end gap-sm mt-xs pt-xs border-t border-outline-variant/60">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Receitas</span>
        <span className="font-numeric-data text-numeric-data text-on-surface-variant">
          {formatBRL(income)}
        </span>
      </div>
    </section>
  );
}
