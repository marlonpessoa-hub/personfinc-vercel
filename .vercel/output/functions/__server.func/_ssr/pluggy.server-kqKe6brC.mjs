//#region node_modules/.nitro/vite/services/ssr/assets/pluggy.server-kqKe6brC.js
/** Helpers server-only para a API do Pluggy (Open Finance). */
var BASE = "https://api.pluggy.ai";
function pluggyCredentials() {
	const clientId = process.env["PLUGGY_CLIENT_ID"];
	const clientSecret = process.env["PLUGGY_CLIENT_SECRET"];
	if (!clientId || !clientSecret) throw new Error("Credenciais do Pluggy não configuradas. Adicione PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET.");
	return {
		clientId,
		clientSecret
	};
}
async function pluggyApiKey() {
	const { clientId, clientSecret } = pluggyCredentials();
	const res = await fetch(`${BASE}/auth`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			clientId,
			clientSecret
		})
	});
	if (!res.ok) throw new Error(`Falha ao autenticar no Pluggy [${res.status}]: ${await res.text()}`);
	return (await res.json()).apiKey;
}
async function pluggyFetch(apiKey, path, init) {
	const res = await fetch(`${BASE}${path}`, {
		method: init?.method ?? "GET",
		headers: {
			"X-API-KEY": apiKey,
			"Content-Type": "application/json"
		},
		...init?.body ? { body: JSON.stringify(init.body) } : {}
	});
	if (!res.ok) throw new Error(`Pluggy ${path} falhou [${res.status}]: ${await res.text()}`);
	return await res.json();
}
/** Sugere a categoria mais parecida com a descrição do lançamento. */
function suggestCategory(description, amount, categories) {
	const desc = description.toLowerCase();
	const kind = amount > 0 ? "receita" : "despesa";
	return categories.filter((c) => c.kind === kind).find((c) => {
		const name = c.name.toLowerCase();
		return desc.includes(name) || name.split(/\s+/).some((w) => w.length > 3 && desc.includes(w));
	})?.id ?? null;
}
//#endregion
export { pluggyApiKey, pluggyFetch, suggestCategory };
