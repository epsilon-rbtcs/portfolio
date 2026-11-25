export interface TechTag {
  label: string;
  colorClasses: string;
}

export const TECH_TAGS: TechTag[] = [
  { label: 'python', colorClasses: 'text-[#21592b] dark:text-[#89b88c] border-[#b6d3bb] dark:border-[#243726] bg-[#eef6ef] dark:bg-[#0f1611]' },
  { label: 'c++', colorClasses: 'text-[#1e4d78] dark:text-[#7aa2c4] border-[#b6cbe0] dark:border-[#23323e] bg-[#edf3f9] dark:bg-[#0f1418]' },
  { label: 'javascript', colorClasses: 'text-[#7a5407] dark:text-[#d9b76a] border-[#dfd0a8] dark:border-[#3b3320] bg-[#fbf6e9] dark:bg-[#16140e]' },
  { label: 'typescript', colorClasses: 'text-[#155975] dark:text-[#76b5cf] border-[#b2d3e0] dark:border-[#223640] bg-[#edf6fa] dark:bg-[#0f161a]' },
  { label: 'react', colorClasses: 'text-[#0f5e63] dark:text-[#6ec3c9] border-[#aed6d9] dark:border-[#22383b] bg-[#ecf7f8] dark:bg-[#0f1617]' },
  { label: 'fastapi', colorClasses: 'text-[#176131] dark:text-[#78c28c] border-[#b1d9be] dark:border-[#22362a] bg-[#ecf7ef] dark:bg-[#0f1612]' },
  { label: 'pytorch', colorClasses: 'text-[#8c321d] dark:text-[#cc7d68] border-[#e2bdb4] dark:border-[#3b2520] bg-[#fbf0ed] dark:bg-[#16100e]' },
  { label: 'scikit-learn', colorClasses: 'text-[#874913] dark:text-[#cc9562] border-[#e2c9b1] dark:border-[#3a2c1e] bg-[#fbf3ec] dark:bg-[#16120e]' },
  { label: 'numpy', colorClasses: 'text-[#245370] dark:text-[#8cb4cc] border-[#b7cede] dark:border-[#26353d] bg-[#eef4f8] dark:bg-[#101518]' },
  { label: 'pandas', colorClasses: 'text-[#5b3378] dark:text-[#b08fc7] border-[#d2c1e0] dark:border-[#34283d] bg-[#f5effa] dark:bg-[#130f17]' },
  { label: 'html', colorClasses: 'text-[#7d4f16] dark:text-[#c7a06d] border-[#dfd0b8] dark:border-[#382d20] bg-[#faf4eb] dark:bg-[#15120e]' },
  { label: 'css', colorClasses: 'text-[#533575] dark:text-[#a98ec7] border-[#cec0de] dark:border-[#31283d] bg-[#f4effa] dark:bg-[#130f17]' },
  { label: 'git', colorClasses: 'text-[#8a2626] dark:text-[#c77575] border-[#e0b8b8] dark:border-[#3a2222] bg-[#fbefef] dark:bg-[#160f0f]' },
  { label: 'docker', colorClasses: 'text-[#1a5669] dark:text-[#75a9b8] border-[#b4cfd7] dark:border-[#223338] bg-[#edf5f7] dark:bg-[#0f1517]' },
  { label: 'linux', colorClasses: 'text-[#175e5a] dark:text-[#7ab5b2] border-[#b1d6d4] dark:border-[#223534] bg-[#ecf7f6] dark:bg-[#0f1615]' },
  { label: 'postgresql', colorClasses: 'text-[#1e5c35] dark:text-[#8ab896] border-[#b5d6c0] dark:border-[#243628] bg-[#edf6f0] dark:bg-[#0f1511]' },
];

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const MONTHS: { label: string; colIndex: number }[] = [
  { label: 'Jan', colIndex: 1 },
  { label: 'Feb', colIndex: 5 },
  { label: 'Mar', colIndex: 10 },
  { label: 'Apr', colIndex: 14 },
  { label: 'May', colIndex: 19 },
  { label: 'Jun', colIndex: 24 },
  { label: 'Jul', colIndex: 28 },
  { label: 'Aug', colIndex: 33 },
  { label: 'Sep', colIndex: 38 },
  { label: 'Oct', colIndex: 43 },
  { label: 'Nov', colIndex: 47 },
];

export const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '#1a1c19',
  1: '#2a4335',
  2: '#3c634a',
  3: '#6c9665',
  4: '#b0c970',
};

