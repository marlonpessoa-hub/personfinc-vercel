export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatSignedBRL = (v: number) => {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${formatBRL(Math.abs(v))}`;
};

export const formatDateShort = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
};

export const formatDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
