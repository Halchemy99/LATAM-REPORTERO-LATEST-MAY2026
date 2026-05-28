'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import GlobalSearchBar from '@/components/GlobalSearchBar';
import {
  Menu,
  User,
  LogOut,
  Bookmark,
  ChevronDown,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const REGIONS = {
  'South America': [
    { name: 'Argentina', slug: 'argentina' },
    { name: 'Bolivia', slug: 'bolivia' },
    { name: 'Brazil', slug: 'brazil' },
    { name: 'Chile', slug: 'chile' },
    { name: 'Colombia', slug: 'colombia' },
    { name: 'Ecuador', slug: 'ecuador' },
    { name: 'Paraguay', slug: 'paraguay' },
    { name: 'Peru', slug: 'peru' },
    { name: 'Uruguay', slug: 'uruguay' },
    { name: 'Venezuela', slug: 'venezuela' },
  ],
  'Central America': [
    { name: 'Costa Rica', slug: 'costa-rica' },
    { name: 'El Salvador', slug: 'el-salvador' },
    { name: 'Guatemala', slug: 'guatemala' },
    { name: 'Honduras', slug: 'honduras' },
    { name: 'Nicaragua', slug: 'nicaragua' },
    { name: 'Panama', slug: 'panama' },
  ],
  'Mexico & Caribbean': [
    { name: 'Mexico', slug: 'mexico' },
    { name: 'Cuba', slug: 'cuba' },
    { name: 'Dominican Republic', slug: 'dominican-republic' },
    { name: 'Haiti', slug: 'haiti' },
    { name: 'Puerto Rico', slug: 'puerto-rico' },
  ],
};

const NAV_ITEMS = [
  { href: '/', label: 'Briefs' },
  { href: '/investigations', label: 'Deep Dives' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
];

export default function Header({ showSearch = true }) {
  const { locale } = useTranslation();
  const { user, role, logout } = useUserRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { token } = useUserRole();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#F9F6F6]/95 backdrop-blur-md border-b border-[#1a1a1a]/10"
      data-testid="header"
    >
      <div className="container">
        <div className="flex h-14 lg:h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" data-testid="logo-link">
            <img
              src="/brand/logo-purple.png"
              alt="LATAM Reportero"
              className="h-9 w-auto"
            />
          </Link>

          {/* Primary Nav */}
          <nav
            className="hidden lg:flex items-center gap-1 flex-1"
            data-testid="primary-nav"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.1em] text-[#1a1a1a] hover:text-[#6111ff] transition-colors px-3 py-2"
                  data-testid="nav-regions"
                >
                  <MapPin className="h-3 w-3" />
                  Regions
                  <ChevronDown className="h-2.5 w-2.5 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[420px] p-4 rounded-none border-[#1a1a1a]/10"
                align="start"
              >
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(REGIONS).map(([region, countries]) => (
                    <div key={region}>
                      <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-wider text-[#666666] mb-1.5 px-0">
                        {region}
                      </DropdownMenuLabel>
                      {countries.map((country) => (
                        <DropdownMenuItem key={country.slug} asChild>
                          <Link
                            href={`/region/${country.slug}`}
                            className="text-xs text-[#1a1a1a] hover:text-[#6111ff] cursor-pointer py-1"
                          >
                            {country.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.1em] text-[#1a1a1a] hover:text-[#6111ff] transition-colors px-3 py-2"
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <LanguageSelector />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1 text-xs text-[#1a1a1a] hover:text-[#6111ff] px-2 py-2"
                    data-testid="user-menu-btn"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline text-xs max-w-[80px] truncate">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-2.5 w-2.5 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-none border-[#1a1a1a]/10"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {user.name || user.email}
                    </p>
                    <p className="text-[10px] text-[#666666] font-mono uppercase tracking-wider">
                      {role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks" className="cursor-pointer text-xs">
                      <Bookmark className="mr-2 h-3.5 w-3.5" />
                      Saved Stories
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-[#6111ff] text-xs"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/auth/login">
                  <button
                    className="text-xs font-medium uppercase tracking-[0.1em] text-[#1a1a1a] hover:text-[#6111ff] transition-colors px-3 py-2"
                    data-testid="login-btn"
                  >
                    Log In
                  </button>
                </Link>
                <Link href="/newsletter">
                  <Button
                    size="sm"
                    className="bg-[#1a1a1a] hover:bg-[#6111ff] text-white rounded-none h-8 px-4 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors"
                    data-testid="newsletter-btn"
                  >
                    Free Newsletter →
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <button
                  className="p-2 text-[#1a1a1a] hover:text-[#6111ff] transition-colors"
                  aria-label="Menu"
                  data-testid="mobile-menu-btn"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] bg-[#F9F6F6] p-0"
              >
                <div className="p-4 border-b border-[#1a1a1a]/10">
                  <img
                    src="/brand/logo-purple.png"
                    alt="LATAM Reportero"
                    className="h-7 w-auto"
                  />
                </div>
                <nav className="p-4 space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#666666] mb-2 px-2">
                    Sections
                  </p>
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-2 py-2 text-sm text-[#1a1a1a] hover:bg-[#6111ff]/5 hover:text-[#6111ff]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {!user && (
                  <div className="p-4 border-t border-[#1a1a1a]/10 space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-none border-[#1a1a1a]/20 text-sm"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link
                      href="/newsletter"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full rounded-none bg-[#1a1a1a] hover:bg-[#6111ff] text-sm transition-colors">
                        Free Newsletter →
                      </Button>
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* AI Search bar — shown on all pages except homepage */}
      {showSearch && <GlobalSearchBar locale={locale} />}
    </header>
  );
}
