# Prompt do Sistema — PersonFinc

> Copie o texto abaixo e cole em outras plataformas de IA para dar contexto completo do projeto **PersonFinc**.

---

## 1. Visão geral do projeto

Você está mantendo/evoluindo o **PersonFinc**, um aplicativo web/mobile de controle financeiro pessoal em português (Brasil). O app é um PWA construído com React 19 + TanStack Start + Vite 7 + Tailwind CSS v4, e empacotado para Android via Capacitor. O backend é Lovable Cloud (Supabase) com Postgres, autenticação, RLS e funções RPC.

Acesso ao app é **sem assinatura tradicional**: o administrador gera chaves de acesso que liberam o usuário para operações de escrita por um período. Leitura é gratuita para qualquer usuário autenticado.

## 2. Stack tecnológica

- **Frontend framework:** React 19
- **Roteamento / SSR / server functions:** TanStack Start v1
- **Bundler:** Vite 7
- **Estilização:** Tailwind CSS v4 (tokens via `@theme` em `src/styles.css`)
- **Ícones:** Material Symbols (Google Fonts)
- **Mobile / Android:** Capacitor (configuração em `capacitor.config.ts`)
- **Backend:** Lovable Cloud (Supabase): Postgres, Auth, Storage, Edge Functions
- **Client Supabase:** `@/integrations/supabase/client` (auto-gerado, não editar)
- **Server functions:** `createServerFn` do `@tanstack/react-start`
- **Notificações:** Web Notifications API + toasts locais
- **Formatação:** `Intl.NumberFormat('pt-BR')`, datas ISO (`YYYY-MM-DD`)

## 3. Arquitetura de rotas (TanStack Router)

- `src/routes/__root.tsx` — layout raiz, fontes, `Toaster`
- `src/routes/login.tsx` — tela de login
- `src/routes/recuperar-senha.tsx` — recuperação de senha
- `src/routes/redefinir-senha.tsx` — redefinição de senha
- `src/routes/senha-alterada.tsx` — confirmação de senha alterada
- `src/routes/_authenticated/route.tsx` — layout protegido (redireciona para `/login` se não autenticado)
- `src/routes/_authenticated/index.tsx` — dashboard principal (painel mensal)
- `src/routes/_authenticated/transacoes.tsx` + `.index.tsx`, `.novo.tsx`, `.$id.editar.tsx` — CRUD de transações
- `src/routes/_authenticated/categorias.tsx` + rotas filhas — CRUD de categorias
- `src/routes/_authenticated/metas.tsx` + rotas filhas — CRUD de metas/financeiras
- `src/routes/_authenticated/fixas.tsx` + rotas filhas — CRUD de despesas fixas
- `src/routes/_authenticated/perfil.tsx` — perfil do usuário, ativação de chave de acesso
- `src/routes/_authenticated/admin.tsx` — painel administrativo para gerar chaves de acesso

Toda rota pai deve renderizar `<Outlet />`. Não usar `react-router-dom`.

## 4. Design system e tokens

Não usar cores hardcoded (`text-white`, `bg-[#...]`). Todos os tokens estão em `src/styles.css` via `@theme`.

Cores principais (Material You-inspired):
- `--color-primary`
- `--color-on-primary`
- `--color-surface`
- `--color-surface-container`
- `--color-surface-container-high`
- `--color-surface-variant`
- `--color-on-surface`
- `--color-on-surface-variant`
- `--color-secondary-container`
- `--color-on-secondary-container`
- `--color-error-container`
- `--color-on-error-container`
- `--color-outline`
- `--color-outline-variant`

Fontes:
- Títulos: `Outfit` / `Space Grotesk` (ver `@theme`)
- Corpo: `Inter` ou fonte do sistema

Classes utilitárias comuns:
- Cards: `bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant`
- Botões primários: `bg-primary text-on-primary rounded-full px-6 py-3`
- FAB: `fixed bottom-6 right-6 bg-primary text-on-primary rounded-2xl shadow-lg`
- Campos: `bg-surface-container-high rounded-2xl px-4 py-3 border border-outline`

## 5. Modelo de dados (Postgres)

Tabelas principais no schema `public`:

