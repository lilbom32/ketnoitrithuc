export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "CLB Kết nối tri thức - Kết nối tri thức vùng Đông Nam Bộ",
  description: "CLB Kết nối tri thức là nền tảng tri thức số cho cộng đồng học tập và kinh doanh Việt Nam. Khám phá kho tài liệu phong phú, khóa học chuyên sâu và cơ hội nghề nghiệp.",
  language: "vi",
  keywords: "CLB Kết nối tri thức, Mekong Delta, Đông Nam Bộ, tài liệu, khóa học, tri thức",
  ogImage: "/images/og-banner.jpg",
  canonical: "https://clbtrithuc.vn",
};
