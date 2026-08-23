import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as LanguageProvider, r as ThemeSync } from "./i18n-Dav9cMeD.mjs";
import { t as Route$28 } from "./cartoes._id.editar-Cpp5WGgD.mjs";
import { t as Route$29 } from "./categorias._id.editar-ssfy6Hhq.mjs";
import { t as needsPasswordSetup } from "./password-setup-Cf9AFU7C.mjs";
import { t as Route$30 } from "./fixas._id.editar-CXffPDB8.mjs";
import { t as Route$31 } from "./metas._id.editar-BGDxoW9r.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$32 } from "./transacoes._id.editar-NKyReIiu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B5B117C_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D8FSK5Zb.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$27 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "theme-color",
				content: "#091426"
			},
			{ title: "PersonFinc — Gestor de Finanças Pessoais" },
			{
				name: "description",
				content: "PersonFinc: controle suas finanças pessoais com transações, categorias e metas em um app simples e bonito."
			},
			{
				property: "og:title",
				content: "PersonFinc — Gestor de Finanças Pessoais"
			},
			{
				property: "og:description",
				content: "Controle transações, categorias e metas em português."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
var themeInitScript = `(function(){try{var t='light';for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('personfinc-theme:')===0){var v=localStorage.getItem(k);if(v==='dark'||v==='light'){t=v;break;}}}document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t;}catch(e){}})();`;
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeInitScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$27.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LanguageProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSync, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true
			})
		] })
	});
}
var $$splitComponentImporter$26 = () => import("./route-BW7Ciaqo.mjs");
var Route$26 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/login" });
		if (needsPasswordSetup(data.user)) throw redirect({ to: "/definir-senha" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./definir-senha-SU-6Zj0Z.mjs");
var Route$25 = createFileRoute("/definir-senha")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Definir Senha — PersonFinc" },
		{
			name: "description",
			content: "Crie uma senha para acessar o PersonFinc também com e-mail e senha."
		},
		{
			property: "og:title",
			content: "Definir senha — PersonFinc"
		},
		{
			property: "og:description",
			content: "Defina uma senha após entrar com o Google."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./login-frxCSxFX.mjs");
var Route$24 = createFileRoute("/login")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Login & Cadastro — PersonFinc" },
		{
			name: "description",
			content: "Entre ou crie sua conta PersonFinc."
		},
		{
			property: "og:title",
			content: "Entrar no PersonFinc"
		},
		{
			property: "og:description",
			content: "Acesse suas finanças pessoais."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./recuperar-senha-3MkFUA77.mjs");
var Route$23 = createFileRoute("/recuperar-senha")({
	head: () => ({ meta: [{ title: "Recuperação de Senha — PersonFinc" }, {
		name: "description",
		content: "Recupere o acesso à sua conta PersonFinc."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./redefinir-senha-Cwvnf901.mjs");
var Route$22 = createFileRoute("/redefinir-senha")({
	head: () => ({ meta: [{ title: "Redefinir Senha — PersonFinc" }, {
		name: "description",
		content: "Defina uma nova senha para sua conta."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./senha-alterada-D-9obxnh.mjs");
var Route$21 = createFileRoute("/senha-alterada")({
	head: () => ({ meta: [{ title: "Senha alterada — PersonFinc" }, {
		name: "description",
		content: "Sua senha foi redefinida com sucesso."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("../_authenticated-Bts7zprh.mjs");
var Route$20 = createFileRoute("/_authenticated/")({
	head: () => ({ meta: [
		{ title: "PersonFinc — Gestor de Finanças Pessoais" },
		{
			name: "description",
			content: "Painel de finanças pessoais: saldo, transações recentes e metas."
		},
		{
			property: "og:title",
			content: "PersonFinc — Painel"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./admin-B5jSrpHm.mjs");
var Route$19 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [
		{ title: "Administração — PersonFinc" },
		{
			name: "description",
			content: "Gere e gerencie chaves de acesso das contas."
		},
		{
			property: "og:title",
			content: "Administração — PersonFinc"
		},
		{
			property: "og:description",
			content: "Chaves de acesso do PersonFinc."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./cartoes-Doi4Wg7c.mjs");
var Route$18 = createFileRoute("/_authenticated/cartoes")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./categorias-CTox3cUr.mjs");
var Route$17 = createFileRoute("/_authenticated/categorias")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./conexoes-C8BqH3vZ.mjs");
var Route$16 = createFileRoute("/_authenticated/conexoes")({
	head: () => ({ meta: [
		{ title: "Contas conectadas — PersonFinc" },
		{
			name: "description",
			content: "Conecte seus bancos pelo Open Finance e importe extrato e fatura do cartão."
		},
		{
			property: "og:title",
			content: "Contas conectadas — PersonFinc"
		},
		{
			property: "og:description",
			content: "Open Finance no PersonFinc: extrato e fatura direto do seu banco."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./fixas-DJyvbrJe.mjs");
var Route$15 = createFileRoute("/_authenticated/fixas")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./importar-DvGsSDva.mjs");
var Route$14 = createFileRoute("/_authenticated/importar")({
	head: () => ({ meta: [
		{ title: "Importar lançamentos — PersonFinc" },
		{
			name: "description",
			content: "Revise e categorize lançamentos importados via Open Finance."
		},
		{
			property: "og:title",
			content: "Importar lançamentos — PersonFinc"
		},
		{
			property: "og:description",
			content: "Revise e categorize lançamentos importados via Open Finance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./metas-Cvd2ZA0d.mjs");
var Route$13 = createFileRoute("/_authenticated/metas")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./perfil-DOusD8XD.mjs");
var Route$12 = createFileRoute("/_authenticated/perfil")({
	head: () => ({ meta: [
		{ title: "Perfil — PersonFinc" },
		{
			name: "description",
			content: "Gerencie sua conta e preferências."
		},
		{
			property: "og:title",
			content: "Perfil — PersonFinc"
		},
		{
			property: "og:description",
			content: "Sua conta e preferências no PersonFinc."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./transacoes-BKnkEruw.mjs");
var Route$11 = createFileRoute("/_authenticated/transacoes")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./auth.callback-9C5Xse1y.mjs");
var Route$10 = createFileRoute("/auth/callback")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Concluindo login — PersonFinc" },
		{
			name: "description",
			content: "Finalizando a autenticação da sua conta PersonFinc."
		},
		{
			property: "og:title",
			content: "Concluindo login — PersonFinc"
		},
		{
			property: "og:description",
			content: "Finalizando a autenticação da sua conta."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./cartoes.index-Ds7SYHBg.mjs");
var Route$9 = createFileRoute("/_authenticated/cartoes/")({
	head: () => ({ meta: [
		{ title: "Cartões — PersonFinc" },
		{
			name: "description",
			content: "Cadastre e gerencie seus cartões de crédito e débito no PersonFinc."
		},
		{
			property: "og:title",
			content: "Cartões — PersonFinc"
		},
		{
			property: "og:description",
			content: "Cadastre e gerencie seus cartões de crédito e débito no PersonFinc."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./cartoes.novo-CSe0l_f7.mjs");
var Route$8 = createFileRoute("/_authenticated/cartoes/novo")({
	head: () => ({ meta: [
		{ title: "Novo Cartão — PersonFinc" },
		{
			name: "description",
			content: "Cadastre um cartão de crédito ou débito."
		},
		{
			property: "og:title",
			content: "Novo Cartão — PersonFinc"
		},
		{
			property: "og:description",
			content: "Cadastre um cartão de crédito ou débito."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./categorias.index-BMCzBKux.mjs");
var Route$7 = createFileRoute("/_authenticated/categorias/")({
	head: () => ({ meta: [{ title: "Categorias — PersonFinc" }, {
		name: "description",
		content: "Gerencie categorias de receitas e despesas."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./categorias.nova-WgLfWC9Q.mjs");
var Route$6 = createFileRoute("/_authenticated/categorias/nova")({
	head: () => ({ meta: [{ title: "Nova Categoria — PersonFinc" }, {
		name: "description",
		content: "Crie uma nova categoria de receita ou despesa."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./fixas.index-B34_aj6F.mjs");
var Route$5 = createFileRoute("/_authenticated/fixas/")({
	head: () => ({ meta: [
		{ title: "Despesas Fixas — PersonFinc" },
		{
			name: "description",
			content: "Cadastre despesas fixas e lance em qualquer mês com um clique."
		},
		{
			property: "og:title",
			content: "Despesas Fixas — PersonFinc"
		},
		{
			property: "og:description",
			content: "Cadastre despesas fixas e lance em qualquer mês com um clique."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./fixas.nova-Q8u0_0m_.mjs");
var Route$4 = createFileRoute("/_authenticated/fixas/nova")({
	head: () => ({ meta: [
		{ title: "Nova Despesa Fixa — PersonFinc" },
		{
			name: "description",
			content: "Cadastre uma despesa fixa recorrente."
		},
		{
			property: "og:title",
			content: "Nova Despesa Fixa — PersonFinc"
		},
		{
			property: "og:description",
			content: "Cadastre uma despesa fixa recorrente."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./metas.index-IbXokdO3.mjs");
var Route$3 = createFileRoute("/_authenticated/metas/")({
	head: () => ({ meta: [{ title: "Minhas Metas — PersonFinc" }, {
		name: "description",
		content: "Acompanhe suas metas financeiras."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./metas.nova-BqRMigM7.mjs");
var Route$2 = createFileRoute("/_authenticated/metas/nova")({
	head: () => ({ meta: [{ title: "Nova Meta — PersonFinc" }, {
		name: "description",
		content: "Crie uma nova meta financeira."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./transacoes.index-ldvboIxF.mjs");
var Route$1 = createFileRoute("/_authenticated/transacoes/")({
	head: () => ({ meta: [
		{ title: "Transações — PersonFinc" },
		{
			name: "description",
			content: "Lista completa de receitas e despesas."
		},
		{
			property: "og:title",
			content: "Transações — PersonFinc"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./transacoes.novo-BsNjqSFA.mjs");
var Route = createFileRoute("/_authenticated/transacoes/novo")({
	head: () => ({ meta: [{ title: "Novo Lançamento — PersonFinc" }, {
		name: "description",
		content: "Adicione uma nova receita ou despesa."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthenticatedRouteRoute = Route$26.update({
	id: "/_authenticated",
	getParentRoute: () => Route$27
});
var DefinirSenhaRoute = Route$25.update({
	id: "/definir-senha",
	path: "/definir-senha",
	getParentRoute: () => Route$27
});
var LoginRoute = Route$24.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$27
});
var RecuperarSenhaRoute = Route$23.update({
	id: "/recuperar-senha",
	path: "/recuperar-senha",
	getParentRoute: () => Route$27
});
var RedefinirSenhaRoute = Route$22.update({
	id: "/redefinir-senha",
	path: "/redefinir-senha",
	getParentRoute: () => Route$27
});
var SenhaAlteradaRoute = Route$21.update({
	id: "/senha-alterada",
	path: "/senha-alterada",
	getParentRoute: () => Route$27
});
var AuthenticatedIndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$19.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCartoesRoute = Route$18.update({
	id: "/cartoes",
	path: "/cartoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCategoriasRoute = Route$17.update({
	id: "/categorias",
	path: "/categorias",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedConexoesRoute = Route$16.update({
	id: "/conexoes",
	path: "/conexoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFixasRoute = Route$15.update({
	id: "/fixas",
	path: "/fixas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedImportarRoute = Route$14.update({
	id: "/importar",
	path: "/importar",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMetasRoute = Route$13.update({
	id: "/metas",
	path: "/metas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPerfilRoute = Route$12.update({
	id: "/perfil",
	path: "/perfil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTransacoesRoute = Route$11.update({
	id: "/transacoes",
	path: "/transacoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthCallbackRoute = Route$10.update({
	id: "/auth/callback",
	path: "/auth/callback",
	getParentRoute: () => Route$27
});
var AuthenticatedCartoesIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedCartoesRoute
});
var AuthenticatedCartoesNovoRoute = Route$8.update({
	id: "/novo",
	path: "/novo",
	getParentRoute: () => AuthenticatedCartoesRoute
});
var AuthenticatedCategoriasIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedCategoriasRoute
});
var AuthenticatedCategoriasNovaRoute = Route$6.update({
	id: "/nova",
	path: "/nova",
	getParentRoute: () => AuthenticatedCategoriasRoute
});
var AuthenticatedFixasIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedFixasRoute
});
var AuthenticatedFixasNovaRoute = Route$4.update({
	id: "/nova",
	path: "/nova",
	getParentRoute: () => AuthenticatedFixasRoute
});
var AuthenticatedMetasIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedMetasRoute
});
var AuthenticatedMetasNovaRoute = Route$2.update({
	id: "/nova",
	path: "/nova",
	getParentRoute: () => AuthenticatedMetasRoute
});
var AuthenticatedTransacoesIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedTransacoesRoute
});
var AuthenticatedTransacoesNovoRoute = Route.update({
	id: "/novo",
	path: "/novo",
	getParentRoute: () => AuthenticatedTransacoesRoute
});
var AuthenticatedCartoesIdEditarRoute = Route$28.update({
	id: "/$id/editar",
	path: "/$id/editar",
	getParentRoute: () => AuthenticatedCartoesRoute
});
var AuthenticatedCategoriasIdEditarRoute = Route$29.update({
	id: "/$id/editar",
	path: "/$id/editar",
	getParentRoute: () => AuthenticatedCategoriasRoute
});
var AuthenticatedFixasIdEditarRoute = Route$30.update({
	id: "/$id/editar",
	path: "/$id/editar",
	getParentRoute: () => AuthenticatedFixasRoute
});
var AuthenticatedMetasIdEditarRoute = Route$31.update({
	id: "/$id/editar",
	path: "/$id/editar",
	getParentRoute: () => AuthenticatedMetasRoute
});
var AuthenticatedTransacoesIdEditarRoute = Route$32.update({
	id: "/$id/editar",
	path: "/$id/editar",
	getParentRoute: () => AuthenticatedTransacoesRoute
});
var AuthenticatedCartoesRouteChildren = {
	AuthenticatedCartoesNovoRoute,
	AuthenticatedCartoesIndexRoute,
	AuthenticatedCartoesIdEditarRoute
};
var AuthenticatedCartoesRouteWithChildren = AuthenticatedCartoesRoute._addFileChildren(AuthenticatedCartoesRouteChildren);
var AuthenticatedCategoriasRouteChildren = {
	AuthenticatedCategoriasNovaRoute,
	AuthenticatedCategoriasIndexRoute,
	AuthenticatedCategoriasIdEditarRoute
};
var AuthenticatedCategoriasRouteWithChildren = AuthenticatedCategoriasRoute._addFileChildren(AuthenticatedCategoriasRouteChildren);
var AuthenticatedFixasRouteChildren = {
	AuthenticatedFixasNovaRoute,
	AuthenticatedFixasIndexRoute,
	AuthenticatedFixasIdEditarRoute
};
var AuthenticatedFixasRouteWithChildren = AuthenticatedFixasRoute._addFileChildren(AuthenticatedFixasRouteChildren);
var AuthenticatedMetasRouteChildren = {
	AuthenticatedMetasNovaRoute,
	AuthenticatedMetasIndexRoute,
	AuthenticatedMetasIdEditarRoute
};
var AuthenticatedMetasRouteWithChildren = AuthenticatedMetasRoute._addFileChildren(AuthenticatedMetasRouteChildren);
var AuthenticatedTransacoesRouteChildren = {
	AuthenticatedTransacoesNovoRoute,
	AuthenticatedTransacoesIndexRoute,
	AuthenticatedTransacoesIdEditarRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedCartoesRoute: AuthenticatedCartoesRouteWithChildren,
	AuthenticatedCategoriasRoute: AuthenticatedCategoriasRouteWithChildren,
	AuthenticatedConexoesRoute,
	AuthenticatedFixasRoute: AuthenticatedFixasRouteWithChildren,
	AuthenticatedImportarRoute,
	AuthenticatedMetasRoute: AuthenticatedMetasRouteWithChildren,
	AuthenticatedPerfilRoute,
	AuthenticatedTransacoesRoute: AuthenticatedTransacoesRoute._addFileChildren(AuthenticatedTransacoesRouteChildren),
	AuthenticatedIndexRoute
};
var rootRouteChildren = {
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	DefinirSenhaRoute,
	LoginRoute,
	RecuperarSenhaRoute,
	RedefinirSenhaRoute,
	SenhaAlteradaRoute,
	AuthCallbackRoute
};
var routeTree = Route$27._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
