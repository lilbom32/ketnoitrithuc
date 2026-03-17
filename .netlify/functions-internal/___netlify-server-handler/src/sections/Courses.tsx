import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock } from 'lucide-react';
import { productConfig } from '@/config';

export function Courses() {
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

  if (!productConfig.courses?.length) return null;

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="section-padding bg-[#F5F7FA]"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-script text-3xl text-[#E63946]">{t('product.scriptText')}</span>
          <div className="mx-auto my-4 h-px w-16 bg-[#E63946]" />
          <p className="text-sm uppercase tracking-widest text-[#6C757D] mb-3">{t('product.subtitle')}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1E2761]">{t('product.coursesTitle')}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productConfig.courses.map((course, index) => (
            <div
              key={course.id}
              className={`group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {course.featured && (
                  <span className="absolute top-3 left-3 bg-[#E63946] text-white text-xs px-3 py-1 rounded-full">
                    {t('product.featured')}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-[#1E2761]/80 text-white text-xs px-3 py-1 rounded-full">
                  {course.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h4 className="font-serif text-lg text-[#1E2761] mb-2 line-clamp-2 group-hover:text-[#E63946] transition-colors">
                  {course.name}
                </h4>
                <p className="text-sm text-[#6C757D] mb-4 line-clamp-2 flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-[#6C757D] mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl text-[#E63946]">{course.price}</span>
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className="flex items-center gap-1 text-sm text-[#1E2761] hover:text-[#E63946] transition-colors"
                  >
                    {t('product.register')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
