# PersonFinc no Android (Capacitor)

O app já está conectado ao backend (banco + autenticação) e configurado para virar
um APK/AAB Android via [Capacitor](https://capacitorjs.com/).
O Lovable roda só a versão web — para gerar o instalador você exporta para o GitHub,
clona localmente e usa o Android Studio.

## Requisitos locais
- Node 20+
- Android Studio (SDK Android 34+ e JDK 17)

## 1. Publique o app web primeiro
O PersonFinc usa renderização no servidor (SSR), então o app Android abre a versão
publicada dentro do WebView nativo. Clique em **Publish** no Lovable e copie a URL.
Depois confira/edite `capacitor.config.ts` → `PUBLISHED_URL`.

> Se um dia você usar um domínio próprio, basta trocar essa URL e rodar `npx cap sync android`.

## 2. Gere o projeto Android
```bash
npm install
npx cap add android      # cria a pasta android/
npm run build
npx cap sync android
npx cap open android     # abre no Android Studio
```

Atalhos disponíveis: `npm run android:sync` e `npm run android:open`.

## 3. Rodar no dispositivo/emulador
No Android Studio: **Run > app**, ou:
```bash
npx cap run android
```

## 4. Depois de qualquer mudança
Mudanças no código web entram automaticamente no app assim que você republicar
(o WebView carrega a URL publicada). Só é preciso `npm run build && npx cap sync android`
quando você alterar a configuração nativa do Capacitor.

## 5. APK/AAB de produção assinado (para a loja)

O Lovable roda só a versão web — a build nativa precisa ser feita na sua máquina
com Android Studio + JDK 17.

### 5.1 Publique a versão web
Clique em **Publish** no Lovable. O app Android carrega essa URL
(`server.url` em `capacitor.config.ts`), então ela precisa estar no ar.

### 5.2 Crie a keystore (só uma vez — guarde bem, sem ela você não consegue atualizar o app)
```bash
keytool -genkey -v -keystore personfinc-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias personfinc
```
Guarde o arquivo `.jks` fora do repositório e anote a senha.

### 5.3 Configure a assinatura
Crie `android/keystore.properties` (NÃO comite):
```properties
storeFile=/caminho/absoluto/personfinc-release.jks
storePassword=SUA_SENHA
keyAlias=personfinc
keyPassword=SUA_SENHA
```

Em `android/app/build.gradle`, dentro de `android { }`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file("keystore.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

signingConfigs {
    release {
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```
E adicione `android/keystore.properties` e `*.jks` ao `.gitignore`.

### 5.4 Defina versão e nome do app
Em `android/app/build.gradle` → `defaultConfig`:
`versionCode 1` (inteiro, aumenta a cada envio) e `versionName "1.0.0"`.

### 5.5 Gere os artefatos
```bash
npm install
npx cap add android        # se a pasta android/ ainda não existir
npm run android:sync
cd android
./gradlew bundleRelease    # AAB — obrigatório na Google Play
./gradlew assembleRelease  # APK — para distribuição direta/testes
```
Saída:
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`

Alternativa pela IDE: `npm run android:open` → **Build > Generate Signed Bundle / APK…**

### 5.6 Envie para a Google Play
Play Console → crie o app → **Produção > Criar versão** → suba o `.aab`.
Deixe o **Play App Signing** ativado (recomendado). Preencha ficha da loja,
ícone 512×512, screenshots, política de privacidade e classificação de conteúdo.

### 5.7 Verificar a assinatura antes de enviar
```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```


## Autenticação dentro do app
- **E-mail e senha** funciona normalmente no WebView.
- **Entrar com Google** exige que o domínio publicado esteja acessível — por isso
  `accounts.google.com` e o domínio do backend estão em `server.allowNavigation`.

## Configuração
`capacitor.config.ts`:
- `appId`: `com.personfinc.app`
- `appName`: `PersonFinc`
- `webDir`: `dist`
- `server.url`: URL publicada carregada pelo app

## Login com Google no navegador do sistema (obrigatório no Android)

O Google bloqueia login dentro de WebView embutida (por isso aparecia só e-mail/senha).
No app nativo o botão "Continuar com Google" agora abre o **Chrome/navegador do
telefone** (Custom Tab) e volta para o app por deep link.

Após `npx cap add android`, adicione no `android/app/src/main/AndroidManifest.xml`,
dentro da `<activity>` principal:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.personfinc.app" android:host="auth" />
</intent-filter>
```

Fluxo: app → Chrome (consentimento Google) → `https://personfinc.lovable.app/auth/callback?native=1`
→ redireciona para `com.personfinc.app://auth/callback` → o app troca o código pela sessão.

Se você usar outro domínio publicado, ajuste `PUBLISHED_URL` em `src/lib/native-auth.ts`
e em `capacitor.config.ts`, e rode `npm run android:sync`.

## Erro: `"Browser" plugin is not implemented on android`

Significa que o projeto nativo em `android/` foi gerado/compilado **antes** dos
plugins `@capacitor/browser` e `@capacitor/app` serem instalados — o Gradle não
incluiu as classes nativas. Resolva na sua máquina:

```bash
npm run android:refresh   # npm install + build web + cap sync android
cd android && ./gradlew clean
cd .. && npx cap run android
```

> `npm run android:refresh` é o atalho oficial após qualquer mudança de plugins.
> Além dele, existe um `postinstall` (`scripts/cap-sync.mjs`) que roda
> `npx cap sync` automaticamente ao final de todo `npm install`, para cada projeto
> nativo existente (em CI/nuvem, sem `android/` nem `ios/`, ele apenas é ignorado).

## iOS (iPhone / Safari)

O mesmo fluxo vale para iOS. Em um Mac com Xcode:

```bash
npx cap add ios          # apenas na primeira vez
npm run ios:refresh      # npm install + build web + cap sync ios
npm run ios:open         # abre no Xcode
```

Se aparecer `"Browser" plugin is not implemented on ios`:

```bash
npm run ios:refresh
cd ios/App && pod install --repo-update
# Xcode > Product > Clean Build Folder, depois reinstale o app
```

Confira se `ios/App/App/capacitor.config.json` e o `Podfile` listam
`@capacitor/browser` e `@capacitor/app`. Para o retorno do login com Google,
registre o esquema `com.personfinc.app` em **Info.plist**:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>com.personfinc.app</string></array>
  </dict>
</array>
```

O sync do iOS só roda em macOS; em Windows/Linux o script detecta e pula
a plataforma sem quebrar o `npm install`. Use `npm run native:refresh` para
sincronizar Android e iOS de uma vez.

Confira se `android/app/src/main/assets/capacitor.plugins.json` lista
`@capacitor/browser` e `@capacitor/app`. Se não listar, apague a pasta `android/`
e recrie: `npx cap add android && npx cap sync android`.

Também verifique se `android/app/build.gradle` contém `implementation project(':capacitor-browser')`
(gerado automaticamente pelo `cap sync`) e se as versões dos plugins são compatíveis
com a versão do `@capacitor/core` (todas na mesma major).

Enquanto o projeto nativo não é sincronizado, o app faz fallback e abre o login
do Google via `window.open`, mas o ideal é sincronizar para usar a Custom Tab.
