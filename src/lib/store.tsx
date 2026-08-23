import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type {
  CardPurchase,
  Category,
  FixedExpense,
  Goal,
  PaymentCard,
  Transaction,
} from "./mock-data";
import { currentMonthKey, dateInMonth, monthKeyOf, shiftMonth } from "./month";

type Ctx = {
  loading: boolean;
  /** Acesso liberado por chave de ativação */
  canWrite: boolean;
  accessExpiresAt: string | null;
  isAdmin: boolean;
  refreshAccess: () => Promise<void>;
  redeemKey: (code: string) => Promise<string>;
  month: string;
  setMonth: (m: string) => void;
  /** Transações do mês selecionado */
  transactions: Transaction[];
  /** Todas as transações, sem filtro de mês */
  allTransactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  fixedExpenses: FixedExpense[];
  cards: PaymentCard[];
  addCard: (c: Omit<PaymentCard, "id">) => Promise<void>;
  updateCard: (id: string, c: Omit<PaymentCard, "id">) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  /** Compras parceladas agrupadas por cartão */
  cardPurchases: CardPurchase[];
  /** Registra uma compra no cartão gerando uma transação por parcela */
  addCardPurchase: (p: {
    cardId: string;
    description: string;
    total: number;
    installments: number;
    date: string;
    payer?: string;
    categoryId: string;
  }) => Promise<number>;
  /** Remove todas as parcelas de uma compra */
  removeCardPurchase: (purchaseId: string) => Promise<void>;
  /** Edita descrição, categoria, responsável e cartão de todas as parcelas de uma compra */
  updateCardPurchase: (
    purchaseId: string,
    data: { description: string; categoryId: string; payer?: string; cardId: string },
  ) => Promise<void>;
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  addTransactions: (list: Omit<Transaction, "id">[]) => Promise<number>;
  updateTransaction: (id: string, t: Omit<Transaction, "id">) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  /** Marca/desmarca um lançamento como quitado */
  setTransactionPaid: (id: string, paid: boolean) => Promise<void>;
  addCategory: (c: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, c: Omit<Category, "id">) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addGoal: (g: Omit<Goal, "id">) => Promise<void>;
  updateGoal: (id: string, g: Omit<Goal, "id">) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  /** Define uma meta como destaque e remove a marca das demais */
  setFeaturedGoal: (id: string | null) => Promise<void>;
  addFixedExpense: (f: Omit<FixedExpense, "id">) => Promise<void>;
  updateFixedExpense: (id: string, f: Omit<FixedExpense, "id">) => Promise<void>;
  removeFixedExpense: (id: string) => Promise<void>;
  /** Lança uma despesa fixa no mês informado */
  launchFixedExpense: (id: string, month: string) => Promise<void>;
  /** Lança todas as despesas fixas ativas ainda não lançadas no mês */
  launchAllFixedExpenses: (month: string) => Promise<number>;
  isFixedLaunched: (fixedId: string, month: string) => boolean;
  categoryById: (id: string) => Category | undefined;

};

const StoreCtx = createContext<Ctx | null>(null);

function fail(error: unknown) {
  console.error(error);
  const message = error instanceof Error ? error.message : "Não foi possível salvar";
  toast.error(message);
  throw error;
}


