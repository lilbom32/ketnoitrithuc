export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
  i18nKey: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
  i18nKey: string;
}

export interface FooterContactItem {
  icon: string;
  text: string;
  i18nKey: string;
}

export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  contactItems: FooterContactItem[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: string[];
  icpText: string;
  backToTopText: string;
  ageVerificationText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "Câu lạc bộ Tri thức Du lịch",
  tagline: "CLB Tri thức Du lịch",
  description: "Kết nối tri thức vùng Đông Nam Bộ và Đồng bằng sông Cửu Long. Bảo tồn, phát triển và chia sẻ giá trị văn hóa, xã hội và kinh tế địa phương.",
  socialLinks: [
    { icon: "Facebook",  label: "Facebook",  href: "https://facebook.com/clbtrithuc" },
    { icon: "Youtube",   label: "YouTube",   href: "https://youtube.com/clbtrithuc" },
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com/clbtrithuc" },
  ],
  linkGroups: [
    {
      title: "Về chúng tôi",
      i18nKey: "nav.about",
      links: [
        { name: "Giới thiệu", href: "#about", i18nKey: "nav.about" },
        { name: "Tầm nhìn",   href: "#about", i18nKey: "about.timeline.2026" },
        { name: "Đội ngũ",    href: "#about", i18nKey: "about.tabs.leadership" },
      ],
    },
    {
      title: "Tài nguyên",
      i18nKey: "nav.resources",
      links: [
        { name: "Kho sách",  href: "#resources", i18nKey: "nav.dropdown.digitalLibrary" },
        { name: "Khóa học",  href: "#product-courses", i18nKey: "nav.courses" },
        { name: "Bespoke",   href: "#product", i18nKey: "nav.dropdown.bespoke" },
      ],
    },
    {
      title: "Hỗ trợ",
      i18nKey: "faq.title",
      links: [
        { name: "FAQ",       href: "#faq", i18nKey: "nav.faq" },
        { name: "Liên hệ",   href: "#contact", i18nKey: "faq.contactLink" },
        { name: "Điều khoản", href: "#terms", i18nKey: "footer.legal.terms" },
      ],
    },
  ],
  contactItems: [
    { icon: "MapPin", text: "TP.HCM, Việt Nam", i18nKey: "contact.info.addressValue" },
    { icon: "Mail",   text: "info@clbtrithuc.vn", i18nKey: "contact.info.emailValue" },
    { icon: "Phone",  text: "028 3822 8855", i18nKey: "contact.info.phoneValue" },
  ],
  newsletterLabel: "Nhận tin mới nhất",
  newsletterPlaceholder: "Nhập email của bạn",
  newsletterButtonText: "Đăng ký",
  newsletterSuccessText: "Đăng ký thành công!",
  newsletterErrorText: "Có lỗi xảy ra. Vui lòng thử lại.",
  newsletterEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID
    ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID}`
    : "",
  copyrightText: "© 2026 Câu lạc bộ Tri thức Du lịch. Tất cả quyền được bảo lưu.",
  legalLinks: ["Chính sách bảo mật", "Điều khoản sử dụng"],
  icpText: "",
  backToTopText: "Lên đầu trang",
  ageVerificationText: "",
};
