/**
 * PageLayout — shared wrapper for all inner pages.
 * Includes Navigation (fixed top) + Footer.
 * Use this on every non-homepage page.
 */
import { ReactNode } from 'react';
import { Navigation } from '@/sections/Navigation';
import { Footer } from '@/sections/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1E2761] flex flex-col">
      <Navigation />
      <main className="flex-1 pt-[72px]">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
