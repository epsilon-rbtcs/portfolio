import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ContributionDay } from '../data/portfolioData';

const GITHUB_USERNAME = 'epsilon-rbtcs';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ApiContributionEntry {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ApiResponse {
  total: {
    lastYear?: number;
    [key: string]: number | undefined;
  };
  contributions: ApiContributionEntry[];
}

function buildCalendarGrid(entries: ApiContributionEntry[]): {
  weeks: (ContributionDay | null)[][];
  months: { label: string; colIndex: number }[];
} {
  if (entries.length === 0) {
    return { weeks: [], months: [] };
  }

  const weeks: (ContributionDay | null)[][] = [];
  let currentWeek: (ContributionDay | null)[] = new Array(7).fill(null);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const [yearStr, monthStr, dayStr] = entry.date.split('-');
    const year = Number(yearStr);
    const monthIdx = Number(monthStr) - 1;
    const dayNum = Number(dayStr);

    const utcDate = new Date(Date.UTC(year, monthIdx, dayNum));
    const dow = utcDate.getUTCDay(); // 0 = Sun .. 6 = Sat

    if (i > 0 && dow === 0) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }

    const formattedDate = `${MONTH_NAMES[monthIdx]} ${dayNum}, ${year}`;
    currentWeek[dow] = {
      date: formattedDate,
      count: entry.count,
      level: entry.level,
    };
  }
  weeks.push(currentWeek);

  // Derive month labels cleanly at week boundaries without overlapping
  const months: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  let lastCol = -4;

  weeks.forEach((week, colIndex) => {
    const firstValid = week.find((d) => d !== null);
    if (!firstValid) return;

    const monthName = firstValid.date.slice(0, 3);
    const monthIdx = MONTH_NAMES.indexOf(monthName);
    if (monthIdx !== -1 && monthIdx !== lastMonth) {
      if (colIndex - lastCol >= 3) {
        months.push({ label: monthName, colIndex });
        lastCol = colIndex;
      }
      lastMonth = monthIdx;
    }
  });

  return { weeks, months };
}

const LEVEL_CLASS_NAMES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#ebedf0] dark:bg-[#1a1c19]',
  1: 'bg-[#9be9a8] dark:bg-[#2a4335]',
  2: 'bg-[#40c463] dark:bg-[#3c634a]',
  3: 'bg-[#30a14e] dark:bg-[#6c9665]',
  4: 'bg-[#216e39] dark:bg-[#b0c970]',
};

export const ContributionGraph: React.FC = () => {
  const [weeks, setWeeks] = useState<(ContributionDay | null)[][]>([]);
  const [months, setMonths] = useState<{ label: string; colIndex: number }[]>([]);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<ContributionDay | null>(null);

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
          GITHUB_USERNAME
        )}?y=last`
      );
      if (!res.ok) {
        throw new Error(`failed to fetch contributions (${res.status})`);
      }
      const data: ApiResponse = await res.json();
      const entries = Array.isArray(data.contributions) ? data.contributions : [];
      const built = buildCalendarGrid(entries);

      const sumFromEntries = entries.reduce((acc, item) => acc + (item.count || 0), 0);
      const total =
        typeof data.total?.lastYear === 'number' ? data.total.lastYear : sumFromEntries;

      setWeeks(built.weeks);
      setMonths(built.months);
      setTotalContributions(total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'could not load github contributions'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const colCount = useMemo(() => Math.max(weeks.length, 53), [weeks.length]);

  return (
    <section
      aria-label="GitHub contribution activity"
      className="w-full max-w-[840px] mx-auto px-5 sm:px-6"
    >
      <div className="border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-4 sm:px-6 py-4 transition-colors duration-200">
        {loading ? (
          <div className="py-10 text-center text-[12px] text-[#5c5a52] dark:text-[#8f8d84]">
            fetching past 1 year contributions for @{GITHUB_USERNAME}...
          </div>
        ) : error ? (
          <div className="py-8 text-center space-y-2.5">
            <p className="text-[12px] text-[#a63a22] dark:text-[#cc7d68]">{error}</p>
            <button
              type="button"
              onClick={fetchContributions}
              className="border border-[#d6d4cc] dark:border-[#242422] px-3 py-1 text-[11.5px] text-[#1a1917] dark:text-[#dfd6a7] hover:border-[#4a4e2f] dark:hover:border-[#676b48] cursor-pointer"
            >
              retry
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto heatmap-scroll pb-1">
              <div className="min-w-[690px]">
                {/* Month labels row */}
                <div className="relative h-5 mb-1.5 text-[11px] text-[#525049] dark:text-[#c7be96]">
                  {months.map((m) => (
                    <span
                      key={`${m.label}-${m.colIndex}`}
                      style={{ left: `${(m.colIndex / colCount) * 100}%` }}
                      className="absolute top-0 leading-none select-none"
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                {/* Dynamic 53-week x 7-day heatmap grid */}
                <div
                  className="grid gap-[3px]"
                  style={{
                    gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={dIdx}
                              className="w-full aspect-square rounded-[2px] bg-transparent"
                              aria-hidden="true"
                            />
                          );
                        }

                        return (
                          <div
                            key={day.date}
                            onMouseEnter={() => setHovered(day)}
                            onFocus={() => setHovered(day)}
                            tabIndex={0}
                            aria-label={`${day.count} contributions on ${day.date}`}
                            className={`w-full aspect-square rounded-[2px] transition-transform duration-100 hover:scale-125 hover:ring-1 hover:ring-[#1a1917]/50 dark:hover:ring-[#dfd6a7]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1a1917] dark:focus-visible:ring-[#dfd6a7] ${LEVEL_CLASS_NAMES[day.level]}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer row inside contribution card */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-[11.5px] text-[#3c3b37] dark:text-[#d4cb9e]">
              <div className="tabular-nums min-h-[18px] flex items-center">
                {hovered ? (
                  <span>
                    {hovered.count}{' '}
                    {hovered.count === 1 ? 'contribution' : 'contributions'} on{' '}
                    {hovered.date}
                  </span>
                ) : (
                  <span>
                    {totalContributions ?? 0} contributions in the last year
                  </span>
                )}
              </div>

              <div className="flex items-center gap-[5px] select-none ml-auto">
                <span className="mr-1 text-[#525049] dark:text-[#d4cb9e]">Less</span>
                {([0, 1, 2, 3, 4] as const).map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-[10.5px] h-[10.5px] rounded-[2px] inline-block ${LEVEL_CLASS_NAMES[lvl]}`}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1 text-[#525049] dark:text-[#d4cb9e]">More</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
