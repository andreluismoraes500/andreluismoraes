"use client";

import { useEffect, useRef } from "react";
import "./SplashCursor.css";

const QUALITY = { low: 0.5, medium: 0.75, high: 1 };
const MAX_PARTICLES = 220;

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const makeSprite = (r, g, b) => {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const x = c.getContext("2d");
  const grad = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.35, `rgba(${r},${g},${b},0.55)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grad;
  x.fillRect(0, 0, s, s);
  return c;
};

const hslToRgb = (h) => {
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (0.5 - 0.5 * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return [f(0), f(8), f(4)];
};

/**
 * Cursor "fluido": tinta luminosa que acompanha o mouse/toque e se desfaz em redemoinhos.
 * Renderizado em canvas 2D com sprites pré-renderizados (leve, sem WebGL).
 */
export default function SplashCursor({
  theme = "dark",
  rainbow = false,
  colors = ["#00e5ff", "#8a2be2", "#ff007f"],
  size = 1,
  force = 1,
  swirl = 2,
  trail = 1,
  glow = 0.3,
  quality = "medium",
  zIndex = 1,
  contained = false,
  className = "",
  style,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const ctx = canvas.getContext("2d");
    const res = QUALITY[quality] ?? QUALITY.medium;
    const dark = theme !== "light";
    let w = 0;
    let h = 0;
    let raf = 0;
    let hue = 0;
    let colorCursor = 0;
    let last = null;
    let dist = 0;
    let particles = [];

    const palette = colors.map((c) => hexToRgb(c));
    const sprites = new Map();
    const sprite = (rgb) => {
      const key = rgb.join(",");
      if (!sprites.has(key)) sprites.set(key, makeSprite(...rgb));
      return sprites.get(key);
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * res);
      canvas.height = Math.round(h * res);
      ctx.setTransform(res, 0, 0, res, 0, 0);
    };

    const nextColor = () => {
      if (rainbow) {
        hue = (hue + 3) % 360;
        return hslToRgb(Math.round(hue / 10) * 10);
      }
      colorCursor += 0.12;
      const i = Math.floor(colorCursor) % palette.length;
      return palette[i];
    };

    const emit = (x, y, vx, vy) => {
      const rgb = nextColor();
      const life = 38 + Math.random() * 26 * trail;
      particles.push({
        x,
        y,
        vx: vx + (Math.random() - 0.5) * 1.2,
        vy: vy + (Math.random() - 0.5) * 1.2,
        life,
        max: life,
        r: (16 + Math.random() * 22) * size,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.012 + Math.random() * 0.02) * swirl,
        sprite: sprite(rgb),
      });
      if (particles.length > MAX_PARTICLES) particles.shift();
    };

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < -50 || y < -50 || x > r.width + 50 || y > r.height + 50) {
        last = null;
        return;
      }
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const d = Math.hypot(dx, dy);
        dist += d;
        const step = 22 / Math.max(0.5, size);
        while (dist >= step) {
          dist -= step;
          const t = 1 - dist / Math.max(d, 1);
          emit(
            last.x + dx * Math.min(1, t),
            last.y + dy * Math.min(1, t),
            dx * 0.08 * force,
            dy * 0.08 * force,
          );
        }
      }
      last = { x, y };
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      last = null;
    };

    const frame = () => {
      raf = 0;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${Math.min(0.6, 0.22 / Math.max(0.3, trail))})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const cos = Math.cos(p.spin);
        const sin = Math.sin(p.spin);
        const vx = p.vx * cos - p.vy * sin;
        const vy = p.vx * sin + p.vy * cos;
        p.vx = vx * 0.94;
        p.vy = vy * 0.94;
        p.x += p.vx;
        p.y += p.vy;
        const k = p.life / p.max;
        const radius = p.r * (0.55 + 0.45 * k);
        ctx.globalAlpha = Math.min(1, k * k * 0.14 * (dark ? 1 : 0.8));
        ctx.drawImage(p.sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
        if (glow > 0) {
          ctx.globalAlpha = k * k * glow * 0.14;
          const g = radius * 2.2;
          ctx.drawImage(p.sprite, p.x - g, p.y - g, g * 2, g * 2);
        }
      }
      ctx.globalAlpha = 1;
      if (particles.length) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };

    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [theme, rainbow, colors, size, force, swirl, trail, glow, quality]);

  return (
    <div
      ref={wrapRef}
      className={`splash-cursor ${className}`.trim()}
      data-contained={contained ? "" : undefined}
      style={{ zIndex, ...style }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="splash-cursor__canvas" />
    </div>
  );
}
