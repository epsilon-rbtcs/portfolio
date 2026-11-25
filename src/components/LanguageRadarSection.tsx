import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface GitHubRepo {
  name: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  size: number;
}

interface LanguageStat {
  language: string;
  repos: number;
  percentage: number;
  stars: number;
}

const DEFAULT_USERNAME = 'epsilon-rbtcs';
const MAX_AXES = 6;

const LANG_COLORS: Record<string, { light: string; dark: string }> = {
  Go: { light: '#0f6a70', dark: '#6ec3c9' },
  Dart: { light: '#1e5485', dark: '#7aa2c4' },
  JavaScript: { light: '#8a6006', dark: '#d9b76a' },
  TypeScript: { light: '#155c7a', dark: '#76b5cf' },
  Lua: { light: '#663d87', dark: '#b08fc7' },
  Shell: { light: '#4a6b1d', dark: '#a9bd7e' },
  Python: { light: '#21592b', dark: '#89b88c' },
  Rust: { light: '#96351d', dark: '#cc7d68' },
  C: { light: '#1e5375', dark: '#8cb4cc' },
  'C++': { light: '#912929', dark: '#c77575' },
  HTML: { light: '#8f4c12', dark: '#cc9562' },
  CSS: { light: '#5c3b82', dark: '#a98ec7' },
};

