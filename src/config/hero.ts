export interface HeroStat {
  value: number;
  label: string;
  suffix: string;
  i18nKey: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  subtitle: string;
  backgroundImage: string;
  ctaButtonText: string;
  ctaTarget: string;
  decorativeText: string;
  stats: HeroStat[];
}

export const heroConfig: HeroConfig = {
  scriptText: "Khám phá kiến thức vùng Đông Nam Bộ",
  mainTitle: "CLB Kết nối tri thức",
  subtitle: "Kết Nối Tri Thức - Kiến Tạo Giá Trị",
  backgroundImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
  ctaButtonText: "Khám phá ngay",
  ctaTarget: "#events",
  decorativeText: "EST. 2015",
  stats: [
    { value: 500, label: "Tài liệu", suffix: "+", i18nKey: "hero.stats.documents" },
    { value: 50, label: "Khóa học", suffix: "+", i18nKey: "hero.stats.courses" },
    { value: 1200, label: "Thành viên", suffix: "+", i18nKey: "hero.stats.members" },
    { value: 20, label: "Đối tác", suffix: "+", i18nKey: "hero.stats.partners" },
  ],
};
