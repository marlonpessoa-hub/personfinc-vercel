import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "../components/app-shell";
import { PasswordInput } from "../components/password-input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logoAsset from "@/assets/logo.png.asset.json";

import { isNativeApp, listenNativeAuthRedirect, signInWithGoogleNative } from "../lib/native-auth";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login & Cadastro — PersonFinc" },
      { name: "description", content: "Entre ou crie sua conta PersonFinc." },
      { property: "og:title", content: "Entrar no PersonFinc" },
      { property: "og:description", content: "Acesse suas finanças pessoais." },
    ],
  }),
  component: Login,
});

function Login() {
  const [tab, setTab] = useState<"login" | "cadastro">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setLoading(true);
    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado");
        navigate({ to: "/" });
      } else {
        if (password !== String(form.get("confirm") ?? "")) {
          toast.error("As senhas não coincidem");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: String(form.get("name") ?? "") },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        setTab("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível continuar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => listenNativeAuthRedirect(() => navigate({ to: "/definir-senha" })), [navigate]);

  async function handleGoogle() {
    if (isNativeApp()) {
      try {
        await signInWithGoogleNative();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Não foi possível entrar com o Google");
      }
      return;
    }
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: { prompt: "select_account" },
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar com o Google");
    }
  }

  return (
    <AuthShell>
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant overflow-hidden">
        <div className="flex flex-col items-center p-md border-b border-outline-variant gap-sm">
          <img src={logoAsset.url} alt="PersonFinc Logo" className="w-48 h-48 object-contain" />
          <h1 className="w-full text-center font-bold font-headline-md text-headline-md text-primary">
            {tab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
        </div>

        <div className="flex border-b border-outline-variant">
          {(["login", "cadastro"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "flex-1 py-4 text-sm font-bold border-b-[3px] transition-colors capitalize " +
                (tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:bg-surface-container-low")
              }
            >
              {t === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          {tab === "cadastro" && <Input name="name" label="Nome Completo" type="text" placeholder="Ex: João Silva" />}
          <Input name="email" label="E-mail" type="email" placeholder="voce@email.com" required />
          <PasswordInput name="password" label="Senha" placeholder="••••••••" required minLength={6} />
          {tab === "cadastro" && (
            <PasswordInput name="confirm" label="Confirme a senha" placeholder="••••••••" required minLength={6} />
          )}
          {tab === "login" && (
            <div className="text-right">
              <Link to="/recuperar-senha" className="font-body-sm text-body-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Aguarde…" : tab === "login" ? "Entrar" : "Criar conta"}
          </button>

          <div className="flex items-center gap-sm">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="font-body-sm text-body-sm text-on-surface-variant">ou</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined !text-[18px]">login</span>
            Continuar com Google
          </button>
        </form>
      </div>
    </AuthShell>
  );
}

function Input({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">{label}</span>
      <input
        {...rest}
        className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
      />
    </label>
  );
}
