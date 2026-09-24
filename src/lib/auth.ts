/**
 * Hyphas — módulo de autenticação (client-side, demonstrativo).
 *
 * Mitigações OWASP aplicadas aqui:
 * - A01 Broken Access Control: a sessão é a única fonte de verdade consultada
 *   pelos guardas de rota (ver isAuthenticated / getSession).
 * - A03 Injection / XSS: sanitizeText() remove caracteres de marcação de toda
 *   entrada antes de ser armazenada ou renderizada.
 * - A07 Authentication Failures: complexidade mínima de senha, rate-limiting
 *   de tentativas inválidas e invalidação completa da sessão no logout.
 */

const SESSION_KEY = "hyphas.session";
const ATTEMPTS_KEY = "hyphas.attempts";

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutos
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 1 minuto de bloqueio

// Credenciais de demonstração (aplicação sem backend).
const DEMO_EMAIL = "aluno@hyphas.art";
const DEMO_PASSWORD = "Hyphas@2026";

export type Session = {
  token: string;
  email: string;
  name: string;
  expiresAt: number;
};

/** A03 — remove caracteres usados em injeção de HTML/script e limita tamanho. */
export function sanitizeText(value: string, maxLength = 120): string {
  return value
    .replace(/[<>"'`\\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-zA-Z]{2,}$/.test(value);
}

/** A07 — política de complexidade mínima de senha. */
export function validatePasswordStrength(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 8) issues.push("mínimo de 8 caracteres");
  if (!/[A-Z]/.test(password)) issues.push("uma letra maiúscula");
  if (!/[a-z]/.test(password)) issues.push("uma letra minúscula");
  if (!/[0-9]/.test(password)) issues.push("um número");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("um caractere especial");
  return issues;
}

function browser(): boolean {
  return typeof window !== "undefined";
}

function createToken(): string {
  if (browser() && window.crypto?.randomUUID) return window.crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export function getSession(): Session | null {
  if (!browser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session?.token || typeof session.expiresAt !== "number") {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    if (Date.now() > session.expiresAt) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

type Attempts = { count: number; lockedUntil: number };

function readAttempts(): Attempts {
  if (!browser()) return { count: 0, lockedUntil: 0 };
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw) as Attempts;
    return { count: Number(parsed.count) || 0, lockedUntil: Number(parsed.lockedUntil) || 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function writeAttempts(attempts: Attempts) {
  if (!browser()) return;
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

/** A07 — segundos restantes de bloqueio por excesso de tentativas. */
export function lockoutSecondsLeft(): number {
  const { lockedUntil } = readAttempts();
  const left = lockedUntil - Date.now();
  return left > 0 ? Math.ceil(left / 1000) : 0;
}

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

export function login(rawEmail: string, password: string): LoginResult {
  const locked = lockoutSecondsLeft();
  if (locked > 0) {
    return {
      ok: false,
      error: `Muitas tentativas inválidas. Tente novamente em ${locked}s.`,
    };
  }

  const email = sanitizeText(rawEmail, 190).toLowerCase();

  const ok = email === DEMO_EMAIL && password === DEMO_PASSWORD;
  if (!ok) {
    const attempts = readAttempts();
    const count = attempts.count + 1;
    const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
    writeAttempts({ count: lockedUntil ? 0 : count, lockedUntil });
    return {
      ok: false,
      error: lockedUntil
        ? "Limite de tentativas atingido. Acesso bloqueado por 1 minuto."
        : `Credenciais inválidas. Tentativas restantes: ${MAX_ATTEMPTS - count}.`,
    };
  }

  writeAttempts({ count: 0, lockedUntil: 0 });
  const session: Session = {
    token: createToken(),
    email,
    name: "Kyccia",
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

/** A07 — invalidação completa do token/sessão. */
export function logout() {
  if (!browser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
