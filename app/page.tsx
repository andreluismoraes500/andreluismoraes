"use client";

import { useState } from "react";
import SpotlightCard from "@/components/SpotlightCard";
import DotGrid from "@/components/DotGrid";
import GradientText from "@/components/GradientText";
import LogoLoop from "@/components/LogoLoop";
import SplashCursor from "@/components/SplashCursor";
import Header from "@/components/Header";
import CountUp from "@/components/CountUp";
import ShinyText from "@/components/ShinyText";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiFigma,
  SiMongodb,
  SiPrisma,
  SiVercel,
  SiPython,
  SiGraphql,
  SiRedis,
} from "react-icons/si";
import {
  LuGlobe,
  LuAtom,
  LuShoppingCart,
  LuPlug,
  LuSmartphone,
  LuPalette,
  LuZap,
  LuSearch,
  LuBot,
  LuShieldCheck,
  LuCloud,
  LuBrain,
  LuArrowRight,
  LuArrowUp,
  LuMail,
  LuGithub,
  LuLinkedin,
  LuMessageCircle,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

const WHATSAPP = "https://wa.me/19989519186";
const EMAIL = "andreluismoraes500@gmail.com";

const techLogos = [
  {
    node: <SiReact />,
    title: "React",
    href: "https://react.dev",
    hoverColor: "#61dafb",
  },
  {
    node: <SiNextdotjs />,
    title: "Next.js",
    href: "https://nextjs.org",
    hoverColor: "#ffffff",
  },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://typescriptlang.org",
    hoverColor: "#3178c6",
  },
  {
    node: <SiJavascript />,
    title: "JavaScript",
    href: "https://developer.mozilla.org/docs/Web/JavaScript",
    hoverColor: "#f7df1e",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind",
    href: "https://tailwindcss.com",
    hoverColor: "#38bdf8",
  },
  {
    node: <SiNodedotjs />,
    title: "Node.js",
    href: "https://nodejs.org",
    hoverColor: "#5fa04e",
  },
  {
    node: <SiPostgresql />,
    title: "PostgreSQL",
    href: "https://postgresql.org",
    hoverColor: "#4169e1",
  },
  {
    node: <SiMongodb />,
    title: "MongoDB",
    href: "https://mongodb.com",
    hoverColor: "#47a248",
  },
  {
    node: <SiPrisma />,
    title: "Prisma",
    href: "https://prisma.io",
    hoverColor: "#7f9cf5",
  },
  {
    node: <SiDocker />,
    title: "Docker",
    href: "https://docker.com",
    hoverColor: "#2496ed",
  },
  {
    node: <SiGit />,
    title: "Git",
    href: "https://git-scm.com",
    hoverColor: "#f05032",
  },
  {
    node: <SiFigma />,
    title: "Figma",
    href: "https://figma.com",
    hoverColor: "#f24e1e",
  },
  {
    node: <SiVercel />,
    title: "Vercel",
    href: "https://vercel.com",
    hoverColor: "#ffffff",
  },
  {
    node: <SiGraphql />,
    title: "GraphQL",
    href: "https://graphql.org",
    hoverColor: "#e10098",
  },
  {
    node: <SiRedis />,
    title: "Redis",
    href: "https://redis.io",
    hoverColor: "#dc382d",
  },
  {
    node: <SiPython />,
    title: "Python",
    href: "https://python.org",
    hoverColor: "#3776ab",
  },
];

const projects = [
  {
    image: "/projects/grafello.png",
    caption: "Site institucional — Gráfica Grafello",
  },
  {
    image: "/projects/Horario-Escolar.png",
    caption: "Horário Escolar — Sitema de gerenciamento de horários escolares",
  },
];

const stats = [
  { to: 8, suffix: "+", label: "Anos de experiência" },
  { to: 4, suffix: "+", label: "Projetos entregues" },
  { to: 4, suffix: "+", label: "Clientes satisfeitos" },
  { to: 100, suffix: "%", label: "Foco em qualidade" },
];

