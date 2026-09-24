# Hyphas — Portal de Cursos e Desenhos Botânicos

Aplicação web moderna, responsiva e *secure by design* para iniciantes em ilustração botânica.
Oferece tela de login, painel do aluno protegido (catálogo de cursos com progresso, galeria
interativa de ilustrações com filtro por tipo de flor e área de guias de estudo em PDF) e logout
com invalidação de sessão.

## Stack

- React 19 + TypeScript
- TanStack Start / TanStack Router (rotas e guardas)
- Tailwind CSS v4 (design system em `src/styles.css`)
- Vite 7

## Instalação e execução local

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd hyphas

# 2. Instalar dependências
npm install       # ou: bun install

# 3. Rodar em desenvolvimento
npm run dev       # http://localhost:8080

# 4. Build de produção
npm run build
```

## Estrutura

```
src/
  assets/            Ilustrações botânicas
  lib/auth.ts        Sessão, validações e defesas de segurança
  lib/hyphas-data.ts Cursos, galeria e guias
  routes/index.tsx   Tela de Login (/)
  routes/dashboard.tsx  Painel do Aluno (/dashboard, protegido)
  styles.css         Design system (tokens de cor, gradientes, tipografia)
```

## Relatório técnico — OWASP Top 10 mitigado

### 1. A01 — Broken Access Control

**Onde:** `src/routes/dashboard.tsx` (`beforeLoad`) e `src/lib/auth.ts` (`isAuthenticated`, `getSession`).

- `beforeLoad` do `/dashboard` executa antes de qualquer renderização e lança
  `redirect({ to: "/" })` quando não há sessão válida — bloqueando acesso direto pela URL.
- `getSession()` valida formato do objeto e expiração (TTL de 30 minutos); sessões expiradas
  ou corrompidas são removidas do armazenamento.
- Reforço em runtime: o componente `Dashboard` reconfere a sessão em `useEffect` e redireciona.
- A rota de login redireciona usuários já autenticados para o painel.

### 2. A03 — Injection / Cross-Site Scripting (XSS)

**Onde:** `src/lib/auth.ts` (`sanitizeText`, `isValidEmail`) e `src/routes/index.tsx` / `dashboard.tsx`.

- `sanitizeText()` remove `< > " ' \` \` de toda entrada, normaliza espaços e aplica limite de
  tamanho antes de qualquer armazenamento ou renderização.
- E-mail validado por regex estrita e campos com `maxLength` no HTML.
- Todo conteúdo dinâmico é renderizado por *data binding* do React (escapado automaticamente);
  **não há uso de `innerHTML`, `dangerouslySetInnerHTML` ou `eval`** em nenhum ponto do código.

### 3. A07 — Identification and Authentication Failures

**Onde:** `src/lib/auth.ts` (`validatePasswordStrength`, `login`, `lockoutSecondsLeft`, `logout`).

- **Complexidade de senha:** mínimo de 8 caracteres com maiúscula, minúscula, número e
  caractere especial, verificada antes do envio.
- **Rate limiting:** após 5 tentativas inválidas o login é bloqueado por 60 segundos, com
  contador regressivo na interface e botão desabilitado.
- **Sessão:** token gerado com `crypto.randomUUID()`, expiração de 30 minutos e
  **invalidação completa no logout** (`localStorage` e `sessionStorage` limpos), seguida de
  redirecionamento imediato para a tela de login.
- Mensagens de erro genéricas evitam enumeração de usuários válidos.

## Licença

Projeto acadêmico/demonstrativo.