export const LanguageRadarSection: React.FC = () => {
  const [inputHandle, setInputHandle] = useState(DEFAULT_USERNAME);
  const [activeUser, setActiveUser] = useState(DEFAULT_USERNAME);
  const [stats, setStats] = useState<LanguageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const fetchLanguages = useCallback(async (username: string) => {
    const clean = username.trim().replace(/^@/, '');
    if (!clean) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(clean)}/repos?per_page=100&type=owner&sort=updated`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        }
      );

      if (res.status === 404) {
        throw new Error(`github user "${clean}" not found`);
      }
      if (res.status === 403) {
        throw new Error('github api rate limit reached — try again in a few minutes');
      }
      if (!res.ok) {
        throw new Error(`github api error (${res.status})`);
      }

      const repos: GitHubRepo[] = await res.json();
      const owned = repos.filter((r) => !r.fork && r.language);

      if (owned.length === 0) {
        setStats([]);
        setActiveUser(clean);
        return;
      }

      const counts = new Map<string, { repos: number; stars: number }>();
      for (const repo of owned) {
        const lang = repo.language as string;
        const prev = counts.get(lang) ?? { repos: 0, stars: 0 };
        counts.set(lang, {
          repos: prev.repos + 1,
          stars: prev.stars + (repo.stargazers_count || 0),
        });
      }

      const sorted = Array.from(counts.entries())
        .map(([language, info]) => ({
          language,
          repos: info.repos,
          stars: info.stars,
          percentage: (info.repos / owned.length) * 100,
        }))
        .sort((a, b) => b.repos - a.repos || b.stars - a.stars)
        .slice(0, MAX_AXES);

      setStats(sorted);
      setActiveUser(clean);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to load github statistics');
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages(DEFAULT_USERNAME);
  }, [fetchLanguages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLanguages(inputHandle);
  };

  // Radar geometry (SVG viewBox 300x280, centered at 150, 140)
  const radarGeometry = useMemo(() => {
    if (stats.length < 3) return null;

    const cx = 150;
    const cy = 140;
    const maxR = 88;
    const n = stats.length;
    const maxRepos = Math.max(...stats.map((s) => s.repos), 1);

    const getPoint = (index: number, ratio: number) => {
      const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * maxR * ratio,
        y: cy + Math.sin(angle) * maxR * ratio,
      };
    };

    const rings = [0.25, 0.5, 0.75, 1].map((r) =>
      Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, r);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(' ')
    );

    const axes = stats.map((item, i) => {
      const outer = getPoint(i, 1);
      const labelPos = getPoint(i, 1.24);
      // Normalize against max language repo count with a minimum floor so small values stay visible
      const normalized = Math.max(0.18, item.repos / maxRepos);
      const valuePoint = getPoint(i, normalized);
      const langPair = LANG_COLORS[item.language];
      const fallback = isDark ? '#dfd6a7' : '#1a1917';
      return {
        ...item,
        outer,
        labelPos,
        valuePoint,
        color: langPair ? (isDark ? langPair.dark : langPair.light) : fallback,
      };
    });

    const dataPolygon = axes
      .map((a) => `${a.valuePoint.x.toFixed(1)},${a.valuePoint.y.toFixed(1)}`)
      .join(' ');

    return { cx, cy, rings, axes, dataPolygon };
  }, [stats, isDark]);

  return (
    <section
      aria-label="GitHub repository language statistics"
      className="w-full max-w-[840px] mx-auto px-5 sm:px-6 mt-12 sm:mt-16"
    >
      {/* Terminal command header + dynamic GitHub user form */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="text-[13px] sm:text-[13.5px] tracking-tight flex items-center gap-2">
          <span className="text-[#4a6b1d] dark:text-[#b0c970]">$</span>
          <span className="text-[#3c3b37] dark:text-[#b5ae8c]">gh lang-radar --user {activeUser}</span>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label htmlFor="gh-user-input" className="sr-only">
            GitHub username
          </label>
          <input
            id="gh-user-input"
            type="text"
            value={inputHandle}
            onChange={(e) => setInputHandle(e.target.value)}
            placeholder="github handle"
            spellCheck={false}
            className="w-32 sm:w-36 border border-[#d6d4cc] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-2.5 py-1 text-[11.5px] text-[#1a1917] dark:text-[#dfd6a7] placeholder:text-[#8a8880] dark:placeholder:text-[#5e5d56] focus:outline-none focus:border-[#4a4e2f] dark:focus:border-[#676b48] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-[#d6d4cc] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-2.5 py-1 text-[11.5px] text-[#525049] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] hover:border-[#8c897c] dark:hover:border-[#44453d] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>fetch</span>
          </button>
        </form>
      </div>

      {/* Content Card */}
      <div className="border border-[#dedcd4] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] px-5 sm:px-6 py-5 transition-colors duration-200">
        {loading ? (
          <div className="py-12 text-center text-[12.5px] text-[#5c5a52] dark:text-[#8f8d84]">
            fetching repositories for @{inputHandle.trim() || activeUser}...
          </div>
        ) : error ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-[12.5px] text-[#a63a22] dark:text-[#cc7d68]">{error}</p>
            <button
              type="button"
              onClick={() => fetchLanguages(inputHandle)}
              className="border border-[#d6d4cc] dark:border-[#242422] px-3 py-1 text-[11.5px] text-[#1a1917] dark:text-[#dfd6a7] hover:border-[#4a4e2f] dark:hover:border-[#676b48] cursor-pointer"
            >
              retry
            </button>
          </div>
        ) : stats.length === 0 ? (
          <div className="py-10 text-center text-[12.5px] text-[#5c5a52] dark:text-[#8f8d84]">
            no public non-fork repositories with language data found for @{activeUser}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Simple SVG Radar Chart */}
            <div className="md:col-span-6 flex items-center justify-center">
              {radarGeometry ? (
                <svg
                  viewBox="0 0 300 280"
                  className="w-full max-w-[300px] h-auto select-none overflow-visible"
                  role="img"
                  aria-label={`Radar chart of top GitHub languages for ${activeUser}`}
                >
                  {/* Concentric guide polygons */}
                  {radarGeometry.rings.map((points, i) => (
                    <polygon
                      key={i}
                      points={points}
                      fill="none"
                      stroke={isDark ? '#222320' : '#e2e0d7'}
                      strokeWidth="1"
                    />
                  ))}

                  {/* Radial spokes */}
                  {radarGeometry.axes.map((axis) => (
                    <line
                      key={axis.language}
                      x1={radarGeometry.cx}
                      y1={radarGeometry.cy}
                      x2={axis.outer.x}
                      y2={axis.outer.y}
                      stroke={isDark ? '#222320' : '#e2e0d7'}
                      strokeWidth="1"
                    />
                  ))}

                  {/* Data area polygon */}
                  <polygon
                    points={radarGeometry.dataPolygon}
                    fill={isDark ? 'rgba(176, 201, 112, 0.16)' : 'rgba(74, 107, 29, 0.14)'}
                    stroke={isDark ? '#b0c970' : '#4a6b1d'}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {/* Vertex dots & axis labels */}
                  {radarGeometry.axes.map((axis) => {
                    const isHovered = hoveredLang === axis.language;
                    return (
                      <g
                        key={axis.language}
                        onMouseEnter={() => setHoveredLang(axis.language)}
                        onMouseLeave={() => setHoveredLang(null)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={axis.valuePoint.x}
                          cy={axis.valuePoint.y}
                          r={isHovered ? 4.5 : 3}
                          fill={isHovered ? (isDark ? '#dfd6a7' : '#1a1917') : axis.color}
                          stroke={isDark ? '#0b0b0a' : '#ffffff'}
                          strokeWidth="1.2"
                        />
                        <text
                          x={axis.labelPos.x}
                          y={axis.labelPos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={
                            isHovered
                              ? isDark
                                ? '#dfd6a7'
                                : '#1a1917'
                              : isDark
                              ? '#9c9684'
                              : '#525049'
                          }
                          fontSize="10.5"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {axis.language.toLowerCase()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="py-8 text-center text-[12px] text-[#5c5a52] dark:text-[#8f8d84]">
                  at least 3 languages needed for radar geometry — showing breakdown.
                </div>
              )}
            </div>

            {/* Right: Tabular Language Breakdown */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#5c5a52] dark:text-[#7c7970] border-b border-[#ebe9e2] dark:border-[#1d1d1b] pb-2">
                <span>language</span>
                <span className="tabular-nums">repos · share</span>
              </div>

              <div className="space-y-2.5">
                {stats.map((item) => {
                  const langPair = LANG_COLORS[item.language];
                  const color = langPair
                    ? isDark
                      ? langPair.dark
                      : langPair.light
                    : isDark
                    ? '#dfd6a7'
                    : '#1a1917';
                  const isHovered = hoveredLang === item.language;
                  return (
                    <div
                      key={item.language}
                      onMouseEnter={() => setHoveredLang(item.language)}
                      onMouseLeave={() => setHoveredLang(null)}
                      className={`transition-colors ${
                        isHovered
                          ? 'text-[#1a1917] dark:text-[#dfd6a7]'
                          : 'text-[#3c3b37] dark:text-[#b5b2a8]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[12.5px]">
                        <span className="inline-flex items-center gap-2">
                          <span
                            style={{ backgroundColor: color }}
                            className="w-2 h-2 rounded-full shrink-0"
                            aria-hidden="true"
                          />
                          <span>{item.language.toLowerCase()}</span>
                        </span>
                        <span className="tabular-nums text-[12px] text-[#5c5a52] dark:text-[#9c9684]">
                          {item.repos} {item.repos === 1 ? 'repo' : 'repos'} ·{' '}
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-[3px] w-full bg-[#efede6] dark:bg-[#171816] overflow-hidden">
                        <div
                          style={{
                            width: `${Math.max(4, item.percentage)}%`,
                            backgroundColor: color,
                            opacity: isHovered ? 1 : 0.78,
                          }}
                          className="h-full transition-all duration-200"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#ebe9e2] dark:border-[#1d1d1b] flex items-center justify-between text-[11px] text-[#5c5a52] dark:text-[#7c7970] tabular-nums">
                <span>source: api.github.com/users/{activeUser}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
