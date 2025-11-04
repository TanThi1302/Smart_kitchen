/* ===================== Data ===================== */
import {
  Shield, Heart, Zap, CheckCircle, Award, Users, Star, Globe,
  Target, Compass, UtensilsCrossed, Wrench, Sparkles,
} from "lucide-react";
const slides = [
  {
    image: "https://plus.unsplash.com/premium_photo-1748021658617-f0931a022ad3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2064",
    title: "Showroom hiện đại",
    desc: "Không gian trưng bày rộng rãi, sang trọng",
  },
  {
    image: "https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
    title: "Sản phẩm cao cấp",
    desc: "Thiết bị nhập khẩu chính hãng từ các thương hiệu hàng đầu",
  },
  {
    image: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80",
    title: "Dịch vụ tận tâm",
    desc: "Đội ngũ tư vấn chuyên nghiệp, nhiệt tình",
  },
  {
    image: "https://images.unsplash.com/photo-1749532125405-70950966b0e5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742",
    title: "Lắp đặt chuyên nghiệp",
    desc: "Đội ngũ kỹ thuật giàu kinh nghiệm",
  },
];

const milestones = [
  { year: "2013", title: "Khởi đầu",       desc: "Thành lập Kitchen Store với 5 nhân viên đầu tiên" },
  { year: "2015", title: "Mở rộng",        desc: "Khai trương showroom thứ 3 tại TP.HCM" },
  { year: "2018", title: "Phát triển",     desc: "Đạt 5000+ khách hàng và 20+ nhân viên" },
  { year: "2020", title: "Chuyển đổi số",  desc: "Ra mắt website và hệ thống bán hàng online" },
  { year: "2023", title: "Hội nhập",       desc: "Hợp tác với 50+ thương hiệu quốc tế" },
  { year: "2025", title: "Dẫn đầu",        desc: "Top 3 nhà bán lẻ thiết bị bếp tại Việt Nam" },
];

const achievements = [
  { icon: Award, number: "100+",    label: "Giải thưởng", color: "from-yellow-400 to-orange-500" },
  { icon: Users, number: "10,000+", label: "Khách hàng",  color: "from-blue-400 to-cyan-500" },
  { icon: Star,  number: "4.9/5",   label: "Đánh giá",    color: "from-purple-400 to-pink-500" },
  { icon: Globe, number: "34/34",   label: "Tỉnh thành",  color: "from-green-400 to-emerald-500" },
];

const values = [
  {
    icon: Shield,
    title: "Chất lượng hàng đầu",
    desc: "Hợp tác trực tiếp với các thương hiệu thiết bị bếp uy tín và kiểm soát chặt chẽ từng khâu giao nhận.",
    points: [
      "100% sản phẩm chính hãng, chứng nhận đầy đủ",
      "Quy trình kiểm định 5 bước trước khi bàn giao",
    ],
    colorKey: "blue",
  },
  {
    icon: Heart,
    title: "Tận tâm phục vụ",
    desc: "Đội ngũ chuyên gia đồng hành từ khâu tư vấn, thiết kế đến lắp đặt và chăm sóc hậu mãi.",
    points: [
      "Tư vấn giải pháp theo nhu cầu thực tế của gia đình",
      "Chăm sóc khách hàng 24/7 qua nhiều kênh kết nối",
    ],
    colorKey: "red",
  },
  {
    icon: Zap,
    title: "Đổi mới sáng tạo",
    desc: "Không ngừng cập nhật công nghệ và xu hướng nhà bếp thông minh, tối ưu trải nghiệm người dùng.",
    points: [
      "Ứng dụng công nghệ IoT trong vận hành thiết bị",
      "Showroom trải nghiệm trực tiếp công nghệ mới",
    ],
    colorKey: "purple",
  },
  {
    icon: CheckCircle,
    title: "Bảo hành tận nơi",
    desc: "Chính sách bảo hành minh bạch, đội kỹ thuật sẵn sàng hỗ trợ nhanh chóng tại nhà.",
    points: [
      "Bảo hành chính hãng toàn quốc",
      "Gói bảo trì định kỳ theo nhu cầu sử dụng",
    ],
    colorKey: "green",
  },
];

