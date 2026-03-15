import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

const languages = [
  { code: 'vi', label: 'VI', flag: '🇻🇳' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'zh', label: 'ZH', flag: '🇨🇳' },
  { code: 'ko', label: 'KO', flag: '🇰🇷' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const currentLang = mounted
    ? (languages.find(lang => lang.code === i18n.language) || languages[0])
    : languages[0];

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    setIsOpen(false);
    void router.push(router.pathname, router.asPath, { locale: code });
  };

  const dropdownEl = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-lg shadow-lg overflow-hidden min-w-[120px] z-[9999]"
      role="listbox"
      style={{ top: position.top, right: position.right }}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-200 ${
            i18n.language === lang.code
              ? 'bg-[#2D5A3D] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          role="option"
          aria-selected={i18n.language === lang.code}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{currentLang.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {typeof document !== 'undefined' && createPortal(dropdownEl, document.body)}
    </div>
  );
}
