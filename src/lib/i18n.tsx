import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

const STORAGE_KEY = "personfinc-lang";

type Dict = Record<string, string>;

const pt: Dict = {
  "nav.home": "Início",
  "nav.transactions": "Transações",
  "nav.fixed": "Fixas",
  "nav.cards": "Cartões",
  "nav.goals": "Metas",
  "nav.profile": "Perfil",
  "profile.categories": "Categorias",
  "profile.notifications": "Notificações",
  "profile.language": "Idioma",
  "profile.security": "Segurança",
  "profile.tithe": "Calcular dízimo",
  "profile.export": "Exportar dados",
  "profile.help": "Ajuda e suporte",
  "profile.adminKeys": "Administração de chaves",
  "profile.signOut": "Sair da conta",
  "common.save": "Salvar",
  "common.cancel": "Cancelar",
  "language.title": "Escolher idioma",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.transactions": "Transactions",
  "nav.fixed": "Fixed",
  "nav.cards": "Cards",
  "nav.goals": "Goals",
  "nav.profile": "Profile",
  "profile.categories": "Categories",
  "profile.notifications": "Notifications",
  "profile.language": "Language",
  "profile.security": "Security",
  "profile.tithe": "Calculate tithe",
  "profile.export": "Export data",
  "profile.help": "Help & support",
  "profile.adminKeys": "Access key admin",
  "profile.signOut": "Sign out",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "language.title": "Choose language",
};

const es: Dict = {
  "nav.home": "Inicio",
  "nav.transactions": "Transacciones",
  "nav.fixed": "Fijos",
  "nav.cards": "Tarjetas",
  "nav.goals": "Metas",
  "nav.profile": "Perfil",
  "profile.categories": "Categorías",
  "profile.notifications": "Notificaciones",
  "profile.language": "Idioma",
  "profile.security": "Seguridad",
  "profile.tithe": "Calcular diezmo",
  "profile.export": "Exportar datos",
  "profile.help": "Ayuda y soporte",
  "profile.adminKeys": "Administración de claves",
  "profile.signOut": "Cerrar sesión",
  "common.save": "Guardar",
  "common.cancel": "Cancelar",
  "language.title": "Elegir idioma",
};

const DICTS: Record<LangCode, Dict> = { "pt-BR": pt, "en-US": en, "es-ES": es };

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx>({
  lang: "pt-BR",
  setLang: () => {},
  t: (k) => pt[k] ?? k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("pt-BR");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignora storage indisponível
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key: string) => DICTS[lang][key] ?? DICTS["pt-BR"][key] ?? key,
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  return useContext(LanguageContext);
}
