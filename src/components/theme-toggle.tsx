import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ThemeMode = "light" | "dark";

/** Tema padrão do app quando o usuário nunca escolheu nada. */
export const DEFAULT_THEME: ThemeMode = "light";

/** Chave usada antes da preferência por usuário (mantida só como leitura de migração). */
export const THEME_STORAGE_KEY = "personfinc-theme";

function keyFor(userId: string | null) {
  return userId ? `${THEME_STORAGE_KEY}:${userId}` : THEME_STORAGE_KEY;
}

export function readStoredTheme(userId: string | null): ThemeMode | null {
  try {
    const value = localStorage.getItem(keyFor(userId));
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

export function applyThemeClass(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

export function applyTheme(mode: ThemeMode, userId: string | null) {
  applyThemeClass(mode);
  try {
    localStorage.setItem(keyFor(userId), mode);
  } catch {
    /* ignore */
  }
}

async function currentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const id = await currentUserId();
    setUserId(id);
    const stored = readStoredTheme(id) ?? DEFAULT_THEME;
    applyThemeClass(stored);
    setThemeState(stored);
  }, []);

  useEffect(() => {
    void load();
    const { data } = supabase.auth.onAuthStateChange(() => {
      void load();
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      applyTheme(mode, userId);
      setThemeState(mode);
    },
    [userId],
  );

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, toggle, setTheme };
}

/** Aplica o tema salvo do usuário logado (montar uma vez na raiz). */
export function ThemeSync() {
  useTheme();
  return null;
}

export function ThemeToggleRow() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-full flex items-center gap-md p-md border-b last:border-b-0 border-outline-variant/60 hover:bg-surface-container-low text-left"
      aria-pressed={isDark}
    >
      <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{isDark ? "dark_mode" : "light_mode"}</span>
      </span>
      <span className="flex-1 font-body-lg text-body-lg text-primary">Aparência</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">
        {theme === null ? "" : isDark ? "Escuro" : "Claro"}
      </span>
      <span
        className={
          "relative w-12 h-7 rounded-full transition-colors " +
          (isDark ? "bg-secondary" : "bg-surface-variant")
        }
      >
        <span
          className={
            "absolute top-1 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant transition-all " +
            (isDark ? "left-6" : "left-1")
          }
        />
      </span>
    </button>
  );
}

export function ThemeToggleButton() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className="p-2 rounded-full text-primary hover:bg-surface-container-low"
    >
      <span className="material-symbols-outlined">{isDark ? "light_mode" : "dark_mode"}</span>
    </button>
  );
}
