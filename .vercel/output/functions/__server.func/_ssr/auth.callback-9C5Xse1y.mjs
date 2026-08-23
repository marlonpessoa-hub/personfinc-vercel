import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as AuthShell } from "./app-shell-zcgA_t_N.mjs";
import { t as APP_SCHEME } from "./native-auth-BbLFzfeM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-9C5Xse1y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallback() {
	const navigate = useNavigate();
	const [message, setMessage] = (0, import_react.useState)("Concluindo login…");
	(0, import_react.useEffect)(() => {
		const { search, hash } = window.location;
		const params = new URLSearchParams(search);
		if (params.get("native") === "1") {
			params.delete("native");
			const query = params.toString();
			setMessage("Voltando para o aplicativo…");
			window.location.replace(`${APP_SCHEME}://auth/callback${query ? `?${query}` : ""}${hash}`);
			return;
		}
		const errorDescription = params.get("error_description") ?? params.get("error");
		if (errorDescription) {
			setMessage(`Não foi possível concluir o login: ${errorDescription}`);
			const timer = setTimeout(() => navigate({ to: "/login" }), 2500);
			return () => clearTimeout(timer);
		}
		let done = false;
		const finish = (to) => {
			if (done) return;
			done = true;
			navigate({ to });
		};
		const { data } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) finish("/");
		});
		(async () => {
			for (let i = 0; i < 20 && !done; i++) {
				const { data: sessionData } = await supabase.auth.getSession();
				if (sessionData.session) {
					finish("/");
					return;
				}
				await new Promise((r) => setTimeout(r, 250));
			}
			setMessage("Sessão não encontrada. Tente entrar novamente.");
			finish("/login");
		})();
		return () => data.subscription.unsubscribe();
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-center font-body-lg text-body-lg text-on-surface-variant",
		children: message
	}) });
}
//#endregion
export { AuthCallback as component };
