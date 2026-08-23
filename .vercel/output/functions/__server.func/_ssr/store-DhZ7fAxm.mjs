import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B6yKsI_N.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DhZ7fAxm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var monthKeyOf = (iso) => iso.slice(0, 7);
var currentMonthKey = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
var shiftMonth = (key, delta) => {
	const [y, m] = key.split("-").map(Number);
	const d = new Date(y, m - 1 + delta, 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
var formatMonthLabel = (key) => {
	const [y, m] = key.split("-").map(Number);
	const label = new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric"
	});
	return label.charAt(0).toUpperCase() + label.slice(1);
};
/** Data ISO do dia informado dentro do mês, respeitando meses curtos. */
var dateInMonth = (key, day) => {
	const [y, m] = key.split("-").map(Number);
	const lastDay = new Date(y, m, 0).getDate();
	return `${key}-${String(Math.min(Math.max(day || 1, 1), lastDay)).padStart(2, "0")}`;
};
var StoreCtx = (0, import_react.createContext)(null);
function fail(error) {
	console.error(error);
	const message = error instanceof Error ? error.message : "Não foi possível salvar";
	toast.error(message);
	throw error;
}
function StoreProvider({ children }) {
	const [transactions, setTx] = (0, import_react.useState)([]);
	const [categories, setCat] = (0, import_react.useState)([]);
	const [goals, setGoals] = (0, import_react.useState)([]);
	const [fixedExpenses, setFixed] = (0, import_react.useState)([]);
	const [cards, setCards] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [month, setMonth] = (0, import_react.useState)(currentMonthKey());
	const [accessExpiresAt, setAccessExpiresAt] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const refreshAccess = (0, import_react.useCallback)(async () => {
		const { data: auth } = await supabase.auth.getUser();
		if (!auth.user) return;
		const [accessRes, roleRes] = await Promise.all([supabase.from("account_access").select("expires_at").eq("user_id", auth.user.id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", auth.user.id)]);
		setAccessExpiresAt(accessRes.data?.expires_at ?? null);
		setIsAdmin((roleRes.data ?? []).some((r) => r.role === "admin"));
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		const [txRes, catRes, goalRes, fixedRes, cardRes] = await Promise.all([
			supabase.from("transactions").select("*").order("date", { ascending: false }),
			supabase.from("categories").select("*").order("name"),
			supabase.from("goals").select("*").order("created_at"),
			supabase.from("fixed_expenses").select("*").order("day_of_month"),
			supabase.from("cards").select("*").order("created_at")
		]);
		if (txRes.error || catRes.error || goalRes.error || fixedRes.error) {
			console.error(txRes.error ?? catRes.error ?? goalRes.error ?? fixedRes.error);
			toast.error("Não foi possível carregar seus dados");
			setLoading(false);
			return;
		}
		setTx((txRes.data ?? []).map((r) => ({
			id: r.id,
			description: r.description,
			amount: Number(r.amount),
			categoryId: r.category_id ?? "",
			date: r.date,
			note: r.note ?? void 0,
			fixedExpenseId: r.fixed_expense_id ?? void 0,
			paid: r.paid ?? false,
			paidAt: r.paid_at ?? void 0,
			cardId: r.card_id ?? void 0,
			payer: r.payer ?? void 0,
			purchaseId: r.purchase_id ?? void 0,
			installmentNo: r.installment_no ?? void 0,
			installments: r.installments ?? void 0
		})));
		setCat((catRes.data ?? []).map((r) => ({
			id: r.id,
			name: r.name,
			icon: r.icon,
			kind: r.kind,
			color: r.color,
			budget: r.budget == null ? void 0 : Number(r.budget)
		})));
		setGoals((goalRes.data ?? []).map((r) => ({
			id: r.id,
			title: r.title,
			icon: r.icon,
			target: Number(r.target),
			saved: Number(r.saved),
			deadline: r.deadline ?? "",
			is_featured: r.is_featured ?? false
		})));
		setFixed((fixedRes.data ?? []).map((r) => ({
			id: r.id,
			description: r.description,
			amount: Number(r.amount),
			categoryId: r.category_id ?? "",
			dayOfMonth: r.day_of_month,
			active: r.active,
			note: r.note ?? void 0
		})));
		setCards((cardRes.data ?? []).map((r) => ({
			id: r.id,
			name: r.name,
			brand: r.brand,
			kind: r.kind,
			last4: r.last4 ?? void 0,
			creditLimit: r.credit_limit == null ? void 0 : Number(r.credit_limit),
			closingDay: r.closing_day ?? void 0,
			dueDay: r.due_day ?? void 0,
			color: r.color
		})));
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
		refreshAccess();
	}, [refresh, refreshAccess]);
	const canWrite = (0, import_react.useMemo)(() => accessExpiresAt != null && new Date(accessExpiresAt).getTime() > Date.now(), [accessExpiresAt]);
	const monthTransactions = (0, import_react.useMemo)(() => transactions.filter((t) => monthKeyOf(t.date) === month), [transactions, month]);
	const cardPurchases = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of transactions) {
			if (!t.purchaseId || !t.cardId) continue;
			const existing = map.get(t.purchaseId);
			if (existing) {
				existing.items.push(t);
				existing.total += Math.abs(t.amount);
				if (t.date < existing.date) existing.date = t.date;
			} else map.set(t.purchaseId, {
				purchaseId: t.purchaseId,
				cardId: t.cardId,
				description: (t.description || "").replace(/\s*\(\d+\/\d+\)\s*$/, ""),
				total: Math.abs(t.amount),
				installments: t.installments ?? 1,
				date: t.date,
				payer: t.payer,
				categoryId: t.categoryId,
				items: [t]
			});
		}
		return [...map.values()].sort((a, b) => a.date < b.date ? 1 : -1);
	}, [transactions]);
	const value = (0, import_react.useMemo)(() => {
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
		const isFixedLaunched = (fixedId, m) => transactions.some((t) => t.fixedExpenseId === fixedId && monthKeyOf(t.date) === m);
		const rowForFixed = async (f, m) => ({
			user_id: await userId(),
			description: f.description,
			amount: -Math.abs(f.amount),
			category_id: f.categoryId || null,
			date: dateInMonth(m, f.dayOfMonth),
			note: f.note ?? null,
			fixed_expense_id: f.id
		});
		return {
			loading,
			canWrite,
			accessExpiresAt,
			isAdmin,
			refreshAccess,
			redeemKey: async (code) => {
				const { data, error } = await supabase.rpc("redeem_access_key", { _code: code });
				if (error) fail(error);
				await refreshAccess();
				return data;
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
					color: c.color
				});
				if (error) fail(error);
				await refresh();
			},
			updateCard: async (id, c) => {
				guard();
				const { error } = await supabase.from("cards").update({
					name: c.name,
					brand: c.brand,
					kind: c.kind,
					last4: c.last4 || null,
					credit_limit: c.creditLimit ?? null,
					closing_day: c.closingDay ?? null,
					due_day: c.dueDay ?? null,
					color: c.color
				}).eq("id", id);
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
				const purchaseId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
						installments: n
					};
				});
				const { error } = await supabase.from("transactions").insert(rows);
				if (error) fail(error);
				await refresh();
				return rows.length;
			},
			removeCardPurchase: async (purchaseId) => {
				guard();
				const { error } = await supabase.from("transactions").delete().eq("purchase_id", purchaseId);
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
					paid: isIncome ? false : t.paid ?? false,
					paid_at: isIncome ? null : t.paid ? t.paidAt ?? (/* @__PURE__ */ new Date()).toISOString() : null,
					card_id: t.cardId || null,
					payer: t.payer || null
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
					payer: t.payer || null
				}));
				const { error } = await supabase.from("transactions").insert(rows);
				if (error) fail(error);
				await refresh();
				return rows.length;
			},
			updateTransaction: async (id, t) => {
				guard();
				const isIncome = t.amount > 0;
				const { error } = await supabase.from("transactions").update({
					description: t.description,
					amount: t.amount,
					category_id: t.categoryId || null,
					date: t.date,
					note: t.note ?? null,
					paid: isIncome ? false : t.paid ?? false,
					paid_at: isIncome ? null : t.paid ? t.paidAt ?? (/* @__PURE__ */ new Date()).toISOString() : null,
					card_id: t.cardId || null,
					payer: t.payer || null
				}).eq("id", id);
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
				const { error } = await supabase.from("transactions").update({
					paid,
					paid_at: paid ? (/* @__PURE__ */ new Date()).toISOString() : null
				}).eq("id", id);
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
					budget: c.budget ?? null
				});
				if (error) fail(error);
				await refresh();
			},
			updateCategory: async (id, c) => {
				guard();
				const { error } = await supabase.from("categories").update({
					name: c.name,
					icon: c.icon,
					kind: c.kind,
					color: c.color,
					budget: c.budget ?? null
				}).eq("id", id);
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
					deadline: g.deadline || null
				});
				if (error) fail(error);
				await refresh();
			},
			updateGoal: async (id, g) => {
				guard();
				const { error } = await supabase.from("goals").update({
					title: g.title,
					icon: g.icon,
					target: g.target,
					saved: g.saved,
					deadline: g.deadline || null
				}).eq("id", id);
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
				const { error: clearError } = await supabase.from("goals").update({ is_featured: false }).eq("user_id", uid);
				if (clearError) fail(clearError);
				if (id) {
					const { error: markError } = await supabase.from("goals").update({ is_featured: true }).eq("id", id).eq("user_id", uid);
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
					note: f.note ?? null
				});
				if (error) fail(error);
				await refresh();
			},
			updateFixedExpense: async (id, f) => {
				guard();
				const { error } = await supabase.from("fixed_expenses").update({
					description: f.description,
					amount: Math.abs(f.amount),
					category_id: f.categoryId || null,
					day_of_month: f.dayOfMonth,
					active: f.active,
					note: f.note ?? null
				}).eq("id", id);
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
			categoryById: (id) => categories.find((c) => c.id === id)
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
		refreshAccess
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreCtx.Provider, {
		value,
		children
	});
}
function useStore() {
	const ctx = (0, import_react.useContext)(StoreCtx);
	if (!ctx) throw new Error("useStore must be used inside StoreProvider");
	return ctx;
}
//#endregion
export { monthKeyOf as a, formatMonthLabel as i, currentMonthKey as n, shiftMonth as o, dateInMonth as r, useStore as s, StoreProvider as t };
