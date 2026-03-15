import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, Clock, MapPin, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { eventsConfig } from '@/config';

export function Events() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>('upcoming');

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

  // Null check: if config is empty, render nothing
  if (!eventsConfig.mainTitle) return null;

  const upcomingEvents = eventsConfig.events.filter(e => e.status === 'upcoming');
  const pastEvents = eventsConfig.events.filter(e => e.status === 'past');

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="events"
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-script text-3xl text-[#E63946]">{t('events.scriptText')}</span>
          <div className="mx-auto my-4 h-px w-16 bg-[#E63946]" />
          <p className="text-sm uppercase tracking-widest text-[#6C757D] mb-3">{t('events.subtitle')}</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1E2761]">{t('events.title')}</h2>
        </div>

        {/* Tabs */}
        <div className={`flex justify-center gap-4 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#1E2761] text-white'
                : 'bg-[#F5F7FA] text-[#6C757D] hover:bg-[#CADCFC]'
            }`}
          >
            {t('events.upcomingTitle')}
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'archive'
                ? 'bg-[#1E2761] text-white'
                : 'bg-[#F5F7FA] text-[#6C757D] hover:bg-[#CADCFC]'
            }`}
          >
            {t('events.archiveTitle')}
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event, index) => (
            <div
              key={event.id}
              className={`group bg-white rounded-lg overflow-hidden border border-[#E9ECEF] hover:border-[#1E2761]/30 hover:shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    event.status === 'upcoming' 
                      ? 'bg-[#E63946] text-white' 
                      : 'bg-[#6C757D] text-white'
                  }`}>
                    {event.category}
                  </span>
                  {event.registrationOpen && (
                    <span className="bg-[#1E2761] text-white text-xs px-3 py-1 rounded-full">
                      {t('events.registrationOpen')}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="font-serif text-xl text-[#1E2761] mb-3 group-hover:text-[#E63946] transition-colors">
                  {event.title}
                </h4>
                <p className="text-sm text-[#6C757D] mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Meta info */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                    <Calendar className="w-4 h-4 text-[#E63946]" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                    <Clock className="w-4 h-4 text-[#E63946]" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                    <MapPin className="w-4 h-4 text-[#E63946]" />
                    {event.location}
                  </div>
                </div>

                {/* Action */}
                {event.status === 'upcoming' && event.registrationOpen ? (
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className="w-full btn-accent text-center text-sm flex items-center justify-center gap-2"
                  >
                    {t('events.registerAction')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : event.status === 'past' ? (
                  <button className="w-full py-2 text-sm text-[#6C757D] border border-[#E9ECEF] rounded hover:bg-[#F5F7FA] transition-colors flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {t('events.ended')}
                  </button>
                ) : (
                  <button className="w-full py-2 text-sm text-[#6C757D] border border-[#E9ECEF] rounded cursor-not-allowed flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {t('events.closed')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className={`text-center mt-10 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button
            onClick={() => scrollToSection('#contact')}
            className="inline-flex items-center gap-2 text-[#1E2761] hover:text-[#E63946] transition-colors"
          >
            {t('events.viewAll')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
