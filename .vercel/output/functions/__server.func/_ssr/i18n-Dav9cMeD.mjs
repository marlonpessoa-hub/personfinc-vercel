import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/i18n-Dav9cMeD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Chave usada antes da preferência por usuário (mantida só como leitura de migração). */
var THEME_STORAGE_KEY = "personfinc-theme";
function keyFor(userId) {
	return userId ? `${THEME_STORAGE_KEY}:${userId}` : THEME_STORAGE_KEY;
}
function readStoredTheme(userId) {
	try {
		const value = localStorage.getItem(keyFor(userId));
		return value === "dark" || value === "light" ? value : null;
	} catch {
		return null;
	}
}
function applyThemeClass(mode) {
	const root = document.documentElement;
	root.classList.toggle("dark", mode === "dark");
	root.style.colorScheme = mode;
}
function applyTheme(mode, userId) {
	applyThemeClass(mode);
	try {
		localStorage.setItem(keyFor(userId), mode);
	} catch {}
}
async function currentUserId() {
	try {
		const { data } = await supabase.auth.getUser();
		return data.user?.id ?? null;
	} catch {
		return null;
	}
}
function useTheme() {
	const [theme, setThemeState] = (0, import_react.useState)(null);
	const [userId, setUserId] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		const id = await currentUserId();
		setUserId(id);
		const stored = readStoredTheme(id) ?? "light";
		applyThemeClass(stored);
		setThemeState(stored);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
		const { data } = supabase.auth.onAuthStateChange(() => {
			load();
		});
		return () => data.subscription.unsubscribe();
	}, [load]);
	const setTheme = (0, import_react.useCallback)((mode) => {
		applyTheme(mode, userId);
		setThemeState(mode);
	}, [userId]);
	return {
		theme,
		toggle: (0, import_react.useCallback)(() => {
			setTheme(theme === "dark" ? "light" : "dark");
		}, [theme, setTheme]),
		setTheme
	};
}
/** Aplica o tema salvo do usuário logado (montar uma vez na raiz). */
function ThemeSync() {
	useTheme();
	return null;
}
function ThemeToggleRow() {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggle,
		className: "w-full flex items-center gap-md p-md border-b last:border-b-0 border-outline-variant/60 hover:bg-surface-container-low text-left",
		"aria-pressed": isDark,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined",
					children: isDark ? "dark_mode" : "light_mode"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 font-body-lg text-body-lg text-primary",
				children: "Aparência"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-body-sm text-body-sm text-on-surface-variant",
				children: theme === null ? "" : isDark ? "Escuro" : "Claro"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative w-12 h-7 rounded-full transition-colors " + (isDark ? "bg-secondary" : "bg-surface-variant"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant transition-all " + (isDark ? "left-6" : "left-1") })
			})
		]
	});
}
function ThemeToggleButton() {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: toggle,
		"aria-label": isDark ? "Ativar tema claro" : "Ativar tema escuro",
		className: "p-2 rounded-full text-primary hover:bg-surface-container-low",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "material-symbols-outlined",
			children: isDark ? "light_mode" : "dark_mode"
		})
	});
}
var LANGUAGES = [
	{
		code: "pt-BR",
		label: "Português (BR)",
		flag: "🇧🇷"
	},
	{
		code: "en-US",
		label: "English (US)",
		flag: "🇺🇸"
	},
	{
		code: "es-ES",
		label: "Español",
		flag: "🇪🇸"
	}
];
var STORAGE_KEY = "personfinc-lang";
var pt = {
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
	"language.title": "Escolher idioma"
};
var DICTS = {
	"pt-BR": pt,
	"en-US": {
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
		"language.title": "Choose language"
	},
	"es-ES": {
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
		"language.title": "Elegir idioma"
	}
};
var LanguageContext = (0, import_react.createContext)({
	lang: "pt-BR",
	setLang: () => {},
	t: (k) => pt[k] ?? k
});
function LanguageProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("pt-BR");
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && stored in DICTS) setLangState(stored);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
	}, [lang]);
	const setLang = (0, import_react.useCallback)((l) => {
		setLangState(l);
		try {
			localStorage.setItem(STORAGE_KEY, l);
		} catch {}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		lang,
		setLang,
		t: (key) => DICTS[lang][key] ?? DICTS["pt-BR"][key] ?? key
	}), [lang, setLang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	return (0, import_react.useContext)(LanguageContext);
}
//#endregion
export { ThemeToggleRow as a, ThemeToggleButton as i, LanguageProvider as n, useI18n as o, ThemeSync as r, LANGUAGES as t };
