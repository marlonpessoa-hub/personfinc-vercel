export type TxKind = "receita" | "despesa";

export type Category = {
  id: string;
  name: string;
  icon: string; // material symbol
  kind: TxKind;
  color: string; // tailwind class name for chip bg (e.g. "bg-secondary-container text-on-secondary-container")
  budget?: number;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number; // signed: negative = despesa
  categoryId: string;
  date: string; // ISO
  note?: string;
  fixedExpenseId?: string;
  /** Lançamento quitado (pago/recebido) */
  paid?: boolean;
  paidAt?: string;
  /** Cartão utilizado no lançamento */
  cardId?: string;
  /** Responsável pela compra */
  payer?: string;
  /** Agrupador das parcelas de uma mesma compra */
  purchaseId?: string;
  installmentNo?: number;
  installments?: number;
};

export type CardPurchase = {
  purchaseId: string;
  cardId: string;
  description: string;
  total: number;
  installments: number;
  date: string;
  payer?: string;
  categoryId: string;
  items: Transaction[];
};

export type Goal = {
  id: string;
  title: string;
  icon: string;
  target: number;
  saved: number;
  deadline: string; // ISO
  /** Meta em destaque no Dashboard */
  is_featured?: boolean;
};


export const initialCategories: Category[] = [
  { id: "c1", name: "Salário", icon: "work", kind: "receita", color: "bg-secondary-container text-on-secondary-container" },
  { id: "c2", name: "Freelance", icon: "laptop_mac", kind: "receita", color: "bg-secondary-container text-on-secondary-container" },
  { id: "c3", name: "Mantimentos", icon: "shopping_cart", kind: "despesa", color: "bg-surface-container text-on-surface-variant", budget: 800 },
  { id: "c4", name: "Alimentação", icon: "restaurant", kind: "despesa", color: "bg-surface-container text-on-surface-variant", budget: 500 },
  { id: "c5", name: "Transporte", icon: "directions_car", kind: "despesa", color: "bg-surface-container text-on-surface-variant", budget: 400 },
  { id: "c6", name: "Moradia", icon: "home", kind: "despesa", color: "bg-surface-container text-on-surface-variant", budget: 2200 },
  { id: "c7", name: "Lazer", icon: "movie", kind: "despesa", color: "bg-surface-container text-on-surface-variant", budget: 300 },
  { id: "c8", name: "Saúde", icon: "favorite", kind: "despesa", color: "bg-error-container text-on-error-container", budget: 250 },
];

export const initialTransactions: Transaction[] = [
  { id: "t1", description: "Mercado Central", amount: -142.5, categoryId: "c3", date: "2026-07-16" },
  { id: "t2", description: "Tech Corp S.A.", amount: 4120.25, categoryId: "c1", date: "2026-07-15" },
  { id: "t3", description: "Starbucks", amount: -12.4, categoryId: "c4", date: "2026-07-14" },
  { id: "t4", description: "Uber", amount: -28.9, categoryId: "c5", date: "2026-07-13" },
  { id: "t5", description: "Aluguel", amount: -2200, categoryId: "c6", date: "2026-07-10" },
  { id: "t6", description: "Cinema Iguatemi", amount: -68, categoryId: "c7", date: "2026-07-09" },
  { id: "t7", description: "Projeto Freelance", amount: 1500, categoryId: "c2", date: "2026-07-05" },
  { id: "t8", description: "Farmácia São João", amount: -85.4, categoryId: "c8", date: "2026-07-03" },
];

export const initialGoals: Goal[] = [
  { id: "g1", title: "Fundo para Carro Novo", icon: "directions_car", target: 25000, saved: 15000, deadline: "2027-06-01" },
  { id: "g2", title: "Viagem à Europa", icon: "flight", target: 12000, saved: 4800, deadline: "2026-12-20" },
  { id: "g3", title: "Reserva de Emergência", icon: "shield", target: 20000, saved: 18500, deadline: "2026-11-30" },
];

export type FixedExpense = {
  id: string;
  description: string;
  amount: number; // sempre positivo
  categoryId: string;
  dayOfMonth: number;
  active: boolean;
  note?: string;
};

export type CardBrand = "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "outro";

export type PaymentCard = {
  id: string;
  name: string;
  brand: CardBrand;
  kind: "credito" | "debito";
  last4?: string;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
  color: string;
};
