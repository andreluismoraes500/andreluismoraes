"use client";

import { useEffect, useRef } from "react";

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function DotGrid({
  baseColor = "#2a2a2a",
  activeColor = "#00e5ff",
  shape = "circle",
  dotSize = 6,
  gap = 28,
  proximity = 250,
  shockRadius = 300,
  bounce = 0.4,
  dpr = "auto",
  style,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const base = hexToRgb(baseColor);
    const active = hexToRgb(activeColor);
    const RIPPLE_FRAMES = 70;

    let animId = 0;
    let mouse = { x: -9999, y: -9999 };
    let dots = [];
    let ripples = [];
    let t = 0;
    let width = 0;
    let height = 0;
    let resizeTimer;

    const build = () => {
      const ratio =
        dpr === "auto" ? Math.min(window.devicePixelRatio || 1, 2) : dpr;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      dots = [];
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const offX = (width - (cols - 1) * gap) / 2;
      const offY = (height - (rows - 1) * gap) / 2;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          dots.push({ x: offX + x * gap, y: offY + y * gap, scale: 1, heat: 0 });
        }
      }
    };

    const loop = () => {
      animId = requestAnimationFrame(loop);
      if (document.hidden) return;
      ctx.clearRect(0, 0, width, height);
      t += 1;
      ripples = ripples.filter((r) => t - r.start < RIPPLE_FRAMES);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dist = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);

        let targetScale = 1;
        let targetHeat = 0;

        if (dist < proximity) {
          const k = 1 - dist / proximity;
          targetScale = 1 + k * k * bounce * 3;
          targetHeat = k;
        }

        for (let j = 0; j < ripples.length; j++) {
          const r = ripples[j];
          const age = (t - r.start) / RIPPLE_FRAMES;
          const wave = shockRadius * (1 - Math.pow(1 - age, 2));
          const delta = Math.abs(Math.hypot(dot.x - r.x, dot.y - r.y) - wave);
          if (delta < 45) {
            const power = (1 - delta / 45) * (1 - age);
            targetScale = Math.max(targetScale, 1 + power * 1.6);
            targetHeat = Math.max(targetHeat, power);
          }
        }

        dot.scale += (targetScale - dot.scale) * 0.18;
        dot.heat += (targetHeat - dot.heat) * 0.18;
        const radius = (dotSize / 2) * dot.scale;
        const h = dot.heat;
        const r = Math.round(base[0] + (active[0] - base[0]) * h);
        const g = Math.round(base[1] + (active[1] - base[1]) * h);
        const b = Math.round(base[2] + (active[2] - base[2]) * h);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        if (shape === "circle") {
          ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        } else {
          ctx.rect(dot.x - radius, dot.y - radius, radius * 2, radius * 2);
        }
        ctx.fill();
      }
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, start: t });
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 120);
    };

    build();
    if (reduced) {
      loop();
      cancelAnimationFrame(animId);
    } else {
      loop();
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      window.addEventListener("click", onClick);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, [baseColor, activeColor, shape, dotSize, gap, proximity, shockRadius, bounce, dpr]);

  return <canvas ref={canvasRef} className="block w-full h-full" style={style} />;
}
