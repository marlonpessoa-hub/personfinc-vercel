import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ReadOnlyBanner } from "./access-gate";
import { ThemeToggleButton } from "./theme-toggle";
import { googleAvatarFrom } from "../lib/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "../lib/i18n";
import logoAsset from "@/assets/logo.png.asset.json";

function useAvatar() {
  const [avatar, setAvatar] = useState<string | null>(null);
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", data.user.id)
        .maybeSingle();
      setAvatar(profile?.avatar_url ?? googleAvatarFrom(data.user.user_metadata));
    })();
  }, []);
  return avatar;
}



type NavItem = { to: string; labelKey: string; icon: string };

const NAV: NavItem[] = [
  { to: "/", labelKey: "nav.home", icon: "home" },
  { to: "/transacoes", labelKey: "nav.transactions", icon: "swap_vert" },
  { to: "/fixas", labelKey: "nav.fixed", icon: "event_repeat" },
  { to: "/cartoes", labelKey: "nav.cards", icon: "credit_card" },
  { to: "/metas", labelKey: "nav.goals", icon: "track_changes" },
  { to: "/perfil", labelKey: "nav.profile", icon: "person" },
];

export function AppShell({
  title,
  children,
  action,
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const avatar = useAvatar();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-on-background pb-24 md:pb-8">
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-40 w-full bg-surface border-b border-outline-variant">
        <div className="flex items-center justify-between px-margin-desktop py-sm w-full max-w-[1280px] mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="PersonFinc Logo" className="w-10 h-10 object-contain" />
            <span className="font-headline-md text-headline-md font-bold text-primary">
              PersonFinc
            </span>
          </Link>
          <nav className="flex gap-sm items-center">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={
                  "font-label-md text-label-md px-4 py-2 rounded-full transition-all " +
                  (isActive(n.to)
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")
                }
              >
                {t(n.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-sm">
            <ThemeToggleButton />
            <Link
              to="/perfil"
              className="w-10 h-10 rounded-full overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center"
              aria-label="Perfil"
            >
              {avatar ? (
                <img src={avatar} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 bg-surface border-b border-outline-variant safe-top">
        <div className="flex items-center justify-between px-margin-mobile py-sm">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="PersonFinc Logo" className="w-8 h-8 object-contain" />
            <span className="font-headline-md text-headline-md font-bold text-primary">
              {title ?? "PersonFinc"}
            </span>
          </div>
          <div className="flex items-center gap-xs">
            {action}
            <ThemeToggleButton />
            <Link
              to="/perfil"
              className="p-2 rounded-full text-primary hover:bg-surface-container-low"
              aria-label="Perfil"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <ReadOnlyBanner />
        {children}
      </main>


      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-outline-variant safe-bottom">
        <ul className="grid grid-cols-6">
          {NAV.map((n) => {
            const active = isActive(n.to);
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={
                    "flex flex-col items-center justify-center gap-[2px] py-2 text-[11px] font-semibold transition-colors " +
                    (active ? "text-primary" : "text-on-surface-variant")
                  }
                >
                  <span
                    className={
                      "material-symbols-outlined !text-[22px] " +
                      (active ? "text-primary" : "text-on-surface-variant")
                    }
                  >
                    {n.icon}
                  </span>
                  {t(n.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 bg-surface z-40">
        <div className="flex items-center justify-between px-margin-mobile h-14 max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="PersonFinc Logo" className="w-8 h-8 object-contain" />
            <span className="font-headline-md text-headline-md font-bold text-primary">
              PersonFinc
            </span>
          </Link>
          <ThemeToggleButton />
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div className="w-full max-w-[480px]">{children}</div>
      </main>
      <footer className="w-full mt-auto border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center gap-sm px-margin-mobile py-lg max-w-[1280px] mx-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 PersonFinc. Todos os direitos reservados.
          </span>
          <nav className="flex gap-md">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">
              Termos de Uso
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">
              Privacidade
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary" href="#">
              Suporte
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
