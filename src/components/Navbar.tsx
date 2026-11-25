import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../App';

export type PageRoute = 'home' | 'projects';

interface NavbarProps {
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoute,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  const navItems: { id: PageRoute; label: string }[] = [
    { id: 'projects', label: 'projects' },
  ];

  return (
    <header className="w-full max-w-[840px] mx-auto px-5 sm:px-6 pt-5 pb-4">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]/60 rounded-sm cursor-pointer"
          aria-label="Go to home"
        >
          <span className="text-[15px] font-bold tracking-tight text-[#1a1917] dark:text-[#dfd6a7] group-hover:text-[#000000] dark:group-hover:text-[#ece4bc] transition-colors">
            ankit bhadra
          </span>
          {/* Minimalist coffee cup icon matching screenshot */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="text-[#b56b16] dark:text-[#d99b43] translate-y-[0.5px]"
          >
            {/* Steam */}
            <path
              d="M5.5 2.5C5.5 1.8 6.1 1.6 6.1 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M8.5 2.5C8.5 1.8 9.1 1.6 9.1 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Cup body */}
            <path
              d="M3 5.5H11V10.5C11 12.1569 9.65685 13.5 8 13.5H6C4.34315 13.5 3 12.1569 3 10.5V5.5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Handle */}
            <path
              d="M11 6.5H12.5C13.3284 6.5 14 7.17157 14 8V8.5C14 9.32843 13.3284 10 12.5 10H11"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            {/* Saucer / base line */}
            <path
              d="M2.5 14.5H11.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav className="flex items-center gap-4 sm:gap-6" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            const isDisabled = item.id === 'projects' && activeRoute === 'home';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                disabled={isDisabled}
                className={`text-[13px] sm:text-[13.5px] whitespace-nowrap shrink-0 transition-colors ${
                  isDisabled ? 'cursor-default' : 'cursor-pointer'
                } focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]/60 rounded-sm ${
                  isActive
                    ? 'text-[#1a1917] dark:text-[#dfd6a7] font-medium dark:font-normal'
                    : `text-[#5c5a52] dark:text-[#8f8d84] ${
                        isDisabled
                          ? ''
                          : 'hover:text-[#1a1917] dark:hover:text-[#dfd6a7]'
                      }`
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-8 h-8 border border-[#d6d4cc] dark:border-[#242422] bg-[#ffffff] dark:bg-[#0b0b0a] text-[#3c3b37] dark:text-[#9c9684] hover:text-[#1a1917] dark:hover:text-[#dfd6a7] hover:border-[#8c897c] dark:hover:border-[#676b48] rounded-[3px] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4a4e2f] dark:focus-visible:ring-[#dfd6a7]"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
