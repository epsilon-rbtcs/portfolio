import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe } from 'lucide-react';

interface HackathonEntry {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  certificateUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

const HACKATHONS: HackathonEntry[] = [
  {
    id: '1',
    name: 'DSU DEVHACK 3.0 - Bangalore',
    position: 'Only Finalist from North India',
    description: 'Built an ML-powered firmware analysis engine to detect and classify cryptographic primitives in binary files.',
    image: '/assets/images/DSU-Pitch.jpg',
    certificateUrl: 'https://drive.google.com/file/d/1_615iPkw-R76b98kQEk_Pdps86LAnlo_/view?usp=sharing',
    linkedinUrl: 'https://lnkd.in/p/gPVCCxzW',
    websiteUrl: 'https://cinder-two-olive.vercel.app',
  },
  {
    id: '2',
    name: 'HexaFalls 2.0 - Kolkata',
    position: 'Finalist',
    description: 'worked on designing and creating frontend, integrating backend, and training 2 CNNs locally with 99.8% validation accuracy for dementia mri detection.',
    image: '/assets/images/hexafalls.jpg',
    certificateUrl: 'https://drive.google.com/file/d/1TdU2qPhioeoBeUYWtnuu7gC2NlwaxPKi/view?usp=sharing',
    linkedinUrl: 'https://lnkd.in/p/g4ccFx9d',
    websiteUrl: 'https://github.com/epsilon-rbtcs',
  },
  {
    id: '3',
    name: 'NASA Space Apps Challenge 2026',
    position: 'Participant · American Centre, Delhi',
    description: 'Built a 3-component astronaut health system with offline monitoring, personal baselines, and 2-way medical communication.',
    image: '/assets/images/nasa.jpg',
    certificateUrl: 'https://drive.google.com/file/d/1uloxK4ksoIs7tksPGs2MNdHcc-OOzltt/view?usp=sharing',
    linkedinUrl: 'https://github.com/epsilon-rbtcs',
    websiteUrl: 'https://github.com/epsilon-rbtcs',
  },
];

// Normalize generated asset URL path (copied to /src/assets/images/ in Vite build)
const IMAGE_PATHS: Record<string, string> = {
  '1': '/src/assets/images/DSU-Pitch.jpg',
  '2': '/src/assets/images/hexafalls.jpg',
  '3': '/src/assets/images/nasa.jpg',
};

function circularOffset(index: number, current: number, total: number): number {
  if (total === 0) return 0;
  let diff = ((index - current) % total + total) % total;
  if (diff > total / 2) diff -= total;
  return diff;
}

export const HackathonSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const currentPosRef = useRef<number>(0);
  const targetPosRef = useRef<number>(0);
  const lastSettledRef = useRef<number>(0);
  const snapTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageSizeRef = useRef<{ width: number; cardWidth: number }>({
    width: 792,
    cardWidth: 740,
  });

  const total = HACKATHONS.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const w = el.clientWidth || 792;
      const cardW = w < 640 ? w - 16 : Math.min(w - 36, 756);
      stageSizeRef.current = { width: w, cardWidth: cardW };
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Same buttery-smooth exponential damping & curved arc animation as ProjectsShowcase
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const diff = targetPosRef.current - currentPosRef.current;
      const factor = 1 - Math.exp(-11.5 * dt);
      if (Math.abs(diff) > 0.0005) {
        currentPosRef.current += diff * factor;
      } else {
        currentPosRef.current = targetPosRef.current;
      }

      const cur = currentPosRef.current;
      const normalizedIdx = ((Math.round(cur) % total) + total) % total;
      setActiveIndex((prev) => (prev !== normalizedIdx ? normalizedIdx : prev));

      const { width: stageW, cardWidth } = stageSizeRef.current;
      const isMobile = stageW < 640;
      const stepX = isMobile ? cardWidth * 0.96 : cardWidth * 0.88;

