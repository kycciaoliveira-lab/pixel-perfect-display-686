import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import hero from "@/assets/hero.jpg";
import {
  DEMO_CREDENTIALS,
  isAuthenticated,
  isValidEmail,
  lockoutSecondsLeft,
  login,
  sanitizeText,
  validatePasswordStrength,
} from "@/lib/auth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Hyphas — Portal de Cursos e Desenhos Botânicos" },
      {
        name: "description",
        content:
          "Entre no Hyphas: cursos de ilustração botânica para iniciantes, galeria de desenhos e guias de estudo.",
      },
      { property: "og:title", content: "Hyphas — Portal de Cursos e Desenhos Botânicos" },
      {
        property: "og:description",
        content: "Cursos de desenho botânico para iniciantes, galeria interativa e guias em PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [lock, setLock] = useState(0);

  // A01 — quem já tem sessão válida não vê a tela de login.
  useEffect(() => {
    if (isAuthenticated()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  // A07 — contador visível do bloqueio por tentativas inválidas.
  useEffect(() => {
    setLock(lockoutSecondsLeft());
    const id = setInterval(() => setLock(lockoutSecondsLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    // A03 — toda entrada é sanitizada antes de qualquer uso.
    const safeEmail = sanitizeText(email, 190);
    if (!safeEmail) nextErrors.email = "Informe seu e-mail.";
    else if (!isValidEmail(safeEmail)) nextErrors.email = "Formato de e-mail inválido.";

    if (!password) nextErrors.password = "Informe sua senha.";
    else {
      const issues = validatePasswordStrength(password);
      if (issues.length) nextErrors.password = `A senha precisa de: ${issues.join(", ")}.`;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await login(safeEmail, password);
    if (!result.ok) {
      setErrors({ form: result.error });
      setLock(lockoutSecondsLeft());
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  const blocked = lock > 0;

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src={hero}
          alt="Ilustração botânica tropical com orquídeas, girassóis e hibiscos"
          className="h-full w-full object-cover"
          width={1600}
          height={912}
        />
        <div className="absolute inset-0 bg-botanical opacity-25" />
        <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-card/85 p-6 backdrop-blur">
          <p className="font-display text-2xl text-foreground">
            Desenhe a natureza, um traço por vez.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cursos, galeria e guias para quem está começando na ilustração botânica.
          </p>
        </div>
      </section>

      <section className="bg-soft flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <span className="bg-botanical grid h-11 w-11 place-items-center rounded-xl font-display text-lg text-primary-foreground">
              H
            </span>
            <div>
              <h1 className="font-display text-2xl leading-none text-foreground">Hyphas</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Cursos botânicos
              </p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-foreground">Entrar no portal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse seu painel de aluno, a galeria e os guias de estudo.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                maxLength={190}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
                placeholder="voce@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {errors.form && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={blocked}
              className="bg-botanical shadow-petal w-full rounded-lg px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {blocked ? `Bloqueado (${lock}s)` : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>


          <div className="mt-8 rounded-xl border border-border bg-card/70 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Acesso de demonstração</p>
            <p className="mt-1">
              {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
