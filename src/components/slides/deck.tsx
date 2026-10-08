import { ArrowRight, Check, Code2, Database, GitBranch, Globe, Leaf, LockKeyhole, Monitor, Server, ShieldCheck, UserRound } from "lucide-react";
import hero from "@/assets/hero.jpg";
import orchid from "@/assets/orquidea.jpg";
import sunflower from "@/assets/girassol.jpg";
import hibiscus from "@/assets/hibisco.jpg";
import { SlideLayout } from "./ScaledSlide";

export const slides = [
  { title: "Hyphas", chapter: "Abertura", time: "0:00–0:40", notes: "Apresente o Hyphas como um projeto de aprendizagem em ilustração botânica. Explique que veremos tanto a experiência do aluno quanto o caminho para executar e publicar o projeto." },
  { title: "Do projeto ao navegador", chapter: "Visão geral", time: "0:40–1:20", notes: "Percorra as quatro etapas. O código define a experiência; a execução local permite conferir as páginas; os testes validam o fluxo; a publicação disponibiliza o portal na internet." },
  { title: "Preparar e executar", chapter: "Execução local", time: "1:20–2:10", notes: "Tenha Node.js compatível com as dependências e Git instalados. Clone o endereço real do repositório. Execute os comandos no terminal, dentro da pasta do projeto. Abra a URL exibida pelo comando de desenvolvimento, normalmente localhost:8080 neste projeto." },
  { title: "Criar a conta do aluno", chapter: "Cadastro", time: "2:10–2:50", notes: "Mostre a tela Cadastre-se no portal. Preencha nome, e-mail, senha e confirmação. As contas desta versão são locais ao navegador: não há banco central. Não exponha credenciais reais durante a gravação." },
  { title: "Entrar, estudar, sair", chapter: "Experiência do aluno", time: "2:50–3:40", notes: "Mostre as boas-vindas personalizadas, os cursos e a galeria. Os percentuais de progresso são dados de demonstração, não registros reais das aulas. Os downloads dos guias são simulados. Termine clicando em Sair." },
  { title: "Segurança: intenção e limites", chapter: "OWASP", time: "3:40–4:40", notes: "Explique A01, A03 e A07 como práticas demonstradas. O navegador pode ser alterado pelo próprio usuário, então os guardas locais e o bloqueio de tentativas não protegem dados em produção. SHA-256 com salt não substitui um serviço de autenticação com derivação de senha apropriada. React escapa texto; sanitização não é proteção universal contra injeções." },
  { title: "Conferir antes de publicar", chapter: "Validação", time: "4:40–5:20", notes: "Faça as verificações numa conta de teste. Em uma janela anônima, abra /dashboard para verificar o retorno ao login. Cadastre, entre, filtre e saia. Não apresente o bloqueio de um minuto ao vivo se isso comprometer o tempo; use uma captura preparada." },
  { title: "O caminho até a AWS", chapter: "Publicação", time: "5:20–6:00", notes: "Este é o desenho da configuração proposta para a VM, não confirmação de que ela já está funcionando. DuckDNS resolve o domínio para o IP público. Nginx recebe HTTP/HTTPS e encaminha para o processo da aplicação, gerenciado por PM2." },
  { title: "Preparar a VM", chapter: "AWS · PM2", time: "6:00–7:00", notes: "O projeto utiliza TanStack Start, Vite e Nitro. Verifique no build da VM se o preset node-server gerou .output/server/index.mjs antes de iniciar o PM2. Os comandos representam o fluxo previsto no workflow atual; a configuração final na AWS ainda precisa ser validada. Configure pm2 startup e execute o comando que ele exibir para reiniciar após reboot." },
  { title: "DuckDNS, Nginx e HTTPS", chapter: "Domínio", time: "7:00–8:00", notes: "Use hyphas.duckdns.org apontando para o IP público atual. Libere 80 e 443 no Security Group; restrinja SSH às origens autorizadas, não ao mundo. Configure proxy_pass para 127.0.0.1:3000. Certbot precisa alcançar a porta 80; timeout aponta para conectividade, firewall ou DNS. Não exponha a porta 3000 publicamente." },
  { title: "Atualizar com GitHub Actions", chapter: "Entrega contínua", time: "8:00–9:00", notes: "Cada push na main dispara o workflow. Os segredos VM_HOST, VM_USER e VM_SSH_KEY ficam nos Secrets do GitHub, nunca no código, nos slides ou na gravação. A VM precisa acessar o repositório, ter dependências instaladas e o app configurado. Confira o resultado na aba Actions e no site." },
  { title: "Executar. Conferir. Compartilhar.", chapter: "Conclusão", time: "9:00–10:00", notes: "Recapitule: rodar localmente, testar o fluxo, preparar a VM, configurar domínio e acompanhar o deploy. Antes de uso real, substituir a autenticação demonstrativa por autenticação e dados no servidor. Compartilhe apenas a janela da apresentação no Teams. Confira áudio e imagem antes de publicar no YouTube. Reserve os últimos segundos para perguntas." },
];

const steps = ["Preparar", "Executar", "Conferir", "Publicar"];

