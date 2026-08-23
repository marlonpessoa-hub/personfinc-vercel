import { useState } from "react";
import { LANGUAGES, useI18n, type LangCode } from "../lib/i18n";

/** Linha de perfil que abre a lista de idiomas disponíveis. */
export function LanguageRow() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="border-b last:border-b-0 border-outline-variant/60">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-md p-md hover:bg-surface-container-low text-left"
      >
        <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">language</span>
        </span>
        <span className="flex-1 font-body-lg text-body-lg text-primary">
          {t("profile.language")}
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {current.flag} {current.label}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? "expand_less" : "chevron_right"}
        </span>
      </button>

      {open && (
        <ul className="pb-sm">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                onClick={() => {
                  setLang(l.code as LangCode);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-md pl-[72px] pr-md py-3 hover:bg-surface-container-low text-left"
              >
                <span className="flex-1 font-body-md text-body-md text-primary">
                  {l.flag} {l.label}
                </span>
                {l.code === lang && (
                  <span className="material-symbols-outlined text-secondary">check</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
