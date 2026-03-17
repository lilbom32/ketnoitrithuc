import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { productConfig } from '@/config';

export function Services() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  if (!productConfig.bespokeRegions?.length) return null;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="product"
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-script text-3xl text-[#E63946]">Thiết kế riêng</span>
          <div className="mx-auto my-4 h-px w-16 bg-[#E63946]" />
          <p className="text-sm uppercase tracking-widest text-[#6C757D] mb-3">DÀNH CHO DOANH NGHIỆP & CÁ NHÂN</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1E2761]">{productConfig.bespokeTitle}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {productConfig.bespokeRegions.map((region, index) => (
            <div
              key={region.id}
              className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2761]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-serif text-2xl text-white mb-1">{region.name}</h4>
                  <p className="text-sm text-[#CADCFC]">{region.subtitle}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-sm text-[#6C757D] mb-4">
                  {region.description}
                </p>

                <div className="space-y-2 mb-4">
                  {region.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#1E2761]">
                      <Check className="w-4 h-4 text-[#E63946]" />
                      {highlight}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollToSection('#contact')}
                  className="w-full btn-primary text-center text-sm"
                >
                  {t('product.learnMore')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