// Deterministic pseudo-random generator for reproducible heatmap matching the screenshot
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateContributions(): (ContributionDay | null)[][] {
  const rand = seededRandom(137209);
  const startDate = new Date(2025, 11, 28); // Sunday near end of Dec so Jan aligns on col 1
  const weeks: (ContributionDay | null)[][] = [];

  // Visual structure matching the reference screenshot:
  // Col 0 starts with rows 3..6 (partial first week on bottom left: row 4..6 visible in screenshot!)
  // Actually look closely at screenshot col 0:
  // Col 0 has squares at rows 4, 5, 6? Wait: let's inspect the screenshot edges:
  // Top row (row 0): starts at col 1! Col 0 has empty gap on rows 0..3, and squares on rows 4, 5, 6!
  // Wait: let's check col 52 (rightmost column): rows 0, 1, 2, 3 have squares, rows 4, 5, 6 are empty!
  // Let's count columns in screenshot: 53 columns total (0 to 52).
  // Col 0: rows 4, 5, 6 active (3 days); rows 0..3 null.
  // Col 52: rows 0, 1, 2, 3 active (4 days); rows 4..6 null.
  // Total days = 3 + 51*7 + 4 = 364 days (~1 year)!

  const rawCounts: number[][] = [];
  let currentTotal = 0;

  for (let w = 0; w < 53; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < 4) || (w === 52 && d > 3)) {
        col.push(-1); // empty slot outside year window
        continue;
      }

      const r = rand();
      let count = 0;

      // Highlight spots visible in the screenshot:
      if (w === 8 && d === 0) {
        count = 14; // bright Feb/Mar top cell
      } else if (w === 49 && d === 1) {
        count = 18; // bright Nov row-1 cell
      } else if (w === 49 && d === 5) {
        count = 13; // bright Nov lower cell
      } else if (w === 50 && d === 6) {
        count = 14; // bright Nov bottom-right cell
      } else if (w >= 45 && d >= 1 && d <= 4 && r > 0.35) {
        count = Math.floor(rand() * 7) + 3;
      } else if (r < 0.23) {
        count = 0;
      } else if (r < 0.56) {
        count = Math.floor(rand() * 3) + 1;
      } else if (r < 0.88) {
        count = Math.floor(rand() * 4) + 4;
      } else {
        count = Math.floor(rand() * 4) + 8;
      }

      col.push(count);
      currentTotal += count;
    }
    rawCounts.push(col);
  }

  // Adjust counts deterministically so the sum is strictly 1372
  const TARGET_TOTAL = 1372;
  let diff = TARGET_TOTAL - currentTotal;

  for (let pass = 0; pass < 10 && diff !== 0; pass++) {
    for (let w = 1; w < 52 && diff !== 0; w++) {
      for (let d = 0; d < 7 && diff !== 0; d++) {
        // Skip our anchor bright spots
        if ((w === 8 && d === 0) || (w === 49 && d === 1) || (w === 50 && d === 6)) continue;
        if (diff > 0 && rawCounts[w][d] < 8) {
          rawCounts[w][d] += 1;
          diff -= 1;
        } else if (diff < 0 && rawCounts[w][d] > 1) {
          rawCounts[w][d] -= 1;
          diff += 1;
        }
      }
    }
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let w = 0; w < 53; w++) {
    const col: (ContributionDay | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const count = rawCounts[w][d];
      if (count < 0) {
        col.push(null);
        continue;
      }
      const dateObj = new Date(startDate);
      dateObj.setDate(startDate.getDate() + w * 7 + d);
      const dateStr = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 3) level = 1;
      else if (count <= 6) level = 2;
      else if (count <= 10) level = 3;
      else level = 4;

      col.push({ date: dateStr, count, level });
    }
    weeks.push(col);
  }

  return weeks;
}

export const CONTRIBUTIONS_DATA = generateContributions();

export type ProjectCategory = 'apps' | 'tui';

