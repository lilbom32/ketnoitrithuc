import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Newspaper, Users, GraduationCap, Briefcase, Handshake, UserPlus, HelpCircle, Calendar, Package, LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { navigationConfig } from '@/config';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { supabase } from '@/lib/supabase';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper, Users, GraduationCap, Briefcase, Handshake, UserPlus,
  HelpCircle, Calendar, Package, Menu, X, ChevDown: ChevronDown,
};

export function Navigation() {
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserDropdownOpen(false);
    router.push('/');
  }

  // Null check after all hooks — config is a build-time constant so this never flickers
  if (!navigationConfig.brandName) return null;

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) return; // handled by Link component
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = navigationConfig.navLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#1E2761]/95 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
      role="navigation"
      aria-label="Main navigation"
      suppressHydrationWarning
    >
      <div className="container-custom px-4 lg:px-8 flex items-center justify-between" suppressHydrationWarning>
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label={navigationConfig.brandName}
        >
          <img src="/images/logo clb.jpg" alt="" aria-hidden="true" className="w-9 h-9 rounded-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="font-serif text-xl text-white tracking-wide">{navigationConfig.brandName}</span>
            <span className="hidden xl:block text-[10px] text-[#CADCFC] tracking-widest uppercase">{navigationConfig.tagline}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5" role="menubar">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
              role="none"
            >
              {link.href.startsWith('/') ? (
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-sm text-white/80 hover:text-[#CADCFC] transition-colors duration-300 py-2"
                  role="menuitem"
                  aria-haspopup={link.dropdown ? 'true' : undefined}
                  aria-expanded={link.dropdown ? activeDropdown === link.name : undefined}
                >
                  {mounted ? t(link.i18nKey) : link.name}
                  {link.dropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`} aria-hidden="true" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="flex items-center gap-1 text-sm text-white/80 hover:text-[#CADCFC] transition-colors duration-300 py-2"
                  role="menuitem"
                >
                  {mounted ? t(link.i18nKey) : link.name}
                </button>
              )}

              {/* Dropdown Menu */}
              {link.dropdown && (
                <div
                  className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                    activeDropdown === link.name
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2'
                  }`}
                  role="menu"
                >
                  <div className="bg-[#1E2761]/95 backdrop-blur-md rounded-md overflow-hidden min-w-[200px] border border-white/10">
                    {link.dropdown.map((item) => (
                      item.href.startsWith('/') ? (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeMenus}
                          className="block w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-[#E63946]/20 hover:text-[#CADCFC] transition-colors"
                          role="menuitem"
                        >
                          {mounted ? t(item.i18nKey) : item.name}
                        </Link>
                      ) : (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className="block w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-[#E63946]/20 hover:text-[#CADCFC] transition-colors"
                          role="menuitem"
                        >
                          {mounted ? t(item.i18nKey) : item.name}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Language Switcher + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />

          {user ? (
            /* Logged-in: avatar + dropdown */
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((o) => !o)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                aria-label="Tài khoản"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center text-white text-sm font-bold select-none">
                  {(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`absolute right-0 top-full pt-2 transition-all duration-300 ${
                  userDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="bg-[#1E2761]/95 backdrop-blur-md rounded-md overflow-hidden min-w-[200px] border border-white/10">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-medium truncate">
                      {user.user_metadata?.full_name ?? user.email}
                    </p>
                    <p className="text-[#CADCFC] text-xs truncate mt-0.5">{user.email}</p>
                  </div>

                  <Link
                    href="/tai-nguyen"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white/80 hover:bg-[#E63946]/20 hover:text-[#CADCFC] transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    {mounted ? t('nav.profile') : 'Hồ Sơ'}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white/80 hover:bg-[#E63946]/20 hover:text-[#CADCFC] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {mounted ? t('nav.logout') : 'Đăng Xuất'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Logged-out: Đăng Nhập button */
            <Link
              href="/dang-nhap"
              className="btn-accent rounded text-sm"
            >
              {mounted ? t('nav.login') : 'Đăng Nhập'}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-[#1E2761]/98 backdrop-blur-lg transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container-custom py-8 flex flex-col gap-2">
          {/* Language Switcher in Mobile */}
          <div className="pb-4 border-b border-white/10">
            <LanguageSwitcher />
          </div>
          
          {navLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon];
            return (
              <div
                key={link.name}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="flex items-center justify-between w-full py-4 text-lg text-white border-b border-white/10"
                      aria-expanded={activeDropdown === link.name}
                      role="menuitem"
                    >
                      <span className="flex items-center gap-3">
                        {IconComponent && <IconComponent className="w-5 h-5 text-[#E63946]" />}
                        {mounted ? t(link.i18nKey) : link.name}
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`} aria-hidden="true" />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        activeDropdown === link.name ? 'max-h-60' : 'max-h-0'
                      }`}
                      role="menu"
                    >
                      {link.dropdown.map((item) => (
                        item.href.startsWith('/') ? (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={closeMenus}
                            className="block w-full text-left pl-12 py-3 text-white/70 hover:text-[#CADCFC]"
                            role="menuitem"
                          >
                            {mounted ? t(item.i18nKey) : item.name}
                          </Link>
                        ) : (
                          <button
                            key={item.name}
                            onClick={() => scrollToSection(item.href)}
                            className="block w-full text-left pl-12 py-3 text-white/70 hover:text-[#CADCFC]"
                            role="menuitem"
                          >
                            {mounted ? t(item.i18nKey) : item.name}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  link.href.startsWith('/') ? (
                    <Link
                      href={link.href}
                      onClick={closeMenus}
                      className="flex items-center gap-3 w-full py-4 text-lg text-white border-b border-white/10 hover:text-[#CADCFC] transition-colors"
                      role="menuitem"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 text-[#E63946]" />}
                      {mounted ? t(link.i18nKey) : link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="flex items-center gap-3 w-full py-4 text-lg text-white border-b border-white/10 hover:text-[#CADCFC] transition-colors"
                      role="menuitem"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 text-[#E63946]" />}
                      {mounted ? t(link.i18nKey) : link.name}
                    </button>
                  )
                )}
              </div>
            );
          })}

          {/* Mobile auth section */}
          {user ? (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
              <p className="text-[#CADCFC] text-sm truncate px-1">
                {user.user_metadata?.full_name ?? user.email}
              </p>
              <Link
                href="/tai-nguyen"
                onClick={closeMenus}
                className="flex items-center gap-2 w-full py-3 text-white/80 hover:text-[#CADCFC] transition-colors text-sm"
                role="menuitem"
              >
                <UserIcon className="w-4 h-4 text-[#E63946]" />
                {mounted ? t('nav.profile') : 'Hồ Sơ'}
              </Link>
              <button
                onClick={() => { handleLogout(); closeMenus(); }}
                className="flex items-center gap-2 w-full py-3 text-white/80 hover:text-[#CADCFC] transition-colors text-sm"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 text-[#E63946]" />
                {mounted ? t('nav.logout') : 'Đăng Xuất'}
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              onClick={closeMenus}
              className="btn-accent rounded mt-6 text-center block"
              role="menuitem"
            >
              {mounted ? t('nav.login') : 'Đăng Nhập'}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
