import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell } from "../components/app-shell";
import { PasswordInput } from "../components/password-input";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Redefinir Senha — PersonFinc" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
  component: Redefinir,
});

function Redefinir() {
  const navigate = useNavigate();
  return (
    <AuthShell>
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant p-lg">
        <h1 className="text-center font-headline-md text-headline-md text-primary mb-md">
          Redefinir Senha
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center mb-lg">
          Crie uma senha forte com pelo menos 8 caracteres.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const password = String(form.get("password") ?? "");
            if (password !== String(form.get("confirm") ?? "")) {
              toast.error("As senhas não coincidem");
              return;
            }
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success("Senha redefinida");
            navigate({ to: "/senha-alterada" });
          }}
          className="space-y-md"
        >
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
            label="Confirmar nova senha"
            minLength={8}
            placeholder="••••••••"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
          >
            Redefinir senha
          </button>
        </form>
        <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
