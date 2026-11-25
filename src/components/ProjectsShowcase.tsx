import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, LayoutGrid, Rows3, X } from 'lucide-react';
import { ProjectCategory, ProjectItem, PROJECTS } from '../data/portfolioData';
import { ProjectCardVisual } from './ProjectCardVisual';

interface ProjectsShowcaseProps {
  initialTagFilter: string | null;
  onClearTagFilter: () => void;
}

type CategoryFilter = 'all' | ProjectCategory;

// Shortest signed modular distance in [-N/2, N/2]
function circularOffset(index: number, current: number, total: number): number {
  if (total === 0) return 0;
  let diff = ((index - current) % total + total) % total;
  if (diff > total / 2) diff -= total;
  return diff;
}

function getISTTime(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${formatter.format(new Date())} IST`;
  } catch {
    return '00:34 IST';
  }
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({
  initialTagFilter,
  onClearTagFilter,
}) => {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [expandedProject, setExpandedProject] = useState<ProjectItem | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [istTime, setIstTime] = useState<string>(getISTTime);

  const filteredProjects = useMemo(() => {
    let list = PROJECTS;
    if (category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (initialTagFilter) {
      const tagMatches = list.filter((p) => p.tags.includes(initialTagFilter));
      if (tagMatches.length > 0) list = tagMatches;
    }
    return list;
  }, [category, initialTagFilter]);

  // Default to index 2 ("Ooly journal", 03 / 15) when showing all projects
  const defaultIndex = useMemo(() => {
    if (category === 'all' && !initialTagFilter) {
      const idx = filteredProjects.findIndex((p) => p.id === 'ooly-journal');
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [category, initialTagFilter, filteredProjects]);

  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);

  // Continuous physics state for 60/120fps buttery-smooth scrolling
  const currentPosRef = useRef<number>(defaultIndex);
  const targetPosRef = useRef<number>(defaultIndex);
  const snapTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageSizeRef = useRef<{ width: number; cardWidth: number }>({
    width: 1100,
    cardWidth: 480,
  });

  // Update IST clock every 30s
  useEffect(() => {
    const id = window.setInterval(() => setIstTime(getISTTime()), 30000);
    return () => window.clearInterval(id);
  }, []);

  // Reset carousel position when filter changes
  useEffect(() => {
    currentPosRef.current = defaultIndex;
    targetPosRef.current = defaultIndex;
    setActiveIndex(defaultIndex);
  }, [defaultIndex, filteredProjects.length]);

  // Close expanded photo / privacy on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedProject(null);
        setPrivacyOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Measure responsive stage & card dimensions
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const w = el.clientWidth || 1000;
      const cardW = w < 640 ? Math.min(w * 0.78, 330) : w < 960 ? 410 : 480;
      stageSizeRef.current = { width: w, cardWidth: cardW };
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewMode]);

  const scheduleSnap = useCallback((delay = 140) => {
    if (snapTimerRef.current) {
      window.clearTimeout(snapTimerRef.current);
    }
    snapTimerRef.current = window.setTimeout(() => {
      targetPosRef.current = Math.round(targetPosRef.current);
    }, delay);
  }, []);

  // Main animation loop: transforms cards directly via refs with exponential damping
  useEffect(() => {
    if (viewMode !== 'carousel') return;

    let rafId = 0;
    let lastTime = performance.now();
    const total = filteredProjects.length;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const diff = targetPosRef.current - currentPosRef.current;
      // Exponential time-independent damping: super smooth at any framerate or scroll speed
      const factor = 1 - Math.exp(-11.5 * dt);
      if (Math.abs(diff) > 0.0005) {
        currentPosRef.current += diff * factor;
      } else {
        currentPosRef.current = targetPosRef.current;
      }

      const cur = currentPosRef.current;
      const normalizedIdx =
        total > 0 ? ((Math.round(cur) % total) + total) % total : 0;

      setActiveIndex((prev) => (prev !== normalizedIdx ? normalizedIdx : prev));

      const { width: stageW, cardWidth } = stageSizeRef.current;
      const isMobile = stageW < 640;
      const stepX = isMobile ? cardWidth * 0.76 : Math.min(stageW * 0.275, 320);

      for (let i = 0; i < total; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const offset = circularOffset(i, cur, total);
        const absOff = Math.abs(offset);

        // Hide cards beyond ±2.65 cleanly for crisp performance & zero wrap-around flash
        if (absOff > 2.65) {
          cardEl.style.opacity = '0';
          cardEl.style.pointerEvents = 'none';
          cardEl.style.transform = `translate3d(${offset * stepX}px, 160px, 0) scale(0.45)`;
          continue;
        }

        // Smooth curved arc math matching the screenshot
        const tx = offset * stepX;
        const ty = Math.pow(absOff, 1.85) * (isMobile ? 22 : 30);
        const rot = offset * (isMobile ? 5.5 : 7.2);
        const scale = 1 / (1 + absOff * (isMobile ? 0.32 : 0.36));

        // Opacity falloff: 1.0 center -> ~0.42 neighbor -> ~0.18 outer
        const opacity = Math.max(0, 1 - Math.pow(absOff / 2.55, 0.85) * 0.88);
        const zIndex = Math.round(100 - absOff * 20);

        cardEl.style.width = `${cardWidth}px`;
        cardEl.style.opacity = opacity.toFixed(3);
        cardEl.style.zIndex = String(zIndex);
        cardEl.style.pointerEvents = absOff < 2.4 ? 'auto' : 'none';
        cardEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

        // Dim overlay on non-center cards
        const overlay = cardEl.firstElementChild?.querySelector(
          '[data-dim-overlay]'
        ) as HTMLElement | null;
        if (overlay) {
          const dimAlpha = Math.min(0.72, absOff * 0.38);
          overlay.style.opacity = dimAlpha.toFixed(3);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [filteredProjects.length, viewMode]);

  // Smooth wheel / trackpad listener across the entire projects page when in carousel mode
  const lastSettledRef = useRef<number>(defaultIndex);

  useEffect(() => {
    lastSettledRef.current = defaultIndex;
  }, [defaultIndex]);

  useEffect(() => {
    if (viewMode !== 'carousel' || expandedProject || privacyOpen) return;

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

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [viewMode, expandedProject, privacyOpen]);

  // Keyboard arrow navigation
  useEffect(() => {
    if (viewMode !== 'carousel' || expandedProject || privacyOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        targetPosRef.current = Math.round(targetPosRef.current) + 1;
        lastSettledRef.current = targetPosRef.current;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        targetPosRef.current = Math.round(targetPosRef.current) - 1;
        lastSettledRef.current = targetPosRef.current;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, expandedProject, privacyOpen]);

  // Touch swipe support for mobile & tablet
  const touchStartRef = useRef<{ x: number; y: number; startTarget: number } | null>(
    null
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      startTarget: targetPosRef.current,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const dx = touchStartRef.current.x - e.touches[0].clientX;
    const dy = touchStartRef.current.y - e.touches[0].clientY;
    const primary = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    targetPosRef.current = touchStartRef.current.startTarget + primary * 0.0052;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
    scheduleSnap(20);
  };

  const handleCardClick = (index: number, project: ProjectItem) => {
    const total = filteredProjects.length;
    const offset = circularOffset(index, currentPosRef.current, total);

    // If center card is clicked, pop out the photo!
    if (Math.abs(offset) < 0.25) {
      setExpandedProject(project);
      return;
    }

    // Side card clicked: scroll past any cards in between to land smoothly on clicked card
    const roundedOffset = circularOffset(index, Math.round(currentPosRef.current), total);
    targetPosRef.current = Math.round(currentPosRef.current) + roundedOffset;
    lastSettledRef.current = targetPosRef.current;
  };

  const currentProject = filteredProjects[activeIndex] || filteredProjects[0];
  const totalCount = filteredProjects.length;
  const formattedIndex = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalCount).padStart(2, '0');

  return (
    <div
      className="w-full flex-1 flex flex-col justify-between min-h-[calc(100vh-64px)] select-none"
      onTouchStart={viewMode === 'carousel' ? handleTouchStart : undefined}
      onTouchMove={viewMode === 'carousel' ? handleTouchMove : undefined}
      onTouchEnd={viewMode === 'carousel' ? handleTouchEnd : undefined}
    >
      {/* Top Sub-bar: all / apps / tui + grid toggle */}
      <div className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-3 pb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-[12px] sm:text-[12.5px]">
          {(['all', 'apps', 'tui'] as CategoryFilter[]).map((cat, idx) => {
            const isActive = category === cat;
            return (
              <React.Fragment key={cat}>
                {idx > 0 && <span className="text-[#b5b2a8] dark:text-[#4a4943]">/</span>}
                <button
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    onClearTagFilter();
                  }}
                  className={`cursor-pointer transition-colors ${
                    isActive
                      ? 'text-[#1a1917] dark:text-[#dfd6a7] font-medium dark:font-normal'
                      : 'text-[#5c5a52] dark:text-[#8f8d84] hover:text-[#1a1917] dark:hover:text-[#dfd6a7]'
                  }`}
                >
                  {cat}
                </button>
              </React.Fragment>
            );
          })}

          {initialTagFilter && (
            <>
              <span className="text-[#b5b2a8] dark:text-[#4a4943]">·</span>
              <button
                type="button"
                onClick={onClearTagFilter}
                className="text-[#b56b16] dark:text-[#d99b43] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] cursor-pointer inline-flex items-center gap-1"
                title="Clear tag filter"
              >
                #{initialTagFilter} ×
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setViewMode((prev) => (prev === 'carousel' ? 'grid' : 'carousel'))
          }
          aria-label={viewMode === 'carousel' ? 'Switch to grid view' : 'Switch to carousel view'}
          title={viewMode === 'carousel' ? 'Grid view' : 'Carousel view'}
          className="text-[#5c5a52] dark:text-[#8f8d84] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors p-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm"
        >
          {viewMode === 'carousel' ? (
            <LayoutGrid className="w-4 h-4 stroke-[1.6]" />
          ) : (
            <Rows3 className="w-4 h-4 stroke-[1.6]" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      {viewMode === 'carousel' ? (
        <div className="flex-1 flex flex-col justify-center w-full overflow-hidden">
          {/* Index Counter aligned right inside wide stage */}
          <div className="w-full max-w-[1160px] mx-auto px-5 sm:px-8 flex justify-end mb-1 sm:mb-2">
            <div className="text-[11.5px] sm:text-[12px] tabular-nums tracking-wider">
              <span className="text-[#1a1917] dark:text-[#dfd6a7]">{formattedIndex}</span>
              <span className="text-[#8a8880] dark:text-[#5e5d56] mx-1.5">/</span>
              <span className="text-[#5c5a52] dark:text-[#8f8d84]">{formattedTotal}</span>
            </div>
          </div>

          {/* 3D Curved Arc Stage */}
          <div
            ref={stageRef}
            className="relative isolate w-full max-w-[1360px] mx-auto h-[220px] sm:h-[290px] md:h-[315px] flex items-center justify-center overflow-visible"
          >
            {filteredProjects.map((project, idx) => (
              <button
                key={project.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => handleCardClick(idx, project)}
                aria-label={`View ${project.name}`}
                style={{
                  transformOrigin: 'center center',
                  willChange: 'transform, opacity',
                }}
                className="group absolute aspect-[16/10] rounded-[2px] overflow-hidden shadow-[0_18px_45px_rgba(26,25,23,0.16)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_24px_60px_rgba(26,25,23,0.24)] dark:hover:shadow-[0_26px_68px_rgba(0,0,0,0.95)] border border-[#d6d4cc] dark:border-[#2a2a27] hover:border-[#8c897c] dark:hover:border-[#676b48] bg-[#ffffff] dark:bg-[#0a0a0a] transition-[box-shadow,border-color] duration-250 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
              >
                <div className="relative w-full h-full bg-[#ffffff] dark:bg-[#0a0a0a] overflow-hidden">
                  <div className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.025]">
                    <ProjectCardVisual project={project} />
                  </div>
                  {/* Subtle darkening/fading overlay for side cards */}
                  <div
                    data-dim-overlay
                    className="absolute inset-0 bg-[#faf9f5] dark:bg-[#0a0a0a] pointer-events-none transition-opacity duration-75"
                    style={{ opacity: 0 }}
                  />
                </div>
              </button>
            ))}

            {/* Soft edge vignettes fading outer cards into page background */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-[120] bg-gradient-to-r from-[#faf9f5] dark:from-[#0a0a0a] to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-[120] bg-gradient-to-l from-[#faf9f5] dark:from-[#0a0a0a] to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Active Project Info Below Carousel */}
          {currentProject && (
            <div className="w-full max-w-[680px] mx-auto px-5 sm:px-6 mt-5 sm:mt-6 text-center">
              <div className="inline-flex items-center justify-center gap-2.5">
                <h1 className="text-[26px] sm:text-[32px] font-medium tracking-tight text-[#1a1917] dark:text-[#dfd6a7] leading-tight">
                  {currentProject.name}
                </h1>
                <a
                  href={currentProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${currentProject.name} repository`}
                  className="text-[#5c5a52] dark:text-[#8f8d84] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors translate-y-[1px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="mt-1.5 text-[13px] sm:text-[14.5px] text-[#4a4842] dark:text-[#9c9684]">
                {currentProject.subtitle}
              </p>

              <p className="mt-3 text-[11.5px] sm:text-[12px] text-[#5c5a52] dark:text-[#7c7970] tracking-wide">
                {currentProject.stack.join(' · ')}
              </p>

              {/* Bullet Summary Box */}
              <div className="mt-6 max-w-[600px] mx-auto border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-5 sm:px-7 py-4 sm:py-5 text-left transition-colors duration-200">
                <ul className="space-y-2.5 text-[12px] sm:text-[12.5px] text-[#3c3b37] dark:text-[#9c9684] leading-[1.6]">
                  {currentProject.bullets.map((line, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="text-[#8f6d24] dark:text-[#9e8c50] text-[9px] mt-[5px] shrink-0"
                        aria-hidden="true"
                      >
                        ▸
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grid View triggered by 2x2 Grid Icon */
        <div className="flex-1 w-full max-w-[840px] mx-auto px-5 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="group border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] p-4 flex flex-col gap-3 hover:-translate-y-0.5 hover:border-[#8c897c] dark:hover:border-[#676b48] hover:shadow-[0_14px_34px_rgba(26,25,23,0.12)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.65)] transition-[transform,box-shadow,border-color] duration-250 ease-out"
              >
                <button
                  type="button"
                  onClick={() => setExpandedProject(project)}
                  className="w-full aspect-[16/10] overflow-hidden border border-[#e2e0d8] dark:border-[#222220] cursor-pointer text-left"
                >
                  <div className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.025]">
                    <ProjectCardVisual project={project} />
                  </div>
                </button>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('carousel');
                      currentPosRef.current = idx;
                      targetPosRef.current = idx;
                      setActiveIndex(idx);
                    }}
                    className="text-[16px] font-medium text-[#1a1917] dark:text-[#dfd6a7] hover:underline cursor-pointer text-left"
                  >
                    {project.name}
                  </button>
                  <span className="text-[11px] text-[#5c5a52] dark:text-[#7c7970] tabular-nums">
                    {String(idx + 1).padStart(2, '0')} / {formattedTotal}
                  </span>
                </div>
                <p className="text-[12px] text-[#4a4842] dark:text-[#9c9684]">{project.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Footer Bar matching screenshot */}
      <footer className="w-full max-w-[1160px] mx-auto px-5 sm:px-8 pt-6 pb-4 mt-4 border-t border-[#e4e2da] dark:border-[#161614] flex items-center justify-between text-[11px] sm:text-[11.5px] text-[#5c5a52] dark:text-[#8f8d84]">
        <div className="tabular-nums">{istTime}</div>

        {/* Tiny centered capsule scroll indicator */}
        <div
          className="w-8 h-[7px] rounded-full border border-[#b5b2a8] dark:border-[#4a4944] overflow-hidden flex items-center px-[1px]"
          aria-hidden="true"
        >
          <div
            className="h-[3px] rounded-full bg-[#5c5a52] dark:bg-[#8f8d84] transition-all duration-200"
            style={{
              width: `${Math.max(18, 100 / Math.max(totalCount, 1))}%`,
              marginLeft: `${
                totalCount > 1
                  ? (activeIndex / (totalCount - 1)) *
                    (100 - Math.max(18, 100 / totalCount))
                  : 0
              }%`,
            }}
          />
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors cursor-pointer"
          >
            privacy
          </button>
          <button
            type="button"
            onClick={() => {
              if (viewMode === 'carousel') {
                const offset = circularOffset(0, Math.round(currentPosRef.current), totalCount);
                targetPosRef.current = Math.round(currentPosRef.current) + offset;
                lastSettledRef.current = targetPosRef.current;
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors cursor-pointer"
          >
            top ↑
          </button>
        </div>
      </footer>

      {/* Pop-out Photo Lightbox Modal (click photo to pop out above everything, click again to put back) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {expandedProject && (
              <motion.div
                key="photo-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={`${expandedProject.name} preview`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setExpandedProject(null)}
                className="fixed inset-0 z-[9999] bg-[#faf9f5]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.84, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.84, y: 12 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setExpandedProject(null)}
                  className="relative z-10 w-full max-w-[860px] aspect-[16/10] rounded-[3px] overflow-hidden bg-[#ffffff] dark:bg-[#0a0a0a] border border-[#d6d4cc] dark:border-[#3a3a35] shadow-[0_28px_90px_rgba(26,25,23,0.28)] dark:shadow-[0_28px_90px_rgba(0,0,0,1)] cursor-pointer"
                >
                  <ProjectCardVisual project={expandedProject} isExpanded />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Privacy Notice Modal */}
      {privacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Privacy note"
          onClick={() => setPrivacyOpen(false)}
          className="fixed inset-0 z-[9999] bg-[#1a1917]/40 dark:bg-black/85 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] border border-[#dedcd4] dark:border-[#2d2d2a] bg-[#ffffff] dark:bg-[#0c0c0b] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] text-[#5c5a52] dark:text-[#9c9684]">~ cat privacy.txt</p>
                <h2 className="text-[18px] font-bold text-[#1a1917] dark:text-[#dfd6a7] mt-0.5">privacy</h2>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label="Close privacy note"
                className="p-1 text-[#5c5a52] dark:text-[#8f8d84] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-[#3c3b37] dark:text-[#b5b2a8]">
              Zero cookies, zero third-party analytics, and zero tracking scripts. Just static pages and monospace text.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
