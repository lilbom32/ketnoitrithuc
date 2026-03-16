export interface FAQCategory {
  id: string;
  i18nKey: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
}

export interface FAQConfig {
  subtitle: string;
  title: string;
  introText: string;
  categories: FAQCategory[];
  items: FAQItem[];
  contactCta: string;
  contactLink: string;
}

export const faqConfig: FAQConfig = {
  subtitle: "HỎI ĐÁP",
  title: "Câu Hỏi Thường Gặp",
  introText: "Tìm câu trả lời cho những thắc mắc của bạn về Câu lạc bộ Tri thức Du lịch.",
  categories: [
    { id: "all", i18nKey: "faq.categories.all" },
    { id: "membership", i18nKey: "faq.categories.membership" },
    { id: "resources", i18nKey: "faq.categories.resources" },
    { id: "partnership", i18nKey: "faq.categories.partnership" },
  ],
  items: [
    {
      id: "1",
      question: "Câu lạc bộ Tri thức Du lịch là gì?",
      answer: "Câu lạc bộ Tri thức Du lịch là cộng đồng kết nối những người đam mê văn hóa và lịch sử vùng Đông Nam Bộ & Đồng bằng sông Cửu Long.",
      categoryId: "membership",
    },
    {
      id: "2",
      question: "Làm sao để đăng ký thành viên?",
      answer: "Bạn có thể đăng ký trực tuyến thông qua form đăng ký trên website hoặc liên hệ trực tiếp với Ban tư vấn.",
      categoryId: "membership",
    },
    {
      id: "3",
      question: "Tài liệu của CLB có miễn phí không?",
      answer: "Chúng tôi cung cấp cả tài liệu miễn phí cho cộng đồng và các tài liệu chuyên sâu dành riêng cho thành viên.",
      categoryId: "resources",
    },
  ],
  contactCta: "Vẫn còn thắc mắc?",
  contactLink: "Liên hệ ngay",
};
