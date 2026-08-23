import { t as supabase } from "./client-B6yKsI_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/native-auth-BbLFzfeM.js
/** URL publicada carregada pelo app Android (mesma de capacitor.config.ts). */
var PUBLISHED_URL = "https://personfinc.lovable.app";
/** Esquema de deep link usado para voltar do navegador do sistema para o app. */
var APP_SCHEME = "com.personfinc.app";
function isNativeApp() {
	if (typeof window === "undefined") return false;
	const cap = window.Capacitor;
	return Boolean(cap?.isNativePlatform?.());
}
/**
* Login com Google no app Android usando o navegador do sistema (Chrome / Custom Tab).
* O Google bloqueia login dentro de WebView embutida, por isso o fluxo sai do app,
* autentica no navegador do telefone e volta via deep link.
*/
async function signInWithGoogleNative() {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${PUBLISHED_URL}/auth/callback?native=1`,
			skipBrowserRedirect: true
		}
	});
	if (error) throw error;
	if (!data.url) throw new Error("Não foi possível iniciar o login com o Google.");
	await openExternal(data.url);
}
/**
* Abre a URL no navegador do sistema. Se o plugin nativo Browser não estiver
* disponível (projeto Android não sincronizado: "Browser plugin is not
* implemented on android"), cai para window.open/location como alternativa.
*/
async function openExternal(url) {
	try {
		const { Browser } = await import("../_libs/capacitor__browser.mjs").then((n) => n.t);
		await Browser.open({
			url,
			windowName: "_system"
		});
		return;
	} catch {}
	if (!(typeof window !== "undefined" ? window.open(url, "_system") : null) && typeof window !== "undefined") window.location.href = url;
}
async function closeExternal() {
	try {
		const { Browser } = await import("../_libs/capacitor__browser.mjs").then((n) => n.t);
		await Browser.close();
	} catch {}
}
/** Processa a volta do navegador do sistema (deep link com code ou tokens). */
async function handleNativeAuthUrl(rawUrl) {
	const url = new URL(rawUrl.replace(`${APP_SCHEME}://`, "https://personfinc.app/"));
	const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
	const code = url.searchParams.get("code");
	const accessToken = hash.get("access_token");
	const refreshToken = hash.get("refresh_token");
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) throw error;
		return true;
	}
	if (accessToken && refreshToken) {
		const { error } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});
		if (error) throw error;
		return true;
	}
	return false;
}
/** Escuta os deep links de retorno do login. Retorna uma função de limpeza. */
function listenNativeAuthRedirect(onSession) {
	if (!isNativeApp()) return () => {};
	let cleanup = () => {};
	let cancelled = false;
	(async () => {
		let App;
		try {
			({App} = await import("../_libs/capacitor__app+capacitor__core.mjs").then((n) => n.t));
		} catch {
			return;
		}
		const handle = await App.addListener("appUrlOpen", async ({ url }) => {
			if (!url.includes("auth/callback")) return;
			try {
				const ok = await handleNativeAuthUrl(url);
				await closeExternal();
				if (ok) onSession();
			} catch {
				await closeExternal();
			}
		});
		if (cancelled) {
			await handle.remove();
			return;
		}
		cleanup = () => void handle.remove();
	})();
	return () => {
		cancelled = true;
		cleanup();
	};
}
//#endregion
export { signInWithGoogleNative as i, isNativeApp as n, listenNativeAuthRedirect as r, APP_SCHEME as t };
