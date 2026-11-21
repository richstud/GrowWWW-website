import { useEffect, useRef } from "react";

/**
 * Slow-moving liquid gold background (WebGL). One draw call, capped at 30 fps, paused when off-screen
 * or when the tab is hidden, and a single still frame for people who prefer reduced motion.
 * Falls back to a static CSS gradient where WebGL isn't available.
 */
const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_strength;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 1.6;
  float t = u_time * 0.045;
  p += (u_mouse - 0.5) * 0.25;
  // Domain warping gives folded, silk-like bands
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 3.5 * r);
  float folds = smoothstep(0.35, 0.95, f + 0.35 * r.x);
  float sheen = pow(smoothstep(0.55, 1.0, f * 1.15 + q.y * 0.35), 3.0);

  vec3 black = vec3(0.055, 0.047, 0.039);
  vec3 umber = vec3(0.22, 0.15, 0.07);
  vec3 gold  = vec3(0.85, 0.66, 0.33);
  vec3 light = vec3(1.0, 0.88, 0.62);
  vec3 col = mix(black, umber, folds);
  col = mix(col, gold, folds * folds * 0.55);
  col += light * sheen * 0.55;

  // Keep the left (headline) side and the edges darker so text stays readable
  float side = smoothstep(0.05, 0.85, uv.x);
  float vig = smoothstep(1.25, 0.2, length((uv - vec2(0.7, 0.55)) * vec2(1.0, 1.25)));
  // On tall (phone) screens text runs full width, so the whole effect is toned down
  float portrait = step(u_res.x, u_res.y);
  side = mix(side, 0.42, portrait);
  col = mix(black, col, u_strength * mix(0.22, 1.0, side) * vig);
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

export const GoldSilk = ({ strength = 1, className = "" }: { strength?: number; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) { canvas.dataset.fallback = "1"; return; }

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.dataset.fallback = "1"; return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    gl.uniform1f(gl.getUniformLocation(prog, "u_strength"), strength);

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0, last = 0, visible = true, start = performance.now() - 40000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75; // render below screen resolution - it's a soft background
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(uRes, w, h);
    };
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return;
      last = now;
      draw(now);
    };

    resize();
    draw(performance.now());
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / window.innerWidth; mouse.ty = 1 - e.clientY / window.innerHeight; };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [strength]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full bg-[radial-gradient(70%_60%_at_75%_40%,hsl(38_60%_30%/0.55),transparent)] ${className}`}
    />
  );
};
