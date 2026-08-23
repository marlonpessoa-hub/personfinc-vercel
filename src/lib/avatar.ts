/** Utilidades de foto de perfil (avatar). */

/** Foto vinda do provedor social (Google), quando houver. */
export function googleAvatarFrom(meta: Record<string, unknown> | undefined): string | null {
  if (!meta) return null;
  const url = (meta.avatar_url ?? meta.picture) as string | undefined;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

/**
 * Redimensiona e comprime a imagem escolhida em um data URL quadrado,
 * pequeno o bastante para ser salvo direto no perfil.
 */
export function fileToAvatarDataUrl(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Não foi possível processar a imagem."));
        const side = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size,
        );
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
