'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation, useUserRole } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import AISearchBar from '@/components/AISearchBar';
import ContentModeToggle from '@/components/ContentModeToggle';
import CryptoDonationButton from '@/components/CryptoDonationButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, LayoutDashboard, Bookmark, FileText, Settings, Shield, Edit } from 'lucide-react';

export default function Header() {
  const { t, locale } = useTranslation();
  const { user, role, logout, canSubmitStories, canEditStories, canAccessAdminDashboard, isSubscribed } = useUserRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/solutions', label: t('nav.solutions') },
    { href: '/community', label: 'Community' },
    { href: '/writers', label: t('nav.writers') },
    { href: '/pricing', label: t('nav.pricing') },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F5F2] border-b border-[#23103A]/15" data-testid="header">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group" data-testid="logo-link">
          <Image
            src="/logo.png"
            alt="LATAM Reportero"
            width={120}
            height={36}
            className="h-9 w-auto group-hover:opacity-80 transition-opacity"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-[#23103A] text-sm font-medium hover:text-[#D35A3D] transition-colors"
              data-testid={`nav-${link.href.replace('/', '')}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Human/AI Content Toggle */}
          <ContentModeToggle isSubscribed={isSubscribed} userRole={role} />
          
          {/* AI Search */}
          <AISearchBar locale={locale} />
          
          {/* Crypto Donation */}
          <CryptoDonationButton variant="icon" className="hidden sm:flex" />
          
          {/* Language Selector */}
          <LanguageSelector />

          {/* User Menu or Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 border-[#23103A]/20 hover:border-[#23103A]/40 hover:bg-[#23103A]/5 rounded-none" 
                  data-testid="user-menu-trigger"
                >
                  <User className="h-4 w-4 text-[#23103A]" />
                  <span className="hidden sm:inline max-w-[100px] truncate text-[#23103A]">{user.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-none border-[#23103A]/15">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-[#23103A]">{user.name || user.email}</p>
                  <p className="text-xs text-[#5C5566] capitalize font-mono">{role} account</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('nav.dashboard')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer">
                    <Bookmark className="mr-2 h-4 w-4" />
                    {t('nav.bookmarks')}
                  </Link>
                </DropdownMenuItem>
                {canSubmitStories && (
                  <DropdownMenuItem asChild>
                    <Link href="/contributor/dashboard" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      {t('nav.submit')}
                    </Link>
                  </DropdownMenuItem>
                )}
                {canEditStories && (
                  <DropdownMenuItem asChild>
                    <Link href="/editor/dashboard" className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      {t('nav.editor')}
                    </Link>
                  </DropdownMenuItem>
                )}
                {canAccessAdminDashboard && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      {t('nav.admin')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#D35A3D]">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#23103A] hover:text-[#D35A3D] hover:bg-transparent rounded-none" 
                asChild
              >
                <Link href="/auth/login" data-testid="login-btn">{t('nav.login')}</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-[#23103A] text-white hover:bg-[#160A26] rounded-none" 
                asChild
              >
                <Link href="/auth/signup" data-testid="signup-btn">{t('nav.signup')}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-[#23103A]/5 rounded-none">
                <Menu className="h-5 w-5 text-[#23103A]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-[#F7F5F2]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-[#23103A] hover:text-[#D35A3D] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#23103A]/15">
                  <CryptoDonationButton className="w-full justify-center" />
                </div>
                {!user && (
                  <div className="pt-4 space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center py-2 text-[#23103A] border border-[#23103A]/20"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center py-2 bg-[#23103A] text-white"
                    >
                      {t('nav.signup')}
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