type Tone = "cyan" | "pink" | "yellow" | "white";

const TONES: Record<
  Tone,
  { spotlight: string; iconBg: string; iconText: string }
> = {
  cyan: {
    spotlight: "rgba(0, 229, 255, 0.25)",
    iconBg: "bg-[#00e5ff]/15",
    iconText: "text-[#00e5ff]",
  },
  pink: {
    spotlight: "rgba(255, 0, 127, 0.25)",
    iconBg: "bg-[#ff007f]/15",
    iconText: "text-[#ff007f]",
  },
  yellow: {
    spotlight: "rgba(255, 230, 0, 0.22)",
    iconBg: "bg-[#ffe600]/15",
    iconText: "text-[#ffe600]",
  },
  white: {
    spotlight: "rgba(255,255,255,0.15)",
    iconBg: "bg-white/15",
    iconText: "text-white",
  },
};

const services: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: Tone;
}[] = [
  {
    icon: <LuGlobe />,
    title: "Sites & Landing Pages",
    desc: "Páginas institucionais, portfólios e LPs de alta conversão com performance impecável.",
    color: "cyan",
  },
  {
    icon: <LuAtom />,
    title: "Aplicações Web",
    desc: "SaaS, dashboards e sistemas internos com React, Next.js e TypeScript.",
    color: "pink",
  },
  {
    icon: <LuPalette />,
    title: "UI/UX Design",
    desc: "Interfaces modernas, acessíveis e focadas em conversão (Figma → Código).",
    color: "white",
  },
  {
    icon: <LuZap />,
    title: "Performance",
    desc: "Otimização Core Web Vitals, lazy loading, cache e redução de bundle.",
    color: "yellow",
  },
  {
    icon: <LuSearch />,
    title: "SEO Técnico",
    desc: "Metadados, schema.org, sitemaps e indexação correta para o Google.",
    color: "cyan",
  },
];

const steps = [
  {
    step: "01",
    title: "Descoberta",
    desc: "Entendo o seu negócio, objetivo e público-alvo antes de escrever uma linha de código.",
  },
  {
    step: "02",
    title: "Planejamento",
    desc: "Defino arquitetura, stack, wireframes e cronograma com entregas claras.",
  },
  {
    step: "03",
    title: "Design",
    desc: "Protótipos navegáveis no Figma aprovados antes do desenvolvimento começar.",
  },
  {
    step: "04",
    title: "Desenvolvimento",
    desc: "Código limpo, tipado, testado e versionado com revisões semanais.",
  },
  {
    step: "05",
    title: "QA & Deploy",
    desc: "Testes em navegadores, dispositivos e acessibilidade. Deploy automatizado.",
  },
  {
    step: "06",
    title: "Suporte",
    desc: "Acompanhamento pós-lançamento, monitoramento e evolução contínua.",
  },
];

const testimonials = [
  {
    name: "Prof. Dra. Márcia Regina Reggiolli",
    role: "Diretor Fatec Itapira",
    text: "O André entregou nosso controle de horários escolares com excelência. Recomendo fortemente.",
  },
  {
    name: "Rosemary Moraes",
    role: "Empresária da Grafello",
    text: "Nosso site institucional ficou incrível! O André entendeu nossa identidade visual.",
  },
];

const faq = [
  {
    q: "Quanto tempo leva um projeto?",
    a: "Depende do escopo. Landing pages ficam prontas em 1–2 semanas; SaaS complexos levam de 6 a 12 semanas. Sempre defino o cronograma antes de começar.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Normalmente 40% na aprovação, 40% na entrega do MVP e 20% no lançamento. Projetos recorrentes têm mensalidade fixa.",
  },
  {
    q: "Oferece suporte depois da entrega?",
    a: "Sim. Todos os projetos têm 30 dias de garantia, e ofereço planos de manutenção e evolução contínua.",
  },
];

