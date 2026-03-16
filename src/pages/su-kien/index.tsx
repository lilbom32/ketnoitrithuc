import type { NextPage } from 'next';
import Head from 'next/head';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Share2, Users, LayoutList } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { eventsConfig } from '@/config/events';
import type { Event } from '@/config/events';
import { useState } from 'react';

/** Parse "DD/MM/YYYY" → { day, month (0-based), year } */
function parseEventDate(dateStr: string) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return { day, month: month - 1, year };
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

function CalendarView({ events }: { events: Event[] }) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // Map day → events
  const eventsByDay: Record<number, Event[]> = {};
  for (const ev of events) {
    const { day, month, year } = parseEventDate(ev.date);
    if (year === calYear && month === calMonth) {
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  }

  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  }

  type Cell = { key: string; pad: true } | { key: string; pad: false; day: number };
  const cells: Cell[] = [
    ...Array.from({ length: firstDay }, (_, i): Cell => ({ key: `pad-${i}`, pad: true })),
    ...Array.from({ length: daysInMonth }, (_, i): Cell => ({ key: `day-${i + 1}`, pad: false, day: i + 1 })),
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[#1E2761]/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#1E2761]" />
        </button>
        <h3 className="font-serif text-2xl text-[#1E2761]">
          {MONTH_NAMES[calMonth]} {calYear}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[#1E2761]/10 transition-colors">
          <ChevronRight className="w-5 h-5 text-[#1E2761]" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase py-2">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (cell.pad) return <div key={cell.key} />;
          const day = cell.day;
          const dayEvents = eventsByDay[day] ?? [];
          const isToday = day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
          const isSelected = selectedDay === day;
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={cell.key}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`aspect-square flex flex-col items-center justify-start pt-2 rounded-xl text-sm font-medium transition-all relative ${
                isSelected
                  ? 'bg-[#1E2761] text-white shadow-lg'
                  : isToday
                  ? 'bg-[#CADCFC] text-[#1E2761] font-bold'
                  : hasEvents
                  ? 'bg-white border border-[#CADCFC] hover:border-[#E63946] hover:shadow-md'
                  : 'hover:bg-gray-50 text-gray-400'
              }`}
            >
              <span>{day}</span>
              {hasEvents && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : ev.status === 'upcoming' ? 'bg-[#E63946]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-8 space-y-4">
          <h4 className="font-serif text-lg text-[#1E2761]">
            Ngày {selectedDay} tháng {calMonth + 1} — {selectedEvents.length} sự kiện
          </h4>
          {selectedEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">Không có sự kiện vào ngày này.</p>
          ) : (
            selectedEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#CADCFC] shadow-sm">
                <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${ev.status === 'upcoming' ? 'bg-[#E63946]' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[#1E2761] font-medium">{ev.title}</p>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ev.location}</span>
                  </div>
                </div>
                {ev.status === 'upcoming' && (
                  <span className="text-xs bg-[#E63946] text-white px-2.5 py-1 rounded-full font-bold flex-shrink-0">
                    Mở đăng ký
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />Sắp tới</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" />Đã diễn ra</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#CADCFC]" />Hôm nay</span>
      </div>
    </div>
  );
}

const SuKienPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'archive'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredEvents = eventsConfig.events.filter(event => {
    const matchesTab = activeTab === 'upcoming' ? event.status !== 'past' : event.status === 'past';
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const CATEGORIES = Array.from(new Set(eventsConfig.events.map(e => e.category)));

  return (
    <PageLayout>
      <Head>
        <title>Sự kiện & Hội thảo | Câu lạc bộ Tri thức Du lịch</title>
        <meta name="description" content="Cập nhật lịch các chương trình hội thảo, workshop, networking và các khóa đào tạo chuyên sâu của Câu lạc bộ Tri thức Du lịch." />
      </Head>

      {/* Hero Section */}
      <section className="bg-[#1E2761] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(230,57,70,0.1),transparent)]" />
        <div className="container-custom relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-4 block underline decoration- gold-500 underline-offset-8">Events & Workshops</span>
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Không gian kết nối tri thức</h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Nơi các chuyên gia hội ngộ, chia sẻ tầm nhìn và cùng nhau kiến tạo giải pháp cho ngành du lịch Việt Nam. 
              Từ các buổi workshop thực chiến đến các hội thảo quy mô quốc gia.
            </p>
          </div>
          <div className="w-full md:w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
            <Calendar className="w-12 h-12 text-[#E63946] mx-auto mb-4" />
            <div className="text-sm uppercase tracking-widest text-white/50 mb-2">Tháng 03, 2026</div>
            <div className="text-3xl font-serif font-bold mb-4">03 Sự kiện</div>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">Đang chờ đón bạn tham gia và trải nghiệm.</p>
            <button className="w-full py-3 bg-white text-[#1E2761] rounded-xl font-bold hover:bg-gold-500 hover:text-white transition-all">
              Xem lịch tổng thể
            </button>
          </div>
        </div>
      </section>

      {/* Navigation & Filter */}
      <section className="bg-white border-b border-[#CADCFC] py-6 sticky top-[72px] z-30 shadow-md">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* List/Calendar toggle */}
              <div className="flex bg-[#F5F7FA] p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('list')}
                  title="Danh sách"
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#1E2761] text-white shadow' : 'text-gray-400 hover:text-[#1E2761]'}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  title="Lịch"
                  className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-[#1E2761] text-white shadow' : 'text-gray-400 hover:text-[#1E2761]'}`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>

              {/* Upcoming / Archive — hidden in calendar mode */}
              {viewMode === 'list' && (
                <div className="flex bg-[#F5F7FA] p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-[#1E2761] text-white shadow-lg' : 'text-gray-500 hover:text-[#1E2761]'}`}
                  >
                    Sắp tới
                  </button>
                  <button
                    onClick={() => setActiveTab('archive')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'archive' ? 'bg-[#1E2761] text-white shadow-lg' : 'text-gray-500 hover:text-[#1E2761]'}`}
                  >
                    Đã diễn ra
                  </button>
                </div>
              )}
            </div>

            {viewMode === 'list' && (
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === 'all' ? 'bg-[#E63946] border-[#E63946] text-white' : 'bg-white border-[#CADCFC] text-gray-500 hover:border-[#E63946]'}`}
                >
                  Tất cả
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat ? 'bg-[#E63946] border-[#E63946] text-white' : 'bg-white border-[#CADCFC] text-gray-500 hover:border-[#E63946]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Events List / Calendar */}
      <section className="bg-[#F5F7FA] py-16 px-4 min-h-[500px]">
        <div className="container-custom max-w-5xl">

          {/* Calendar view */}
          {viewMode === 'calendar' && (
            <CalendarView events={eventsConfig.events} />
          )}

          {/* List view */}
          {viewMode === 'list' && (
          <>
          <div className="space-y-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#CADCFC] hover:shadow-2xl transition-all duration-500 group flex flex-col md:flex-row">
                <div className="md:w-1/3 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-gray-200">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 flex flex-col items-center bg-white rounded-2xl p-3 shadow-xl border border-[#CADCFC]">
                    <span className="text-2xl font-bold text-[#1E2761] leading-none mb-1">{event.date.split('/')[0]}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Tháng {event.date.split('/')[1]}</span>
                  </div>
                  {event.status === 'upcoming' && (
                    <div className="absolute bottom-6 left-6">
                      <span className="bg-[#E63946] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg">
                        Mở đăng ký
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs font-bold text-[#E63946] uppercase tracking-widest mb-4">
                    <span>{event.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1E2761] mb-4 group-hover:text-[#E63946] transition-colors leading-tight">{event.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 md:line-clamp-none">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-100 gap-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4 text-gold-500" /> {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Users className="w-4 h-4 text-blue-400" /> 120+ tham gia
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#1E2761] hover:text-white transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${event.status === 'upcoming' ? 'bg-[#E63946] text-white hover:bg-[#E63946]/90 hover:shadow-[#E63946]/40' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                        {event.status === 'upcoming' ? 'Đăng ký tham gia' : 'Đã kết thúc'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-[#CADCFC]">
              <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-2xl text-[#1E2761] font-serif mb-2">Chưa có sự kiện nào</h3>
              <p className="text-gray-400">Vui lòng quay lại sau hoặc chuyển sang tab khác.</p>
            </div>
          )}
          </>
          )}
        </div>
      </section>

      {/* Calendar View Hint */}
      <section className="py-24 px-4 bg-white">
        <div className="container-custom">
          <div className="bg-[#1E2761] rounded-[3rem] p-12 md:p-16 text-white relative flex flex-col lg:flex-row items-center gap-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-serif text-4xl mb-6">Bạn muốn tổ chức sự kiện cùng CLB?</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
                Chúng tôi sẵn sàng hợp tác hỗ trợ không gian, truyền thông và chuyên môn để cùng bạn lan tỏa tri thức đến cộng đồng.
              </p>
              <button className="px-10 py-4 bg-gold-500 text-white rounded-2xl font-bold hover:bg-gold-500/90 transition-all shadow-xl">
                Gửi đề xuất hợp tác
              </button>
            </div>
            <div className="w-full lg:w-1/3 grid grid-cols-7 gap-2 bg-white/5 p-6 rounded-3xl border border-white/10">
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${[15, 20, 25].includes(i+1) ? 'bg-[#E63946] text-white shadow-[#E63946]/50 shadow-md scale-110' : 'bg-white/5 text-white/30'}`}>
                  {i+1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SuKienPage;
