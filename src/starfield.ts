/**
 * Starfield rendered on a single 2D canvas — one compositor layer instead of
 * ~120 individually-animated DOM nodes like the old site. Runs on rAF, pauses
 * when the tab is hidden, and honours prefers-reduced-motion.
 */
interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  hue: 'white' | 'teal' | 'magenta';
}

export function startStarfield(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const count = coarse ? 50 : 120;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars: Star[] = [];
  let raf = 0;
  let running = true;

  function resize(): void {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    seed();
  }

  function seed(): void {
    stars = Array.from({ length: count }, () => {
      const roll = Math.random();
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (roll > 0.8 ? 2 : 1.4) * dpr,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
        hue: roll > 0.85 ? 'teal' : roll > 0.72 ? 'magenta' : 'white',
      };
    });
  }

  const COLORS = {
    white: '255, 255, 255',
    teal: '45, 226, 230',
    magenta: '246, 1, 157',
  } as const;

  let last = 0;
  function frame(t: number): void {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    // ~30fps is plenty for twinkling and halves battery cost on mobile
    if (t - last < 33) return;
    last = t;

    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    const time = t / 1000;
    for (const s of stars) {
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase + time * s.speed));
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r * (0.8 + tw * 0.4), 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${COLORS[s.hue]}, ${tw.toFixed(3)})`;
      ctx!.fill();
    }
  }

  function drawStatic(): void {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${COLORS[s.hue]}, 0.7)`;
      ctx!.fill();
    }
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduced) {
    drawStatic();
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    });
  }

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}
