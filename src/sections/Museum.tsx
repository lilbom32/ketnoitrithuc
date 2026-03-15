import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Wine, CheckCircle2, ArrowRight } from 'lucide-react';
import { museumConfig } from '@/config';

export function Museum() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(museumConfig.tabs[0]?.id ?? '');
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsIntersecting(true);
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Null check: if config is empty, render nothing
  if (!museumConfig.title) return null;

  const activeContent = museumConfig.tabs.find(tab => tab.id === activeTab);

  return (
    <section id="about" ref={sectionRef} className="py-24 relative overflow-hidden bg-white">
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Header & Tabs */}
          <div className={`lg:w-1/3 transition-all duration-1000 ${isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-px bg-[#E63946]" />
                <span className="text-[#E63946] font-medium tracking-widest text-sm uppercase">
                  {t('about.subtitle')}
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1E2761] leading-tight">
                {t('about.title')}
              </h2>
            </div>

            <div className="space-y-2">
              {museumConfig.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-5 text-left transition-all duration-300 rounded-sm group ${
                    activeTab === tab.id 
                    ? 'bg-[#1E2761] text-white shadow-xl translate-x-2' 
                    : 'bg-transparent text-[#1E2761]/60 hover:bg-[#F5F7FA] hover:text-[#1E2761]'
                  }`}
                >
                  <span className="font-medium text-lg">{t(tab.i18nKey)}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className={`lg:w-2/3 transition-all duration-1000 delay-300 ${isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {activeContent && (
              <div className="bg-[#F5F7FA] p-8 md:p-12 rounded-sm shadow-sm relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
                  <Wine className="w-64 h-64 text-[#1E2761]" />
                </div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <h3 className="font-serif text-3xl text-[#1E2761] mb-6 border-b border-[#1E2761]/10 pb-4 inline-block">
                      {t(activeContent.i18nKey)}
                    </h3>
                    <div className="prose prose-lg prose-indigo text-[#1E2761]/70 leading-relaxed max-w-none">
                      <p className="whitespace-pre-line">
                        {t(activeContent.i18nContentKey)}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8 mt-12">
                    {activeContent.details.map((detail, idx) => (
                      <div key={idx} className="flex gap-4 group/detail">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E63946] shadow-sm flex-shrink-0 group-hover/detail:bg-[#E63946] group-hover/detail:text-white transition-colors duration-300">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-[#1E2761] text-lg mb-1">{t(detail.i18nTitleKey)}</h4>
                          <p className="text-[#1E2761]/60 text-sm leading-relaxed">{t(detail.i18nDescKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeTab === 'orgChart' && (
                    <div className="mt-12 p-6 bg-white rounded-sm border border-[#1E2761]/5 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[#1E2761]/40 text-sm italic mb-4">{t('about.orgChart.title')}</p>
                        <button className="text-[#E63946] flex items-center gap-2 hover:underline font-medium">
                          {t('about.orgChart.viewFull')} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Story/Timeline Preview */}
        <div className={`mt-24 pt-24 border-t border-[#1E2761]/10 transition-all duration-1000 delay-500 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { year: '2020', i18nKey: 'about.timeline.2020' },
              { year: '2022', i18nKey: 'about.timeline.2022' },
              { year: '2024', i18nKey: 'about.timeline.2024' },
              { year: '2026', i18nKey: 'about.timeline.2026' }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="text-5xl font-serif text-[#1E2761]/10 group-hover:text-[#E63946]/20 transition-colors duration-500 mb-4">{item.year}</div>
                <div className="h-px w-12 bg-[#E63946] mb-6" />
                <p className="text-[#1E2761]/70 leading-relaxed group-hover:text-[#1E2761] transition-colors duration-300">
                  {t(item.i18nKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
