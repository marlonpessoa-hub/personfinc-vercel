#!/usr/bin/env node
/**
 * Sincroniza os plugins Capacitor com os projetos nativos (Android e iOS).
 *
 * Uso:
 *   node scripts/cap-sync.mjs                  -> modo "postinstall" (silencioso se nao houver projeto nativo)
 *   node scripts/cap-sync.mjs --full           -> npm install + build web + sync de todas as plataformas presentes
 *   node scripts/cap-sync.mjs --full --platform ios
 *   node scripts/cap-sync.mjs --full --platform android
 *
 * Sempre que um plugin nativo for adicionado/removido, rode:
 *   npm run native:refresh      (ou android:refresh / ios:refresh)
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const full = args.includes("--full");
const isPostinstall = !full;

const platformFlagIndex = args.indexOf("--platform");
const requested = platformFlagIndex >= 0 ? args[platformFlagIndex + 1] : null;

const ALL = ["android", "ios"];
const targets = (requested ? [requested] : ALL).filter((p) => ALL.includes(p));

const isMac = process.platform === "darwin";
const present = targets.filter((p) => existsSync(resolve(root, p)));

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root });
}

if (present.length === 0) {
  const msg =
    "[cap-sync] Nenhum projeto nativo encontrado (android/ ou ios/) - sync ignorado. " +
    "Crie com `npx cap add android` e/ou `npx cap add ios` (iOS exige macOS + Xcode).";
  if (isPostinstall) {
    console.log(msg);
    process.exit(0);
  }
  console.error(msg);
  process.exit(1);
}

try {
  if (full) {
    run("npm install");
    run("npm run build");
  }

  for (const platform of present) {
    if (platform === "ios" && !isMac) {
      console.log(
        "[cap-sync] Projeto ios/ presente, mas o sync do iOS (CocoaPods/Xcode) só roda em macOS - pulando.",
      );
      continue;
    }
    run(`npx cap sync ${platform}`);
    if (platform === "ios") {
      console.log(
        '[cap-sync] iOS sincronizado. Se aparecer "plugin is not implemented": cd ios/App && pod install --repo-update, ' +
          "depois limpe o build no Xcode (Product > Clean Build Folder) e reinstale o app.",
      );
    } else {
      console.log(
        '[cap-sync] Android sincronizado. Se aparecer "plugin is not implemented": cd android && ./gradlew clean, e reinstale o app.',
      );
    }
  }
} catch (error) {
  console.error(`[cap-sync] Falha ao sincronizar: ${error.message}`);
  // Nao quebra o `npm install` em ambientes sem SDKs nativos.
  process.exit(isPostinstall ? 0 : 1);
}