1. **`profiles`** — perfil do usuário (disparado pelo trigger `handle_new_user` no cadastro).
2. **`categories`** — categorias de receita/despesa do usuário. Colunas: `id`, `user_id`, `name`, `icon`, `kind` (`receita` | `despesa`), `color`, `budget`, `created_at`, `updated_at`.
3. **`transactions`** — lançamentos financeiros. Colunas: `id`, `user_id`, `description`, `amount` (negativo = despesa, positivo = receita), `category_id`, `date` (ISO), `note`, `fixed_expense_id`, `paid` (boolean, default false), `paid_at` (timestamptz), `created_at`, `updated_at`.
4. **`fixed_expenses`** — despesas fixas recorrentes. Colunas: `id`, `user_id`, `description`, `amount` (sempre positivo), `category_id`, `day_of_month`, `active`, `note`, `created_at`, `updated_at`.
5. **`goals`** — metas financeiras. Colunas: `id`, `user_id`, `title`, `icon`, `target`, `saved`, `deadline`, `created_at`, `updated_at`.
6. **`user_roles`** — papéis do usuário (`admin`, `moderator`, `user`). Um usuário pode ter múltiplos papéis.
7. **`access_keys`** — chaves de acesso geradas pelo admin. Colunas: `id`, `created_by`, `duration_days`, `expires_at`, `revoked_at`, `key_hash` (ou texto da chave, conforme implementação), `created_at`.
8. **`account_access`** — associação de chave ao usuário, indicando até quando o acesso de escrita é válido. Colunas: `id`, `user_id`, `access_key_id`, `expires_at`, `created_at`.

Schema `private`:
- `private.has_role(user_id uuid, role app_role)` — SECURITY DEFINER
- `private.has_active_access(user_id uuid)` — SECURITY DEFINER

### Regras de RLS (Row Level Security)

- Todas as tabelas `public` têm `ENABLE ROW LEVEL SECURITY`.
- Toda tabela `public` criada deve ter `GRANT` explícito para `authenticated` e `service_role`.
- Operações de escrita (`INSERT`, `UPDATE`, `DELETE`) em `transactions`, `categories`, `fixed_expenses`, `goals` exigem `private.has_active_access(auth.uid())` ou `private.has_role(auth.uid(), 'admin')`.
- Leitura (`SELECT`) é permitida ao próprio usuário (`user_id = auth.uid()`).
- `user_roles` e `access_keys`/`account_access` são gerenciadas por funções/RLS específicas.

## 6. Funcionalidades principais

### Dashboard (`/authenticated/index`)
- Seletor de mês (`MonthSelector`).
- Resumo mensal: total de receitas, total de despesas e **resultado (receitas - despesas)** com destaque de cor.
- Lista das últimas transações do mês.
- Metas em destaque.
- Atenção: não mostrar status de quitação para receitas.

### Transações (`/authenticated/transacoes`)
- CRUD completo de lançamentos.
- Filtro por mês.
- Campo **Quitado** apenas para despesas (`amount < 0`).
- Na lista: mostrar badge "Quitado" / "Em aberto" e botão de alternância **somente para despesas**.
- Forçar `paid = false` ao salvar/editar receitas.
- `setTransactionPaid` deve bloquear receitas.
- Data de quitação (`paid_at`) registrada automaticamente quando `paid` passa a `true`.

### Categorias (`/authenticated/categorias`)
- CRUD de categorias.
- Cada categoria é `receita` ou `despesa` e tem ícone do Material Symbols.
- Orçamento (`budget`) opcional para despesas.

### Despesas Fixas (`/authenticated/fixas`)
- CRUD de despesas fixas recorrentes (`day_of_month`, `active`, `amount`, `category_id`).
- Lançamento de uma despesa fixa em um mês específico sem duplicar o registro base.
- Lembretes de vencimento com notificação push/toast local.

### Metas (`/authenticated/metas`)
- CRUD de metas financeiras com valor alvo, valor guardado, ícone e prazo.

### Perfil (`/authenticated/perfil`)
- Dados do usuário, alteração de senha, logout.
- Seção "Chave de acesso" para ativar chave gerada por admin.
- Link "Administração" visível apenas para `admin`.

### Admin (`/authenticated/admin`)
- Gerar chaves de acesso com duração de 30 dias até 10 anos.
- Listar chaves geradas, status, revogação.
- Apenas usuários com `role = 'admin'` podem acessar.

