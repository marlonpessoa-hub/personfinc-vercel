import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, n as useQueryClient, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as useStore } from "./store-DhZ7fAxm.mjs";
import { a as ThemeToggleRow, o as useI18n, t as LANGUAGES } from "./i18n-Dav9cMeD.mjs";
import { a as googleAvatarFrom, i as fileToAvatarDataUrl, n as AppShell, t as ActivationCard } from "./app-shell-zcgA_t_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-DOusD8XD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Linha de perfil que abre a lista de idiomas disponíveis. */
function LanguageRow() {
	const { lang, setLang, t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b last:border-b-0 border-outline-variant/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "w-full flex items-center gap-md p-md hover:bg-surface-container-low text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined",
						children: "language"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 font-body-lg text-body-lg text-primary",
					children: t("profile.language")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-body-sm text-body-sm text-on-surface-variant",
					children: [
						current.flag,
						" ",
						current.label
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined text-on-surface-variant",
					children: open ? "expand_less" : "chevron_right"
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "pb-sm",
			children: LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setLang(l.code);
					setOpen(false);
				},
				className: "w-full flex items-center gap-md pl-[72px] pr-md py-3 hover:bg-surface-container-low text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex-1 font-body-md text-body-md text-primary",
					children: [
						l.flag,
						" ",
						l.label
					]
				}), l.code === lang && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined text-secondary",
					children: "check"
				})]
			}) }, l.code))
		})]
	});
}
function Perfil() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [avatar, setAvatar] = (0, import_react.useState)(null);
	const [googleAvatar, setGoogleAvatar] = (0, import_react.useState)(null);
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draftName, setDraftName] = (0, import_react.useState)("");
	const [draftAvatar, setDraftAvatar] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [titheEnabled, setTitheEnabled] = (0, import_react.useState)(true);
	const pickRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const { isAdmin } = useStore();
	const { t } = useI18n();
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!data.user) return;
			setUserId(data.user.id);
			setEmail(data.user.email ?? "");
			const social = googleAvatarFrom(data.user.user_metadata);
			setGoogleAvatar(social);
			const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url, tithe_enabled").eq("id", data.user.id).maybeSingle();
			setName(profile?.full_name ?? data.user.user_metadata?.full_name ?? "Minha conta");
			setAvatar(profile?.avatar_url ?? social);
			setTitheEnabled(profile?.tithe_enabled ?? true);
		})();
	}, []);
	function startEdit() {
		setDraftName(name);
		setDraftAvatar(avatar);
		setEditing(true);
	}
	async function handleFile(file) {
		if (!file) return;
		try {
			setDraftAvatar(await fileToAvatarDataUrl(file));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível usar essa imagem");
		}
	}
	async function saveProfile() {
		if (!userId) return;
		setSaving(true);
		try {
			const { error } = await supabase.from("profiles").update({
				full_name: draftName.trim() || null,
				avatar_url: draftAvatar
			}).eq("id", userId);
			if (error) throw error;
			setName(draftName.trim() || "Minha conta");
			setAvatar(draftAvatar);
			setEditing(false);
			toast.success("Perfil atualizado");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível salvar o perfil");
		} finally {
			setSaving(false);
		}
	}
	async function handleSignOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		toast.success("Sessão encerrada");
		navigate({
			to: "/login",
			replace: true
		});
	}
	const shown = editing ? draftAvatar : avatar;
	async function toggleTithe() {
		if (!userId) return;
		const next = !titheEnabled;
		const { error } = await supabase.from("profiles").update({ tithe_enabled: next }).eq("id", userId);
		if (error) {
			toast.error("Não foi possível alterar o dízimo");
			return;
		}
		setTitheEnabled(next);
		toast.success(next ? "Dízimo ativado" : "Dízimo desativado");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Perfil",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mx-auto space-y-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl p-lg border border-outline-variant card-shadow space-y-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center text-center gap-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: startEdit,
								className: "absolute top-0 right-0 p-2 rounded-full text-primary hover:bg-surface-container-low",
								"aria-label": "Editar perfil",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined",
									children: "edit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-24 h-24 rounded-full overflow-hidden bg-primary-container text-on-primary flex items-center justify-center shrink-0",
								children: shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: shown,
									alt: "Foto de perfil",
									className: "w-full h-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined !text-[40px]",
									children: "person"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full",
								children: [editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draftName,
									onChange: (e) => setDraftName(e.target.value),
									placeholder: "Seu nome",
									className: "w-full h-11 px-md rounded-xl border border-outline-variant bg-surface font-body-lg text-body-lg text-primary text-center"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-headline-md text-headline-md text-primary break-words",
									children: name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									title: email,
									className: "font-body-sm text-body-sm text-on-surface-variant break-words mt-0.5",
									children: email
								})]
							})
						]
					}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: pickRef,
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => void handleFile(e.target.files?.[0])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: cameraRef,
								type: "file",
								accept: "image/*",
								capture: "user",
								className: "hidden",
								onChange: (e) => void handleFile(e.target.files?.[0])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => pickRef.current?.click(),
										className: "h-10 px-md rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px] align-middle mr-xs",
											children: "image"
										}), "Escolher foto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => cameraRef.current?.click(),
										className: "h-10 px-md rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low md:hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px] align-middle mr-xs",
											children: "photo_camera"
										}), "Tirar foto"]
									}),
									googleAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setDraftAvatar(googleAvatar),
										className: "h-10 px-md rounded-full border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "material-symbols-outlined !text-[18px] align-middle mr-xs",
											children: "account_circle"
										}), "Usar foto do Google"]
									}),
									draftAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setDraftAvatar(null),
										className: "h-10 px-md rounded-full border border-error text-error font-label-md text-label-md hover:bg-error-container",
										children: "Remover foto"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void saveProfile(),
									disabled: saving,
									className: "flex-1 h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md disabled:opacity-60",
									children: saving ? "Salvando..." : "Salvar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditing(false),
									className: "flex-1 h-11 rounded-full border border-outline text-primary font-label-md text-label-md",
									children: "Cancelar"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivationCard, {}),
				isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "flex items-center gap-md p-md rounded-xl bg-surface-container-lowest border border-outline-variant card-shadow hover:bg-surface-container-low",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "material-symbols-outlined",
								children: "key"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 font-body-lg text-body-lg text-primary",
							children: t("profile.adminKeys")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "material-symbols-outlined text-on-surface-variant",
							children: "chevron_right"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/categorias",
							className: "flex items-center gap-md p-md border-b border-outline-variant/60 hover:bg-surface-container-low",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined",
										children: "category"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 font-body-lg text-body-lg text-primary",
									children: t("profile.categories")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "material-symbols-outlined text-on-surface-variant",
									children: "chevron_right"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileItem, {
							icon: "notifications",
							label: t("profile.notifications")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggleRow, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageRow, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileItem, {
							icon: "security",
							label: t("profile.security")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-md p-md border-b last:border-b-0 border-outline-variant/60 hover:bg-surface-container-low",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "material-symbols-outlined",
										children: "church"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 font-body-lg text-body-lg text-primary",
									children: t("profile.tithe")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void toggleTithe(),
									className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${titheEnabled ? "bg-secondary" : "bg-surface-variant"}`,
									"aria-label": titheEnabled ? "Desativar dízimo" : "Ativar dízimo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-on-secondary transition-transform ${titheEnabled ? "translate-x-6" : "translate-x-1"}` })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileItem, {
							icon: "download",
							label: t("profile.export")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileItem, {
							icon: "help",
							label: t("profile.help")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleSignOut,
					className: "w-full py-3 rounded-full border border-error text-error font-label-md text-label-md hover:bg-error-container",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "material-symbols-outlined !text-[18px] align-middle mr-sm",
						children: "logout"
					}), t("profile.signOut")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center font-body-sm text-body-sm text-on-surface-variant",
					children: "PersonFinc v1.0"
				})
			]
		})
	});
}
function ProfileItem({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "w-full flex items-center gap-md p-md border-b last:border-b-0 border-outline-variant/60 hover:bg-surface-container-low text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "material-symbols-outlined",
					children: icon
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 font-body-lg text-body-lg text-primary",
				children: label
			}),
			value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-body-sm text-body-sm text-on-surface-variant",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "material-symbols-outlined text-on-surface-variant",
				children: "chevron_right"
			})
		]
	});
}
//#endregion
export { Perfil as component };
