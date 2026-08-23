import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "../components/app-shell";
import { PasswordInput } from "../components/password-input";
import { needsPasswordSetup } from "../lib/password-setup";

export const Route = createFileRoute("/definir-senha")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Definir Senha — PersonFinc" },
      {
        name: "description",
        content: "Crie uma senha para acessar o PersonFinc também com e-mail e senha.",
      },
      { property: "og:title", content: "Definir senha — PersonFinc" },
      {
        property: "og:description",
        content: "Defina uma senha após entrar com o Google.",
      },
    ],
  }),
  component: DefinirSenha,
});

function DefinirSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        navigate({ to: "/login" });
        return;
      }
      if (!needsPasswordSetup(data.user)) {
        navigate({ to: "/" });
        return;
      }
      setEmail(data.user.email ?? "");
      setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) {
      toast.error("As senhas não coincidem");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
        data: { password_set: true },
      });
      if (error) throw error;
      toast.success("Senha definida! Agora você também pode entrar com e-mail e senha.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível definir a senha");
    } finally {
      setSaving(false);
    }
  }

  async function handleSkip() {
    await supabase.auth.updateUser({ data: { password_set: true } }).catch(() => {});
    navigate({ to: "/" });
  }

  return (
    <AuthShell>
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-lg">
        <h1 className="text-center font-headline-md text-headline-md text-primary mb-md">
          Definir senha
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center mb-lg">
          {checking
            ? "Verificando sua conta…"
            : `Você entrou com o Google${email ? ` como ${email}` : ""}. Crie uma senha para também poder entrar com e-mail e senha.`}
        </p>

        {!checking && (
          <>
            <form onSubmit={handleSubmit} className="space-y-md">
              <PasswordInput
                required
                name="password"
                label="Nova senha"
                minLength={8}
                placeholder="••••••••"
              />
              <PasswordInput
                required
                name="confirm"
                label="Confirmar senha"
                minLength={8}
                placeholder="••••••••"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Salvando…" : "Salvar senha"}
              </button>
            </form>
            <button
              type="button"
              onClick={handleSkip}
              className="mt-md w-full py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low"
            >
              Agora não
            </button>
          </>
        )}
      </div>
    </AuthShell>
  );
}
