import React from 'react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectCardVisualProps {
  project: ProjectItem;
  isExpanded?: boolean;
}

export const ProjectCardVisual: React.FC<ProjectCardVisualProps> = ({
  project,
}) => {
  switch (project.visualType) {
    case 'ooly':
      return (
        <div
          className="w-full h-full relative overflow-hidden select-none flex flex-col items-center justify-between pt-4 sm:pt-5 px-4"
          style={{
            background:
              'linear-gradient(155deg, #d76f78 0%, #e7967d 45%, #f0951f 100%)',
          }}
        >
          {/* Subtle top warm glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(255,220,210,0.28), transparent 65%)',
            }}
          />

          {/* Top headline matching screenshot */}
          <div className="relative z-10 text-center">
            <p className="text-[14px] sm:text-[18px] md:text-[20px] font-medium tracking-tight text-white drop-shadow-sm">
              Ooly ~ journal for your readings
            </p>
          </div>

          {/* 5 Fanned Phone Mockups matching screenshot */}
          <div className="relative z-10 w-full flex items-end justify-center h-[78%] mt-2">
            {/* Far Left Phone - Dark Settings */}
            <div className="w-[21%] h-[78%] -mr-[4%] translate-y-3 rounded-t-[14px] bg-[#1b1615] border-[2px] border-[#111] shadow-xl p-1.5 flex flex-col gap-1 opacity-95">
              <div className="w-6 h-1 bg-[#332c2a] rounded-full mx-auto mb-1" />
              <div className="h-3 rounded bg-[#2a2220]" />
              <div className="h-3 rounded bg-[#2a2220]" />
              <div className="h-6 rounded bg-[#261f1d] mt-1" />
              <div className="h-3 rounded bg-[#2a2220]" />
            </div>

            {/* Inner Left Phone - Autobiography of a Yogi */}
            <div className="w-[23%] h-[86%] -mr-[3%] translate-y-1.5 rounded-t-[16px] bg-[#f8f3ed] border-[2.5px] border-[#1c1917] shadow-2xl p-2 flex flex-col items-center text-[#1c1917]">
              <div className="w-7 h-1 bg-[#d6cfc7] rounded-full mb-1.5" />
              <div className="w-[52%] aspect-[3/4] rounded-[3px] bg-gradient-to-b from-[#3b4e76] to-[#1e2940] flex items-center justify-center shadow-sm">
                <span className="text-[6px] sm:text-[7px] font-bold text-[#f3e7d3] tracking-wider">
                  YOGI
                </span>
              </div>
              <div className="mt-1.5 w-full space-y-1">
                <div className="h-1 w-4/5 mx-auto bg-[#d8d0c5] rounded" />
                <div className="h-1 w-3/5 mx-auto bg-[#e3dcd2] rounded" />
                <div className="h-4 w-full bg-[#efe8de] rounded mt-1" />
              </div>
            </div>

            {/* Center Hero Phone - Welcome to Ooly */}
            <div className="relative z-20 w-[26%] h-[96%] rounded-t-[18px] bg-[#fdf9f4] border-[3px] border-[#18141a] shadow-[0_12px_35px_rgba(0,0,0,0.45)] p-2.5 flex flex-col items-center justify-between text-[#1f1c1a]">
              <div className="w-8 h-1 bg-[#18141a] rounded-full" />
              <div className="flex flex-col items-center text-center my-auto">
                <div className="w-6 h-6 rounded-lg bg-[#f3e3d3] flex items-center justify-center mb-1.5 border border-[#e2cbb5]">
                  <div className="w-3 h-2.5 border border-[#c87d55] rounded-[2px]" />
                </div>
                <div className="text-[7px] sm:text-[8px] font-bold tracking-tight">
                  Welcome to Ooly
                </div>
                <div className="mt-1.5 w-full space-y-1">
                  <div className="h-1 w-14 mx-auto bg-[#e6dfd7] rounded" />
                  <div className="h-1 w-11 mx-auto bg-[#ece6df] rounded" />
                  <div className="h-1 w-12 mx-auto bg-[#e6dfd7] rounded" />
                </div>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#18141a] mb-1" />
            </div>

            {/* Inner Right Phone - Your Library */}
            <div className="w-[23%] h-[86%] -ml-[3%] translate-y-1.5 rounded-t-[16px] bg-[#fdfaf6] border-[2.5px] border-[#1c1917] shadow-2xl p-2 flex flex-col text-[#1c1917]">
              <div className="w-7 h-1 bg-[#d6cfc7] rounded-full mx-auto mb-1.5" />
              <div className="text-[6px] font-semibold mb-1 text-[#444]">Your Library</div>
              <div className="grid grid-cols-3 gap-1">
                <div className="aspect-[2/3] rounded-[2px] bg-[#9c2b23]" />
                <div className="aspect-[2/3] rounded-[2px] bg-[#222226]" />
                <div className="aspect-[2/3] rounded-[2px] bg-[#c9a15d]" />
              </div>
              <div className="mt-1.5 h-1 w-1/2 bg-[#ddd6cd] rounded" />
              <div className="mt-1 grid grid-cols-2 gap-1 flex-1">
                <div className="rounded-[2px] bg-[#efe8de]" />
                <div className="rounded-[2px] bg-[#efe8de]" />
              </div>
            </div>

            {/* Far Right Phone - Sapiens */}
            <div className="w-[21%] h-[78%] -ml-[4%] translate-y-3 rounded-t-[14px] bg-[#f4ede4] border-[2px] border-[#1c1917] shadow-xl p-2 flex flex-col items-center text-[#1c1917]">
              <div className="w-6 h-1 bg-[#d6cfc7] rounded-full mb-1.5" />
              <div className="w-full h-[55%] rounded-[3px] bg-gradient-to-b from-[#d85a3a] to-[#b83f26] p-1 flex flex-col justify-between text-white">
                <span className="text-[7px] font-bold leading-none">Sapiens</span>
                <span className="text-[4.5px] opacity-80">Yuval Noah Harari</span>
              </div>
              <div className="mt-1.5 w-full space-y-1">
                <div className="h-1 w-full bg-[#dcd4ca] rounded" />
                <div className="h-1 w-4/5 bg-[#e6dfd6] rounded" />
              </div>
            </div>
          </div>
        </div>
      );

    case 'toofan':
      return (
        <div className="w-full h-full bg-[#0d0e10] border border-[#222326] p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-[10px] text-[#5c5f66]">
            <span>toofan.sh</span>
            <span className="text-[#c8a951]">15</span>
          </div>
          <div className="my-auto text-[11px] sm:text-[13px] leading-[1.9] text-[#555860] font-mono">
            <span className="text-[#d4ccb0]">given</span> time surface should blue feel human{' '}
            <span className="border-l-2 border-[#dfd6a7] text-[#8d9099] pl-[1px]">
              point themselves
            </span>{' '}
            we table to are decide result field because table year the that wonder seem girl
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#6d7078]">
            <span className="text-[#a5a196]">Toofan</span>
            <span>wpm 114 · acc 98%</span>
          </div>
        </div>
      );

    case 'symphony':
      return (
        <div
          className="w-full h-full relative overflow-hidden p-5 sm:p-7 flex flex-col justify-between select-none"
          style={{
            background:
              'radial-gradient(circle at 30% 25%, #2a1822 0%, #120d11 55%, #09080a 100%)',
          }}
        >
          <div className="flex items-center justify-between text-[10px] text-[#7a6871]">
            <span>now playing</span>
            <span>44.1 khz · flac</span>
          </div>
          <div className="my-auto text-center">
            <p className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#e3d2d8]/90 italic">
              Symphony
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5 h-6">
              {[35, 68, 48, 92, 60, 80, 42, 74, 52, 88, 44, 62].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 rounded-full bg-[#c98da2]/55"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#8a7580]">
            <span>rain on cedar</span>
            <span>02:14 / 05:00</span>
          </div>
        </div>
      );

    case 'termpulse':
      return (
        <div className="w-full h-full bg-[#090a0b] border border-[#222426] p-4 sm:p-5 flex flex-col justify-between font-mono select-none">
          <div className="flex items-center justify-between border-b border-[#1b1d1f] pb-2 text-[10px] text-[#6f747c]">
            <span>termpulse — docker://prod-cluster</span>
            <span className="text-[#78a66a]">live</span>
          </div>
          <div className="my-auto space-y-1.5 text-[10px] sm:text-[11px]">
            <div className="flex gap-2">
              <span className="text-[#5e6268]">03:15:01</span>
              <span className="text-[#d9b76a]">WARN</span>
              <span className="text-[#a5a9b0] truncate">redis-pool latency spike 14.2ms</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#5e6268]">03:15:03</span>
              <span className="text-[#78a66a]">INFO</span>
              <span className="text-[#a5a9b0] truncate">worker-04 drained 420 jobs</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#5e6268]">03:15:05</span>
              <span className="text-[#6ec3c9]">GRPC</span>
              <span className="text-[#a5a9b0] truncate">POST /v1/dispatch 200 OK 1.8ms</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#5e6268]">03:15:08</span>
              <span className="text-[#78a66a]">INFO</span>
              <span className="text-[#a5a9b0] truncate">snapshot flushed 12.4MB</span>
            </div>
          </div>
          <div className="text-[10px] text-[#5e6268] flex justify-between">
            <span>TermPulse</span>
            <span>q:quit /:filter</span>
          </div>
        </div>
      );

    case 'kalam':
      return (
        <div
          className="w-full h-full relative overflow-hidden p-5 flex flex-col justify-between select-none"
          style={{
            background: 'linear-gradient(145deg, #1b1c1f 0%, #0d0d0f 100%)',
          }}
        >
          <div className="flex items-center justify-center gap-3 h-[78%] my-auto">
            <div className="w-[28%] h-[82%] -rotate-12 rounded-[14px] bg-[#131416] border border-[#2c2e33] p-2.5 flex flex-col gap-1.5 shadow-xl">
              <div className="w-5 h-1 bg-[#313338] rounded-full mx-auto" />
              <div className="h-2 w-2/3 bg-[#3e4047] rounded mt-1" />
              <div className="h-1.5 w-full bg-[#24262b] rounded" />
              <div className="h-1.5 w-5/6 bg-[#24262b] rounded" />
            </div>
            <div className="w-[30%] h-[92%] rounded-[14px] bg-[#16171a] border border-[#3a3c42] p-3 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-6 h-1 bg-[#3a3c42] rounded-full mx-auto mb-2" />
                <div className="text-[9px] text-[#dfd6a7] font-semibold">draft_04.md</div>
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-full bg-[#2d2f36] rounded" />
                  <div className="h-1.5 w-4/5 bg-[#2d2f36] rounded" />
                  <div className="h-1.5 w-full bg-[#2d2f36] rounded" />
                </div>
              </div>
              <div className="text-[7px] text-[#6d7078]">482 words</div>
            </div>
            <div className="w-[28%] h-[82%] rotate-12 rounded-[14px] bg-[#131416] border border-[#2c2e33] p-2.5 flex flex-col gap-1.5 shadow-xl">
              <div className="w-5 h-1 bg-[#313338] rounded-full mx-auto" />
              <div className="h-2 w-1/2 bg-[#3e4047] rounded mt-1" />
              <div className="h-1.5 w-full bg-[#24262b] rounded" />
              <div className="h-1.5 w-3/4 bg-[#24262b] rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#8b8e96]">
            <span>KaLam</span>
            <span>oled ink mode</span>
          </div>
        </div>
      );

    default: {
      // Rich domain-authentic terminal / mobile preview cards for projects 06–15
      const isApp = project.category === 'apps';
      return (
        <div
          className="w-full h-full relative overflow-hidden p-5 sm:p-6 flex flex-col justify-between border border-[#252624] select-none"
          style={{
            background: isApp
              ? 'linear-gradient(150deg, #171a1f 0%, #0d0e11 100%)'
              : 'linear-gradient(150deg, #101411 0%, #0a0b0a 100%)',
          }}
        >
          <div className="flex items-center justify-between text-[10px] text-[#777a74]">
            <span>{isApp ? 'mobile / flutter' : 'tui / go'}</span>
            <span className="text-[#dfd6a7]/80">{project.stack[0]}</span>
          </div>

          <div className="my-auto">
            <div className="text-[22px] sm:text-[26px] font-bold text-[#dfd6a7] tracking-tight">
              {project.name}
            </div>
            <div className="mt-2 border border-[#232622] bg-[#090a09]/90 p-3 rounded-[3px] text-[10.5px] text-[#8f948b] space-y-1">
              <div className="text-[#a9bd7e]">$ {project.id} --status</div>
              <div className="truncate">{project.bullets[0]}</div>
              <div className="text-[#6ec3c9] truncate">▸ {project.bullets[1]}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#6d706a]">
            <span>{project.stack.slice(0, 3).join(' · ')}</span>
            <span>ready</span>
          </div>
        </div>
      );
    }
  }
};