const SplashColors = ["#00e5ff", "#8a2be2", "#ff007f"];
const heroGradient = [
  "#00e5ff",
  "#22d3ee",
  "#8a2be2",
  "#ff007f",
  "#ff7f00",
  "#00e5ff",
];

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00e5ff] to-[#ff007f]">
    {children}
  </span>
);

const SectionTitle = ({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) => (
  <div className="flex flex-col items-center mb-14 md:mb-16 text-center">
    <div>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        {children}
      </h2>
    </div>
    {sub && (
      <div>
        <p className="text-gray-400 text-lg max-w-2xl">{sub}</p>
      </div>
    )}
  </div>
);

const sectionCls =
  "container mx-auto px-6 py-20 md:py-28 border-t border-white/5 scroll-mt-20";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [currentProject, setCurrentProject] = useState(0);

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-clip font-sans selection:bg-[#ff007f] selection:text-white">
      <SplashCursor
        theme="dark"
        rainbow={false}
        colors={SplashColors}
        size={1.1}
        force={0.9}
        swirl={2.5}
        trail={1.2}
        glow={0.3}
        quality="medium"
        zIndex={1}
      />

      <div className="fixed inset-0 z-0">
        <DotGrid
          baseColor="#262629"
          activeColor="#00e5ff"
          shape="circle"
          dotSize={5}
          gap={28}
          proximity={220}
          shockRadius={320}
          bounce={0.4}
        />
      </div>

      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="aurora-blob absolute -top-40 -left-32 h-130 w-130 rounded-full bg-[#8a2be2]/20 blur-[140px]" />
        <div
          className="aurora-blob absolute top-1/3 -right-40 h-120 w-120 rounded-full bg-[#00e5ff]/15 blur-[140px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="aurora-blob absolute -bottom-40 left-1/4 h-115 w-115 rounded-full bg-[#ff007f]/15 blur-[150px]"
          style={{ animationDelay: "-11s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_100%)]" />
      </div>

      <Header whatsapp={WHATSAPP} />

      <div className="relative z-10 pt-24 md:pt-32">
        {/* HERO */}
        <section
          id="inicio"
          className="container mx-auto px-6 pt-10 pb-24 flex flex-col items-center justify-center text-center min-h-[78vh] scroll-mt-28"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full border border-white/15 bg-white/4 backdrop-blur-md text-xs md:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e5ff] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e5ff]" />
              </span>
              <ShinyText>Disponível para novos projetos</ShinyText>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-2 flex items-center justify-center">
            <GradientText
              colors={heroGradient}
              className="text-[4.5rem] md:text-[8rem] lg:text-[11rem] font-black uppercase tracking-tighter leading-none"
            >
              André
            </GradientText>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-6">
            Luis de Moraes{" "}
            <span className="text-gray-500 font-light">
              — Desenvolvedor Full Stack
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Construo produtos digitais rápidos, escaláveis e bonitos. Do{" "}
            <span className="text-[#00e5ff] font-medium">design</span> ao{" "}
            <span className="text-[#ff007f] font-medium">deploy</span> — sites,
            SaaS, e-commerces e APIs sob medida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="#projetos"
              className="group inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#00e5ff] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Ver projetos{" "}
              <LuArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contato"
              className="border border-white/20 bg-white/4 backdrop-blur-md px-8 py-3.5 rounded-full font-bold text-sm hover:border-[#ff007f] hover:text-[#ff007f] transition-all duration-300 hover:-translate-y-0.5"
            >
              Vamos conversar
            </a>
          </div>
        </section>

        {/* STATS */}
        <section className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md p-6 text-center hover:border-[#00e5ff]/40 hover:bg-white/5 transition-colors"
              >
                <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-linear-to-br from-[#00e5ff] to-[#ff007f] tabular-nums">
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STACK */}
        <section className="container mx-auto px-6 pb-24">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Tecnologias que domino no dia a dia
            </p>
          </div>
          <div
            className="text-gray-500"
            style={{ height: 120, position: "relative", overflow: "hidden" }}
          >
            <LogoLoop
              logos={techLogos}
              speed={80}
              direction="left"
              logoHeight={44}
              gap={64}
              hoverSpeed={0}
              scaleOnHover
              fadeOutWidth={0.15}
              ariaLabel="Stack de tecnologias"
            />
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className={sectionCls}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#00e5ff] mb-4">
                Sobre mim
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                Código bem escrito é <Accent>a base de tudo.</Accent>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Sou <strong className="text-white">André Luis de Moraes</strong>
                , desenvolvedor full stack com foco em produtos digitais de alta
                performance. Trabalho com{" "}
                <strong className="text-white">
                  React, Next.js, TypeScript e Node.js
                </strong>
                , sempre pensando em arquitetura limpa, DX e experiência do
                usuário.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Ao longo dos últimos anos ajudei startups e empresas
                consolidadas a lançarem MVPs, refatorarem legados e escalarem
                aplicações para milhares de usuários — com código que qualquer
                outro dev consegue manter no futuro.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Clean Code",
                  "Testes",
                  "Acessibilidade",
                  "Performance",
                  "Design System",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/4 text-gray-300 hover:border-[#00e5ff]/50 hover:text-[#00e5ff] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b0b0f]/90 backdrop-blur overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,229,255,0.25)]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-gray-500 font-mono">
                  dev.js
                </span>
              </div>
              <pre className="text-xs md:text-sm p-5 overflow-x-auto leading-relaxed text-gray-300 font-mono">
                <code>
                  <span className="text-[#ff007f]">const</span>{" "}
                  <span className="text-[#00e5ff]">andre</span> = {"{"}
                  {"\n  "}role:{" "}
                  <span className="text-[#ffe600]">
                    &quot;Full Stack Developer&quot;
                  </span>
                  ,{"\n  "}stack: [
                  <span className="text-[#ffe600]">&quot;React&quot;</span>,{" "}
                  <span className="text-[#ffe600]">&quot;Next.js&quot;</span>,{" "}
                  <span className="text-[#ffe600]">&quot;Node.js&quot;</span>],
                  {"\n  "}focus: [
                  <span className="text-[#ffe600]">
                    &quot;Performance&quot;
                  </span>
                  , <span className="text-[#ffe600]">&quot;DX&quot;</span>,{" "}
                  <span className="text-[#ffe600]">&quot;UI/UX&quot;</span>],
                  {"\n  "}principles: [{"\n    "}
                  <span className="text-[#ffe600]">
                    &quot;Código legível &gt; código esperto&quot;
                  </span>
                  ,{"\n    "}
                  <span className="text-[#ffe600]">
                    &quot;Entregar valor cedo e com qualidade&quot;
                  </span>
                  ,{"\n    "}
                  <span className="text-[#ffe600]">
                    &quot;Testes não são opcionais&quot;
                  </span>
                  ,{"\n  "}],
                  {"\n  "}status:{" "}
                  <span className="text-[#ffe600]">
                    &quot;open_to_work&quot;
                  </span>
                  ,{"\n"}
                  {"};"}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* SERVIÇOS */}
        <section id="servicos" className={sectionCls}>
          <SectionTitle sub="Soluções de ponta a ponta — do produto ao deploy. Sempre com foco em qualidade, prazos e comunicação clara.">
            O que eu <Accent>faço</Accent>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((s) => {
              const tone = TONES[s.color];
              return (
                <SpotlightCard
                  key={s.title}
                  spotlightColor={tone.spotlight}
                  className="h-full bg-white/3 border border-white/10 backdrop-blur-md p-8 rounded-2xl hover:-translate-y-2 hover:border-white/20 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${tone.iconBg} ${tone.iconText} flex items-center justify-center mb-6 text-2xl`}
                  >
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {s.desc}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* PROJETOS (CARROSSEL SIMPLES) */}
        <section id="projetos" className={sectionCls}>
          <SectionTitle sub="Uma amostra do que já entreguei. Use as setas para navegar.">
            Projetos <Accent>selecionados</Accent>
          </SectionTitle>

          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_100px_-30px_rgba(138,43,226,0.5)] bg-black/40">
            <div className="relative h-75 md:h-112.5 w-full">
              <img
                src={projects[currentProject].image}
                alt={projects[currentProject].caption}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent">
                <p className="text-white font-semibold text-lg">
                  {projects[currentProject].caption}
                </p>
              </div>
            </div>

            {/* Botões de navegação */}
            <button
              onClick={prevProject}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#00e5ff] hover:text-black transition-colors"
              aria-label="Projeto anterior"
            >
              <LuChevronLeft size={20} />
            </button>
            <button
              onClick={nextProject}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#00e5ff] hover:text-black transition-colors"
              aria-label="Próximo projeto"
            >
              <LuChevronRight size={20} />
            </button>

            {/* Indicadores (bolinhas) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProject(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentProject
                      ? "bg-[#00e5ff] w-4"
                      : "bg-white/50"
                  }`}
                  aria-label={`Ir para o projeto ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* PROCESSO */}
        <section id="processo" className={sectionCls}>
          <SectionTitle sub="Um processo previsível, transparente e sem surpresas — do briefing ao suporte.">
            Como <Accent>trabalhamos</Accent>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((p) => (
              <div
                key={p.step}
                className="relative rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md p-7 hover:border-[#00e5ff]/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-[#00e5ff] to-[#ff007f] opacity-40 group-hover:opacity-100 transition-opacity">
                  {p.step}
                </span>
                <h3 className="text-lg font-bold mt-3 mb-2 text-white">
                  {p.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className={sectionCls}>
          <SectionTitle>
            O que dizem <Accent>sobre mim</Accent>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t) => (
              <SpotlightCard
                key={t.name}
                spotlightColor="rgba(0, 229, 255, 0.2)"
                className="h-full bg-white/3 border border-white/10 backdrop-blur-md p-8 rounded-2xl"
              >
                <div
                  className="flex gap-1 mb-4 text-[#ffe600]"
                  aria-label="5 estrelas"
                >
                  ★★★★★
                </div>
                <p className="text-gray-300 leading-relaxed italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-linear-to-br from-[#00e5ff] to-[#ff007f] flex items-center justify-center text-black font-black text-sm">
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className={sectionCls}>
          <SectionTitle>
            Perguntas <Accent>frequentes</Accent>
          </SectionTitle>

          <div className="max-w-3xl mx-auto space-y-4">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-white/10 bg-white/3 backdrop-blur-md p-6 hover:border-[#00e5ff]/40 open:border-[#00e5ff]/40 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold text-white">{f.q}</span>
                  <span className="ml-4 text-[#00e5ff] group-open:rotate-45 transition-transform text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CONTATO */}
        <footer
          id="contato"
          className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-lg mt-10 scroll-mt-20"
        >
          <div className="container mx-auto px-6 py-16 md:py-20">
            <div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                    Vamos tirar seu projeto <Accent>do papel?</Accent>
                  </h2>
                  <p className="text-gray-400 text-lg max-w-lg">
                    Me conta a sua ideia. Respondo em até 24h úteis com uma
                    proposta clara, sem compromisso.
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                  <span className="text-sm text-gray-500">
                    Atendimento Seg–Sex, 8h–18h
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff007f] text-white font-bold text-sm hover:bg-[#00e5ff] hover:text-black transition-all shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                >
                  <LuMessageCircle /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 py-6 text-center">
            <p className="text-xs text-gray-600">
              &copy; {currentYear} André Luis de Moraes. Todos os direitos
              reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* BOTÃO VOLTAR AO TOPO */}
      <a
        href="#inicio"
        title="Voltar ao topo"
        aria-label="Voltar ao topo"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center w-12 h-12 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white shadow-lg hover:bg-[#00e5ff] hover:text-black hover:border-[#00e5ff] transition-all duration-300 hover:-translate-y-1"
      >
        <LuArrowUp className="text-xl" />
      </a>
    </main>
  );
}
