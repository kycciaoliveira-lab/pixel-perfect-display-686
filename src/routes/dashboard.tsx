import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { artworks, courses, guides } from "@/lib/hyphas-data";
import { getSession, isAuthenticated, logout, sanitizeText } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  // A01 — guarda de rota: sem sessão válida o acesso direto pela URL é barrado.
  beforeLoad: () => {
    if (typeof window !== "undefined" && !isAuthenticated()) {
      throw redirect({ to: "/", replace: true });
    }
  },
  head: () => ({
    meta: [
      { title: "Painel do Aluno — Hyphas" },
      {
        name: "description",
        content:
          "Painel do aluno Hyphas: progresso dos cursos, galeria de ilustrações botânicas e guias de estudo.",
      },
      { property: "og:title", content: "Painel do Aluno — Hyphas" },
      {
        property: "og:description",
        content: "Acompanhe seus cursos de desenho botânico, explore a galeria e baixe guias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const filters = ["Todas", "Orquídea", "Girassol", "Hibisco"] as const;

function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("aluno(a)");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/", replace: true });
      return;
    }
    setName(sanitizeText(session.name, 40));
  }, [navigate]);

  const visible = useMemo(
    () => (filter === "Todas" ? artworks : artworks.filter((a) => a.type === filter)),
    [filter],
  );

  function handleLogout() {
    logout(); // A07 — invalida token/sessão por completo
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-soft">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-botanical grid h-9 w-9 place-items-center rounded-lg font-display text-primary-foreground">
              H
            </span>
            <span className="font-display text-xl text-foreground">Hyphas</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-12">
        <section>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Bem-vinda</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">Olá, {name} 🌿</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Continue de onde parou nos seus estudos de desenho botânico.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Catálogo de cursos</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="shadow-petal rounded-2xl border border-border bg-card p-6"
              >
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {course.level}
                </span>
                <h3 className="mt-4 font-display text-xl text-foreground">{course.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
                <p className="mt-4 text-xs text-muted-foreground">{course.lessons} aulas</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-botanical h-full rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-foreground">
                  {course.progress}% concluído
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-foreground">Galeria de ilustrações</h2>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={
                    f === filter
                      ? "bg-botanical rounded-full px-4 py-1.5 text-sm font-medium text-primary-foreground"
                      : "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground transition hover:bg-secondary"
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((art) => (
              <figure
                key={art.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card"
              >
                <img
                  src={art.image}
                  alt={art.title}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <figcaption className="p-4">
                  <p className="font-medium text-foreground">{art.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {art.type} · {art.technique}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Guias de estudo (PDF)</h2>
          <ul className="mt-6 space-y-3">
            {guides.map((guide) => (
              <li
                key={guide.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4"
              >
                <div>
                  <p className="font-medium text-foreground">{guide.title}</p>
                  <p className="text-xs text-muted-foreground">PDF · {guide.pages} páginas</p>
                </div>
                <button
                  onClick={() => alert("Download simulado: material de demonstração.")}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
                >
                  Baixar
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