export function StoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [categories, setCat] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [fixedExpenses, setFixed] = useState<FixedExpense[]>([]);
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonthKey());
  const [accessExpiresAt, setAccessExpiresAt] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshAccess = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const [accessRes, roleRes] = await Promise.all([
      supabase.from("account_access").select("expires_at").eq("user_id", auth.user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
    ]);
    setAccessExpiresAt(accessRes.data?.expires_at ?? null);
    setIsAdmin((roleRes.data ?? []).some((r) => r.role === "admin"));
  }, []);


  const refresh = useCallback(async () => {
    const [txRes, catRes, goalRes, fixedRes, cardRes] = await Promise.all([
      supabase.from("transactions").select("*").order("date", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase.from("goals").select("*").order("created_at"),
      supabase.from("fixed_expenses").select("*").order("day_of_month"),
      supabase.from("cards").select("*").order("created_at"),
    ]);

    if (txRes.error || catRes.error || goalRes.error || fixedRes.error) {
      console.error(txRes.error ?? catRes.error ?? goalRes.error ?? fixedRes.error);
      toast.error("Não foi possível carregar seus dados");
      setLoading(false);
      return;
    }

    setTx(
      (txRes.data ?? []).map((r) => ({
        id: r.id,
        description: r.description,
        amount: Number(r.amount),
        categoryId: r.category_id ?? "",
        date: r.date,
        note: r.note ?? undefined,
        fixedExpenseId: r.fixed_expense_id ?? undefined,
        paid: r.paid ?? false,
        paidAt: r.paid_at ?? undefined,
        cardId: r.card_id ?? undefined,
        payer: r.payer ?? undefined,
        purchaseId: r.purchase_id ?? undefined,
        installmentNo: r.installment_no ?? undefined,
        installments: r.installments ?? undefined,
      })),
    );
    setCat(
      (catRes.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon,
        kind: r.kind as Category["kind"],
        color: r.color,
        budget: r.budget == null ? undefined : Number(r.budget),
      })),
    );
    setGoals(
      (goalRes.data ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        icon: r.icon,
        target: Number(r.target),
        saved: Number(r.saved),
        deadline: r.deadline ?? "",
        is_featured: (r as any).is_featured ?? false,
      })),
    );

    setFixed(
      (fixedRes.data ?? []).map((r) => ({
        id: r.id,
        description: r.description,
        amount: Number(r.amount),
        categoryId: r.category_id ?? "",
        dayOfMonth: r.day_of_month,
        active: r.active,
        note: r.note ?? undefined,
      })),
    );
    setCards(
      (cardRes.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        brand: r.brand as PaymentCard["brand"],
        kind: r.kind as PaymentCard["kind"],
        last4: r.last4 ?? undefined,
        creditLimit: r.credit_limit == null ? undefined : Number(r.credit_limit),
        closingDay: r.closing_day ?? undefined,
        dueDay: r.due_day ?? undefined,
        color: r.color,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    void refreshAccess();
  }, [refresh, refreshAccess]);

  const canWrite = useMemo(
    () => accessExpiresAt != null && new Date(accessExpiresAt).getTime() > Date.now(),
    [accessExpiresAt],
  );

  const monthTransactions = useMemo(
    () => transactions.filter((t) => monthKeyOf(t.date) === month),
    [transactions, month],
  );

  const cardPurchases = useMemo<CardPurchase[]>(() => {
    const map = new Map<string, CardPurchase>();
    for (const t of transactions) {
      if (!t.purchaseId || !t.cardId) continue;
      const existing = map.get(t.purchaseId);
      if (existing) {
        existing.items.push(t);
        existing.total += Math.abs(t.amount);
        if (t.date < existing.date) existing.date = t.date;
      } else {
        map.set(t.purchaseId, {
          purchaseId: t.purchaseId,
          cardId: t.cardId,
          description: (t.description || "").replace(/\s*\(\d+\/\d+\)\s*$/, ""),
          total: Math.abs(t.amount),
          installments: t.installments ?? 1,
          date: t.date,
          payer: t.payer,
          categoryId: t.categoryId,
          items: [t],
        });
      }
    }
    return [...map.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions]);

  const value = useMemo<Ctx>(() => {
    const userId = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Sessão expirada. Entre novamente.");
      return data.user.id;
    };

    const guard = () => {
      if (!canWrite) {
        const msg = "Modo somente leitura — ative uma chave de acesso no Perfil para editar.";
        toast.error(msg);
        throw new Error(msg);
      }
    };

    const isFixedLaunched = (fixedId: string, m: string) =>
      transactions.some((t) => t.fixedExpenseId === fixedId && monthKeyOf(t.date) === m);

    const rowForFixed = async (f: FixedExpense, m: string) => ({
      user_id: await userId(),
      description: f.description,
      amount: -Math.abs(f.amount),
      category_id: f.categoryId || null,
      date: dateInMonth(m, f.dayOfMonth),
      note: f.note ?? null,
      fixed_expense_id: f.id,
    });

    return {
      loading,
      canWrite,
      accessExpiresAt,
      isAdmin,
      refreshAccess,
      redeemKey: async (code: string) => {
        const { data, error } = await supabase.rpc("redeem_access_key", { _code: code });
        if (error) fail(error);
        await refreshAccess();
        return data as unknown as string;
      },
      month,
      setMonth,

      transactions: monthTransactions,
      allTransactions: transactions,
      categories,
      goals,
      fixedExpenses,
      cards,
      addCard: async (c) => {
        guard();
        const { error } = await supabase.from("cards").insert({
          user_id: await userId(),
          name: c.name,
          brand: c.brand,
          kind: c.kind,
          last4: c.last4 || null,
          credit_limit: c.creditLimit ?? null,
          closing_day: c.closingDay ?? null,
          due_day: c.dueDay ?? null,
          color: c.color,
        });
        if (error) fail(error);
        await refresh();
      },
      updateCard: async (id, c) => {
        guard();
        const { error } = await supabase
          .from("cards")
          .update({
            name: c.name,
            brand: c.brand,
            kind: c.kind,
            last4: c.last4 || null,
            credit_limit: c.creditLimit ?? null,
            closing_day: c.closingDay ?? null,
            due_day: c.dueDay ?? null,
            color: c.color,
          })
          .eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      removeCard: async (id) => {
        guard();
        const { error } = await supabase.from("cards").delete().eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      cardPurchases,
      addCardPurchase: async (p) => {
        guard();
        const n = Math.max(1, Math.round(p.installments || 1));
        const total = Math.abs(p.total);
        const uid = await userId();
        const purchaseId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
              });
        const cents = Math.round(total * 100);
        const base = Math.floor(cents / n);
        const rest = cents - base * n;
        const day = Number(p.date.slice(8, 10)) || 1;
        const startMonth = monthKeyOf(p.date);
        const rows = Array.from({ length: n }, (_, i) => {
          const value = (base + (i < rest ? 1 : 0)) / 100;
          return {
            user_id: uid,
            description: n > 1 ? `${p.description} (${i + 1}/${n})` : p.description,
            amount: -value,
            category_id: p.categoryId || null,
            date: i === 0 ? p.date : dateInMonth(shiftMonth(startMonth, i), day),
            paid: false,
            paid_at: null,
            card_id: p.cardId,
            payer: p.payer || null,
            purchase_id: purchaseId,
            installment_no: i + 1,
            installments: n,
          };
        });
        const { error } = await supabase.from("transactions").insert(rows);
        if (error) fail(error);
        await refresh();
        return rows.length;
      },
      removeCardPurchase: async (purchaseId) => {
        guard();
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("purchase_id", purchaseId);
        if (error) fail(error);
        await refresh();
      },
      updateCardPurchase: async (purchaseId, data) => {
        guard();
        const items = transactions.filter((t) => t.purchaseId === purchaseId);
        if (items.length === 0) throw new Error("Compra não encontrada.");
        const results = await Promise.all(
          items.map((t) => {
            const suffix =
              t.installmentNo && t.installments ? ` (${t.installmentNo}/${t.installments})` : "";
            return supabase
              .from("transactions")
              .update({
                description: `${data.description.trim()}${suffix}`,
                category_id: data.categoryId || null,
                payer: data.payer?.trim() || null,
                card_id: data.cardId,
              })
              .eq("id", t.id);
          }),
        );
        const error = results.find((r) => r.error)?.error;
        if (error) fail(error);
        await refresh();
      },
      addTransaction: async (t) => {
        guard();
        const isIncome = t.amount > 0;
        const { error } = await supabase.from("transactions").insert({
          user_id: await userId(),
          description: t.description,
          amount: t.amount,
          category_id: t.categoryId || null,
          date: t.date,
          note: t.note ?? null,
          paid: isIncome ? false : (t.paid ?? false),
          paid_at: isIncome ? null : (t.paid ? (t.paidAt ?? new Date().toISOString()) : null),
          card_id: t.cardId || null,
          payer: t.payer || null,
        });
        if (error) fail(error);
        await refresh();
      },
      addTransactions: async (list) => {
        guard();
        if (list.length === 0) return 0;
        const uid = await userId();
        const rows = list.map((t) => ({
          user_id: uid,
          description: t.description,
          amount: t.amount,
          category_id: t.categoryId || null,
          date: t.date,
          note: t.note ?? null,
          paid: false,
          paid_at: null,
          card_id: t.cardId || null,
          payer: t.payer || null,
        }));
        const { error } = await supabase.from("transactions").insert(rows);
        if (error) fail(error);
        await refresh();
        return rows.length;
      },
      updateTransaction: async (id, t) => {
        guard();
        const isIncome = t.amount > 0;
        const { error } = await supabase
          .from("transactions")
          .update({
            description: t.description,
            amount: t.amount,
            category_id: t.categoryId || null,
            date: t.date,
            note: t.note ?? null,
            paid: isIncome ? false : (t.paid ?? false),
            paid_at: isIncome ? null : (t.paid ? (t.paidAt ?? new Date().toISOString()) : null),
            card_id: t.cardId || null,
            payer: t.payer || null,
          })
          .eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      setTransactionPaid: async (id, paid) => {
        guard();
        const tx = transactions.find((t) => t.id === id);
        if (!tx) throw new Error("Transação não encontrada.");
        if (tx.amount > 0) {
          toast.info("Receitas não são marcadas como quitadas.");
          return;
        }
        const { error } = await supabase
          .from("transactions")
          .update({ paid, paid_at: paid ? new Date().toISOString() : null })
          .eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      removeTransaction: async (id) => {
        guard();
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      addCategory: async (c) => {
        guard();
        const { error } = await supabase.from("categories").insert({
          user_id: await userId(),
          name: c.name,
          icon: c.icon,
          kind: c.kind,
          color: c.color,
          budget: c.budget ?? null,
        });
        if (error) fail(error);
        await refresh();
      },
      updateCategory: async (id, c) => {
        guard();
        const { error } = await supabase
          .from("categories")
          .update({
            name: c.name,
            icon: c.icon,
            kind: c.kind,
            color: c.color,
            budget: c.budget ?? null,
          })
          .eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      removeCategory: async (id) => {
        guard();
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      addGoal: async (g) => {
        guard();
        const { error } = await supabase.from("goals").insert({
          user_id: await userId(),
          title: g.title,
          icon: g.icon,
          target: g.target,
          saved: g.saved,
          deadline: g.deadline || null,
        });
        if (error) fail(error);
        await refresh();
      },
      updateGoal: async (id, g) => {
        guard();
        const { error } = await supabase
          .from("goals")
          .update({
            title: g.title,
            icon: g.icon,
            target: g.target,
            saved: g.saved,
            deadline: g.deadline || null,
          })
          .eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      removeGoal: async (id) => {
        guard();
        const { error } = await supabase.from("goals").delete().eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      setFeaturedGoal: async (id) => {
        guard();
        const uid = await userId();
        // Remove a marca de destaque de todas as metas do usuário
        const { error: clearError } = await supabase
          .from("goals")
          .update({ is_featured: false } as any)
          .eq("user_id", uid);
        if (clearError) fail(clearError);
        if (id) {
          const { error: markError } = await supabase
            .from("goals")
            .update({ is_featured: true } as any)
            .eq("id", id)
            .eq("user_id", uid);
          if (markError) fail(markError);
        }
        await refresh();
      },

      addFixedExpense: async (f) => {
        guard();
        const { error } = await supabase.from("fixed_expenses").insert({
          user_id: await userId(),
          description: f.description,
          amount: Math.abs(f.amount),
          category_id: f.categoryId || null,
          day_of_month: f.dayOfMonth,
          active: f.active,
          note: f.note ?? null,
        });
        if (error) fail(error);
        await refresh();
      },
      updateFixedExpense: async (id, f) => {
        guard();
        const { error } = await supabase
          .from("fixed_expenses")
          .update({
            description: f.description,
            amount: Math.abs(f.amount),
            category_id: f.categoryId || null,
            day_of_month: f.dayOfMonth,
            active: f.active,
            note: f.note ?? null,
          })
          .eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      removeFixedExpense: async (id) => {
        guard();
        const { error } = await supabase.from("fixed_expenses").delete().eq("id", id);
        if (error) fail(error);
        await refresh();
      },
      launchFixedExpense: async (id, m) => {
        guard();
        const f = fixedExpenses.find((x) => x.id === id);
        if (!f) return;
        if (isFixedLaunched(id, m)) {
          toast.info("Essa despesa fixa já foi lançada neste mês");
          return;
        }
        const { error } = await supabase.from("transactions").insert(await rowForFixed(f, m));
        if (error) fail(error);
        await refresh();
      },
      launchAllFixedExpenses: async (m) => {
        guard();
        const pending = fixedExpenses.filter((f) => f.active && !isFixedLaunched(f.id, m));
        if (pending.length === 0) return 0;
        const rows = await Promise.all(pending.map((f) => rowForFixed(f, m)));
        const { error } = await supabase.from("transactions").insert(rows);
        if (error) fail(error);
        await refresh();
        return pending.length;
      },
      isFixedLaunched,
      categoryById: (id) => categories.find((c) => c.id === id),
    };
  }, [
    transactions,
    monthTransactions,
    categories,
    goals,
    fixedExpenses,
    cards,
    cardPurchases,
    loading,
    month,
    refresh,
    canWrite,
    accessExpiresAt,
    isAdmin,
    refreshAccess,
  ]);


  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
