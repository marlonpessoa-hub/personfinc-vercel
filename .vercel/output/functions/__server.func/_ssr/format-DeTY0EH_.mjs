//#region node_modules/.nitro/vite/services/ssr/assets/format-DeTY0EH_.js
var formatBRL = (v) => v.toLocaleString("pt-BR", {
	style: "currency",
	currency: "BRL"
});
var formatSignedBRL = (v) => {
	return `${v > 0 ? "+" : v < 0 ? "-" : ""}${formatBRL(Math.abs(v))}`;
};
var formatDateShort = (iso) => {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short"
	}).replace(".", "");
};
var formatDateLong = (iso) => new Date(iso).toLocaleDateString("pt-BR", {
	day: "2-digit",
	month: "long",
	year: "numeric"
});
//#endregion
export { formatSignedBRL as i, formatDateLong as n, formatDateShort as r, formatBRL as t };
