import { useEffect, useState } from 'react';
import { Navbar, PageRoute } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ContributionGraph } from './components/ContributionGraph';
import { LanguageRadarSection } from './components/LanguageRadarSection';
import { ExperienceSection } from './components/ExperienceSection';
import { HackathonSection } from './components/HackathonSection';
import { HireMeSection } from './components/HireMeSection';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { ContactModal } from './components/SubPages';

export type ThemeMode = 'light' | 'dark';

export default function App() {
  const [route, setRoute] = useState<PageRoute>('home');
  const [projectTagFilter, setProjectTagFilter] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('portfolio-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContactOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (nextRoute: PageRoute) => {
    if (nextRoute !== 'projects') {
      setProjectTagFilter(null);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#0a0a0a] text-[#272724] dark:text-[#b8b5ab] flex flex-col transition-colors duration-200">
      <Navbar
        activeRoute={route}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main
        className={
          route === 'projects'
            ? 'flex-1 flex flex-col'
            : route === 'home'
            ? 'flex-1 pb-6'
            : 'flex-1 pb-14 sm:pb-20'
        }
      >
        {route === 'home' && (
          <div className="pt-4 sm:pt-10 md:pt-14">
            <HeroSection
              onOpenContact={() => setContactOpen(true)}
            />
            <div className="mt-6 sm:mt-14 md:mt-16">
              <ContributionGraph />
            </div>
            <LanguageRadarSection />
            <ExperienceSection />
            <HackathonSection />
            <HireMeSection />
          </div>
        )}

        {route === 'projects' && (
          <ProjectsShowcase
            initialTagFilter={projectTagFilter}
            onClearTagFilter={() => setProjectTagFilter(null)}
          />
        )}
      </main>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
