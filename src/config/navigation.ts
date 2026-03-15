export interface NavDropdownItem {
  name: string;
  href: string;
  i18nKey: string;
}

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  i18nKey: string;
  dropdown?: NavDropdownItem[];
}

export interface NavigationConfig {
  brandName: string;
  brandSubname: string;
  tagline: string;
  navLinks: NavLink[];
  ctaButtonText: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "CLB Kết nối tri thức",
  brandSubname: "Knowledge Club",
  tagline: "Kết nối tri thức - Kiến tạo giá trị",
  navLinks: [
    {
      name: "Về Chúng Tôi",
      href: "/ve-chung-toi",
      icon: "Users",
      i18nKey: "nav.about",
      dropdown: [
        { name: "Sơ đồ tổ chức", href: "/ve-chung-toi#so-do-to-chuc", i18nKey: "nav.dropdown.orgChart" },
        { name: "Ban đào tạo", href: "/ve-chung-toi#ban-dao-tao", i18nKey: "nav.dropdown.trainingDept" },
        { name: "Ban tư vấn", href: "/ve-chung-toi#ban-tu-van", i18nKey: "nav.dropdown.advisoryDept" },
        { name: "Bộ văn hóa CLB", href: "/ve-chung-toi#van-hoa", i18nKey: "nav.dropdown.culture" },
      ],
    },
    {
      name: "Kho Tri Thức",
      href: "/kien-thuc",
      icon: "Newspaper",
      i18nKey: "nav.news",
      dropdown: [
        { name: "Tất cả bài viết", href: "/kien-thuc", i18nKey: "nav.dropdown.allArticles" },
        { name: "Xu hướng ngành", href: "/kien-thuc?category=xu-huong", i18nKey: "nav.dropdown.industryTrends" },
        { name: "Phân tích chuyên sâu", href: "/kien-thuc?category=phan-tich", i18nKey: "nav.dropdown.deepAnalysis" },
      ],
    },
    {
      name: "Sản phẩm",
      href: "/san-pham",
      icon: "Package",
      i18nKey: "nav.product",
      dropdown: [
        { name: "Khóa học", href: "/san-pham", i18nKey: "nav.courses" },
        { name: "Masterclass", href: "/san-pham?type=masterclass", i18nKey: "nav.dropdown.masterclass" },
        { name: "Bespoke", href: "/bespoke", i18nKey: "nav.dropdown.bespoke" },
      ],
    },
    {
      name: "Tài Nguyên",
      href: "/tai-nguyen",
      icon: "BookOpen",
      i18nKey: "nav.resources",
      dropdown: [
        { name: "Thư viện số", href: "/tai-nguyen", i18nKey: "nav.dropdown.digitalLibrary" },
        { name: "PDF Viewer", href: "/tai-nguyen?view=pdf", i18nKey: "nav.dropdown.pdfViewer" },
      ],
    },
    {
      name: "Kết Nối",
      href: "/co-hoi",
      icon: "Handshake",
      i18nKey: "nav.community",
      dropdown: [
        { name: "Sự kiện", href: "/su-kien", i18nKey: "nav.events" },
        { name: "Việc làm", href: "/co-hoi?tab=jobs", i18nKey: "nav.dropdown.jobs" },
        { name: "Học bổng", href: "/co-hoi?tab=scholarships", i18nKey: "nav.dropdown.scholarships" },
        { name: "Đối tác", href: "/doi-tac", i18nKey: "nav.partners" },
      ],
    },
    {
      name: "Thêm",
      href: "/hoi-dap",
      icon: "Menu",
      i18nKey: "nav.more",
      dropdown: [
        { name: "Hỏi đáp", href: "/hoi-dap", i18nKey: "nav.faq" },
        { name: "Đăng ký thành viên", href: "/dang-ky", i18nKey: "nav.register" },
      ],
    },
  ],
  ctaButtonText: "Đăng ký thành viên",
};
