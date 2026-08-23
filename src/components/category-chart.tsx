import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatBRL } from "../lib/format";
import type { Category, Transaction } from "../lib/mock-data";

interface CategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
  categoryById: (id: string) => Category | undefined;
}

export function CategoryChart({ transactions, categoryById }: CategoryChartProps) {
  const data = useMemo(() => {
    const byCategory: Record<
      string,
      { name: string; color: string; income: number; expense: number }
    > = {};

    for (const tx of transactions) {
      const cat = categoryById(tx.categoryId);
      const key = cat?.name ?? "Sem categoria";
      if (!byCategory[key]) {
        byCategory[key] = {
          name: key,
          color: "#75777d",
          income: 0,
          expense: 0,
        };
      }
      if (tx.amount > 0) {
        byCategory[key].income += tx.amount;
      } else {
        byCategory[key].expense += Math.abs(tx.amount);
      }
    }

    return Object.values(byCategory).sort((a, b) => b.expense - a.expense);
  }, [transactions, categoryById]);

  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow h-64 flex items-center justify-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
          Nenhuma transação no mês para exibir no gráfico.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant card-shadow">
      <h3 className="font-headline-md text-headline-md text-primary mb-md">
        Receitas e despesas por categoria
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--color-on-surface-variant)", fontSize: 12 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "var(--color-on-surface-variant)", fontSize: 12 }}
              tickFormatter={(value) =>
                value >= 1000 ? `R$${(value / 1000).toFixed(1)}k` : `R$${value}`
              }
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatBRL(value), name === "expense" ? "Despesas" : "Receitas"]}
              contentStyle={{
                backgroundColor: "var(--color-surface-container-lowest)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "12px",
                color: "var(--color-on-surface)",
              }}
            />
            <Legend
              formatter={(value) => (value === "expense" ? "Despesas" : "Receitas")}
              wrapperStyle={{ paddingTop: 8 }}
            />
            <Bar dataKey="income" name="income" fill="#006c49" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="expense" fill="#ba1a1a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
