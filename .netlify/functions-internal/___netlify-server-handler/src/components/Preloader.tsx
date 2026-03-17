import { useState, useEffect } from 'react';
import { preloaderConfig } from '@/config';

const CLB_LOGO_URL = '/images/logo clb.jpg';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'fading'>('loading');

  useEffect(() => {
    if (!preloaderConfig.brandName) {
      onComplete();
      return;
    }
    const fadeTimer = setTimeout(() => setPhase('fading'), 2400);
    const completeTimer = setTimeout(() => onComplete(), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!preloaderConfig.brandName) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#1E2761] flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo Image */}
      <div className="preloader-text mb-6">
        <img
          src={CLB_LOGO_URL}
          alt="Câu lạc bộ Tri thức Du lịch"
          className="w-24 h-24 rounded-full object-cover shadow-2xl ring-2 ring-white/20"
        />
      </div>

      {/* Brand Name */}
      <div className="preloader-text text-center" style={{ animationDelay: '0.2s' }}>
        <h1 className="font-serif text-3xl md:text-4xl text-white tracking-wide mb-1">
          {preloaderConfig.brandName}
        </h1>
        <p className="text-[10px] text-[#CADCFC] tracking-[0.3em] uppercase mb-2">Du Lịch</p>
        <p className="font-script text-xl text-[#CADCFC]/80">{preloaderConfig.brandSubname}</p>
      </div>

      {/* Loading Line */}
      <div className="mt-8 w-48 h-px bg-white/10 overflow-hidden">
        <div className="preloader-line h-full bg-gradient-to-r from-[#E63946]/50 via-[#E63946] to-[#E63946]/50" />
      </div>

      {/* Year */}
      {preloaderConfig.yearText && (
        <p
          className="preloader-text mt-4 text-xs text-white/40 uppercase tracking-[0.3em]"
          style={{ animationDelay: '0.4s' }}
        >
          {preloaderConfig.yearText}
        </p>
      )}
    </div>
  );
}
