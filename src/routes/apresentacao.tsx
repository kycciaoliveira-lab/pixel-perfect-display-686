import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Grid2X2, Leaf, Maximize, Moon, PanelLeft, Play, Printer, StickyNote, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeckSlide, slides } from "@/components/slides/deck";
import { ScaledSlide } from "@/components/slides/ScaledSlide";

export const Route = createFileRoute("/apresentacao")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    slide: Math.max(1, Math.min(slides.length, Number(search["slide"]) || 1)),
    print: search["print"] === true || search["print"] === "true",
    presenter: search["presenter"] === true || search["presenter"] === "true",
  }),
  head: () => ({ meta: [
    { title: "Hyphas — Apresentação do processo de execução" },
    { name: "description", content: "Aprenda a executar, testar e publicar o Hyphas: cadastro, segurança, AWS, DuckDNS e GitHub Actions." },
    { property: "og:title", content: "Hyphas — Da ideia à publicação" },
    { property: "og:description", content: "Uma apresentação passo a passo do processo de execução do portal Hyphas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Presentation,
});

function Presentation() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const index = search.slide - 1;
  const [grid, setGrid] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [idle, setIdle] = useState(false);
  const touchStart = useRef<number | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [order, setOrder] = useState(slides.map((_, i) => i));
  const [selected, setSelected] = useState<number[]>([]);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    navigate({ to: "/apresentacao", search: { ...search, slide: clamped + 1 }, replace: true });
    channel.current?.postMessage({ index: clamped });
  };

  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem("hyphas.presentation.notes") || "{}")); } catch { /* use original notes */ }
    setDark(document.documentElement.classList.contains("dark"));
    const bc = new BroadcastChannel("hyphas-presentation");
    channel.current = bc;
    bc.onmessage = (event) => {
      if (typeof event.data.index === "number") navigate({ to: "/apresentacao", search: { ...search, slide: event.data.index + 1 }, replace: true });
    };
    return () => { bc.close(); channel.current = null; };
  }, [search.presenter]);

  useEffect(() => { document.title = `${index + 1}/${slides.length} — ${slides[index]?.title} · Hyphas`; }, [index]);
  useEffect(() => {
    if (!presenting && !search.presenter) return;
    const timer = setInterval(() => setElapsed(value => value + 1), 1000);
    return () => clearInterval(timer);
  }, [presenting, search.presenter]);
  useEffect(() => {
    const onFullscreen = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);
  useEffect(() => {
    if (!presenting) return;
    let timeout: ReturnType<typeof setTimeout>;
    const move = () => { setIdle(false); clearTimeout(timeout); timeout = setTimeout(() => setIdle(true), 2500); };
    move();
    window.addEventListener("pointermove", move);
    return () => { clearTimeout(timeout); window.removeEventListener("pointermove", move); };
  }, [presenting]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return;
      if (["ArrowRight", " ", "ArrowLeft", "F5"].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowRight" || event.key === " ") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key.toLowerCase() === "g") setGrid(value => !value);
      if (event.key === "F5") startPresent();
      if (event.key === "Escape") { setPresenting(false); setGrid(false); if (document.fullscreenElement) document.exitFullscreen(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  async function startPresent() {
    setGrid(false); setPresenting(true); setElapsed(0);
    try { await document.documentElement.requestFullscreen(); } catch { /* full-window mode remains available */ }
  }
  function saveNote(value: string) {
    const updated = { ...notes, [index]: value };
    setNotes(updated);
    localStorage.setItem("hyphas.presentation.notes", JSON.stringify(updated));
  }
  const swipe = {
    onTouchStart: (event: React.TouchEvent) => { touchStart.current = event.touches[0]?.clientX ?? null; },
    onTouchEnd: (event: React.TouchEvent) => {
      const end = event.changedTouches[0]?.clientX;
      if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) go(index + (end < touchStart.current ? 1 : -1));
      touchStart.current = null;
    },
  };
  const note = notes[index] ?? slides[index]?.notes ?? "";

  if (search.print) return <main className="deck-print"><div className="print-actions"><Button onClick={() => window.print()}><Printer /> Salvar como PDF</Button><Button variant="outline" asChild><Link to="/apresentacao" search={{ ...search, print: false }}>Voltar</Link></Button></div>{slides.map((_, i) => <DeckSlide key={i} index={i} />)}</main>;
  if (presenting) return <main className={`presentation-full ${idle ? "cursor-hidden" : ""}`} {...swipe}><ScaledSlide><DeckSlide index={index} /></ScaledSlide><div className={`present-controls ${idle ? "controls-hidden" : ""}`}><Button variant="secondary" size="icon" title="Slide anterior" aria-label="Slide anterior" disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft /></Button><span>{index + 1} / {slides.length}</span><Button variant="secondary" size="icon" title="Próximo slide" aria-label="Próximo slide" disabled={index === slides.length - 1} onClick={() => go(index + 1)}><ArrowRight /></Button><Button variant="secondary" size="icon" title="Sair da apresentação" aria-label="Sair da apresentação" onClick={() => { setPresenting(false); if (document.fullscreenElement) document.exitFullscreen(); }}><X /></Button></div></main>;
  if (search.presenter) return <main className="presenter-page"><header><h1 className="font-display text-2xl">Hyphas · Apresentador</h1><span className="presenter-timer">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}</span><Button variant="outline" onClick={() => setElapsed(0)}>Reiniciar tempo</Button></header><div className="presenter-slides"><div {...swipe}><ScaledSlide><DeckSlide index={index} /></ScaledSlide></div><div><p>Próximo slide</p><ScaledSlide><DeckSlide index={Math.min(index + 1, slides.length - 1)} /></ScaledSlide></div></div><p className="presenter-note">{note}</p><div className="flex gap-3"><Button disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft /> Anterior</Button><Button disabled={index === slides.length - 1} onClick={() => go(index + 1)}>Próximo <ArrowRight /></Button></div></main>;

  return <main className="deck-editor">
    <header className="deck-toolbar"><Button variant="ghost" size="icon" asChild title="Voltar ao portal"><Link to="/" aria-label="Voltar ao portal"><ArrowLeft /></Link></Button><div className="deck-brand"><Leaf /><span>Hyphas</span><span className="deck-divider" /><p>Da ideia à publicação</p></div><div className="deck-tools">
      <Button variant={grid ? "secondary" : "ghost"} size="icon" aria-label="Visão geral" title="Visão geral" onClick={() => setGrid(!grid)}><Grid2X2 /></Button>
      <Button variant={notesOpen ? "secondary" : "ghost"} size="icon" aria-label="Notas do apresentador" title="Notas do apresentador" onClick={() => setNotesOpen(!notesOpen)}><StickyNote /></Button>
      <Button variant="ghost" size="icon" aria-label="Alternar tema" title="Alternar tema" onClick={() => { document.documentElement.classList.toggle("dark"); setDark(!dark); }}>{dark ? <Sun /> : <Moon />}</Button>
      <Button variant="ghost" size="icon" asChild title="Salvar como PDF"><Link to="/apresentacao" search={{ ...search, print: true }} aria-label="Salvar como PDF"><Printer /></Link></Button>
      <Button variant="ghost" size="icon" aria-label="Copiar link do slide" title="Copiar link do slide" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } }}>{copied ? <Check /> : <Copy />}</Button>
      <Button className="present-button" onClick={startPresent}><Play /> <span>Apresentar</span></Button>
    </div></header>
    <div className="deck-workspace">
      {sidebar && !grid && <aside className="deck-sidebar"><div className="sidebar-heading"><span>SLIDES</span><span>{slides.length}</span></div>{slides.map((slide, i) => <Button key={slide.title} variant="ghost" className={`slide-thumbnail ${i === index ? "selected" : ""}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}: ${slide.title}`}><div className="thumb-image"><ScaledSlide><DeckSlide index={i} /></ScaledSlide></div><div className="thumb-label"><span>{String(i + 1).padStart(2, "0")}</span><span>{slide.title}</span></div></Button>)}</aside>}
      <section className="deck-main"><div className="deck-context"><div><Button variant="ghost" size="icon" aria-label="Alternar lista de slides" title="Alternar lista de slides" onClick={() => setSidebar(!sidebar)}><PanelLeft /></Button><span>{grid ? "Visão geral" : slides[index]?.chapter}</span></div><span className="deck-duration">{slides[index]?.time} <span> / 10 min</span></span></div>
        {grid ? <div className="deck-grid">{order.map(i => <article key={i} draggable onDragStart={() => { dragIndex.current = i; }} onDragOver={event => event.preventDefault()} onDrop={() => { const from = dragIndex.current; if (from === null) return; const updated = order.filter(n => n !== from); updated.splice(updated.indexOf(i), 0, from); setOrder(updated); }}><Button variant="ghost" className="grid-thumb" onClick={() => { go(i); setGrid(false); }}><ScaledSlide><DeckSlide index={i} /></ScaledSlide></Button><div className="grid-label"><input type="checkbox" aria-label={`Selecionar slide ${i + 1}`} checked={selected.includes(i)} onChange={event => setSelected(event.target.checked ? [...selected, i] : selected.filter(n => n !== i))} /><span>{i + 1}. {slides[i]?.title}</span></div></article>)}{selected.length > 0 && <Button variant="outline" className="grid-selection" onClick={() => setSelected([])}>Limpar seleção ({selected.length})</Button>}</div> : <div className="deck-canvas" {...swipe}><div className="canvas-slide"><ScaledSlide><DeckSlide index={index} /></ScaledSlide></div></div>}
        <footer className="deck-navigation"><span className="navigation-label">PROCESSO DE EXECUÇÃO</span><div><Button variant="ghost" size="icon" title="Slide anterior" aria-label="Slide anterior" onClick={() => go(index - 1)} disabled={index === 0}><ArrowLeft /></Button><span aria-live="polite">{String(index + 1).padStart(2, "0")} <span className="text-muted-foreground">/ {slides.length}</span></span><Button variant="ghost" size="icon" title="Próximo slide" aria-label="Próximo slide" onClick={() => go(index + 1)} disabled={index === slides.length - 1}><ArrowRight /></Button></div><Button variant="ghost" size="icon" aria-label="Abrir visão do apresentador" title="Abrir visão do apresentador" onClick={() => window.open(`/apresentacao?slide=${index + 1}&presenter=true`, "hyphas-presenter")}><Maximize /></Button></footer>
        {notesOpen && <div className="deck-notes"><label htmlFor="presenter-notes"><StickyNote size={16} /> Notas do apresentador <span>Salvas neste navegador</span></label><textarea id="presenter-notes" value={note} onChange={event => saveNote(event.target.value)} /></div>}
      </section>
    </div>
  </main>;
}