import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { isAuthenticated, register, validatePasswordStrength } from "@/lib/auth";

export const Route = createFileRoute("/cadastro")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Criar conta — Hyphas" },
      {
        name: "description",
        content: "Cadastre-se no Hyphas e comece seus estudos de ilustração botânica.",
      },
      { property: "og:title", content: "Criar conta — Hyphas" },
      {
        property: "og:description",
        content: "Crie sua conta de aluno no portal de cursos botânicos Hyphas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40";

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  const issues = password ? validatePasswordStrength(password) : [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setBusy(true);
    const result = await register(name, email, password);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setDone(true);
  }

  return (
    <main className="bg-soft flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <span className="bg-botanical grid h-11 w-11 place-items-center rounded-xl font-display text-lg text-primary-foreground">
            H
          </span>
          <h1 className="font-display text-2xl text-foreground">Hyphas</h1>
        </div>

        {done ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl text-foreground">Conta criada 🌿</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Seu cadastro foi concluído. Entre com seu e-mail e senha.
            </p>
            <Link
              to="/"
              className="bg-botanical mt-6 block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              Ir para o login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-display text-3xl text-foreground">Criar conta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cadastre-se para acessar cursos, galeria e guias.
            </p>
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Nome
                </label>
                <input id="name" maxLength={40} autoComplete="name" value={name}
                  onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  E-mail
                </label>
                <input id="email" type="email" maxLength={190} autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} className={inputClass}
                  placeholder="voce@exemplo.com" />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                  Senha
                </label>
                <input id="password" type="password" maxLength={128} autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                {issues.length > 0 && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Falta: {issues.join(", ")}.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-foreground">
                  Confirmar senha
                </label>
                <input id="confirm" type="password" maxLength={128} autoComplete="new-password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
              </div>
              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button type="submit" disabled={busy}
                className="bg-botanical shadow-petal w-full rounded-lg px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-50">
                {busy ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/" className="font-medium text-primary hover:underline">Entrar</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
