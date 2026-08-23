import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell } from "../components/app-shell";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperação de Senha — PersonFinc" },
      { name: "description", content: "Recupere o acesso à sua conta PersonFinc." },
    ],
  }),
  component: Recuperar,
});

function Recuperar() {
  return (
    <AuthShell>
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-lg">
        <div className="flex items-center gap-sm mb-md">
          <Link to="/login" className="p-2 rounded-full hover:bg-surface-container-low">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="flex-1 text-center font-headline-md text-headline-md text-primary pr-10">
            Recuperar Senha
          </h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center mb-lg">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const email = String(new FormData(e.currentTarget).get("email") ?? "");
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/redefinir-senha`,
            });
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success("E-mail de recuperação enviado");
          }}
          className="space-y-md"
        >
          <label className="block">
            <span className="block font-label-md text-label-md text-on-surface-variant mb-xs uppercase">
              E-mail
            </span>
            <input
              required
              name="email"
              type="email"
              placeholder="voce@email.com"
              className="w-full h-12 rounded-lg border border-outline bg-surface-container-lowest px-md outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
          >
            Enviar link de recuperação
          </button>
        </form>
        <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
          Lembrou a senha?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
