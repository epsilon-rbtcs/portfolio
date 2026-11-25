import React, { useEffect, useRef } from 'react';

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  colorIdx: 0 | 1 | 2 | 3;
  isEye?: boolean;
  isEmber?: boolean;
  isAmberEmber?: boolean;
  phase: number;
  driftSpeed: number;
}

const DARK_PALETTE = ['#ece4bc', '#dfd6a7', '#c2b98f', '#948c6c'] as const;
const LIGHT_PALETTE = ['#181816', '#2e2d29', '#4f4d46', '#78756c'] as const;
const DARK_AMBER = '#d99b43';
const LIGHT_AMBER = '#b56b16';

function generateCoolDragonDots(img: HTMLImageElement, size: number): Dot[] {
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = img.naturalWidth || img.width;
  srcCanvas.height = img.naturalHeight || img.height;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) return [];

  srcCtx.drawImage(img, 0, 0);
  const sw = srcCanvas.width;
  const sh = srcCanvas.height;
  const srcData = srcCtx.getImageData(0, 0, sw, sh).data;

  // Detect dragon bounding box, ignoring bottom corner watermarks
  const minSearchX = Math.floor(sw * 0.14);
  const maxSearchX = Math.floor(sw * 0.86);
  const minSearchY = Math.floor(sh * 0.05);
  const maxSearchY = Math.floor(sh * 0.94);

  let bx0 = maxSearchX;
  let by0 = maxSearchY;
  let bx1 = minSearchX;
  let by1 = minSearchY;

  for (let y = minSearchY; y < maxSearchY; y++) {
    for (let x = minSearchX; x < maxSearchX; x++) {
      const idx = (y * sw + x) * 4;
      const lum = (srcData[idx] + srcData[idx + 1] + srcData[idx + 2]) / (3 * 255);
      if (lum > 0.12) {
        if (x < bx0) bx0 = x;
        if (x > bx1) bx1 = x;
        if (y < by0) by0 = y;
        if (y > by1) by1 = y;
      }
    }
  }

  if (bx1 <= bx0 || by1 <= by0) {
    bx0 = Math.floor(sw * 0.18);
    bx1 = Math.floor(sw * 0.78);
    by0 = Math.floor(sh * 0.08);
    by1 = Math.floor(sh * 0.92);
  }

  const bw = bx1 - bx0;
  const bh = by1 - by0;

  // Draw slightly tilted dynamic stance onto logical canvas
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const ctx = off.getContext('2d');
  if (!ctx) return [];

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  const pad = size * 0.09;
  const avail = size - pad * 2;
  const scale = Math.min(avail / bw, avail / bh);
  const drawW = bw * scale;
  const drawH = bh * scale;

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.07); // Slight dynamic -4deg tilt
  ctx.drawImage(srcCanvas, bx0, by0, bw, bh, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  const imgData = ctx.getImageData(0, 0, size, size).data;
  const field = new Float32Array(size * size);
  const eyeMask = new Uint8Array(size * size);

  for (let i = 0; i < size * size; i++) {
    const r = imgData[i * 4];
    const g = imgData[i * 4 + 1];
    const b = imgData[i * 4 + 2];
    const isRedEye = r > 65 && r > g * 1.85 && r > b * 1.85;
    if (isRedEye) {
      eyeMask[i] = 1;
      field[i] = 0.9;
    } else {
      field[i] = Math.max(r, g, b) / 255;
    }
  }

  const dots: Dot[] = [];
  let seed = 73913;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const step = 2.0;

  for (let gy = 0; gy < size; gy += step) {
    for (let gx = 0; gx < size; gx += step) {
      const x = gx + (rand() - 0.5) * step * 1.15;
      const y = gy + (rand() - 0.5) * step * 1.15;
      const ix = Math.max(0, Math.min(size - 1, Math.round(x)));
      const iy = Math.max(0, Math.min(size - 1, Math.round(y)));
      const idx = iy * size + ix;

      if (eyeMask[idx] === 1) {
        dots.push({
          homeX: x,
          homeY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          r: 0.95 + rand() * 0.35,
          baseAlpha: 0.95,
          colorIdx: 0,
          isEye: true,
          phase: rand() * Math.PI * 2,
          driftSpeed: 0,
        });
        continue;
      }

      const density = field[idx];

      // Sample edge gradient for crisp dorsal highlight
      const rightIdx = iy * size + Math.min(size - 1, ix + 2);
      const downIdx = Math.min(size - 1, iy + 2) * size + ix;
      const edge =
        Math.abs(density - field[rightIdx]) + Math.abs(density - field[downIdx]);

      // Subtle atmospheric stipple dissipation around dragon contours
      if (density <= 0.08) {
        const nearby =
          field[Math.max(0, iy - 4) * size + ix] +
          field[Math.min(size - 1, iy + 4) * size + ix] +
          field[iy * size + Math.max(0, ix - 4)] +
          field[iy * size + Math.min(size - 1, ix + 4)];

        if (nearby > 0.45 && rand() < 0.085) {
          dots.push({
            homeX: x + (rand() - 0.5) * 6,
            homeY: y + (rand() - 0.5) * 6,
            x,
            y,
            vx: 0,
            vy: 0,
            r: 0.48 + rand() * 0.42,
            baseAlpha: 0.28 + rand() * 0.25,
            colorIdx: 3,
            isEmber: true,
            isAmberEmber: rand() < 0.2,
            phase: rand() * Math.PI * 2,
            driftSpeed: 0.6 + rand() * 0.9,
          });
        }
        continue;
      }

      const prob = Math.min(
        0.96,
        0.24 + Math.pow(density, 0.72) * 0.7 + edge * 0.35
      );

      if (rand() < prob) {
        const colorIdx: 0 | 1 | 2 | 3 =
          edge > 0.35 || density > 0.8
            ? 0
            : density > 0.54
            ? 1
            : density > 0.32
            ? 2
            : 3;

        dots.push({
          homeX: x,
          homeY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          r: 0.58 + rand() * 0.44 + density * 0.25 + (edge > 0.3 ? 0.12 : 0),
          baseAlpha: Math.min(1, 0.44 + density * 0.56),
          colorIdx,
          phase: rand() * Math.PI * 2,
          driftSpeed: 0,
        });
      }
    }
  }

  return dots;
}

