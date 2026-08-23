//#region node_modules/.nitro/vite/services/ssr/assets/file-import-CgWmic9Y.js
function toISODate(raw) {
	const s = raw.trim();
	let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (m) return `${m[1]}-${m[2]}-${m[3]}`;
	m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
	if (m) {
		const d = m[1].padStart(2, "0");
		const mo = m[2].padStart(2, "0");
		let y = m[3];
		if (y.length === 2) y = `20${y}`;
		return `${y}-${mo}-${d}`;
	}
	return null;
}
function parseAmount(raw) {
	let s = raw.trim().replace(/\s/g, "").replace(/R\$/i, "");
	if (!s) return null;
	let negative = false;
	if (/^\(.*\)$/.test(s)) {
		negative = true;
		s = s.slice(1, -1);
	}
	if (s.endsWith("-")) {
		negative = true;
		s = s.slice(0, -1);
	}
	if (s.startsWith("-")) {
		negative = true;
		s = s.slice(1);
	}
	if (s.startsWith("+")) s = s.slice(1);
	if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
	else if ((s.match(/\./g) ?? []).length > 1) {
		const parts = s.split(".");
		const last = parts.pop();
		s = `${parts.join("")}.${last}`;
	}
	const n = Number(s);
	if (!Number.isFinite(n)) return null;
	return negative ? -Math.abs(n) : n;
}
function splitCsvLine(line, delimiter) {
	const out = [];
	let cur = "";
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === "\"") if (quoted && line[i + 1] === "\"") {
			cur += "\"";
			i++;
		} else quoted = !quoted;
		else if (ch === delimiter && !quoted) {
			out.push(cur);
			cur = "";
		} else cur += ch;
	}
	out.push(cur);
	return out.map((c) => c.trim().replace(/^"|"$/g, ""));
}
var DATE_KEYS = [
	"data",
	"date",
	"data lancamento",
	"data do lançamento",
	"data movimento"
];
var DESC_KEYS = [
	"descricao",
	"descrição",
	"description",
	"historico",
	"histórico",
	"lancamento",
	"lançamento",
	"estabelecimento",
	"memo",
	"title"
];
var AMOUNT_KEYS = [
	"valor",
	"amount",
	"value",
	"montante",
	"valor (r$)",
	"vlr"
];
var norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
function parseCSV(text) {
	const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim().length > 0);
	if (lines.length === 0) return [];
	const first = lines[0];
	const delimiter = [
		";",
		",",
		"	"
	].map((d) => ({
		d,
		n: (first.match(new RegExp(`\\${d}`, "g")) ?? []).length
	})).sort((a, b) => b.n - a.n)[0].d;
	const header = splitCsvLine(first, delimiter).map(norm);
	const hasHeader = header.some((h) => [...DATE_KEYS, ...AMOUNT_KEYS].map(norm).includes(h));
	let dateIdx = 0;
	let descIdx = 1;
	let amountIdx = 2;
	if (hasHeader) {
		const find = (keys) => header.findIndex((h) => keys.map(norm).includes(h));
		const d = find(DATE_KEYS);
		const de = find(DESC_KEYS);
		const a = find(AMOUNT_KEYS);
		if (d >= 0) dateIdx = d;
		if (de >= 0) descIdx = de;
		if (a >= 0) amountIdx = a;
	}
	const rows = [];
	const body = hasHeader ? lines.slice(1) : lines;
	for (const line of body) {
		const cells = splitCsvLine(line, delimiter);
		if (cells.length < 2) continue;
		const date = toISODate(cells[dateIdx] ?? "");
		const amount = parseAmount(cells[amountIdx] ?? "");
		const description = (cells[descIdx] ?? "").trim();
		if (!date || amount === null || amount === 0) continue;
		rows.push({
			date,
			description: description || "Lançamento importado",
			amount
		});
	}
	return rows;
}
function parseStatementText(text) {
	const rows = [];
	const lineRe = /(\d{1,2}[/.-]\d{1,2}(?:[/.-]\d{2,4})?|\d{4}-\d{2}-\d{2})\s+(.+?)\s+(-?R?\$?\s?\(?-?[\d.]+,\d{2}\)?-?)\s*$/;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trim().replace(/\s{2,}/g, " ");
		if (!line) continue;
		const m = line.match(lineRe);
		if (!m) continue;
		let dateStr = m[1];
		if (/^\d{1,2}[/.-]\d{1,2}$/.test(dateStr)) dateStr = `${dateStr}/${(/* @__PURE__ */ new Date()).getFullYear()}`;
		const date = toISODate(dateStr);
		const amount = parseAmount(m[3]);
		if (!date || amount === null || amount === 0) continue;
		rows.push({
			date,
			description: m[2].trim() || "Lançamento importado",
			amount
		});
	}
	return rows;
}
async function parsePDF(file) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	const workerSrc = (await import("./pdf.worker-BrKeqqLm.mjs")).default;
	pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
	const buffer = await file.arrayBuffer();
	const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
	const lines = [];
	for (let p = 1; p <= doc.numPages; p++) {
		const content = await (await doc.getPage(p)).getTextContent();
		const byY = /* @__PURE__ */ new Map();
		for (const item of content.items) {
			if (!item.str || !item.transform) continue;
			const y = Math.round(item.transform[5]);
			const x = item.transform[4];
			const arr = byY.get(y) ?? [];
			arr.push({
				x,
				str: item.str
			});
			byY.set(y, arr);
		}
		const ys = Array.from(byY.keys()).sort((a, b) => b - a);
		for (const y of ys) {
			const parts = byY.get(y).sort((a, b) => a.x - b.x);
			lines.push(parts.map((p2) => p2.str).join(" ").replace(/\s{2,}/g, " ").trim());
		}
	}
	return parseStatementText(lines.join("\n"));
}
async function parseImportFile(file) {
	if (file.name.toLowerCase().endsWith(".pdf")) return parsePDF(file);
	return parseCSV(await file.text());
}
/** Renderiza as primeiras páginas do PDF como imagens (data URL) para leitura por IA. */
async function pdfPageImages(file, maxPages = 3) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	const workerSrc = (await import("./pdf.worker-BrKeqqLm.mjs")).default;
	pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
	const buffer = await file.arrayBuffer();
	const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
	const out = [];
	const pages = Math.min(doc.numPages, maxPages);
	for (let p = 1; p <= pages; p++) {
		const page = await doc.getPage(p);
		const viewport = page.getViewport({ scale: 1.6 });
		const canvas = document.createElement("canvas");
		canvas.width = Math.floor(viewport.width);
		canvas.height = Math.floor(viewport.height);
		const ctx = canvas.getContext("2d");
		if (!ctx) continue;
		await page.render({
			canvas,
			canvasContext: ctx,
			viewport
		}).promise;
		out.push(canvas.toDataURL("image/jpeg", .8));
	}
	return out;
}
/** Reduz e converte uma imagem em data URL JPEG para envio à IA. */
async function imageToDataUrl(file, maxSide = 1600) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Não foi possível processar a imagem.");
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL("image/jpeg", .8);
}
//#endregion
export { pdfPageImages as a, parsePDF as i, parseCSV as n, parseImportFile as r, imageToDataUrl as t };
