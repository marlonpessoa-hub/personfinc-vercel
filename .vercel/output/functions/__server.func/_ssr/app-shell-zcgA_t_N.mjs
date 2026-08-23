import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { i as ThemeToggleButton, o as useI18n } from "./i18n-Dav9cMeD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-zcgA_t_N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(iso) {
	return new Date(iso).toLocaleDateString("pt-BR");
}
function ReadOnlyBanner() {
	const { canWrite, loading } = useStore();
	if (loading || canWrite) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-md rounded-xl border border-error/40 bg-error-container text-on-error-container p-md flex items-start gap-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "material-symbols-outlined !text-[20px]",
			children: "lock"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-body-sm text-body-sm",
			children: [
				"Modo somente leitura — insira sua chave de ativação no ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Perfil" }),
				" para criar, editar ou excluir lançamentos."
			]
		})]
	});
}
function ActivationCard() {
	const { canWrite, accessExpiresAt, redeemKey } = useStore();
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(e) {
		e.preventDefault();
		if (!code.trim()) return;
		setBusy(true);
		try {
			const expires = await redeemKey(code.trim());
			toast.success(`Acesso liberado até ${formatDate(expires)}`);
			setCode("");
		} catch {} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow space-y-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined text-primary",
					children: "key"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-headline-md text-headline-md text-primary",
					children: "Chave de acesso"
				})]
			}),
			canWrite && accessExpiresAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-body-sm text-body-sm text-on-surface-variant",
				children: [
					"Acesso ativo até ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatDate(accessExpiresAt) }),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-body-sm text-body-sm text-on-surface-variant",
				children: "Sua conta está em modo somente leitura. Informe a chave enviada pelo administrador para liberar a edição."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "flex flex-col sm:flex-row gap-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: code,
					onChange: (e) => setCode(e.target.value.toUpperCase()),
					placeholder: "PFIN-XXXX-XXXX-XXXX",
					className: "flex-1 h-12 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: "h-12 px-lg rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60",
					children: busy ? "Validando..." : canWrite ? "Estender acesso" : "Ativar"
				})]
			})
		]
	});
}
/** Utilidades de foto de perfil (avatar). */
/** Foto vinda do provedor social (Google), quando houver. */
function googleAvatarFrom(meta) {
	if (!meta) return null;
	const url = meta.avatar_url ?? meta.picture;
	return typeof url === "string" && url.startsWith("http") ? url : null;
}
/**
* Redimensiona e comprime a imagem escolhida em um data URL quadrado,
* pequeno o bastante para ser salvo direto no perfil.
*/
function fileToAvatarDataUrl(file, size = 256) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Não foi possível ler a imagem."));
		reader.onload = () => {
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Arquivo de imagem inválido."));
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");
				if (!ctx) return reject(/* @__PURE__ */ new Error("Não foi possível processar a imagem."));
				const side = Math.min(img.width, img.height);
				ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
				resolve(canvas.toDataURL("image/jpeg", .82));
			};
			img.src = String(reader.result);
		};
		reader.readAsDataURL(file);
	});
}
var logo_png_asset_default = {
	version: 1,
	asset_id: "5d42a39e-e9ea-4190-a01b-658acbe4b012",
	project_id: "1ff05e66-474b-44ce-bbe4-5e115be7b50f",
	url: "/__l5e/assets-v1/5d42a39e-e9ea-4190-a01b-658acbe4b012/logo.png",
	r2_key: "a/v1/1ff05e66-474b-44ce-bbe4-5e115be7b50f/5d42a39e-e9ea-4190-a01b-658acbe4b012/logo.png",
	original_filename: "logo.png",
	size: 742033,
	content_type: "image/png",
	created_at: "2026-08-21T21:50:11Z"
};
function useAvatar() {
	const [avatar, setAvatar] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!data.user) return;
			const { data: profile } = await supabase.from("profiles").select("avatar_url").eq("id", data.user.id).maybeSingle();
			setAvatar(profile?.avatar_url ?? googleAvatarFrom(data.user.user_metadata));
		})();
	}, []);
	return avatar;
}
var NAV = [
	{
		to: "/",
		labelKey: "nav.home",
		icon: "home"
	},
	{
		to: "/transacoes",
		labelKey: "nav.transactions",
		icon: "swap_vert"
	},
	{
		to: "/fixas",
		labelKey: "nav.fixed",
		icon: "event_repeat"
	},
	{
		to: "/cartoes",
		labelKey: "nav.cards",
		icon: "credit_card"
	},
	{
		to: "/metas",
		labelKey: "nav.goals",
		icon: "track_changes"
	},
	{
		to: "/perfil",
		labelKey: "nav.profile",
		icon: "person"
	}
];
function AppShell({ title, children, action }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (to) => to === "/" ? pathname === "/" : pathname.startsWith(to);
	const avatar = useAvatar();
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-on-background pb-24 md:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "hidden md:flex sticky top-0 z-40 w-full bg-surface border-b border-outline-variant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-margin-desktop py-sm w-full max-w-[1280px] mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo_png_asset_default.url,
								alt: "PersonFinc Logo",
								className: "w-10 h-10 object-contain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-headline-md text-headline-md font-bold text-primary",
								children: "PersonFinc"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex gap-sm items-center",
							children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								className: "font-label-md text-label-md px-4 py-2 rounded-full transition-all " + (isActive(n.to) ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"),
								children: t(n.labelKey)
							}, n.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggleButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/perfil",
								className: "w-10 h-10 rounded-full overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center",
								"aria-label": "Perfil",
								children: avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatar,
									alt: "Foto de perfil",
									className: "w-full h-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "person"
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "md:hidden sticky top-0 z-40 bg-surface border-b border-outline-variant safe-top",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-margin-mobile py-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_png_asset_default.url,
							alt: "PersonFinc Logo",
							className: "w-8 h-8 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-headline-md text-headline-md font-bold text-primary",
							children: title ?? "PersonFinc"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-xs",
						children: [
							action,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggleButton, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/perfil",
								className: "p-2 rounded-full text-primary hover:bg-surface-container-low",
								"aria-label": "Perfil",
								children: avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatar,
									alt: "Foto de perfil",
									className: "w-7 h-7 rounded-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "person"
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBanner, {}), children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-outline-variant safe-bottom",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-6",
					children: NAV.map((n) => {
						const active = isActive(n.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: "flex flex-col items-center justify-center gap-[2px] py-2 text-[11px] font-semibold transition-colors " + (active ? "text-primary" : "text-on-surface-variant"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined !text-[22px] " + (active ? "text-primary" : "text-on-surface-variant"),
								children: n.icon
							}), t(n.labelKey)]
						}) }, n.to);
					})
				})
			})
		]
	});
}
function AuthShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 bg-surface z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-margin-mobile h-14 max-w-[1280px] mx-auto w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_png_asset_default.url,
							alt: "PersonFinc Logo",
							className: "w-8 h-8 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-headline-md text-headline-md font-bold text-primary",
							children: "PersonFinc"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggleButton, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-grow flex items-center justify-center px-margin-mobile py-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-[480px]",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "w-full mt-auto border-t border-outline-variant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row justify-between items-center gap-sm px-margin-mobile py-lg max-w-[1280px] mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-body-sm text-body-sm text-on-surface-variant",
						children: "© 2026 PersonFinc. Todos os direitos reservados."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex gap-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "font-body-sm text-body-sm text-on-surface-variant hover:text-primary",
								href: "#",
								children: "Termos de Uso"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "font-body-sm text-body-sm text-on-surface-variant hover:text-primary",
								href: "#",
								children: "Privacidade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "font-body-sm text-body-sm text-on-surface-variant hover:text-primary",
								href: "#",
								children: "Suporte"
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { googleAvatarFrom as a, fileToAvatarDataUrl as i, AppShell as n, logo_png_asset_default as o, AuthShell as r, ActivationCard as t };