const colorClasses = {
  blue:   { bg: "bg-blue-100",   text: "text-blue-600",   gradFrom: "from-blue-400",   gradTo: "to-blue-600" },
  red:    { bg: "bg-red-100",    text: "text-red-600",    gradFrom: "from-red-400",    gradTo: "to-red-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", gradFrom: "from-purple-400", gradTo: "to-purple-600" },
  green:  { bg: "bg-green-100",  text: "text-green-600",  gradFrom: "from-green-400",  gradTo: "to-green-600" },
};

const missionVision = [
  {
    icon: Target,
    title: "Sứ mệnh",
    desc: "Mang công nghệ nhà bếp hiện đại đến mọi gia đình Việt để mỗi bữa ăn đều trọn vẹn và đủ đầy.",
    bullets: [
      "Cung cấp giải pháp bếp tối ưu cho từng không gian sống",
      "Đồng hành cùng khách hàng từ trải nghiệm showroom đến hậu mãi",
    ],
  },
  {
    icon: Compass,
    title: "Tầm nhìn",
    desc: "Trở thành hệ sinh thái thiết bị nhà bếp đáng tin cậy nhất tại Việt Nam và khu vực.",
    bullets: [
      "Định hình tiêu chuẩn mới về dịch vụ và trải nghiệm mua sắm",
      "Phát triển mạng lưới chuyên gia và trung tâm dịch vụ toàn quốc",
    ],
  },
];

const certifications = [
  "ISO 9001:2015",
  "Chứng nhận CR",
  "Đại lý ủy quyền chính thức",
  "Top 100 Sao Vàng Đất Việt",
  "Thương hiệu tin cậy",
];

const offerings = [
  {
    icon: UtensilsCrossed,
    title: "Sản phẩm chủ lực",
    desc: "Danh mục sản phẩm phong phú, cập nhật xu hướng thiết kế quốc tế.",
    items: [
      "Bếp từ, bếp gas, lò nướng & lò vi sóng nhập khẩu",
      "Máy hút mùi, máy rửa chén, tủ lạnh thông minh",
      "Phụ kiện tủ bếp, bộ nồi chảo chuẩn châu Âu",
    ],
  },
  {
    icon: Wrench,
    title: "Dịch vụ nổi bật",
    desc: "Giải pháp trọn gói giúp căn bếp vận hành hiệu quả và an toàn lâu dài.",
    items: [
      "Tư vấn thiết kế, phối cảnh 3D theo yêu cầu",
      "Lắp đặt, bảo trì tận nơi bởi kỹ thuật viên chuẩn hãng",
      "Đào tạo sử dụng thiết bị cho cả gia đình",
    ],
  },
  {
    icon: Sparkles,
    title: "Trải nghiệm khác biệt",
    desc: "Đặt khách hàng làm trung tâm trong mọi quyết định và quy trình vận hành.",
    items: [
      "Showroom trải nghiệm thực tế với chuyên gia đồng hành",
      "Ứng dụng đặt lịch bảo hành và mua sắm trực tuyến",
      "Chính sách đổi trả linh hoạt, minh bạch",
    ],
  },
];

const contacts = [
  { type: "Hotline", value: "1900 xxxx", sub: "Hỗ trợ 24/7", tone: "blue" },
  { type: "Email",   value: "info@kitchenstore.com", sub: "Phản hồi trong 24h", tone: "green" },
  { type: "Showroom",value: "TP. HCM & Hà Nội", sub: "5 chi nhánh", tone: "purple" },
];

export {
  slides,
  milestones,
  achievements,
  values,
  colorClasses,
  missionVision,
  certifications,
  offerings,
  contacts,
};
