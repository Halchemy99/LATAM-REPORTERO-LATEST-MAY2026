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
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, LayoutDashboard, Bookmark, FileText, Settings, Shield, Edit, Users } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();
  const { user, role, logout, canSubmitStories, canEditStories, canAccessAdminDashboard } = useUserRole();
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>L</span>
            </div>
            <span className="ml-2 text-xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              LATAM Reportero
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* User Menu or Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2" data-testid="user-menu-trigger">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name || user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role} account</p>
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
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">{t('nav.login')}</Link>
              </Button>
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" asChild>
                <Link href="/auth/signup">{t('nav.signup')}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-primary"
                    >
                      {t('nav.signup')}
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
