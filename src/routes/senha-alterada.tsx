import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "../components/app-shell";

export const Route = createFileRoute("/senha-alterada")({
  head: () => ({
    meta: [
      { title: "Senha alterada — PersonFinc" },
      { name: "description", content: "Sua senha foi redefinida com sucesso." },
    ],
  }),
  component: SenhaAlterada,
});

function SenhaAlterada() {
  return (
    <AuthShell>
      <div className="bg-surface-container-lowest rounded-xl p-lg md:p-xl border border-outline-variant text-center flex flex-col items-center card-shadow">
        <div className="mb-lg relative">
          <div className="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center success-checkmark-bounce">
            <span className="material-symbols-outlined text-on-secondary-container !text-[48px]">
              check_circle
            </span>
          </div>
        </div>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-md">
          Senha alterada!
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[320px]">
          Sua senha foi redefinida com sucesso. Agora você já pode acessar sua conta com a nova senha.
        </p>
        <Link
          to="/login"
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-md px-lg rounded-lg flex items-center justify-center gap-sm hover:opacity-90"
        >
          Ir para o Login
          <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
        </Link>
        <p className="mt-lg font-body-sm text-body-sm text-outline">
          Problemas para acessar?{" "}
          <a className="text-secondary font-semibold hover:underline" href="#">
            Fale com o suporte
          </a>
        </p>
      </div>
    </AuthShell>
  );
}
