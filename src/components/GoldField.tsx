import { useEffect, useRef } from "react";

/**
 * Animated hero backdrop: drifting gold dust that links into a "web" (the WWW in GrowWWW)
 * and reacts to the pointer / touch. Pure canvas, no libraries, ~3 KB.
 * - Particle count scales with screen size (lighter on phones)
 * - Pauses when off-screen or the tab is hidden
 * - Draws one still frame for visitors who prefer reduced motion
 */
export const GoldField = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999, active: false };

    type P = { x: number; y: number; vx: number; vy: number; r: number; tw: number };
    let pts: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(110, Math.max(38, (w * h) / 13000)));
      pts = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.05,
        r: Math.random() * 1.6 + 0.4,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const LINK = () => (w < 640 ? 90 : 130);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // slow diagonal light sweep
      const sweep = ((t / 9000) % 1) * (w + h) - h * 0.5;
      const g = ctx.createLinearGradient(sweep - 260, 0, sweep + 260, h);
      g.addColorStop(0, "rgba(212,168,90,0)");
      g.addColorStop(0.5, "rgba(212,168,90,0.07)");
      g.addColorStop(1, "rgba(212,168,90,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const link = LINK();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduce) {
          // gentle pull toward the pointer
          if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 220 * 220) {
              p.vx += dx * 0.000035;
              p.vy += dy * 0.000035;
            }
          }
          p.vx *= 0.995;
          p.vy *= 0.995;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.strokeStyle = `rgba(212,168,90,${(1 - d / link) * 0.22})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const a = 0.55 + Math.sin(t / 700 + p.tw) * 0.35;
        ctx.fillStyle = `rgba(243,213,138,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (pointer.active) {
        const rg = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 160);
        rg.addColorStop(0, "rgba(243,213,138,0.10)");
        rg.addColorStop(1, "rgba(243,213,138,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(pointer.x - 160, pointer.y - 160, 320, 320);
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      if (!running) draw(performance.now());
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
};
