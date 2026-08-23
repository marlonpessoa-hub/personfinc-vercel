import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "../components/app-shell";
import { APP_SCHEME } from "../lib/native-auth";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Concluindo login — PersonFinc" },
      { name: "description", content: "Finalizando a autenticação da sua conta PersonFinc." },
      { property: "og:title", content: "Concluindo login — PersonFinc" },
      { property: "og:description", content: "Finalizando a autenticação da sua conta." },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Concluindo login…");

  useEffect(() => {
    const { search, hash } = window.location;
    const params = new URLSearchParams(search);

    // Fluxo do app Android: devolve o resultado para o app via deep link,
    // já que o login aconteceu no navegador do sistema.
    if (params.get("native") === "1") {
      params.delete("native");
      const query = params.toString();
      setMessage("Voltando para o aplicativo…");
      window.location.replace(`${APP_SCHEME}://auth/callback${query ? `?${query}` : ""}${hash}`);
      return;
    }

    const errorDescription = params.get("error_description") ?? params.get("error");
    if (errorDescription) {
      setMessage(`Não foi possível concluir o login: ${errorDescription}`);
      const timer = setTimeout(() => navigate({ to: "/login" }), 2500);
      return () => clearTimeout(timer);
    }

    let done = false;
    const finish = (to: "/" | "/login") => {
      if (done) return;
      done = true;
      navigate({ to });
    };

    // O cliente troca o código pela sessão automaticamente; esperamos ela existir
    // antes de navegar, para não cair na rota protegida sem usuário.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish("/");
    });

    void (async () => {
      for (let i = 0; i < 20 && !done; i++) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          finish("/");
          return;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      setMessage("Sessão não encontrada. Tente entrar novamente.");
      finish("/login");
    })();

    return () => data.subscription.unsubscribe();
  }, [navigate]);


  return (
    <AuthShell>
      <p className="text-center font-body-lg text-body-lg text-on-surface-variant">{message}</p>
    </AuthShell>
  );
}
