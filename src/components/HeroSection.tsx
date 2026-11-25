import React from 'react';
import { TECH_TAGS } from '../data/portfolioData';
import { StipplePenguin } from './StipplePenguin';

interface HeroSectionProps {
  onOpenContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenContact,
}) => {
  return (
    <section
      aria-label="Introduction"
      className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-8 pb-12 sm:pt-14 sm:pb-16"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
        {/* Left: Stippled Penguin */}
        <div className="md:pt-2 shrink-0">
          <StipplePenguin />
        </div>

        {/* Right: Identity, Bio, Tech Stack, Social Icons */}
        <div className="w-full max-w-[490px] relative">
          {/* Top header + tilted double-bordered stamp */}
          <div className="relative pr-28 sm:pr-32">
            <p className="text-[12px] sm:text-[12.5px] text-[#5c5a52] dark:text-[#9c9684] tracking-tight mb-1">
              ~ epsilon-rbtcs
            </p>
            <h1 className="text-[30px] sm:text-[40px] md:text-[44px] font-bold leading-[1.08] tracking-[-0.02em] text-[#1a1917] dark:text-[#dfd6a7]">
              ankit bhadra
            </h1>

            {/* Double-bordered tilted 'open to work' stamp */}
            <button
              type="button"
              onClick={onOpenContact}
              title="Available for AIML, Design and Web Development Roles"
              className="absolute right-0 top-1 sm:top-1.5 -rotate-[14deg] border border-[#7a7d56] dark:border-[#676b48] p-[3px] bg-[#faf9f5]/90 dark:bg-[#0a0a0a]/80 hover:border-[#4a4e2f] dark:hover:border-[#929768] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
            >
              <span className="block border border-[#7a7d56] dark:border-[#676b48] px-2.5 sm:px-3 py-[3px] text-[10.5px] sm:text-[11.5px] text-[#3d4223] dark:text-[#c7c194] tracking-[0.02em] whitespace-nowrap">
                open to work
              </span>
            </button>
          </div>

          {/* Bio paragraph */}
          <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.68] text-[#3c3b37] dark:text-[#b5b2a8] max-w-[465px]">
            I&apos;m a ML engineer who also loves designing and building end to end products.
          </p>

          {/* Tech stack tags */}
          <div
            className="mt-5 flex flex-wrap gap-[7px]"
            aria-label="Technologies and tools"
          >
            {TECH_TAGS.map((tag) => (
              <span
                key={tag.label}
                className={`px-2 py-[3px] text-[11.5px] leading-tight border rounded-[3px] whitespace-nowrap shrink-0 transition-transform duration-150 hover:-translate-y-[1px] hover:brightness-95 dark:hover:brightness-110 select-none cursor-default ${tag.colorClasses}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Social & Action Icons Row */}
          <div className="mt-6 flex items-center gap-5 text-[#5c5a52] dark:text-[#8f8d84]">
            {/* GitHub */}
            <a
              href="https://github.com/epsilon-rbtcs"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm p-0.5"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/epsilonrbtcs"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm p-0.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/ankit-bhadra/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm p-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:abhadra1606@gmail.com"
              aria-label="Email Ankit Bhadra"
              title="Email abhadra1606@gmail.com"
              className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm p-0.5"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>

            {/* Resume / Document */}
            <a
              href="/assets/aistudio/Resume-Nov_e9c9d5b1.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label="View Resume"
              title="View Resume (PDF)"
              className="hover:text-[#1a1917] dark:hover:text-[#dfd6a7] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7] rounded-sm p-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