      for (let i = 0; i < total; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const offset = circularOffset(i, cur, total);
        const absOff = Math.abs(offset);

        if (absOff > 2.2) {
          cardEl.style.opacity = '0';
          cardEl.style.pointerEvents = 'none';
          cardEl.style.transform = `translate3d(${offset * stepX}px, 90px, 0) scale(0.65)`;
          continue;
        }

        const tx = offset * stepX;
        const ty = Math.pow(absOff, 1.85) * (isMobile ? 16 : 26);
        const rot = offset * (isMobile ? 4 : 5.5);
        const scale = 1 / (1 + absOff * (isMobile ? 0.2 : 0.24));
        const opacity = Math.max(0, 1 - Math.pow(absOff / 1.9, 0.9) * 0.86);
        const zIndex = Math.round(60 - absOff * 15);

        cardEl.style.width = `${cardWidth}px`;
        cardEl.style.opacity = opacity.toFixed(3);
        cardEl.style.zIndex = String(zIndex);
        cardEl.style.pointerEvents = absOff < 1.8 ? 'auto' : 'none';
        cardEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [total]);

  // Native non-passive wheel listener scoped strictly to the hackathon carousel stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rawDelta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const normalized =
        e.deltaMode === 1
          ? rawDelta * 32
          : e.deltaMode === 2
          ? rawDelta * 400
          : rawDelta;

      if (Math.abs(normalized) < 0.5) return;

      const step =
        Math.sign(normalized) * Math.min(Math.abs(normalized) * 0.0058, 1.15);
      targetPosRef.current += step;

