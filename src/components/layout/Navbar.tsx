'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  Sparkles, Image, Video, Music, Box, Wand2, Package, 
  CreditCard, Code2, Bookmark, Building2, ChevronDown, 
  Menu, X, Globe, LogIn, User, BookOpen
} from 'lucide-react';
import { MAIN_NAV, NavItem } from '@/config/navigation';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Wand2: <Wand2 className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Bookmark: <Bookmark className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  Paintbrush: <Wand2 className="w-4 h-4" />,
  Layers: <Box className="w-4 h-4" />,
  FileText: <Code2 className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  GitFork: <Code2 className="w-4 h-4" />,
  Library: <Bookmark className="w-4 h-4" />,
  LifeBuoy: <Bookmark className="w-4 h-4" />,
  Newspaper: <Bookmark className="w-4 h-4" />,
  Users: <Building2 className="w-4 h-4" />,
  Info: <Building2 className="w-4 h-4" />,
  Shield: <Building2 className="w-4 h-4" />,
  Handshake: <Building2 className="w-4 h-4" />,
  Brain: <Sparkles className="w-4 h-4" />,
  Banana: <Sparkles className="w-4 h-4" />,
};

function NavItemComponent({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname();
  const locale = useLocale();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href && pathname.includes(item.href);

  const content = (
    <>
      {item.icon && iconMap[item.icon]}
      <span>{item.title}</span>
      {item.badge && (
        <span className="absolute -top-2 -right-3 inline-flex items-center overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-500 pointer-events-none">
          <span className="relative z-10">{item.badge}</span>
          {item.badge.includes('OFF') && (
            <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-nav-badge-shine" />
          )}
        </span>
      )}
      {hasChildren && <ChevronDown className="w-3 h-3 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />}
    </>
  );

  if (hasChildren) {
    return (
      <div className="relative group">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 bg-transparent hover:bg-accent focus:bg-accent data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 w-max"
          data-state={hasChildren ? 'open' : 'closed'}
        >
          {content}
        </button>
        {hasChildren && (
          <div className="absolute top-full left-0 pt-2">
            <div className="hidden group-hover:block">
              <div className="relative rounded-xl border border-border/40 bg-[linear-gradient(180deg,rgba(44,29,24,0.98),rgba(28,19,16,0.98))] shadow-xl backdrop-blur-xl min-w-[200px] p-2">
                <div className="absolute -top-2 left-4 h-3 w-3 translate-y-1/2 rotate-45 border-l border-t border-border/40 bg-background" />
                {item.children!.map((child, idx) => (
                  <NavItemComponent key={idx} item={child} level={level + 1} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (item.href) {
    return (
      <Link
        href={`/${locale}${item.href}`}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 bg-transparent hover:bg-accent focus:bg-accent data-[active]:bg-accent/50 relative ${isActive ? 'text-accent-foreground' : 'text-muted-foreground'}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 bg-transparent hover:bg-accent focus:bg-accent w-full text-left">
      {content}
    </button>
  );
}

function LanguageSelector() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const labels: Record<string, string> = { zh: '简体中文', en: 'English' };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-x-2 border-none text-muted-foreground outline-none hover:bg-transparent focus:ring-0 focus:ring-offset-0"
        aria-label={`Language: ${labels[locale]}`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:block">{labels[locale]}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[140px] rounded-lg border border-border/40 bg-background shadow-xl p-1 z-50">
          {['zh', 'en'].map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className={`block px-3 py-2 text-sm rounded-md hover:bg-accent ${locale === l ? 'bg-accent' : ''}`}
              onClick={() => setOpen(false)}
            >
              {labels[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Get top-level nav items (first level of MAIN_NAV)
  const topNavItems = MAIN_NAV;

  return (
    <section className="py-3" data-critical-header="true">
      <div className="md:max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/zh" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-xl text-primary font-bold">MY AI</span>
            </Link>
            <div className="flex items-center">
              <nav aria-label="Main">
                <ul className="group flex flex-1 list-none items-center justify-center space-x-1">
                  {/* Direct links visible in desktop nav */}
                  {topNavItems.slice(0, 5).map((item, idx) => (
                    <li key={idx}>
                      <NavItemComponent item={item} />
                    </li>
                  ))}
                  {/* AI Tools dropdown for remaining items */}
                  <li>
                    <div className="relative group">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:text-accent-foreground h-10 px-4 py-2 bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent text-muted-foreground">
                        <span>AI 工具</span>
                        <ChevronDown className="w-3 h-3 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                      <div className="absolute top-full flex justify-center right-0 left-auto">
                        <div className="hidden group-hover:block pt-2">
                          <div className="relative rounded-xl border border-border/40 bg-[linear-gradient(180deg,rgba(44,29,24,0.98),rgba(28,19,16,0.98))] shadow-xl backdrop-blur-xl min-w-[200px] p-2">
                            <div className="absolute -top-2 right-4 h-3 w-3 translate-y-1/2 rotate-45 border-l border-t border-border/40 bg-background" />
                            <div className="space-y-1">
                              {topNavItems.slice(5).map((item, idx) => (
                                <NavItemComponent key={idx} item={item} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="shrink-0 flex gap-2 items-center">
            <div className="w-[140px]">
              <LanguageSelector />
            </div>
            <div className="flex items-center gap-x-2 px-2">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden md:block">登录</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/zh" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-xl font-bold">MY AI</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
              aria-haspopup="dialog"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-border/40 pt-4">
              <nav className="space-y-2">
                {topNavItems.map((item, idx) => (
                  <div key={idx} className="py-1">
                    <NavItemComponent item={item} />
                  </div>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-4">
                <div className="flex-1">
                  <LanguageSelector />
                </div>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  <LogIn className="w-4 h-4" />
                  <span>登录</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}