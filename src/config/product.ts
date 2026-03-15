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
      price: "2.500.000đ",
      category: "Du lịch",
      featured: true,
    },
    {
      id: "english-tourism",
      name: "Tiếng Anh cho Du lịch",
      description: "Tiếng Anh chuyên ngành du lịch, khách sạn và dịch vụ lữ hành.",
      image: "/images/course-2.jpg",
      duration: "8 buổi",
      price: "1.800.000đ",
      category: "Ngoại ngữ",
      featured: true,
    },
    {
      id: "marketing-digital",
      name: "Marketing Số cho Doanh nghiệp",
      description: "Chiến lược marketing digital, social media và xây dựng thương hiệu online.",
      image: "/images/course-3.jpg",
      duration: "6 buổi",
      price: "3.200.000đ",
      category: "Marketing",
      featured: false,
    },
    {
      id: "cross-culture",
      name: "Giao tiếp Đa văn hóa",
      description: "Kỹ năng làm việc và giao tiếp trong môi trường đa văn hóa.",
      image: "/images/course-4.jpg",
      duration: "4 buổi",
      price: "1.200.000đ",
      category: "Kỹ năng",
      featured: false,
    },
  ],
  bespokeTitle: "Bespoke - Nội dung Địa phương",
  bespokeRegions: [
    {
      id: "dong-nam-bo",
      name: "Đông Nam Bộ",
      subtitle: "Vùng đất năng động",
      image: "/images/resource-1.jpg",
      description: "Nội dung chuyên biệt cho các tỉnh Đông Nam Bộ: TP.HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu.",
      highlights: ["Văn hóa đô thị", "Kinh tế công nghiệp", "Du lịch biển", "Ẩm thực đặc trưng"],
    },
    {
      id: "mekong",
      name: "Đồng bằng sông Cửu Long",
      subtitle: "Vùng đất phù sa",
      image: "/images/resource-3.jpg",
      description: "Nghiên cứu và cơ hội vùng ĐBSCL: Cần Thơ, An Giang, Kiên Giang, Bến Tre.",
      highlights: ["Văn hóa sông nước", "Nông nghiệp bền vững", "Du lịch sinh thái", "Làng nghề truyền thống"],
    },
    {
      id: "dich-vu",
      name: "Các ngành Dịch vụ",
      subtitle: "Nhà hàng, Khách sạn, Lữ hành",
      image: "/images/event-2.jpg",
      description: "Đào tạo chuyên sâu cho ngành dịch vụ: tour guide, nhà hàng, khách sạn, lữ hành.",
      highlights: ["Quản lý nhà hàng", "Dịch vụ khách sạn", "Lữ hành chuyên nghiệp", "Đánh giá năng lực"],
    },
  ],
};
