import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { faqConfig } from '@/config';

export function FAQ() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter FAQs by category
  const filteredFaqs = activeCategory === 'all' 
    ? faqConfig.items 
    : faqConfig.items.filter(f => f.categoryId === activeCategory);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-24 bg-[#F5F7FA]"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm uppercase tracking-widest text-[#E63946] mb-3">{t('faq.subtitle')}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1E2761] mb-4">{t('faq.title')}</h2>
          <p className="text-[#6C757D] max-w-2xl mx-auto">{t('faq.intro')}</p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {faqConfig.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-[#E63946] text-white shadow-lg'
                  : 'bg-white text-[#6C757D] hover:bg-[#CADCFC] border border-[#E9ECEF]'
              }`}
            >
              {t(category.i18nKey)}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`mb-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 50}ms` }}
            >
              <button
                onClick={() => setOpenItem(openItem === faq.id ? null : faq.id)}
                className={`w-full flex items-center justify-between p-5 bg-white rounded-lg border transition-all ${
                  openItem === faq.id 
                    ? 'border-[#1E2761] shadow-md' 
                    : 'border-[#E9ECEF] hover:border-[#1E2761]/30'
                }`}
              >
                <div className="flex items-start gap-4 text-left">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#CADCFC] text-[#1E2761] text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="font-medium text-[#1E2761]">{faq.question}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-[#6C757D] flex-shrink-0 ml-4 transition-transform duration-300 ${
                    openItem === faq.id ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openItem === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-0 bg-white rounded-b-lg border-x border-b border-[#E9ECEF]">
                  <div className="pt-4 border-t border-[#E9ECEF]">
                    <p className="text-[#6C757D] leading-relaxed pl-10">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-lg border border-[#E9ECEF]">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-[#E63946]" />
              <span className="text-[#1E2761]">{t('faq.contactCta')}</span>
            </div>
            <button 
              onClick={() => scrollToSection('#contact')}
              className="flex items-center gap-2 text-[#E63946] font-medium hover:gap-3 transition-all"
            >
              {t('faq.contactLink')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