export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  category: ProjectCategory;
  tags: string[];
  stack: string[];
  bullets: string[];
  repoUrl: string;
  visualType:
    | 'symphony'
    | 'toofan'
    | 'ooly'
    | 'termpulse'
    | 'kalam'
    | 'kestrel'
    | 'drift'
    | 'rpeek'
    | 'pulseq'
    | 'bruno-nvim'
    | 'pocketping'
    | 'lazycron'
    | 'gitpulse'
    | 'vaultsync'
    | 'nettrace';
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'symphony',
    name: 'Symphony',
    subtitle: 'ambient focus music player for minimalists',
    category: 'apps',
    tags: ['dart', 'flutter', 'riverpod'],
    stack: ['dart', 'flutter', 'riverpod', 'just_audio', 'sqlite'],
    bullets: [
      'gapless ambient soundscape mixing with per-stem volume curves',
      'pomodoro interval chimes built directly into the audio engine',
      'offline cache manager for lossless field recordings',
      'zero-distraction dark canvas UI with subtle vinyl grain shaders',
    ],
    repoUrl: 'https://github.com',
    visualType: 'symphony',
  },
  {
    id: 'toofan',
    name: 'Toofan',
    subtitle: 'fast terminal-inspired typing practice in the browser',
    category: 'tui',
    tags: ['javascript', 'vercel', 'linux'],
    stack: ['javascript', 'canvas', 'web audio', 'vercel'],
    bullets: [
      'sub-frame keystroke latency measurement with live wpm & burst telemetry',
      'customizable 15s / 30s / 60s timed sprints with clean monospace focus',
      'mechanical switch acoustic synthesizer via web audio api',
      'zero-clutter keyboard heatmap highlighting weak bigrams',
    ],
    repoUrl: 'https://github.com',
    visualType: 'toofan',
  },
  {
    id: 'ooly-journal',
    name: 'Ooly journal',
    subtitle: 'track what you learned, not just what you read',
    category: 'apps',
    tags: ['dart', 'flutter', 'riverpod', 'firebase'],
    stack: ['dart', 'flutter', 'riverpod', 'gemini ai', 'cloud tts'],
    bullets: [
      'google gemini ai integration to generate smart session summaries',
      'native cloud tts for natural, human-like audio playback of summaries',
      'github-style activity streak calendar to motivate weekly reading consistency',
      'local persistence with hive and a minimal layout',
    ],
    repoUrl: 'https://github.com',
    visualType: 'ooly',
  },
  {
    id: 'termpulse',
    name: 'TermPulse',
    subtitle: 'live container & systemd log multiplexer for ssh sessions',
    category: 'tui',
    tags: ['go', 'docker', 'linux', 'bash'],
    stack: ['go', 'bubbletea', 'docker sdk', 'journald'],
    bullets: [
      'streams multi-host systemd and docker logs in a single split pane',
      'instant regex filtering and severity highlighting at 60fps',
      'low-memory ring buffer keeping 100k recent lines searchable offline',
      'vim-style navigation and one-key export to markdown incident notes',
    ],
    repoUrl: 'https://github.com',
    visualType: 'termpulse',
  },
  {
    id: 'kalam',
    name: 'KaLam',
    subtitle: 'monochrome distraction-free mobile writing studio',
    category: 'apps',
    tags: ['dart', 'flutter', 'riverpod', 'obsidian'],
    stack: ['dart', 'flutter', 'riverpod', 'markdown', 'sqflite'],
    bullets: [
      'pure e-ink inspired monochrome theme tuned for oled night writing',
      'bi-directional wiki-links and instant backlink drawer',
      'versioned local snapshots with diff viewer for every draft',
      'one-tap export to obsidian vaults, pdf, and clean html',
    ],
    repoUrl: 'https://github.com',
    visualType: 'kalam',
  },
  {
    id: 'kestrel',
    name: 'Kestrel',
    subtitle: 'zero-dependency http & grpc load runner with tui histograms',
    category: 'tui',
    tags: ['go', 'linux', 'docker'],
    stack: ['go', 'grpc', 'bubbletea', 'hdrhistogram'],
    bullets: [
      'sustains 140k req/s on a single node with bounded goroutine pools',
      'real-time p50 / p95 / p99 latency histograms inside your terminal',
      'reads bruno and har collections directly without manual conversion',
      'exports prometheus metrics and json ci regression reports',
    ],
    repoUrl: 'https://github.com',
    visualType: 'kestrel',
  },
  {
    id: 'drift',
    name: 'Drift notes',
    subtitle: 'offline-first markdown capture synced to obsidian',
    category: 'apps',
    tags: ['dart', 'flutter', 'riverpod', 'obsidian'],
    stack: ['dart', 'flutter', 'riverpod', 'sqlite', 'tailscale'],
    bullets: [
      'instant cold-start capture sheet opening directly into your daily note',
      'conflict-free lamport timestamp sync over tailscale or s3',
      'hardware-accelerated 60fps local tag & backlink graph',
      'biometric vault lock with local aes-256 note encryption',
    ],
    repoUrl: 'https://github.com',
    visualType: 'drift',
  },
  {
    id: 'rpeek',
    name: 'rpeek',
    subtitle: 'interactive terminal inspector for redis streams & ttl keys',
    category: 'tui',
    tags: ['go', 'redis', 'neovim', 'bash'],
    stack: ['go', 'redis', 'tcell', 'resp3'],
    bullets: [
      'non-blocking scan cursor pagination safe for production redis clusters',
      'live stream consumer-group lag monitor with ack/claim actions',
      'interactive slowlog flamegraph and memory-usage key breakdown',
      'vim modal keybindings with inline json pretty-printing',
    ],
    repoUrl: 'https://github.com',
    visualType: 'rpeek',
  },
  {
    id: 'pulseq',
    name: 'PulseQ',
    subtitle: 'idempotent webhook fan-out broker in go and redis',
    category: 'tui',
    tags: ['go', 'redis', 'docker', 'git'],
    stack: ['go', 'redis streams', 'docker', 'hmac-sha256'],
    bullets: [
      'guaranteed at-least-once delivery with exponential jitter backoff',
      'per-tenant circuit breakers preventing noisy-neighbor queue stalls',
      'cli dead-letter replay tool with payload diffing',
      'single 14mb static binary deployable anywhere via docker',
    ],
    repoUrl: 'https://github.com',
    visualType: 'pulseq',
  },
  {
    id: 'bruno-nvim',
    name: 'bruno.nvim',
    subtitle: 'run .bru api collections inside neovim floating splits',
    category: 'tui',
    tags: ['lua', 'neovim', 'bruno'],
    stack: ['lua', 'neovim', 'bruno cli', 'treesitter'],
    bullets: [
      'executes the request under your cursor with a single leader keymap',
      'renders formatted json responses, headers, and timing in a scratch split',
      'environment switcher for dev, staging, and local docker ports',
      'zero external node runtime overhead outside bruno cli',
    ],
    repoUrl: 'https://github.com',
    visualType: 'bruno-nvim',
  },
  {
    id: 'pocketping',
    name: 'PocketPing',
    subtitle: 'minimalist uptime & ssl expiry monitor with push alerts',
    category: 'apps',
    tags: ['flutter', 'firebase', 'javascript', 'vercel'],
    stack: ['flutter', 'firebase', 'vercel edge', 'fcm'],
    bullets: [
      'multi-region edge probes verifying tls handshake and response assertions',
      'instant silent-bypass push notifications via firebase cloud messaging',
      'clean 24-hour latency sparklines without bloated enterprise dashboards',
      'one-click curl reproducer copied straight from incident cards',
    ],
    repoUrl: 'https://github.com',
    visualType: 'pocketping',
  },
  {
    id: 'lazycron',
    name: 'lazycron',
    subtitle: 'human-readable crontab editor & next-run simulator',
    category: 'tui',
    tags: ['go', 'bash', 'linux'],
    stack: ['go', 'bubbletea', 'systemd timers'],
    bullets: [
      'live natural-language parser showing the next 10 scheduled timestamps',
      'validates user environment paths and dry-runs scripts in a sandbox',
      'converts standard crontabs into systemd .timer units cleanly',
      'automatic git-backed history before writing any crontab edit',
    ],
    repoUrl: 'https://github.com',
    visualType: 'lazycron',
  },
  {
    id: 'gitpulse',
    name: 'gitpulse',
    subtitle: 'terminal commit velocity & contributor heatmap analyzer',
    category: 'tui',
    tags: ['go', 'git', 'linux', 'bash'],
    stack: ['go', 'libgit2', 'lipgloss'],
    bullets: [
      'renders local repository activity calendars directly in truecolor ansi',
      'surfaces code-churn hotspots and bus-factor warnings per directory',
      'zero network calls—analyzes bare and worktree repos locally in milliseconds',
      'exports clean svg summary cards for readme profiles',
    ],
    repoUrl: 'https://github.com',
    visualType: 'gitpulse',
  },
  {
    id: 'vaultsync',
    name: 'VaultSync',
    subtitle: 'encrypted dotfiles & ssh key sync daemon for linux',
    category: 'tui',
    tags: ['go', 'linux', 'git', 'bash'],
    stack: ['go', 'age encryption', 'git', 'inotify'],
    bullets: [
      'watches ~/.config with inotify and commits encrypted diffs automatically',
      'uses age public-key encryption so secrets stay safe in private git repos',
      'bootstrap fresh arch or ubuntu machines with a single curl-free binary',
      'interactive conflict resolver inside the terminal',
    ],
    repoUrl: 'https://github.com',
    visualType: 'vaultsync',
  },
  {
    id: 'nettrace',
    name: 'NetTrace',
    subtitle: 'mobile dns lookup, traceroute & tls certificate inspector',
    category: 'apps',
    tags: ['dart', 'flutter', 'android studio'],
    stack: ['dart', 'flutter', 'doh', 'raw sockets'],
    bullets: [
      'queries dns-over-https across cloudflare, quad9, and google resolvers',
      'visualizes full x.509 certificate chains and san entries offline',
      'runs tcp port reachability checks and hop-by-hop latency probes',
      'clean monospace output copyable as plain text or json',
    ],
    repoUrl: 'https://github.com',
    visualType: 'nettrace',
  },
];

