'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation, useUserRole } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import ContentModeToggle from '@/components/ContentModeToggle';
import CryptoDonationButton from '@/components/CryptoDonationButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, User, LogOut, LayoutDashboard, Bookmark, Settings, 
  ChevronDown, MapPin, FileText, TrendingUp, Sparkles, Radio,
  Lock
} from 'lucide-react';

// Full LATAM regions
const REGIONS = {
  'South America': [
    { name: 'Argentina', slug: 'argentina' },
    { name: 'Bolivia', slug: 'bolivia' },
    { name: 'Brazil', slug: 'brazil' },
    { name: 'Chile', slug: 'chile' },
    { name: 'Colombia', slug: 'colombia' },
    { name: 'Ecuador', slug: 'ecuador' },
    { name: 'Guyana', slug: 'guyana' },
    { name: 'Paraguay', slug: 'paraguay' },
    { name: 'Peru', slug: 'peru' },
    { name: 'Suriname', slug: 'suriname' },
    { name: 'Uruguay', slug: 'uruguay' },
    { name: 'Venezuela', slug: 'venezuela' },
  ],
  'Central America': [
    { name: 'Belize', slug: 'belize' },
    { name: 'Costa Rica', slug: 'costa-rica' },
    { name: 'El Salvador', slug: 'el-salvador' },
    { name: 'Guatemala', slug: 'guatemala' },
    { name: 'Honduras', slug: 'honduras' },
    { name: 'Nicaragua', slug: 'nicaragua' },
    { name: 'Panama', slug: 'panama' },
  ],
  'Mexico': [
    { name: 'Mexico', slug: 'mexico' },
  ],
  'Caribbean': [
    { name: 'Cuba', slug: 'cuba' },
    { name: 'Dominican Republic', slug: 'dominican-republic' },
    { name: 'Haiti', slug: 'haiti' },
    { name: 'Jamaica', slug: 'jamaica' },
    { name: 'Puerto Rico', slug: 'puerto-rico' },
    { name: 'Trinidad & Tobago', slug: 'trinidad-tobago' },
  ],
};

// Topic categories
const TOPICS = [
  { name: 'Investigations', slug: 'investigations', icon: FileText },
  { name: 'Analysis', slug: 'analysis', icon: TrendingUp },
  { name: 'Good News', slug: 'good-news', icon: Sparkles },
  { name: 'On the Ground', slug: 'on-the-ground', icon: Radio },
];

export default function Header() {
  const { t, locale } = useTranslation();
  const { user, role, logout, isSubscribed } = useUserRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F5F2] border-b border-[#23103A]/10" data-testid="header">
      <div className="container">
        <div className="flex h-12 items-center justify-between">
          {/* Left: Logo + Main Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center group" data-testid="logo-link">
              <Image
                src="/logo.png"
                alt="LATAM Reportero"
                width={100}
                height={28}
                className="h-7 w-auto group-hover:opacity-80 transition-opacity"
                style={{ width: 'auto', height: '28px' }}
                priority
              />
            </Link>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Regions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-[#23103A] hover:bg-[#23103A]/5 rounded-none h-8 px-3 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    Regions
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[480px] p-4 rounded-none border-[#23103A]/15" align="start">
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(REGIONS).map(([region, countries]) => (
                      <div key={region}>
                        <DropdownMenuLabel className="text-xs font-mono uppercase tracking-wider text-[#5C5566] mb-2">
                          {region}
                        </DropdownMenuLabel>
                        {countries.map((country) => (
                          <DropdownMenuItem key={country.slug} asChild>
                            <Link 
                              href={`/region/${country.slug}`}
                              className="text-sm text-[#23103A] hover:text-[#D35A3D] cursor-pointer"
                            >
                              {country.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ))}
                  </div>
                  <DropdownMenuSeparator className="my-3" />
                  <div>
                    <DropdownMenuLabel className="text-xs font-mono uppercase tracking-wider text-[#5C5566] mb-2">
                      Topics
                    </DropdownMenuLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {TOPICS.map((topic) => (
                        <Link
                          key={topic.slug}
                          href={`/topic/${topic.slug}`}
                          className="flex items-center gap-2 p-2 text-sm text-[#23103A] hover:bg-[#23103A]/5 hover:text-[#D35A3D] transition-colors"
                        >
                          <topic.icon className="h-3.5 w-3.5" />
                          {topic.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Community */}
              <Link href="/community">
                <Button variant="ghost" size="sm" className="text-[#23103A] hover:bg-[#23103A]/5 rounded-none h-8 px-3 text-sm font-medium">
                  Community
                </Button>
              </Link>

              {/* Transparency */}
              <Link href="/transparency">
                <Button variant="ghost" size="sm" className="text-[#23103A] hover:bg-[#23103A]/5 rounded-none h-8 px-3 text-sm font-medium">
                  Transparency
                </Button>
              </Link>

              {/* Funding */}
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="text-[#23103A] hover:bg-[#23103A]/5 rounded-none h-8 px-3 text-sm font-medium">
                  Funding
                </Button>
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Human/AI Toggle */}
            <div className="hidden sm:block">
              <ContentModeToggle isSubscribed={isSubscribed} userRole={role} />
            </div>
            
            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-[#23103A] hover:bg-[#23103A]/5 rounded-none h-8 px-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline text-sm max-w-[80px] truncate">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-none border-[#23103A]/15">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-[#23103A]">{user.name || user.email}</p>
                    <p className="text-xs text-[#5C5566] font-mono capitalize">{role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks" className="cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Saved Stories
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#D35A3D]">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#23103A] hover:bg-[#23103A]/5 rounded-none h-8 px-3 text-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button 
                    size="sm" 
                    className="bg-[#23103A] text-white hover:bg-[#160A26] rounded-none h-8 px-3 text-sm"
                  >
                    Join
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-[#23103A]/5 rounded-none h-8 w-8">
                  <Menu className="h-5 w-5 text-[#23103A]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#F7F5F2] p-0">
                <div className="p-4 border-b border-[#23103A]/10">
                  <Image
                    src="/logo.png"
                    alt="LATAM Reportero"
                    width={100}
                    height={28}
                    className="h-7 w-auto"
                  />
                </div>
                <nav className="p-4 space-y-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#5C5566] mb-2 px-2">Navigation</p>
                  <Link
                    href="/region/all"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-[#23103A] hover:bg-[#23103A]/5"
                  >
                    <MapPin className="h-4 w-4" />
                    All Regions
                  </Link>
                  <Link
                    href="/community"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-[#23103A] hover:bg-[#23103A]/5"
                  >
                    Community
                  </Link>
                  <Link
                    href="/transparency"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-[#23103A] hover:bg-[#23103A]/5"
                  >
                    Transparency
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-[#23103A] hover:bg-[#23103A]/5"
                  >
                    Funding
                  </Link>
                </nav>
                <div className="p-4 border-t border-[#23103A]/10">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#5C5566] mb-2">Topics</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TOPICS.map((topic) => (
                      <Link
                        key={topic.slug}
                        href={`/topic/${topic.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1 p-2 text-sm text-[#23103A] hover:bg-[#23103A]/5"
                      >
                        <topic.icon className="h-3.5 w-3.5" />
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {!user && (
                  <div className="p-4 border-t border-[#23103A]/10 space-y-2">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full rounded-none border-[#23103A]/20">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-none bg-[#23103A]">
                        Join
                      </Button>
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
