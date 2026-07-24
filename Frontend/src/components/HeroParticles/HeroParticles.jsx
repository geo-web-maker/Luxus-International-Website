import { useEffect, useRef } from "react";

/**
 * Ambient "survey mesh" background for the homepage hero.
 *
 * This is the on-brand replacement for the old site's particles.js canvas:
 * same idea (a handful of drifting points, connecting lines when they're
 * close together, gentle continuous motion) but restyled as a wireframe
 * mesh — a nod to Luxuz's actual GIS/survey and engineering service lines,
 * and consistent with the wireframe-globe motif already used elsewhere in
 * this design system (see WireframeGlobe.jsx). Brand blue only, low
 * opacity, slow — meant to read as "alive" without competing with the
 * headline or feeling like a consumer/games-style effect.
 *
 * No dependency (plain canvas + rAF). Respects prefers-reduced-motion by
 * drawing one static frame and skipping the animation loop entirely.
 */
export default function HeroParticles({
  density = 46,
  color = "111, 197, 240", // matches --brand-blue as an rgb triplet
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let points = [];
    let rafId = null;
    let resizeObserver;

    function seedPoints() {
      const area = width * height;
      // Roughly `density` points per ~1,000,000px of hero area, capped
      // so it stays light-weight on very wide displays.
      const count = Math.max(18, Math.min(density, Math.round((area / 1_000_000) * density)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedPoints();
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // update
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // connecting lines between nearby points
      const linkDistance = Math.max(90, Math.min(width, height) * 0.12);
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = 0.16 * (1 - dist / linkDistance);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of points) {
        ctx.fillStyle = `rgba(${color}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(step);
      }
    }

    resize();
    step();

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        resize();
        if (prefersReducedMotion) step();
      });
      resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener("resize", resize);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", resize);
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`hero-particles ${className}`}
      aria-hidden="true"
    />
  );
}
