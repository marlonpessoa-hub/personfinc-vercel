import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Gera o token usado pelo widget Pluggy Connect. */
export const createPluggyConnectToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ itemId: z.string().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { pluggyApiKey, pluggyFetch } = await import("./pluggy.server");
    const apiKey = await pluggyApiKey();
    const res = await pluggyFetch<{ accessToken: string }>(apiKey, "/connect_token", {
      method: "POST",
      body: data.itemId ? { itemId: data.itemId } : {},
    });
    return { connectToken: res.accessToken };
  });

/** Salva o item conectado e suas contas/cartões. */
export const savePluggyItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ itemId: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { pluggyApiKey, pluggyFetch } = await import("./pluggy.server");
    const apiKey = await pluggyApiKey();

    const item = await pluggyFetch<{
      id: string;
      status: string;
      connector?: { name?: string; imageUrl?: string };
    }>(apiKey, `/items/${data.itemId}`);

    const { data: conn, error: connErr } = await context.supabase
      .from("bank_connections")
      .upsert(
        {
          user_id: context.userId,
          pluggy_item_id: item.id,
          institution_name: item.connector?.name ?? "Banco",
          institution_image_url: item.connector?.imageUrl ?? null,
          status: item.status ?? "UPDATED",
        },
        { onConflict: "user_id,pluggy_item_id" },
      )
      .select("id")
      .single();
    if (connErr) throw new Error(connErr.message);

    const accounts = await pluggyFetch<{ results: import("./pluggy.server").PluggyAccount[] }>(
      apiKey,
      `/accounts?itemId=${item.id}`,
    );

    if (accounts.results.length > 0) {
      const rows = accounts.results.map((a) => ({
        user_id: context.userId,
        connection_id: conn.id,
        pluggy_account_id: a.id,
        name: a.name ?? "Conta",
        type: a.type ?? "BANK",
        number: a.number ?? null,
        balance: a.balance ?? 0,
        credit_limit: a.creditData?.creditLimit ?? null,
        due_day: a.creditData?.balanceDueDate
          ? Number(a.creditData.balanceDueDate.slice(8, 10))
          : null,
      }));
      const { error } = await context.supabase
        .from("bank_accounts")
        .upsert(rows, { onConflict: "user_id,pluggy_account_id" });
      if (error) throw new Error(error.message);
    }

    return { connectionId: conn.id, accounts: accounts.results.length };
  });

/** Busca extrato e faturas e coloca os itens na fila de revisão. */
export const syncPluggyConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ connectionId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { pluggyApiKey, pluggyFetch, suggestCategory } = await import("./pluggy.server");
    const apiKey = await pluggyApiKey();

    const { data: conn, error: connErr } = await context.supabase
      .from("bank_connections")
      .select("id, pluggy_item_id, last_synced_at")
      .eq("id", data.connectionId)
      .single();
    if (connErr || !conn) throw new Error("Conexão não encontrada");

    const { data: accounts, error: accErr } = await context.supabase
      .from("bank_accounts")
      .select("id, pluggy_account_id, type")
      .eq("connection_id", conn.id);
    if (accErr) throw new Error(accErr.message);

    const { data: categories } = await context.supabase
      .from("categories")
      .select("id, name, kind");

    const from = conn.last_synced_at
      ? new Date(conn.last_synced_at).toISOString().slice(0, 10)
      : new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);

    let inserted = 0;
    for (const acc of accounts ?? []) {
      const txs = await pluggyFetch<{ results: import("./pluggy.server").PluggyTransaction[] }>(
        apiKey,
        `/transactions?accountId=${acc.pluggy_account_id}&from=${from}&pageSize=500`,
      );
      if (txs.results.length === 0) continue;

      const rows = txs.results.map((t) => ({
        user_id: context.userId,
        connection_id: conn.id,
        account_id: acc.id,
        pluggy_transaction_id: t.id,
        description: t.description ?? "Lançamento",
        amount: t.amount ?? 0,
        date: (t.date ?? new Date().toISOString()).slice(0, 10),
        kind: acc.type === "CREDIT" ? "fatura" : "extrato",
        suggested_category_id: suggestCategory(
          t.description ?? "",
          t.amount ?? 0,
          (categories ?? []) as { id: string; name: string; kind: string }[],
        ),
        status: "pendente",
      }));

      const { data: ins, error } = await context.supabase
        .from("staged_transactions")
        .upsert(rows, { onConflict: "user_id,pluggy_transaction_id", ignoreDuplicates: true })
        .select("id");
      if (error) throw new Error(error.message);
      inserted += ins?.length ?? 0;
    }

    await context.supabase
      .from("bank_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", conn.id);

    return { inserted };
  });

/** Converte itens revisados em lançamentos do app. */
export const importStagedTransactions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        items: z
          .array(z.object({ id: z.string().uuid(), categoryId: z.string().uuid().nullable() }))
          .min(1),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const ids = data.items.map((i) => i.id);
    const { data: staged, error } = await context.supabase
      .from("staged_transactions")
      .select("id, description, amount, date, pluggy_transaction_id, status")
      .in("id", ids)
      .eq("status", "pendente");
    if (error) throw new Error(error.message);

    let imported = 0;
    for (const s of staged ?? []) {
      const categoryId = data.items.find((i) => i.id === s.id)?.categoryId ?? null;
      const amount = Number(s.amount);
      const { data: tx, error: txErr } = await context.supabase
        .from("transactions")
        .insert({
          user_id: context.userId,
          description: s.description,
          amount,
          category_id: categoryId,
          date: s.date,
          source: "pluggy",
          external_id: s.pluggy_transaction_id,
          paid: amount < 0,
          paid_at: amount < 0 ? new Date().toISOString() : null,
        })
        .select("id")
        .single();
      if (txErr) {
        if (!txErr.message.includes("duplicate")) throw new Error(txErr.message);
        await context.supabase
          .from("staged_transactions")
          .update({ status: "importado" })
          .eq("id", s.id);
        continue;
      }
      await context.supabase
        .from("staged_transactions")
        .update({ status: "importado", transaction_id: tx.id })
        .eq("id", s.id);
      imported += 1;
    }

    return { imported };
  });