      if (snapTimerRef.current) {
        window.clearTimeout(snapTimerRef.current);
      }
      snapTimerRef.current = window.setTimeout(() => {
        const diffFromSettled = targetPosRef.current - lastSettledRef.current;
        if (Math.abs(diffFromSettled) > 0.08 && Math.abs(diffFromSettled) < 0.5) {
          targetPosRef.current =
            lastSettledRef.current + Math.sign(diffFromSettled);
        } else {
          targetPosRef.current = Math.round(targetPosRef.current);
        }
        lastSettledRef.current = targetPosRef.current;
      }, 130);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Touch horizontal swipe support on mobile without blocking vertical page scroll
  const touchStartRef = useRef<{
    x: number;
    y: number;
    startTarget: number;
    lockedAxis: 'x' | 'y' | null;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      startTarget: targetPosRef.current,
      lockedAxis: null,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const dx = touchStartRef.current.x - e.touches[0].clientX;
    const dy = touchStartRef.current.y - e.touches[0].clientY;

    if (!touchStartRef.current.lockedAxis) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        touchStartRef.current.lockedAxis =
          Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      }
    }

    if (touchStartRef.current.lockedAxis === 'x') {
      targetPosRef.current = touchStartRef.current.startTarget + dx * 0.0048;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    if (touchStartRef.current.lockedAxis === 'x') {
      targetPosRef.current = Math.round(targetPosRef.current);
      lastSettledRef.current = targetPosRef.current;
    }
    touchStartRef.current = null;
  };

  const stepCarousel = (dir: -1 | 1) => {
    targetPosRef.current = Math.round(targetPosRef.current) + dir;
    lastSettledRef.current = targetPosRef.current;
  };

  const jumpToCard = (index: number) => {
    const offset = circularOffset(index, Math.round(currentPosRef.current), total);
    if (offset === 0) return;
    targetPosRef.current = Math.round(currentPosRef.current) + offset;
    lastSettledRef.current = targetPosRef.current;
  };

  const formattedIdx = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(total).padStart(2, '0');

  return (
    <section
      aria-label="Hackathon log"
      className="w-full max-w-[840px] mx-auto px-5 sm:px-6 mt-12 sm:mt-16"
    >
      {/* Terminal command header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="text-[13px] sm:text-[13.5px] tracking-tight flex items-center gap-2">
          <span className="text-[#4a6b1d] dark:text-[#b0c970]">$</span>
          <span className="text-[#3c3b37] dark:text-[#b5ae8c]">cat hackathon.log</span>
        </div>

        <div className="text-[11.5px] tabular-nums tracking-wider">
          <span className="text-[#1a1917] dark:text-[#dfd6a7]">{formattedIdx}</span>
          <span className="text-[#8a8880] dark:text-[#5e5d56] mx-1.5">/</span>
          <span className="text-[#5c5a52] dark:text-[#8f8d84]">{formattedTotal}</span>
        </div>
      </div>

      {/* Curved Carousel Stage */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative isolate w-full h-[545px] sm:h-[330px] md:h-[320px] flex items-center justify-center overflow-x-clip overflow-y-visible py-2"
      >
        {HACKATHONS.map((item, idx) => {
          const isCenter = idx === activeIndex;
          const imgSrc = IMAGE_PATHS[item.id] || item.image;
          const isBroken = failedImages[item.id];

          return (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onClick={() => {
                if (!isCenter) jumpToCard(idx);
              }}
              style={{
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
              className={`absolute border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] p-4 sm:p-5 shadow-[0_14px_38px_rgba(26,25,23,0.1)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.8)] transition-colors duration-200 ${
                !isCenter ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-5 sm:gap-6">
                {/* Left side: Rectangular image with good width */}
                <div className="w-full sm:w-[46%] aspect-[4/3] shrink-0 border border-[#e2e0d8] dark:border-[#222220] bg-[#f4f2ec] dark:bg-[#10110f] overflow-hidden">
                  {isBroken ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#f4f2ec] to-[#faf9f5] dark:from-[#161814] dark:to-[#0b0b0a]">
                      <span className="text-[12px] text-[#1a1917] dark:text-[#dfd6a7] font-medium">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#5c5a52] dark:text-[#7c7970] mt-1">
                        {item.position}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover block"
                    />
                  )}
                </div>

                {/* Right side: Name, Position, 1-line description, Certificate box, LinkedIn + Website icons */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[21px] sm:text-[24px] font-bold text-[#1a1917] dark:text-[#dfd6a7] leading-tight tracking-tight">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[14px] sm:text-[15.5px] font-medium text-[#4a6b1d] dark:text-[#b0c970]">
                      {item.position}
                    </p>
                    <p className="mt-3 text-[12.5px] sm:text-[13px] leading-[1.6] text-[#3c3b37] dark:text-[#b5b2a8]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-2 flex flex-col items-start sm:items-end gap-3">
                    {/* Certificate text and arrow in box */}
                    <a
                      href={item.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 border border-[#d6d4cc] dark:border-[#2c2c28] bg-[#faf9f5] dark:bg-[#0e0e0c] px-3 py-1.5 text-[12px] text-[#1a1917] dark:text-[#dfd6a7] hover:border-[#7a7d56] dark:hover:border-[#676b48] hover:text-[#000000] dark:hover:text-[#ece4bc] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
                    >
                      <span>Certificate</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#4a6b1d] dark:text-[#b0c970]" />
                    </a>

                    {/* LinkedIn & Website icons ending the right side under Certificate */}
                    <div className="flex items-center justify-end gap-4 text-[#5c5a52] dark:text-[#8f8d84]">
                      <a
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${item.name} LinkedIn profile`}
                        title="LinkedIn profile"
                        className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>

                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${item.name} hosted website`}
                        title="Hosted project website"
                        className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm"
                      >
                        <Globe className="w-4 h-4 stroke-[1.75]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Soft horizontal edge vignettes */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-8 z-[80] bg-gradient-to-r from-[#faf9f5] dark:from-[#0a0a0a] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-4 sm:w-8 z-[80] bg-gradient-to-l from-[#faf9f5] dark:from-[#0a0a0a] to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Centered < and > navigation buttons */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => stepCarousel(-1)}
          aria-label="Previous hackathon"
          className="w-9 h-9 border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] flex items-center justify-center text-[#5c5a52] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] hover:border-[#7a7d56] dark:hover:border-[#676b48] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => stepCarousel(1)}
          aria-label="Next hackathon"
          className="w-9 h-9 border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] flex items-center justify-center text-[#5c5a52] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] hover:border-[#7a7d56] dark:hover:border-[#676b48] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
