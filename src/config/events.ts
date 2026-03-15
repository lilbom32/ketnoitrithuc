export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: "upcoming" | "ongoing" | "past";
  registrationOpen: boolean;
}

export interface EventsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  upcomingTitle: string;
  archiveTitle: string;
  events: Event[];
}

export const eventsConfig: EventsConfig = {
  scriptText: "Cập nhật sự kiện",
  subtitle: "SỰ KIỆN & HỘI THẢO",
  mainTitle: "Sự Kiện Sắp Tới",
  upcomingTitle: "Sự Kiện Sắp Tới",
  archiveTitle: "Sự Kiện Đã Diễn Ra",
  events: [
    {
      id: "event-1",
      title: "Hội thảo Văn hóa Mekong",
      description: "Khám phá di sản văn hóa truyền thống và hiện đại của vùng Đồng bằng sông Cửu Long.",
      image: "/images/event-1.jpg",
      date: "15/03/2026",
      time: "09:00 - 16:00",
      location: "TP.HCM",
      category: "Hội thảo",
      status: "upcoming",
      registrationOpen: true,
    },
    {
      id: "event-2",
      title: "Khóa học Tiếng Anh Du lịch",
      description: "Tiếng Anh chuyên ngành du lịch cho hướng dẫn viên và nhân viên khách sạn.",
      image: "/images/event-2.jpg",
      date: "20/03/2026",
      time: "18:00 - 20:00",
      location: "Online",
      category: "Khóa học",
      status: "upcoming",
      registrationOpen: true,
    },
    {
      id: "event-3",
      title: "Gặp gỡ Đối tác Quốc tế",
      description: "Kết nối đối tác trong nước và quốc tế, mở rộng mạng lưới hợp tác.",
      image: "/images/event-3.jpg",
      date: "25/03/2026",
      time: "14:00 - 17:00",
      location: "TP.HCM",
      category: "Networking",
      status: "upcoming",
      registrationOpen: true,
    },
    {
      id: "event-4",
      title: "Workshop Marketing Số 2025",
      description: "Chiến lược marketing digital cho doanh nghiệp vừa và nhỏ.",
      image: "/images/news-1.jpg",
      date: "10/01/2026",
      time: "09:00 - 12:00",
      location: "TP.HCM",
      category: "Workshop",
      status: "past",
      registrationOpen: false,
    },
    {
      id: "event-5",
      title: "Hội thảo Du lịch Bền vững",
      description: "Phát triển du lịch bền vững tại vùng Đồng bằng sông Cửu Long.",
      image: "/images/news-4.jpg",
      date: "05/02/2026",
      time: "08:30 - 16:30",
      location: "Cần Thơ",
      category: "Hội thảo",
      status: "past",
      registrationOpen: false,
    },
  ],
};
