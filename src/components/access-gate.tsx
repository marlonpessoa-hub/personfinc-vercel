import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../lib/store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function ReadOnlyBanner() {
  const { canWrite, loading } = useStore();
  if (loading || canWrite) return null;
  return (
    <div className="mb-md rounded-xl border border-error/40 bg-error-container text-on-error-container p-md flex items-start gap-sm">
      <span className="material-symbols-outlined !text-[20px]">lock</span>
      <p className="font-body-sm text-body-sm">
        Modo somente leitura — insira sua chave de ativação no <strong>Perfil</strong> para criar,
        editar ou excluir lançamentos.
      </p>
    </div>
  );
}

export function ActivationCard() {
  const { canWrite, accessExpiresAt, redeemKey } = useStore();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    try {
      const expires = await redeemKey(code.trim());
      toast.success(`Acesso liberado até ${formatDate(expires)}`);
      setCode("");
    } catch {
      /* erro já exibido */
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow space-y-md">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">key</span>
        <h2 className="font-headline-md text-headline-md text-primary">Chave de acesso</h2>
      </div>

      {canWrite && accessExpiresAt ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Acesso ativo até <strong>{formatDate(accessExpiresAt)}</strong>.
        </p>
      ) : (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Sua conta está em modo somente leitura. Informe a chave enviada pelo administrador para
          liberar a edição.
        </p>
      )}

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-sm">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="PFIN-XXXX-XXXX-XXXX"
          className="flex-1 h-12 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-12 px-lg rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60"
        >
          {busy ? "Validando..." : canWrite ? "Estender acesso" : "Ativar"}
        </button>
      </form>
    </section>
  );
}
