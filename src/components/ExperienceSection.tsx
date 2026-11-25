import React, { useState } from 'react';

interface ExperienceItem {
  id: string;
  role: string;
  dotClass: string;
  titleClass: string;
  description: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: '1',
    role: 'Graphic Designer (Elite Hack 1.0) - Feb 2026',
    dotClass: 'bg-[#4a6b1d] dark:bg-[#b2c96c]',
    titleClass: 'text-[#4a6b1d] dark:text-[#b2c96c]',
    description: 'designed rapid posters, banners, and social media graphics for elite hack 1.0, a hackathon event by Elite Coders Community.',
  },
  {
    id: '2',
    role: 'Google Student Ambassador - 2026',
    dotClass: 'bg-[#1f6e3a] dark:bg-[#78c28c]',
    titleClass: 'text-[#1f6e3a] dark:text-[#78c28c]',
    description:
      'organized and led workshops, events, and initiatives to promote Google technologies and resources among students. collaborated with the google team to provide feedback on products and services.',
  },
  {
    id: '3',
    role: 'Graphic Designer (Hacknovate 8.0) - Feb 2027',
    dotClass: 'bg-[#9a5c0f] dark:bg-[#d9a04e]',
    titleClass: 'text-[#9a5c0f] dark:text-[#d9a04e]',
    description:
      'designed and created visual assets for hacknovate 8.0, including logos, banners, social media graphics, and promotional materials.',
  },
];

export const ExperienceSection: React.FC = () => {
  const [showStats, setShowStats] = useState(false);

  return (
    <section
      aria-label="Experience log"
      className="w-full max-w-[840px] mx-auto px-5 sm:px-6 mt-12 sm:mt-16"
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-7 sm:mb-8">
        <div className="text-[13px] sm:text-[13.5px] tracking-tight flex items-center gap-2">
          <span className="text-[#4a6b1d] dark:text-[#b0c970]">$</span>
          <span className="text-[#3c3b37] dark:text-[#b5ae8c]">cat experience.log</span>
        </div>

        <button
          type="button"
          onClick={() => setShowStats((prev) => !prev)}
          aria-expanded={showStats}
          className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] text-[#5c5a52] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm"
        >
          {/* Minimal 3-bar stats icon matching screenshot */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="text-[#4a6b1d] dark:text-[#9cb870]"
          >
            <rect x="1.5" y="4.5" width="1.6" height="6" fill="currentColor" />
            <rect x="5.2" y="6.5" width="1.6" height="4" fill="currentColor" />
            <rect x="8.9" y="2.5" width="1.6" height="8" fill="currentColor" />
          </svg>
          <span>stats</span>
        </button>
      </div>

      {/* Expandable inline stats drawer when user clicks 'stats' */}
      {showStats && (
        <div className="mb-7 border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-4 sm:px-5 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12px] transition-colors duration-200">
          <div>
            <div className="text-[#5c5a52] dark:text-[#7c7970]">commits (1y)</div>
            <div className="text-[#1a1917] dark:text-[#dfd6a7] font-medium mt-0.5 tabular-nums">1,372</div>
          </div>
          <div>
            <div className="text-[#5c5a52] dark:text-[#7c7970]">public repos</div>
            <div className="text-[#1a1917] dark:text-[#dfd6a7] font-medium mt-0.5 tabular-nums">38</div>
          </div>
          <div>
            <div className="text-[#5c5a52] dark:text-[#7c7970]">roms shipped</div>
            <div className="text-[#1a1917] dark:text-[#dfd6a7] font-medium mt-0.5 tabular-nums">14 releases</div>
          </div>
          <div>
            <div className="text-[#5c5a52] dark:text-[#7c7970]">workshop attendees</div>
            <div className="text-[#1a1917] dark:text-[#dfd6a7] font-medium mt-0.5 tabular-nums">120+</div>
          </div>
        </div>
      )}

      {/* Timeline list */}
      <div className="pl-2 sm:pl-2.5">
        {EXPERIENCES.map((item, idx) => {
          const isLast = idx === EXPERIENCES.length - 1;
          return (
            <div key={item.id} className="relative flex items-start gap-5 sm:gap-6">
              {!isLast && (
                <span
                  className="w-[1px] bg-[#d6d4cc] dark:bg-[#2f2f2b] absolute left-[5px] -translate-x-1/2 top-[11px] bottom-[-11px]"
                  aria-hidden="true"
                />
              )}

              {/* Dot column */}
              <div className="relative flex flex-col items-center shrink-0 w-2.5">
                <span
                  className={`w-[7px] h-[7px] rounded-full mt-[7px] relative z-10 shrink-0 ${item.dotClass}`}
                  aria-hidden="true"
                />
              </div>

              {/* Content column */}
              <div className={isLast ? 'pb-2' : 'pb-7 sm:pb-8'}>
                <h2
                  className={`text-[13.5px] sm:text-[14px] font-medium leading-snug ${item.titleClass}`}
                >
                  {item.role}
                </h2>
                <p className="mt-2 text-[12.5px] sm:text-[13.5px] leading-[1.7] text-[#3c3b37] dark:text-[#b5b2a8] max-w-[710px]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
