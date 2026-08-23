import type { CapacitorConfig } from "@capacitor/cli";

// PersonFinc roda em TanStack Start (SSR), então o app Android carrega a versão
// publicada na web dentro do WebView nativo. Troque `server.url` pela sua URL
// publicada (Publish no Lovable) ou pelo seu domínio próprio.
const PUBLISHED_URL = "https://project--1ff05e66-474b-44ce-bbe4-5e115be7b50f.lovable.app";

const config: CapacitorConfig = {
  appId: "com.personfinc.app",
  appName: "PersonFinc",
  webDir: "dist",
  server: {
    androidScheme: "https",
    url: PUBLISHED_URL,
    cleartext: false,
    // Domínios que podem abrir dentro do app (login Google + backend).
    allowNavigation: [
      "*.lovable.app",
      "jlbevejwfmjzhianludh.supabase.co",
      "accounts.google.com",
      "*.google.com",
    ],
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
