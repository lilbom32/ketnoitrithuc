export interface Course {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  price: string;
  category: string;
  featured: boolean;
}

export interface BespokeRegion {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  highlights: string[];
}

export interface ProductConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  coursesTitle: string;
  courses: Course[];
  bespokeTitle: string;
  bespokeRegions: BespokeRegion[];
}

export const productConfig: ProductConfig = {
  scriptText: "Nâng cao kỹ năng",
  subtitle: "SẢN PHẨM ĐÀO TẠO",
  mainTitle: "Khóa Học & Dịch Vụ",
  coursesTitle: "Khóa Học Nổi Bật",
  courses: [
    {
      id: "tour-guide",
      name: "Đào tạo Hướng dẫn viên chuyên nghiệp",
      description: "Khóa học toàn diện cho hướng dẫn viên du lịch, bao gồm kỹ năng giao tiếp, xử lý tình huống và kiến thức địa phương.",
      image: "/images/course-1.jpg",
      duration: "12 buổi",
      price: "",
      category: "Du lịch",
      featured: true,
    },
    {
      id: "english-tourism",
      name: "Tiếng Anh cho Du lịch",
      description: "Tiếng Anh chuyên ngành du lịch, khách sạn và dịch vụ lữ hành.",
      image: "/images/course-2.jpg",
      duration: "8 buổi",
      price: "",
      category: "Ngoại ngữ",
      featured: true,
    },
    {
      id: "marketing-digital",
      name: "Marketing Số cho Doanh nghiệp",
      description: "Chiến lược marketing digital, social media và xây dựng thương hiệu online.",
      image: "/images/course-3.jpg",
      duration: "6 buổi",
      price: "",
      category: "Marketing",
      featured: false,
    },
    {
      id: "cross-culture",
      name: "Giao tiếp Đa văn hóa",
      description: "Kỹ năng làm việc và giao tiếp trong môi trường đa văn hóa.",
      image: "/images/course-4.jpg",
      duration: "4 buổi",
      price: "",
      category: "Kỹ năng",
      featured: false,
    },
  ],
  bespokeTitle: "Sản phẩm & dịch vụ",
  bespokeRegions: [
    {
      id: "mekong-tour",
      name: "Đồng bằng sông Cửu Long",
      subtitle: "Tour sinh thái — sông nước — miệt vườn",
      image: "/images/resource-3.jpg",
      description: "Chương trình tour khám phá vùng đất phù sa: Cần Thơ, An Giang, Kiên Giang, Bến Tre. Phù hợp đoàn khách trong nước, quốc tế và MICE nhỏ.",
      highlights: ["Du thuyền sông Mekong", "Chợ nổi Cái Răng", "Homestay miệt vườn", "Ẩm thực đặc sản địa phương"],
    },
    {
      id: "tailor-made",
      name: "Tour Thiết Kế Theo Yêu Cầu",
      subtitle: "Lịch trình riêng — trải nghiệm độc quyền",
      image: "/images/resource-1.jpg",
      description: "Tư vấn và xây dựng lịch trình du lịch hoàn toàn theo nhu cầu: cá nhân, gia đình, nhóm doanh nhân hay đoàn khách đặc biệt.",
      highlights: ["Tư vấn lộ trình 1:1", "Kết nối đối tác địa phương", "Hỗ trợ điều phối thực địa", "Linh hoạt thời gian & ngân sách"],
    },
    {
      id: "training-consulting",
      name: "Tư Vấn & Đào Tạo Dịch Vụ",
      subtitle: "Nhà hàng · Khách sạn · Lữ hành",
      image: "/images/event-2.jpg",
      description: "Chương trình tư vấn nghiệp vụ và đào tạo nhân lực tại chỗ cho doanh nghiệp dịch vụ du lịch: nâng chuẩn quy trình, cải thiện chất lượng phục vụ.",
      highlights: ["Đào tạo hướng dẫn viên", "Chuẩn hóa quy trình F&B", "Kỹ năng tiếp đón khách quốc tế", "Đánh giá & phản hồi thực tế"],
    },
  ],
};