export interface BlogPost {
  id: string;
  date: string;
  title: string;
  readTime: string;
  summary: string;
  content: string[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'go-worker-pools',
    date: '2026-11-04',
    title: 'bounding goroutines without choking backpressure',
    readTime: '6 min',
    summary:
      'Notes from rewriting an unbounded job dispatcher in Go using semaphore channels, context deadlines, and ring-buffer metrics.',
    tags: ['go', 'redis'],
    content: [
      'Unbounded goroutine spawning looks harmless in benchmarks until a downstream database stalls for 400ms and memory spikes 8x.',
      'By pairing a fixed-size semaphore with explicit queue rejection at the edge, tail latency stays predictable under burst load while keeping CPU cache lines warm.',
      'In production we cut p99 worker allocation overhead by 62% simply by pooling byte buffers per worker rather than per message.',
    ],
  },
  {
    id: 'flutter-riverpod-offline',
    date: '2026-09-19',
    title: 'offline-first state sync in flutter with riverpod',
    readTime: '8 min',
    summary:
      'Structuring optimistic mutations, conflict queues, and deterministic local snapshots in Dart without fighting widget rebuilds.',
    tags: ['dart', 'flutter', 'riverpod'],
    content: [
      'Most mobile sync bugs happen when UI state and persistence state drift apart during flaky cellular handoffs.',
      'Treating the local SQLite log as the single source of truth and projecting Riverpod AsyncNotifiers strictly from reactive streams eliminates race conditions.',
      'Each offline edit carries a monotonic Lamport timestamp so merges with Obsidian markdown files remain deterministic.',
    ],
  },
  {
    id: 'neovim-lua-workflow',
    date: '2026-07-28',
    title: 'leaving heavy ides for a 400-line lua config',
    readTime: '5 min',
    summary:
      'Why fast startup time, headless terminal splits, and Bruno CLI collections replaced half of my GUI tooling.',
    tags: ['lua', 'neovim', 'linux', 'bruno'],
    content: [
      'Every millisecond between thinking of a search query and seeing matches breaks flow.',
      'Keeping Neovim lean—LSP, treesitter, telescope, and a tiny Lua wrapper around Bruno CLI—means editing Go services and Flutter widgets shares the exact same muscle memory.',
    ],
  },
];

export interface GearSection {
  category: string;
  items: { name: string; detail: string }[];
}

export const GEARS_LIST: GearSection[] = [
  {
    category: 'workstation',
    items: [
      { name: 'thinkpad t14 gen 4 (amd)', detail: 'arch linux + hyprland, 32gb ram' },
      { name: 'keychron q1 pro', detail: 'gateron oil king switches, blank pbt caps' },
      { name: 'dell u2723qe 27" 4k', detail: 'single crisp display, zero clutter' },
    ],
  },
  {
    category: 'editor & terminal',
    items: [
      { name: 'neovim 0.10', detail: 'custom lua config, treesitter, gopls, dartls' },
      { name: 'ghostty + tmux', detail: 'jetbrains mono 13px, custom dark palette' },
      { name: 'zsh + starship', detail: 'minimal prompt with git & go version hooks' },
    ],
  },
  {
    category: 'daily tools',
    items: [
      { name: 'bruno', detail: 'git-friendly local api collections' },
      { name: 'obsidian', detail: 'architecture rfcs, postmortems, daily scratchpad' },
      { name: 'docker + orbstack/podman', detail: 'local redis, postgres, and integration harnesses' },
    ],
  },
];
