/** Helpers server-only para a API do Pluggy (Open Finance). */

const BASE = "https://api.pluggy.ai";

export type PluggyAccount = {
  id: string;
  type: string;
  subtype?: string;
  name: string;
  number?: string;
  balance?: number;
  creditData?: { creditLimit?: number; balanceDueDate?: string } | null;
};

export type PluggyTransaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  type?: string;
};

export function pluggyCredentials() {
  const clientId = process.env["PLUGGY_CLIENT_ID"];
  const clientSecret = process.env["PLUGGY_CLIENT_SECRET"];
  if (!clientId || !clientSecret) {
    throw new Error(
      "Credenciais do Pluggy não configuradas. Adicione PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET.",
    );
  }
  return { clientId, clientSecret };
}

export async function pluggyApiKey() {
  const { clientId, clientSecret } = pluggyCredentials();
  const res = await fetch(`${BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao autenticar no Pluggy [${res.status}]: ${await res.text()}`);
  }
  const json = (await res.json()) as { apiKey: string };
  return json.apiKey;
}

export async function pluggyFetch<T>(
  apiKey: string,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
  });
  if (!res.ok) {
    throw new Error(`Pluggy ${path} falhou [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/** Sugere a categoria mais parecida com a descrição do lançamento. */
export function suggestCategory(
  description: string,
  amount: number,
  categories: { id: string; name: string; kind: string }[],
) {
  const desc = description.toLowerCase();
  const kind = amount > 0 ? "receita" : "despesa";
  const pool = categories.filter((c) => c.kind === kind);
  const hit = pool.find((c) => {
    const name = c.name.toLowerCase();
    return desc.includes(name) || name.split(/\s+/).some((w) => w.length > 3 && desc.includes(w));
  });
  return hit?.id ?? null;
}
