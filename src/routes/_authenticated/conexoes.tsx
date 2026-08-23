import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "../../components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "../../lib/store";
import { formatBRL } from "../../lib/format";
import {
  createPluggyConnectToken,
  savePluggyItem,
  syncPluggyConnection,
} from "../../lib/pluggy.functions";

export const Route = createFileRoute("/_authenticated/conexoes")({
  head: () => ({
    meta: [
      { title: "Contas conectadas — PersonFinc" },
      {
        name: "description",
        content: "Conecte seus bancos pelo Open Finance e importe extrato e fatura do cartão.",
      },
      { property: "og:title", content: "Contas conectadas — PersonFinc" },
      {
        property: "og:description",
        content: "Open Finance no PersonFinc: extrato e fatura direto do seu banco.",
      },
    ],
  }),
  component: Conexoes,
});

const PLUGGY_SCRIPT = "https://cdn.pluggy.ai/pluggy-connect/v2.9.2/pluggy-connect.js";

type Connection = {
  id: string;
  institution_name: string;
  institution_image_url: string | null;
  status: string;
  last_synced_at: string | null;
  pluggy_item_id: string;
};

type Account = {
  id: string;
  connection_id: string;
  name: string;
  type: string;
  number: string | null;
  balance: number;
  credit_limit: number | null;
  due_day: number | null;
};

function loadPluggyScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("sem navegador"));
    if ((window as unknown as { PluggyConnect?: unknown }).PluggyConnect) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PLUGGY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("falha ao carregar widget")));
      return;
    }
    const el = document.createElement("script");
    el.src = PLUGGY_SCRIPT;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("falha ao carregar widget"));
    document.head.appendChild(el);
  });
}

function Conexoes() {
  const { canWrite } = useStore();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pending, setPending] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = useServerFn(createPluggyConnectToken);
  const saveItem = useServerFn(savePluggyItem);
  const syncConn = useServerFn(syncPluggyConnection);

  const refresh = useCallback(async () => {
    const [connRes, accRes, pendRes] = await Promise.all([
      supabase
        .from("bank_connections")
        .select("id, institution_name, institution_image_url, status, last_synced_at, pluggy_item_id")
        .order("created_at"),
      supabase.from("bank_accounts").select("*").order("name"),
      supabase
        .from("staged_transactions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente"),
    ]);
    setConnections((connRes.data ?? []) as Connection[]);
    setAccounts(
      ((accRes.data ?? []) as Account[]).map((a) => ({
        ...a,
        balance: Number(a.balance),
        credit_limit: a.credit_limit == null ? null : Number(a.credit_limit),
      })),
    );
    setPending(pendRes.count ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function connect(itemId?: string) {
    if (!canWrite) {
      toast.error("Modo somente leitura — ative uma chave de acesso no Perfil.");
      return;
    }
    setBusy("connect");
    try {
      const [{ connectToken }] = await Promise.all([
        getToken({ data: itemId ? { itemId } : {} }),
        loadPluggyScript(),
      ]);
      const Ctor = (
        window as unknown as {
          PluggyConnect: new (opts: Record<string, unknown>) => { init: () => void };
        }
      ).PluggyConnect;
      const widget = new Ctor({
        connectToken,
        includeSandbox: true,
        onSuccess: async (payload: { item: { id: string } }) => {
          try {
            const res = await saveItem({ data: { itemId: payload.item.id } });
            toast.success(`Banco conectado (${res.accounts} conta(s))`);
            await refresh();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Falha ao salvar conexão");
          }
        },
        onError: () => toast.error("Não foi possível concluir a conexão"),
      });
      widget.init();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao abrir o Open Finance");
    } finally {
      setBusy(null);
    }
  }

  async function sync(id: string) {
    setBusy(id);
    try {
      const res = await syncConn({ data: { connectionId: id } });
      toast.success(
        res.inserted > 0
          ? `${res.inserted} novo(s) item(ns) para revisar`
          : "Nenhum item novo encontrado",
      );
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao sincronizar");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover esta conexão e os itens ainda não importados?")) return;
    const { error } = await supabase.from("bank_connections").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Conexão removida");
    await refresh();
  }

  return (
    <AppShell title="Contas conectadas">
      <div className="max-w-3xl mx-auto space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-md">
          <div className="flex-1">
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
              Contas conectadas
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Open Finance via Pluggy — extrato bancário e fatura do cartão.
            </p>
          </div>
          <button
            onClick={() => void connect()}
            disabled={busy === "connect"}
            className="inline-flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
          >
            <span className="material-symbols-outlined !text-[18px]">account_balance</span>
            {busy === "connect" ? "Abrindo…" : "Conectar banco"}
          </button>
        </div>

        {pending > 0 && (
          <Link
            to="/importar"
            className="flex items-center gap-md p-md rounded-xl bg-secondary-container text-on-secondary-container"
          >
            <span className="material-symbols-outlined">inbox</span>
            <span className="flex-1 font-body-lg text-body-lg">
              {pending} item(ns) aguardando revisão
            </span>
            <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        )}

        {loading ? (
          <p className="font-body-lg text-body-lg text-on-surface-variant">Carregando…</p>
        ) : connections.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-xl text-center">
            <span className="material-symbols-outlined text-on-surface-variant !text-[48px]">
              account_balance
            </span>
            <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
              Nenhum banco conectado ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-md">
            {connections.map((c) => {
              const accs = accounts.filter((a) => a.connection_id === c.id);
              return (
                <section
                  key={c.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden"
                >
                  <header className="flex items-center gap-md p-md">
                    <span className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden">
                      {c.institution_image_url ? (
                        <img src={c.institution_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined">account_balance</span>
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-lg text-body-lg text-primary font-medium truncate">
                        {c.institution_name}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {c.last_synced_at
                          ? `Atualizado em ${new Date(c.last_synced_at).toLocaleString("pt-BR")}`
                          : "Nunca sincronizado"}
                      </p>
                    </div>
                    <button
                      onClick={() => void sync(c.id)}
                      disabled={busy === c.id}
                      className="px-3 py-2 rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container disabled:opacity-60"
                    >
                      {busy === c.id ? "Atualizando…" : "Atualizar"}
                    </button>
                    <button
                      onClick={() => void remove(c.id)}
                      aria-label="Remover conexão"
                      className="w-10 h-10 rounded-full text-error hover:bg-error-container flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined !text-[20px]">delete</span>
                    </button>
                  </header>

                  {accs.length > 0 && (
                    <div className="divide-y divide-outline-variant/60 border-t border-outline-variant/60">
                      {accs.map((a) => (
                        <div key={a.id} className="flex items-center gap-md p-md">
                          <span className="material-symbols-outlined text-on-surface-variant">
                            {a.type === "CREDIT" ? "credit_card" : "savings"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body-lg text-body-lg text-primary truncate">{a.name}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {a.type === "CREDIT"
                                ? `Cartão${a.due_day ? ` • vence dia ${a.due_day}` : ""}`
                                : "Conta"}
                              {a.number ? ` • ${a.number}` : ""}
                            </p>
                          </div>
                          <p className="font-numeric-data text-numeric-data text-primary">
                            {formatBRL(a.balance)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
