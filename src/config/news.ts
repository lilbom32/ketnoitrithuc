export interface NewsArticle {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface StoryQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface StoryTimelineItem {
  value: string;
  label: string;
}

export interface NewsConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  viewAllText: string;
  readMoreText: string;
  articles: NewsArticle[];
  testimonialsScriptText: string;
  testimonialsSubtitle: string;
  testimonialsMainTitle: string;
  testimonials: Testimonial[];
  storyScriptText: string;
  storySubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyTimeline: StoryTimelineItem[];
  storyQuote: StoryQuote;
  storyImage: string;
  storyImageCaption: string;
}

export const newsConfig: NewsConfig = {
  scriptText: "Cập nhật mới nhất",
  subtitle: "TIN TỨC & TRI THỨC",
  mainTitle: "Bài Viết Nổi Bật",
  viewAllText: "Xem tất cả",
  readMoreText: "Đọc thêm",
  articles: [
    {
      id: 1,
      image: "/images/news-1.jpg",
      title: "Ra mắt thư viện số vùng Mekong",
      excerpt: "Nền tảng thư viện số với hơn 500 tài liệu về văn hóa, xã hội và kinh tế vùng ĐBSCL.",
      date: "01/03/2026",
      category: "Công nghệ",
    },
    {
      id: 2,
      image: "/images/news-2.jpg",
      title: "Ký kết hợp tác với ĐH Quốc tế",
      excerpt: "Câu lạc bộ Tri thức Du lịch ký kết thỏa thuận hợp tác với các trường đại học quốc tế.",
      date: "25/02/2026",
      category: "Đối tác",
    },
    {
      id: 3,
      image: "/images/news-3.jpg",
      title: "Khóa học tiếng Hàn miễn phí",
      excerpt: "Mở đăng ký khóa học tiếng Hàn cơ bản dành cho người đi làm.",
      date: "20/02/2026",
      category: "Khóa học",
    },
    {
      id: 4,
      image: "/images/news-4.jpg",
      title: "Hội thảo Du lịch bền vững",
      excerpt: "Hội thảo về phát triển du lịch bền vững tại vùng Đồng bằng sông Cửu Long.",
      date: "15/02/2026",
      category: "Sự kiện",
    },
  ],
  testimonialsScriptText: "Cảm nhận thành viên",
  testimonialsSubtitle: "ĐÁNH GIÁ",
  testimonialsMainTitle: "Thành Viên Nói Gì",
  testimonials: [
    {
      name: "Phạm Thanh Hương",
      role: "Trưởng phòng Sản phẩm — Vietravel",
      text: "Tài liệu thực chiến về quản lý allotment của CLB đã giúp tôi giải quyết bài toán tồn kho phòng trong mùa cao điểm. Không có ở đâu khác tôi tìm được thông tin chi tiết đến vậy.",
      rating: 5,
    },
    {
      name: "Nguyễn Minh Khoa",
      role: "Giám đốc điều hành — Mekong Travel",
      text: "Từ khi tham gia CLB, đội ngũ của tôi tiếp cận được mạng lưới đối tác B2B chất lượng ở ĐBSCL mà trước đây phải mất nhiều năm mới xây dựng được.",
      rating: 5,
    },
    {
      name: "Trần Thị Lan Anh",
      role: "Chuyên gia MICE — Saigontourist",
      text: "Báo cáo phân tích thị trường MICE của CLB rất sát thực tế. Tôi dùng số liệu này để thuyết phục ban lãnh đạo mở rộng sang phân khúc bleisure — và đã thành công.",
      rating: 5,
    },
  ],
  storyScriptText: "Thành tựu",
  storySubtitle: "CON SỐ ẤN TƯỢNG",
  storyTitle: "Hành Trình 11 Năm",
  storyParagraphs: [
    "Từ những ngày đầu thành lập với chỉ một nhóm nhỏ đam mê nghiên cứu, Câu lạc bộ Tri thức Du lịch đã không ngừng phát triển và mở rộng.",
    "Chúng tôi tự hào đã xây dựng được một cộng đồng tri thức sôi động với hàng nghìn thành viên và đối tác.",
  ],
  storyTimeline: [
    { value: "1000+", label: "Tài liệu" },
    { value: "50+",  label: "Khóa học" },
    { value: "100+", label: "Thành viên" },
    { value: "20+",  label: "Đối tác" },
  ],
  storyQuote: {
    prefix: "",
    text: "Cùng nhau xây dựng cộng đồng tri thức vững mạnh.",
    attribution: "Câu lạc bộ Tri thức Du lịch",
  },
  storyImage: "/images/resource-3.jpg",
  storyImageCaption: "Cộng đồng Câu lạc bộ Tri thức Du lịch",
};
