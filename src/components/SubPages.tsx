import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import {
  BLOG_POSTS,
  GEARS_LIST,
  TECH_TAGS,
  BlogPost,
} from '../data/portfolioData';

const tagStyleMap = new Map(TECH_TAGS.map((t) => [t.label, t]));

export const BlogView: React.FC = () => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  if (activePost) {
    return (
      <section className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-8 pb-16">
        <button
          type="button"
          onClick={() => setActivePost(null)}
          className="text-[12.5px] text-[#5c5a52] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] mb-6 inline-flex items-center gap-1.5 cursor-pointer"
        >
          ← cd ../blog
        </button>

        <article className="border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-[#5c5a52] dark:text-[#9c9684] tabular-nums">
            <span>{activePost.date}</span>
            <span>·</span>
            <span>{activePost.readTime} read</span>
          </div>
          <h1 className="mt-2 text-[24px] sm:text-[28px] font-bold text-[#1a1917] dark:text-[#dfd6a7] leading-snug">
            {activePost.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {activePost.tags.map((tag) => {
              const style = tagStyleMap.get(tag);
              return (
                <span
                  key={tag}
                  className={`px-2 py-[2px] text-[11px] border rounded-[3px] ${
                    style?.colorClasses ??
                    'text-[#3c3b37] dark:text-[#b5b2a8] border-[#d6d4cc] dark:border-[#242422] bg-[#faf9f5] dark:bg-[#0b0b0a]'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-[#ebe9e2] dark:border-[#1e1e1c] space-y-4 text-[14px] leading-[1.75] text-[#3c3b37] dark:text-[#b5b2a8]">
            {activePost.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-8 pb-16">
      <div className="mb-8">
        <p className="text-[12px] text-[#5c5a52] dark:text-[#9c9684] mb-1">~ cat ./blog/index.md</p>
        <h1 className="text-[32px] sm:text-[38px] font-bold text-[#1a1917] dark:text-[#dfd6a7] tracking-tight">
          blog
        </h1>
        <p className="mt-2 text-[14px] text-[#3c3b37] dark:text-[#b5b2a8] max-w-[540px] leading-relaxed">
          Engineering
        </p>
      </div>

      <div className="space-y-3">
        {BLOG_POSTS.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setActivePost(post)}
            className="w-full text-left border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] p-5 hover:border-[#8c897c] dark:hover:border-[#44453d] transition-colors cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#5c5a52] dark:text-[#9c9684] tabular-nums">
              <span>{post.date}</span>
              <span>{post.readTime} read</span>
            </div>
            <h2 className="mt-1.5 text-[17px] font-bold text-[#1a1917] dark:text-[#dfd6a7] group-hover:text-[#000000] dark:group-hover:text-[#ece4bc]">
              {post.title}
            </h2>
            <p className="mt-2 text-[13px] text-[#3c3b37] dark:text-[#b5b2a8] leading-[1.6]">
              {post.summary}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export const GearsView: React.FC = () => {
  return (
    <section className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-8 pb-16">
      <div className="mb-8">
        <p className="text-[12px] text-[#5c5a52] dark:text-[#9c9684] mb-1">~ neofetch --gears</p>
        <h1 className="text-[32px] sm:text-[38px] font-bold text-[#1a1917] dark:text-[#dfd6a7] tracking-tight">
          gears
        </h1>
        <p className="mt-2 text-[14px] text-[#3c3b37] dark:text-[#b5b2a8] max-w-[540px] leading-relaxed">
          A curated list of tools, frameworks, and technologies I use for development, design, and productivity.
        </p>
      </div>

      <div className="space-y-5">
        {GEARS_LIST.map((section) => (
          <div
            key={section.category}
            className="border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] p-5"
          >
            <h2 className="text-[13px] font-bold text-[#b56b16] dark:text-[#d99b43] mb-3.5">
              {section.category}
            </h2>
            <div className="divide-y divide-[#ebe9e2] dark:divide-[#1a1a18]">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                >
                  <span className="text-[13.5px] text-[#1a1917] dark:text-[#dfd6a7]">{item.name}</span>
                  <span className="text-[12.5px] text-[#5c5a52] dark:text-[#8f8d84]">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ResumeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-[#1a1917]/40 dark:bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Resume preview"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] border border-[#dedcd4] dark:border-[#2d2d2a] bg-[#ffffff] dark:bg-[#0c0c0b] p-6 max-h-[85vh] overflow-y-auto shadow-[0_20px_60px_rgba(26,25,23,0.18)] dark:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#ebe9e2] dark:border-[#20201e]">
          <div>
            <p className="text-[11px] text-[#5c5a52] dark:text-[#9c9684]">~ cat resume.txt</p>
            <h2 className="text-[22px] font-bold text-[#1a1917] dark:text-[#dfd6a7] mt-0.5">ankit bhadra</h2>
            <p className="text-[12.5px] text-[#3c3b37] dark:text-[#b5b2a8]">
              AIML Engineer · Terminal Tools &amp; Mobile Apps
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resume"
            className="p-1 text-[#5c5a52] dark:text-[#8f8d84] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-[13px] leading-relaxed text-[#3c3b37] dark:text-[#b5b2a8]">
          <div>
            <h3 className="text-[12px] text-[#b56b16] dark:text-[#d99b43] font-semibold mb-2">experience</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between gap-2 text-[#1a1917] dark:text-[#dfd6a7]">
                  <span>AIML Engineer</span>
                  <span className="text-[#5c5a52] dark:text-[#8f8d84] tabular-nums">2024 — present</span>
                </div>
                <p className="text-[#4a4842] dark:text-[#9c9684] text-[12px] mt-0.5">
                  Designed Go microservices, Redis stream pipelines, and containerized CLI tooling handling high-throughput webhook delivery.
                </p>
              </div>
              <div>
                <div className="flex justify-between gap-2 text-[#1a1917] dark:text-[#dfd6a7]">
                  <span>Mobile &amp; Systems Developer</span>
                  <span className="text-[#5c5a52] dark:text-[#8f8d84] tabular-nums">2022 — 2024</span>
                </div>
                <p className="text-[#4a4842] dark:text-[#9c9684] text-[12px] mt-0.5">
                  Built cross-platform Flutter applications with Riverpod state management, Firebase sync, and offline-first local storage.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] text-[#b56b16] dark:text-[#d99b43] font-semibold mb-2">core stack</h3>
            <p className="text-[#3c3b37] dark:text-[#b5b2a8]">
              Go, Dart, JavaScript, Lua, Bash · Flutter, Riverpod, Firebase, Redis, Docker, Linux, Neovim
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'abhadra1606@gmail.com';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1a1917]/40 dark:bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contact information"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] border border-[#dedcd4] dark:border-[#2d2d2a] bg-[#ffffff] dark:bg-[#0c0c0b] p-6 shadow-[0_20px_60px_rgba(26,25,23,0.18)] dark:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] text-[#5c5a52] dark:text-[#9c9684]">~ status --availability</p>
            <h2 className="text-[20px] font-bold text-[#1a1917] dark:text-[#dfd6a7] mt-0.5">open to work</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="p-1 text-[#5c5a52] dark:text-[#8f8d84] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-[#3c3b37] dark:text-[#b5b2a8]">
          Available for AIML, Design, and Web development opportunities.
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border border-[#dedcd4] dark:border-[#242422] bg-[#faf9f5] dark:bg-[#0a0a0a] px-3.5 py-2.5">
          <span className="text-[13px] text-[#1a1917] dark:text-[#dfd6a7] truncate">{email}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-[#5c5a52] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#4a6b1d] dark:text-[#a9bd7e]" />
                <span className="text-[#4a6b1d] dark:text-[#a9bd7e]">copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