function scatterMolecules(dots: Dot[], size: number): void {
  let seed = 918273;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const angle = rand() * Math.PI * 2;
    const dist = 36 + rand() * 112;
    dot.x = Math.max(8, Math.min(size - 8, dot.homeX + Math.cos(angle) * dist));
    dot.y = Math.max(8, Math.min(size - 8, dot.homeY + Math.sin(angle) * dist));
    // Subtle tangential swirl velocity so molecules coalesce organically
    const swirl = 1.6 + rand() * 2.2;
    dot.vx = -Math.sin(angle) * swirl;
    dot.vy = Math.cos(angle) * swirl;
  }
}

export const StipplePenguin: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[] | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });
  const isDarkRef = useRef<boolean>(
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const LOGICAL_SIZE = 260;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = LOGICAL_SIZE * dpr;
    canvas.height = LOGICAL_SIZE * dpr;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let cancelled = false;
    let startTime = performance.now();

    const renderFrame = (now: number) => {
      if (cancelled) return;
      const elapsed = (now - startTime) / 1000;
      const dots = dotsRef.current || [];

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, LOGICAL_SIZE, LOGICAL_SIZE);

      const ptr = pointerRef.current;
      let anyMoving = false;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (!prefersReducedMotion) {
          // Gentle breathing target for floating ember/aura particles
          const floatOffsetX = dot.isEmber
            ? Math.sin(elapsed * dot.driftSpeed + dot.phase) * 2.2
            : 0;
          const floatOffsetY = dot.isEmber
            ? Math.cos(elapsed * dot.driftSpeed * 0.8 + dot.phase) * 2.6 - 1.0
            : 0;

          const targetX = dot.homeX + floatOffsetX;
          const targetY = dot.homeY + floatOffsetY;

          if (ptr.active) {
            const dx = dot.x - ptr.x;
            const dy = dot.y - ptr.y;
            const distSq = dx * dx + dy * dy;
            const radius = 38;
            if (distSq < radius * radius && distSq > 0.05) {
              const dist = Math.sqrt(distSq);
              const force = ((radius - dist) / radius) * 1.65;
              dot.vx += (dx / dist) * force;
              dot.vy += (dy / dist) * force;
            }
          }

          // Gentle intro spring during initial molecule assembly (~1.3s), crisp spring after
          const stiffness = elapsed < 1.35 ? 0.068 : 0.12;
          const damping = elapsed < 1.35 ? 0.8 : 0.76;

          dot.vx += (targetX - dot.x) * stiffness;
          dot.vy += (targetY - dot.y) * stiffness;
          dot.vx *= damping;
          dot.vy *= damping;
          dot.x += dot.vx;
          dot.y += dot.vy;

          if (
            dot.isEmber ||
            dot.isEye ||
            Math.abs(dot.vx) > 0.01 ||
            Math.abs(dot.vy) > 0.01 ||
            Math.abs(targetX - dot.x) > 0.05 ||
            Math.abs(targetY - dot.y) > 0.05
          ) {
            anyMoving = true;
          }
        }

        let alpha = dot.baseAlpha;
        if (!prefersReducedMotion && elapsed < 0.75 && !dot.isEmber) {
          // Molecules subtly brighten as they lock into formation
          alpha *= Math.min(1, 0.35 + (elapsed / 0.75) * 0.65);
        }
        if (!prefersReducedMotion && dot.isEye) {
          alpha = 0.75 + 0.25 * Math.sin(elapsed * 2.4 + dot.phase);
        } else if (!prefersReducedMotion && dot.isEmber) {
          alpha = dot.baseAlpha * (0.65 + 0.35 * Math.sin(elapsed * 1.8 + dot.phase));
        }

        const isDark = isDarkRef.current;
        const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
        const amber = isDark ? DARK_AMBER : LIGHT_AMBER;
        const dotColor =
          dot.isEye || dot.isAmberEmber ? amber : palette[dot.colorIdx];

        ctx.globalAlpha = alpha;
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (!prefersReducedMotion && (ptr.active || anyMoving)) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const startLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(renderFrame);
    };

    if (dotsRef.current) {
      if (!prefersReducedMotion) {
        scatterMolecules(dotsRef.current, LOGICAL_SIZE);
      }
      startTime = performance.now();
      startLoop();
    } else {
      const img = new Image();
      img.src = '/assets/aistudio/image_48b798e9.png';
      img.onload = () => {
        if (cancelled) return;
        const generated = generateCoolDragonDots(img, LOGICAL_SIZE);
        if (!prefersReducedMotion) {
          scatterMolecules(generated, LOGICAL_SIZE);
        }
        dotsRef.current = generated;
        startTime = performance.now();
        startLoop();
      };
    }

    const themeObserver = new MutationObserver(() => {
      const nextDark = document.documentElement.classList.contains('dark');
      if (nextDark !== isDarkRef.current) {
        isDarkRef.current = nextDark;
        startLoop();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * LOGICAL_SIZE,
        y: ((e.clientY - rect.top) / rect.height) * LOGICAL_SIZE,
        active: true,
      };
      startLoop();
    };

    const handleLeave = () => {
      pointerRef.current.active = false;
      startLoop();
    };

    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerleave', handleLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center shrink-0 select-none">
      <canvas
        ref={canvasRef}
        aria-label="Stipple art illustration of a stylized dragon"
        className="w-[210px] h-[210px] sm:w-[245px] sm:h-[245px] md:w-[258px] md:h-[258px] cursor-default"
      />
    </div>
  );
};