function Footer({ index }: { index: number }) {
  return <footer className="slide-footer"><span>HYPHAS / PROCESSO DE EXECUÇÃO</span><span>{String(index + 1).padStart(2, "0")} / {slides.length}</span></footer>;
}

function Heading({ index, subtitle }: { index: number; subtitle: string }) {
  return <header className="slide-heading"><p className="slide-kicker">{slides[index]?.chapter}</p><h2 className="slide-title">{slides[index]?.title}</h2><p className="slide-body slide-muted">{subtitle}</p></header>;
}

function Checklist({ items }: { items: string[] }) {
  return <ul className="slide-checklist">{items.map(item => <li key={item}><Check size={32} /><span>{item}</span></li>)}</ul>;
}

function Commands({ lines }: { lines: string[] }) {
  return <div className="slide-terminal"><div className="slide-caption terminal-label"><Code2 size={28} /> TERMINAL</div>{lines.map((line, i) => <code key={i}><span>$</span> {line}</code>)}</div>;
}

export function DeckSlide({ index }: { index: number }) {
  let content;
  switch (index) {
    case 0:
      return <SlideLayout className="slide-cover"><img src={hero} alt="Ilustrações botânicas do Hyphas" /><div className="slide-cover-shade" /><div className="slide-cover-copy"><p className="slide-kicker">CURSOS E DESENHOS BOTÂNICOS</p><h1>Hyphas</h1><p className="slide-subtitle">Da ideia à publicação.</p><p className="slide-body-lg">O processo de execução do projeto,<br />passo a passo.</p><div className="cover-signature"><span>Kyccia Oliveira</span><span>Apresentação · 10 minutos</span></div></div><Footer index={index} /></SlideLayout>;
    case 1:
      content = <><Heading index={index} subtitle="Uma sequência para entender, executar e verificar o portal." /><div className="slide-timeline">{steps.map((step, i) => <article key={step}><span className="step-number">0{i + 1}</span><h3 className="slide-subtitle">{step}</h3><p className="slide-body">{["Obter o código e instalar as dependências.", "Abrir o portal no ambiente local.", "Validar cadastro, login e navegação.", "Configurar a VM e disponibilizar o site."][i]}</p>{i < 3 && <ArrowRight className="timeline-arrow" />}</article>)}</div><p className="slide-bottom-note"><Leaf /> A experiência do aluno é o ponto de partida; a publicação é o resultado.</p></>;
      break;
    case 2:
      content = <><Heading index={index} subtitle="Comece em seu computador, antes de alterar a VM." /><div className="slide-two-columns"><div><h3 className="slide-subtitle">O que preparar</h3><Checklist items={["Git e Node.js compatível instalados", "Endereço do repositório no GitHub", "Terminal aberto na pasta do projeto"]} /><p className="slide-callout">Abra a URL exibida no terminal.<br />Neste projeto: localhost:8080.</p></div><Commands lines={["git clone <URL_DO_REPOSITORIO>", "cd <PASTA_DO_PROJETO>", "npm install", "npm run dev"]} /></div></>;
      break;
    case 3:
      content = <><Heading index={index} subtitle="O primeiro passo da jornada dentro do Hyphas." /><div className="slide-two-columns"><div className="slide-form-example"><p className="slide-kicker"><UserRound size={30} /> CADASTRO</p>{["Nome", "E-mail", "Senha", "Confirmar senha"].map((label, i) => <div key={label}><span className="slide-caption">{label}</span><p className="example-field">{["Seu nome", "seu@email.com", "••••••••", "••••••••"][i]}</p></div>)}</div><div><h3 className="slide-subtitle">Preencher → validar → entrar</h3><Checklist items={["Informe nome e e-mail válidos.", "Use 8 ou mais caracteres: maiúscula, minúscula, número e símbolo.", "Confirme a senha e volte ao login."]} /><p className="slide-callout">Versão demonstrativa: a conta fica somente no navegador em que foi criada.</p></div></div></>;
      break;
    case 4:
      content = <><Heading index={index} subtitle="A sessão libera o painel; o logout encerra o acesso local." /><div className="slide-gallery">{[{ image: orchid, title: "Cursos", text: "Catálogo e progresso de exemplo." }, { image: sunflower, title: "Galeria", text: "Filtro por tipo de flor." }, { image: hibiscus, title: "Guias", text: "Materiais com download simulado." }].map(item => <article key={item.title}><img src={item.image} alt={item.title} /><h3 className="slide-subtitle">{item.title}</h3><p className="slide-body">{item.text}</p></article>)}</div></>;
      break;
    case 5:
      content = <><Heading index={index} subtitle="Práticas demonstradas não equivalem a proteção de produção." /><div className="slide-security">{[{ icon: LockKeyhole, code: "A01", title: "Controle de acesso", text: "Guarda de rota e sessão local com expiração." }, { icon: Code2, code: "A03", title: "Entradas e XSS", text: "Validação, sanitização e texto escapado pelo React." }, { icon: ShieldCheck, code: "A07", title: "Autenticação", text: "Senha forte, limite local de tentativas e logout." }].map(item => <article key={item.code}><item.icon size={62} /><p className="slide-kicker">{item.code}</p><h3 className="slide-subtitle">{item.title}</h3><p className="slide-body">{item.text}</p></article>)}</div><p className="slide-callout">Para uso real: autenticação e autorização no servidor. Contas locais, bloqueio local e hash SHA-256 não são suficientes.</p></>;
      break;
    case 6:
      content = <><Heading index={index} subtitle="Um teste curto para cada comportamento importante." /><div className="slide-two-columns"><Checklist items={["Cadastrar uma conta de teste e entrar.", "Conferir o nome nas boas-vindas.", "Filtrar a galeria por tipo de flor.", "Sair e tentar acessar /dashboard."]} /><div className="slide-test-result"><ShieldCheck size={100} /><h3 className="slide-subtitle">Sem sessão?</h3><p className="slide-body-lg">O acesso a /dashboard deve retornar à tela de login.</p><p className="slide-caption">Teste em janela anônima para começar sem sessão local.</p></div></div></>;
      break;
    case 7:
      content = <><Heading index={index} subtitle="Arquitetura proposta para publicar o Hyphas na VM." /><div className="architecture-flow">{[{ icon: Monitor, title: "Visitante", text: "Navegador" }, { icon: Globe, title: "DuckDNS", text: "Domínio → IP" }, { icon: ShieldCheck, title: "Nginx", text: "HTTPS · proxy" }, { icon: Server, title: "Aplicação", text: "PM2 · porta 3000" }].map((item, i) => <article key={item.title}><item.icon size={90} /><h3 className="slide-subtitle">{item.title}</h3><p className="slide-body">{item.text}</p>{i < 3 && <ArrowRight className="timeline-arrow" />}</article>)}</div><p className="slide-callout">A VM precisa estar configurada e validada. O desenho não confirma que a publicação externa já funciona.</p></>;
      break;
    case 8:
      content = <><Heading index={index} subtitle="Gerar a versão de produção e manter o processo em execução." /><div className="slide-two-columns"><Commands lines={["cd ~/hyphas", "npm install", "NITRO_PRESET=node-server npm run build", "PORT=3000 pm2 start \\", "  .output/server/index.mjs --name hyphas", "pm2 save"]} /><div><h3 className="slide-subtitle">Verificações na VM</h3><Checklist items={["Instalar PM2 e conferir a saída do build.", "Validar se o arquivo index.mjs foi gerado.", "Testar a aplicação em 127.0.0.1:3000.", "Configurar pm2 startup para reinícios."]} /><p className="slide-caption slide-muted">Fluxo previsto no deploy atual; validar compatibilidade do build na VM.</p></div></div></>;
      break;
    case 9:
      content = <><Heading index={index} subtitle="O domínio aponta; o Nginx encaminha; o certificado protege o tráfego." /><div className="slide-two-columns"><Checklist items={["DuckDNS → IP público atual da VM.", "Liberar HTTP 80 e HTTPS 443 na AWS.", "Nginx → proxy para 127.0.0.1:3000.", "Executar Certbot após testar HTTP."]} /><div><div className="slide-domain"><Globe size={58} /><span>hyphas.duckdns.org</span></div><Commands lines={["sudo nginx -t", "sudo systemctl reload nginx", "sudo certbot --nginx \\", "  -d hyphas.duckdns.org"]} /><p className="slide-caption slide-muted">Timeout no Certbot? Confira DNS, porta 80 e firewall. Restrinja SSH a origens autorizadas.</p></div></div></>;
      break;
    case 10:
      content = <><Heading index={index} subtitle="Um push na main inicia a atualização automática prevista no projeto." /><div className="slide-delivery"><GitBranch size={72} /><span>Push na main</span><ArrowRight /><span>Actions · SSH</span><ArrowRight /><span>Build na VM</span><ArrowRight /><span>PM2 reinicia</span></div><div className="slide-two-columns"><div><h3 className="slide-subtitle">Segredos no GitHub</h3><p className="slide-body mono">VM_HOST · VM_USER · VM_SSH_KEY</p><p className="slide-body slide-muted">Nunca publique a chave privada no código ou na gravação.</p></div><div><h3 className="slide-subtitle">Como conferir</h3><Checklist items={["Acompanhar a execução na aba Actions.", "Verificar os logs se houver falha.", "Abrir o site e conferir a alteração."]} /></div></div></>;
      break;
    default:
      return <SlideLayout className="slide-ending"><Leaf size={98} /><p className="slide-kicker">DA IDEIA À PUBLICAÇÃO</p><h2 className="slide-title-lg">Executar. Conferir.<br />Compartilhar.</h2><div className="ending-summary"><p><Check /> Rodar e testar o portal</p><p><Check /> Validar VM, domínio e deploy</p><p><Database /> Evoluir para dados e autenticação no servidor</p></div><p className="slide-body">Teams: compartilhar a janela · YouTube: revisar áudio e imagem</p><Footer index={index} /></SlideLayout>;
  }
  return <SlideLayout>{content}<Footer index={index} /></SlideLayout>;
}