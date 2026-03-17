import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle, AlertCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { contactConfig } from '../config/contact';

export function ContactForm() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#F5F7FA] rounded-bl-full -z-0 opacity-50" />
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-12">
              <span className="text-[#E63946] font-medium tracking-widest text-sm uppercase mb-4 block">
                {t('contact.scriptText')}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1E2761] mb-6">
                {t('contact.connect')}
              </h2>
              <p className="text-[#1E2761]/70 text-lg leading-relaxed">
                {t('contact.connectDesc')}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#E63946] group-hover:bg-[#E63946] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1E2761] text-xl mb-1">{t('contact.phone')}</h4>
                  <p className="text-[#1E2761]/60">{contactConfig?.info?.phone ?? ''}</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#E63946] group-hover:bg-[#E63946] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1E2761] text-xl mb-1">Email</h4>
                  <p className="text-[#1E2761]/60">{contactConfig?.info?.email ?? ''}</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#E63946] group-hover:bg-[#E63946] group-hover:text-white transition-all duration-300 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1E2761] text-xl mb-1">{t('contact.address')}</h4>
                  <p className="text-[#1E2761]/60">{contactConfig?.info?.address ?? ''}</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#E63946] group-hover:bg-[#E63946] group-hover:text-white transition-all duration-300 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-[#1E2761] text-xl mb-1">{t('contact.workingHours')}</h4>
                  <p className="text-[#1E2761]/60">{contactConfig?.info?.hours ?? ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-2xl border border-[#F5F7FA]">
              {formState === 'success' ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1E2761] mb-4">{t('contact.successTitle')}</h3>
                  <p className="text-[#1E2761]/60 mb-8">
                    {t('contact.successMsg')}
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="text-[#E63946] font-medium hover:underline"
                  >
                    {t('contact.newMessage')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-[#1E2761]/70 mb-2">{t('contact.form.name')} *</label>
                      <input
                        id="contact-name"
                        required
                        type="text"
                        placeholder={t('contact.form.namePlaceholder')}
                        className="w-full px-4 py-3 bg-[#F5F7FA] border-transparent focus:bg-white focus:border-[#E63946] focus:ring-0 transition-all outline-none rounded-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-[#1E2761]/70 mb-2">Email *</label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 bg-[#F5F7FA] border-transparent focus:bg-white focus:border-[#E63946] focus:ring-0 transition-all outline-none rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-[#1E2761]/70 mb-2">{t('contact.form.phone')}</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder={t('contact.form.phonePlaceholder')}
                      className="w-full px-4 py-3 bg-[#F5F7FA] border-transparent focus:bg-white focus:border-[#E63946] focus:ring-0 transition-all outline-none rounded-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-[#1E2761]/70 mb-2">{t('contact.subject')}</label>
                    <select id="contact-subject" className="w-full px-4 py-3 bg-[#F5F7FA] border-transparent focus:bg-white focus:border-[#E63946] focus:ring-0 transition-all outline-none rounded-sm appearance-none">
                      <option>{t('contact.subjectOptions.general')}</option>
                      <option>{t('contact.subjectOptions.membership')}</option>
                      <option>{t('contact.subjectOptions.bespoke')}</option>
                      <option>{t('contact.subjectOptions.partner')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-[#1E2761]/70 mb-2">{t('contact.form.message')} *</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder={t('contact.form.messagePlaceholder')}
                      className="w-full px-4 py-3 bg-[#F5F7FA] border-transparent focus:bg-white focus:border-[#E63946] focus:ring-0 transition-all outline-none rounded-sm resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={formState === 'submitting'}
                    type="submit" 
                    className={`w-full py-4 bg-[#1E2761] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#E63946] transition-all duration-300 shadow-lg ${formState === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {formState === 'submitting' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {t('contact.form.submit')} <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {formState === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-4 animate-shake">
                      <AlertCircle className="w-4 h-4" />
                      {t('contact.sendError')}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
