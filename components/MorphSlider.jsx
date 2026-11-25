"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./MorphSlider.css";

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform float uP;
uniform float uDir;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
vec2 cover(vec2 uv, vec2 img){
  float ra = uRes.x / uRes.y;
  float ri = img.x / img.y;
  vec2 s = ra > ri ? vec2(1.0, ri / ra) : vec2(ra / ri, 1.0);
  return clamp((uv - 0.5) * s + 0.5, 0.0, 1.0);
}
void main(){
  float p = uP;
  vec2 w = vec2(noise(vUv * 2.5 + 1.3), noise(vUv * 2.5 + 9.1)) - 0.5;
  vec2 uvA = vUv + w * 0.35 * p + vec2(uDir * 0.10 * p, 0.0);
  vec2 uvB = vUv - w * 0.35 * (1.0 - p) - vec2(uDir * 0.10 * (1.0 - p), 0.0);
  vec4 a = texture2D(uA, cover(uvA, uSizeA));
  vec4 b = texture2D(uB, cover(uvB, uSizeB));
  float m = smoothstep(0.0, 1.0, clamp(p * 1.6 - 0.3 + (noise(vUv * 3.0) - 0.5) * 0.6, 0.0, 1.0));
  if (p <= 0.0001) m = 0.0;
  if (p >= 0.9999) m = 1.0;
  vec4 c = mix(a, b, m);
  float glow = sin(m * 3.14159) * 0.18;
  gl_FragColor = vec4(c.rgb + vec3(0.0, 0.9, 1.0) * glow * 0.35, 1.0);
}`;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

function createEngine(canvas, slides, durationMs, forceCpu) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const dur = reduced ? 1 : durationMs;
  let gl = null;
  if (!forceCpu) {
    try {
      gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    } catch {
      gl = null;
    }
  }
  const ctx2d = gl ? null : canvas.getContext("2d");

  const imgs = slides.map((s) => {
    const img = new Image();
    img.decoding = "async";
    img.src = s.src;
    img.onload = () => {
      if (gl) upload(i0(img));
      draw(performance.now());
    };
    return img;
  });
  const i0 = (img) => imgs.indexOf(img);

  let from = 0;
  let to = 0;
  let dir = 1;
  let anim = null;
  let raf = 0;
  let destroyed = false;
  const tex = [];
  let prog = null;
  let loc = {};

  if (gl) try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uA", "uB", "uRes", "uSizeA", "uSizeB", "uP", "uDir"])
      loc[n] = gl.getUniformLocation(prog, n);
    gl.uniform1i(loc.uA, 0);
    gl.uniform1i(loc.uB, 1);
  } catch (err) {
    destroyed = true;
    throw err;
  }

  function upload(i) {
    if (i < 0 || !imgs[i].complete || !imgs[i].naturalWidth) return;
    const t = tex[i] || gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    tex[i] = t;
  }

  function cover2d(img, w, h, alpha) {
    if (!img.naturalWidth) return;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx2d.globalAlpha = alpha;
    ctx2d.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  function draw(now) {
    if (destroyed) return;
    let p = 0;
    if (anim) {
      const t = Math.min(1, (now - anim.t0) / dur);
      p = ease(t);
      if (t >= 1) {
        from = to;
        anim = null;
        p = 0;
      }
    }
    const w = canvas.width;
    const h = canvas.height;
    if (gl) {
      gl.viewport(0, 0, w, h);
      const A = tex[from];
      const B = tex[anim ? to : from];
      if (A && B) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, A);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, B);
        gl.uniform2f(loc.uRes, w, h);
        gl.uniform2f(loc.uSizeA, imgs[from].naturalWidth, imgs[from].naturalHeight);
        const tb = anim ? to : from;
        gl.uniform2f(loc.uSizeB, imgs[tb].naturalWidth, imgs[tb].naturalHeight);
        gl.uniform1f(loc.uP, anim ? p : 0);
        gl.uniform1f(loc.uDir, dir);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    } else {
      ctx2d.clearRect(0, 0, w, h);
      cover2d(imgs[from], w, h, 1);
      if (anim) cover2d(imgs[to], w, h, p);
      ctx2d.globalAlpha = 1;
    }
    raf = anim ? requestAnimationFrame(draw) : 0;
  }

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    if (!raf) draw(performance.now());
  };
  resize();
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  ro?.observe(canvas);

  return {
    transition(next, d) {
      if (next === (anim ? to : from)) return;
      if (anim) {
        from = to;
        anim = null;
      }
      to = next;
      dir = d;
      anim = { t0: performance.now() };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      if (gl) {
        tex.forEach((t) => t && gl.deleteTexture(t));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    },
  };
}

const Chevron = ({ flip }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export default function MorphSlider({
  slides,
  autoplay = true,
  interval = 5500,
  duration = 1200,
  className = "",
  style,
}) {
  const [active, setActive] = useState(0);
  const [cpu, setCpu] = useState(false);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef(null);
  const count = slides.length;

  useEffect(() => {
    let engine;
    try {
      engine = createEngine(canvasRef.current, slides, duration, cpu);
    } catch (err) {
      console.warn("MorphSlider: WebGL falhou, usando fallback 2D.", err);
      setCpu(true);
      return undefined;
    }
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [slides, duration, cpu]);

  const go = useCallback(
    (target, d) => {
      const next = ((target % count) + count) % count;
      if (next === activeRef.current) return;
      const dir = d ?? (next > activeRef.current ? 1 : -1);
      activeRef.current = next;
      setActive(next);
      engineRef.current?.transition(next, dir);
    },
    [count],
  );

  const step = useCallback((d) => go(activeRef.current + d, d), [go]);

  useEffect(() => {
    if (!autoplay || count < 2) return undefined;
    const id = setInterval(() => {
      if (!pausedRef.current && !document.hidden) step(1);
    }, interval);
    return () => clearInterval(id);
  }, [autoplay, interval, count, step, active]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={`morph-slider ${className}`.trim()}
      style={{ "--ms-swap": "0.7s", "--ms-dot": "0.45s", ...style }}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Projetos"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        className="morph-slider-stage"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragRef.current = null)}
        onFocus={() => (pausedRef.current = true)}
        onBlur={() => (pausedRef.current = false)}
        aria-label={`Slide ${active + 1} de ${count}: ${slides[active].caption}`}
      >
        <canvas key={cpu ? "2d" : "gl"} ref={canvasRef} className="morph-slider-canvas" />
      </div>

      <div className="morph-slider-caption" aria-live="polite">
        {slides.map((s, i) => (
          <span key={s.caption} className={`morph-slider-caption-text${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
            {s.caption}
          </span>
        ))}
      </div>

      <div className="morph-slider-controls">
        <button type="button" className="morph-slider-btn" onClick={() => step(-1)} aria-label="Slide anterior">
          <Chevron flip />
        </button>
        <button type="button" className="morph-slider-btn" onClick={() => step(1)} aria-label="Próximo slide">
          <Chevron />
        </button>
      </div>

      <div className="morph-slider-indicators">
        {slides.map((s, i) => (
          <button
            key={s.caption}
            type="button"
            className={`morph-slider-dot${i === active ? " is-active" : ""}`}
            onClick={() => go(i)}
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === active}
          />
        ))}
      </div>
    </div>
  );
}
