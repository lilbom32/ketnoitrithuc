export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface TierOption {
  value: 'free' | 'premium';
  label: string;
  description: string;
  badge?: string;
}

export interface ContactFormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  tierLabel: string;
  tiers: TierOption[];
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  submittingText: string;
  successMessage: string;
  errorMessage: string;
  emailExistsError: string;
  weakPasswordError: string;
  passwordMismatchError: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  form: ContactFormFields;
  privacyNotice: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Kết nối với chúng tôi",
  subtitle: "ĐĂNG KÝ THÀNH VIÊN",
  mainTitle: "Tham Gia Cộng Đồng",
  introText: "Đăng ký thành viên để truy cập đầy đủ tài nguyên và tham gia cộng đồng tri thức của chúng tôi.",
  contactInfoTitle: "Thông tin liên hệ",
  contactInfo: [
    { icon: "MapPin", label: "Địa chỉ", value: "TP.HCM, Việt Nam", subtext: "Văn phòng chính" },
    { icon: "Mail",   label: "Email",   value: "info@clbtrithuc.vn", subtext: "Liên hệ chung" },
    { icon: "Phone",  label: "Hotline", value: "028 3822 8855", subtext: "T2-T7, 8h-17h" },
    { icon: "Clock",  label: "Giờ làm việc", value: "T2-T7, 8:00-17:00", subtext: "Trừ ngày lễ" },
  ],
  form: {
    nameLabel: "Họ và tên",
    namePlaceholder: "Nhập họ và tên của bạn",
    emailLabel: "Email",
    emailPlaceholder: "Nhập địa chỉ email",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "Nhập số điện thoại",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu (tối thiểu 6 ký tự)",
    confirmPasswordLabel: "Xác nhận mật khẩu",
    confirmPasswordPlaceholder: "Nhập lại mật khẩu",
    tierLabel: "Gói thành viên",
    tiers: [
      { value: 'free', label: 'Miễn phí', description: '10 tài liệu/tháng' },
      { value: 'premium', label: 'Premium', description: 'Không giới hạn', badge: 'Phổ biến' },
    ],
    messageLabel: "Lời nhắn",
    messagePlaceholder: "Nhập lời nhắn của bạn (không bắt buộc)",
    submitText: "Đăng ký ngay",
    submittingText: "Đang xử lý...",
    successMessage: "Kiểm tra hộp thư để xác nhận đăng ký",
    errorMessage: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    emailExistsError: "Email này đã được đăng ký. Vui lòng đăng nhập.",
    weakPasswordError: "Mật khẩu quá yếu. Vui lòng sử dụng ít nhất 6 ký tự.",
    passwordMismatchError: "Mật khẩu xác nhận không khớp.",
  },
  privacyNotice: "Bằng việc đăng ký, bạn đồng ý với các điều khoản và chính sách bảo mật của CLB Kết nối tri thức.",
};

/** Flat contact info for ContactForm section (home page). */
export const contactConfig = {
  info: {
    phone: '028 3822 8855',
    email: 'info@clbtrithuc.vn',
    address: 'TP.HCM, Việt Nam',
    hours: 'T2-T7, 8:00-17:00',
  },
};
