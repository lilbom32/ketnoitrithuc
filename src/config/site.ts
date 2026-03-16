export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "Câu lạc bộ Tri thức Du lịch - Cộng đồng tri thức ngành du lịch Việt Nam",
  description: "Câu lạc bộ Tri thức Du lịch là cộng đồng tri thức cho travel agents, tour operators và hospitality managers tại Việt Nam. Chia sẻ tài liệu, kết nối chuyên gia và cập nhật xu hướng ngành.",
  language: "vi",
  keywords: "Câu lạc bộ Tri thức Du lịch, CLB Tri thức Du lịch, Mekong Delta, Đông Nam Bộ, tài liệu, du lịch, tri thức",
  ogImage: "/images/og-banner.jpg",
  canonical: "https://clbtrithuc.vn",
};
