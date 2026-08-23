export const monthKeyOf = (iso: string) => iso.slice(0, 7);

export const currentMonthKey = () => new Date().toISOString().slice(0, 7);

export const shiftMonth = (key: string, delta: number) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const formatMonthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

/** Data ISO do dia informado dentro do mês, respeitando meses curtos. */
export const dateInMonth = (key: string, day: number) => {
  const [y, m] = key.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  const safeDay = Math.min(Math.max(day || 1, 1), lastDay);
  return `${key}-${String(safeDay).padStart(2, "0")}`;
};
