import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export type ActiveTab = 'feed' | 'analyzer' | 'moderation' | 'report' | 'github';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenQuickReport: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'feed', label: 'News Feed' },
  { id: 'analyzer', label: 'Analyzer' },
  { id: 'moderation', label: 'Moderation' },
  { id: 'report', label: 'Project Report' },
  { id: 'github', label: 'GitHub Code' },
];

export function Navbar({ activeTab, onSelectTab, onOpenQuickReport }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F17]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('feed')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded"
        >
          <svg
            viewBox="0 0 28 28"
            className="h-6 w-6 text-amber-400 shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12.5" cy="12.5" r="8.5" stroke="currentColor" strokeWidth="1.75" />
            <path d="M19 19L25 25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M9 12.5H16M12.5 9V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-editorial text-xl font-semibold tracking-tight text-[#F3F6FA]">
            TruthLens
          </span>
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                  isActive ? 'text-amber-300' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-amber-400"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenQuickReport}
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-amber-400 px-3.5 py-2 text-xs font-semibold tracking-wide text-slate-950 whitespace-nowrap shrink-0 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Report Claim
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center rounded-md border border-white/10 p-2 text-slate-300 hover:bg-white/5 hover:text-white"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0F1520] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="font-mono text-xs text-amber-400">Active</span>}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenQuickReport();
              }}
              className="mt-3 w-full rounded-md bg-amber-400 px-3.5 py-2.5 text-center text-xs font-semibold tracking-wide text-slate-950 transition hover:bg-amber-300"
            >
              Report Claim
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
