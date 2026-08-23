//#region node_modules/.nitro/vite/services/ssr/assets/password-setup-Cf9AFU7C.js
/**
* Contas criadas por login social (Google) não têm senha própria.
* Retorna true quando o usuário ainda precisa definir uma senha no app.
*/
function needsPasswordSetup(user) {
	if (!user) return false;
	if (user.user_metadata?.["password_set"] === true) return false;
	const identities = user.identities ?? [];
	if (identities.length === 0) return false;
	if (identities.some((i) => i.provider === "email")) return false;
	return identities.some((i) => i.provider !== "email");
}
//#endregion
export { needsPasswordSetup as t };