### Lembretes
- Componente `DueRemindersWatcher` monitora despesas fixas próximas do vencimento.
- Solicita permissão de notificação ao usuário.
- Configuração de antecedência (dias) em `ReminderSettingsCard`.

## 7. Regras de negócio críticas

1. **Acesso com chave:** leitura gratuita após login; escrita exige `account_access` ativo.
2. **Income não é quitado:** apenas despesas (`amount < 0`) podem ter `paid = true`. Receitas sempre `paid = false`.
3. **Mês corrente:** todas as telas de listagem devem respeitar o mês selecionado (default = mês atual).
4. **Despesas fixas:** são modelos; ao "usar no mês", cria-se uma `transaction` vinculada via `fixed_expense_id`.
5. **Admin:** email `marlonfpessoa@gmail.com` (ou conforme roles) é o admin principal.
6. **Segurança:** funções `SECURITY DEFINER` internas devem ficar no schema `private`; RPCs públicas devem ser `SECURITY INVOKER` e validar permissões internamente.

## 8. Convenções de código

- **Server functions:** arquivos `*.functions.ts` em `src/lib/` ou próximo à rota; não colocar lógica de runtime no escopo do módulo; apenas imports, tipos e declarações `createServerFn`.
- **Server-only helpers:** `*.server.ts`.
- **Client importa:** `*.functions.ts`, nunca `*.server.ts`.
- **Hooks:** `useServerFn` para chamar server functions a partir de componentes.
- **Loader:** usar `context.queryClient.ensureQueryData(queryOptions)` na rota + `useSuspenseQuery` no componente.
- **Erros:** usar `sonner` para toasts; `<Toaster />` renderizado em `__root.tsx`.
- **Metadados:** toda rota de conteúdo deve ter `head()` com title, description, og:title, og:description, og:type, twitter:card. Não usar "Lovable App".
- **Mobile:** respeitar safe-area insets; usar `env(safe-area-inset-*)` no CSS.

## 9. Arquivos-chave

- `src/styles.css` — design tokens
- `src/lib/store.tsx` — estado global (Supabase + React Context)
- `src/components/app-shell.tsx` — layout autenticado
- `src/components/access-gate.tsx` — banner de somente leitura + card de ativação
- `src/components/transaction-form.tsx` — formulário de transações
- `src/components/fixed-expense-form.tsx` — formulário de despesas fixas
- `src/components/category-form.tsx` — formulário de categorias
- `src/components/goal-form.tsx` — formulário de metas
- `src/components/month-selector.tsx` — seletor de mês
- `src/components/reminder-settings.tsx` — configuração de lembretes
- `src/hooks/use-due-reminders.tsx` — lógica de lembretes
- `src/routes/_authenticated/route.tsx` — gate de autenticação
- `src/start.ts` — configuração do TanStack Start, middleware `attachSupabaseAuth`
- `capacitor.config.ts` — configuração Android/PWA

## 10. NÃO fazer

- Não adicionar `react-router-dom` ou rotas fora de `src/routes`.
- Não criar `src/pages` ou `App.tsx` com switcher de rotas.
- Não editar `src/routeTree.gen.ts` manualmente.
- Não editar `src/integrations/supabase/client.ts`, `client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`, `types.ts`.
- Não colocar chaves de API no código (env vars no server, `import.meta.env` no client).
- Não usar `SECURITY DEFINER` em schema `public` sem justificativa; manter helpers internos no schema `private`.
- Não permitir que receitas sejam marcadas como quitadas.
- Não adicionar assinatura paga sem aprovação do usuário; manter modelo de chaves de acesso.

## 11. Comandos úteis

- Instalar dependências: `bun install`
- Dev: `bun run dev`
- Typecheck: `tsgo --noEmit`
- Testar: `bunx vitest run` (se configurado)
- Android sync: `npx cap sync android`
- Android build: abrir `android/` no Android Studio e gerar APK/AAB assinado.

## 12. Tom de comunicação

Sempre responda em português do Brasil. Seja direto, técnico quando necessário, mas acessível. Antes de implementar funcionalidades amplas ou ambíguas, pergunte ao usuário para confirmar escopo. Preserve a estética minimalista e escura do app. Não use gradientes genéricos de roxo/indigo a menos que explicitamente solicitado.

---

**Use este prompt para continuar o PersonFinc em outras plataformas de IA.**
