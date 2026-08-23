import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "../../components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "../../lib/store";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administração — PersonFinc" },
      { name: "description", content: "Gere e gerencie chaves de acesso das contas." },
      { property: "og:title", content: "Administração — PersonFinc" },
      { property: "og:description", content: "Chaves de acesso do PersonFinc." },
    ],
  }),
  component: Admin,
});

type KeyRow = {
  id: string;
  code: string;
  valid_days: number;
  note: string | null;
  created_at: string;
  redeemed_by: string | null;
  redeemed_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
};

const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "—");

function Admin() {
  const { isAdmin, loading } = useStore();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [days, setDays] = useState(30);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/", replace: true });
  }, [loading, isAdmin, navigate]);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("access_keys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Não foi possível carregar as chaves");
      return;
    }
    setKeys((data ?? []) as KeyRow[]);
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  async function generate() {
    setBusy(true);
    const { data, error } = await supabase.rpc("generate_access_key", {
      _valid_days: days,
      _note: note || undefined,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const created = data as unknown as KeyRow;
    setNote("");
    await load();
    try {
      await navigator.clipboard.writeText(created.code);
      toast.success(`Chave ${created.code} gerada e copiada`);
    } catch {
      toast.success(`Chave gerada: ${created.code}`);
    }
  }

  async function revoke(id: string) {
    const { error } = await supabase.rpc("revoke_access_key", { _key_id: id });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Chave revogada");
    await load();
  }

  function status(k: KeyRow) {
    if (k.revoked_at) return { label: "Revogada", cls: "bg-error-container text-on-error-container" };
    if (!k.redeemed_by) return { label: "Disponível", cls: "bg-secondary-container text-on-secondary-container" };
    if (k.expires_at && new Date(k.expires_at).getTime() < Date.now())
      return { label: "Expirada", cls: "bg-surface-container text-on-surface-variant" };
    return { label: "Ativa", cls: "bg-primary-container text-on-primary" };
  }

  if (!isAdmin) return null;

  return (
    <AppShell title="Administração">
      <div className="max-w-3xl mx-auto space-y-lg">
        <h1 className="font-headline-md text-headline-md text-primary">Chaves de acesso</h1>

        <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow space-y-md">
          <h2 className="font-body-lg text-body-lg text-primary font-medium">Gerar nova chave</h2>
          <div className="flex flex-col sm:flex-row gap-sm">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="h-12 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary"
            >
              <option value={30}>30 dias</option>
              <option value={90}>90 dias</option>
              <option value={180}>180 dias</option>
              <option value={365}>365 dias</option>
              <option value={3650}>10 anos</option>
            </select>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Observação (ex.: nome do usuário)"
              className="flex-1 h-12 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary"
            />
            <button
              onClick={generate}
              disabled={busy}
              className="h-12 px-lg rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60"
            >
              {busy ? "Gerando..." : "Gerar chave"}
            </button>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden divide-y divide-outline-variant/60">
          {keys.length === 0 && (
            <p className="p-md font-body-sm text-body-sm text-on-surface-variant">
              Nenhuma chave gerada ainda.
            </p>
          )}
          {keys.map((k) => {
            const s = status(k);
            return (
              <div key={k.id} className="p-md flex items-center justify-between gap-md flex-wrap">
                <div>
                  <p className="font-numeric-data text-numeric-data text-primary">{k.code}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {k.valid_days} dias · criada em {fmt(k.created_at)}
                    {k.note ? ` · ${k.note}` : ""}
                    {k.redeemed_at ? ` · resgatada em ${fmt(k.redeemed_at)}` : ""}
                    {k.expires_at ? ` · expira em ${fmt(k.expires_at)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-sm">
                  <span className={"font-label-md text-label-md px-3 py-1 rounded-full " + s.cls}>
                    {s.label}
                  </span>
                  <button
                    onClick={() => void navigator.clipboard.writeText(k.code)}
                    className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low"
                    aria-label="Copiar chave"
                  >
                    <span className="material-symbols-outlined !text-[20px]">content_copy</span>
                  </button>
                  {!k.revoked_at && (
                    <button
                      onClick={() => void revoke(k.id)}
                      className="p-2 rounded-full text-error hover:bg-error-container"
                      aria-label="Revogar chave"
                    >
                      <span className="material-symbols-outlined !text-[20px]">block</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
