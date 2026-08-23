import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseImportFile, type ParsedRow } from "../lib/file-import";

export function FileImportCard({ onImported }: { onImported: () => void | Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function stage(rows: ParsedRow[]) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("Sessão expirada. Entre novamente.");

    const payload = rows.map((r) => ({
      user_id: userId,
      pluggy_transaction_id: `arquivo:${crypto.randomUUID()}`,
      description: r.description.slice(0, 200),
      amount: r.amount,
      date: r.date,
      kind: "arquivo",
      status: "pendente",
    }));

    const { error } = await supabase.from("staged_transactions").insert(payload);
    if (error) throw new Error(error.message);
  }

  async function handleFile(file: File) {
    setBusy(true);
    setFileName(file.name);
    try {
      const rows = await parseImportFile(file);
      if (rows.length === 0) {
        toast.error("Nenhum lançamento reconhecido no arquivo.");
        return;
      }
      await stage(rows);
      toast.success(`${rows.length} lançamento(s) prontos para revisão.`);
      await onImported();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao ler o arquivo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-lg">
      <div className="flex items-start gap-md">
        <span className="material-symbols-outlined text-primary">upload_file</span>
        <div className="flex-1">
          <h2 className="font-body-lg text-body-lg text-primary font-medium">
            Importar arquivo (CSV, OFX texto ou PDF)
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
            Envie o extrato ou a fatura do cartão. Os lançamentos entram na fila de revisão abaixo.
          </p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) void handleFile(f);
            }}
            className="mt-md border border-dashed border-outline rounded-lg p-lg text-center"
          >
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {busy ? `Lendo ${fileName ?? "arquivo"}…` : "Arraste o arquivo aqui ou"}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="mt-sm px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 disabled:opacity-60"
            >
              Selecionar arquivo
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.txt,.ofx,.pdf,text/csv,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
