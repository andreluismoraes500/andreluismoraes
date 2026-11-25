"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Processo" },
  { href: "#contato", label: "Contato" },
];

export default function Header({ whatsapp }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = links.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setCurrent(`#${e.target.id}`));
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 backdrop-blur-xl ${
        scrolled || open ? "bg-black/60 border-white/10 py-0" : "bg-transparent border-transparent py-2"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#inicio" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00e5ff] to-[#ff007f] flex items-center justify-center font-black text-black text-sm shadow-[0_0_20px_rgba(0,229,255,0.5)] group-hover:scale-105 transition-transform">
            AL
          </span>
          <span className="font-bold tracking-tight text-sm md:text-base">
            André Luis<span className="text-[#00e5ff]">.</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative px-4 py-2 rounded-full transition-colors ${
                current === l.href ? "text-white bg-white/10" : "text-gray-400 hover:text-[#00e5ff]"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ff007f] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-[#00e5ff] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,0,127,0.6)] hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]"
          >
            Falar comigo
          </a>
          <button
            type="button"
            className="md:hidden w-10 h-10 rounded-full border border-white/15 flex flex-col items-center justify-center gap-1.5"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container mx-auto px-6 pb-6 flex flex-col" aria-label="Mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-3 text-lg font-semibold border-b border-white/5 ${
                current === l.href ? "text-[#00e5ff]" : "text-gray-300"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
