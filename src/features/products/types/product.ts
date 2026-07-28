export type ProductCategory = 'all' | 'qr_collar' | 'food' | 'accessories';

export type PriceRange = 'all' | 'under_200' | '200_300' | 'above_300';

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: 'qr_collar' | 'food' | 'accessories';
  categoryLabel: string;
  price: number; // Price in VND
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  shortDescription: string;
  description: string;
  features: string[];
  imageUrl: string;
  isFlagship?: boolean;
  reviews: ProductReview[];
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'DogDex Smart QR Tag Collar',
    category: 'qr_collar',
    categoryLabel: 'Vòng Cổ QR Định Vị',
    price: 199000,
    originalPrice: 299000,
    rating: 4.9,
    reviewCount: 128,
    badge: 'Flagship Startup',
    shortDescription: 'Thẻ QR định vị thông minh khẩn cấp khi cún đi lạc.',
    description: 'Thẻ đeo cổ thông minh tích hợp mã QR định vị liên hệ. Khi chó bị thất lạc, người tìm thấy chỉ cần quét mã QR bằng camera điện thoại để xem ngay thông tin liên lạc và tọa độ vị trí chủ nuôi.',
    features: [
      'Quét QR định vị & liên hệ chủ tức thì',
      'Chống nước & chống va đập chuẩn IP67',
      'Không dùng pin, độ bền trọn đời',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    isFlagship: true,
    reviews: [
      {
        id: 'rev-1',
        author: 'Nguyễn Văn Minh',
        rating: 5,
        date: '28/07/2026',
        comment: 'Cún nhà mình đi lạc trong xóm, hàng xóm quét QR cái gọi điện ngay cho mình luôn. Sản phẩm quá tuyệt vời cho các chủ nuôi!',
        verifiedPurchase: true,
      },
      {
        id: 'rev-2',
        author: 'Trần Thị Thu Thảo',
        rating: 5,
        date: '25/07/2026',
        comment: 'Chất liệu thẻ đeo chắc chắn, quét bằng camera thường lên cực nhanh. Rất an tâm khi cho cún đi dạo.',
        verifiedPurchase: true,
      },
      {
        id: 'rev-3',
        author: 'Hoàng Anh Tuấn',
        rating: 4,
        date: '20/07/2026',
        comment: 'Sản phẩm đẹp, chống nước tốt. Giao hàng nhanh!',
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-02',
    name: 'Nutri-Bites Organic Kibble (2kg)',
    category: 'food',
    categoryLabel: 'Thức Ăn Hạt',
    price: 320000,
    originalPrice: 380000,
    rating: 4.8,
    reviewCount: 86,
    badge: 'Dinh Dưỡng Cao Cấp',
    shortDescription: 'Hạt hữu cơ giàu Protein & Omega-3 cho lông mượt.',
    description: 'Thức ăn hạt hữu cơ giàu protein tự nhiên, bổ sung Omega-3 & Omega-6 giúp lông cún bóng mượt và hỗ trợ hệ tiêu hóa vượt trội.',
    features: [
      '100% Nguyên liệu hữu cơ sạch',
      'Bổ sung Omega 3 & 6 làm mượt lông',
      'Hỗ trợ tiêu hóa khỏe mạnh',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    reviews: [
      {
        id: 'rev-4',
        author: 'Lê Hoàng Yến',
        rating: 5,
        date: '26/07/2026',
        comment: 'Cún nhà mình ăn rất hợp, không bị dị ứng. Hạt thơm và lông bớt rụng rõ rệt.',
        verifiedPurchase: true,
      },
      {
        id: 'rev-5',
        author: 'Phạm Đức Mạnh',
        rating: 4,
        date: '22/07/2026',
        comment: 'Hàng đóng gói cẩn thận, hạt giòn thơm.',
        verifiedPurchase: true,
      },
    ],
  },
  {
    id: 'prod-03',
    name: 'Reflective Night Harness + QR Tag',
    category: 'accessories',
    categoryLabel: 'Phụ Kiện Thú Cưng',
    price: 280000,
    originalPrice: 350000,
    rating: 4.9,
    reviewCount: 64,
    badge: 'Phản Quang Ban Đêm',
    shortDescription: 'Đai yếm phản quang an toàn dạo đêm tích hợp mã QR.',
    description: 'Đai yếm dắt dạo đêm tích hợp dải phản quang an toàn kết hợp thẻ QR định vị liên hệ khẩn cấp bảo vệ cún yêu tối đa.',
    features: [
      'Dải phản quang an toàn dạo đêm',
      'Đệm ngực êm chống siết cổ',
      'Kèm thẻ QR định vị liên hệ',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80',
    reviews: [
      {
        id: 'rev-6',
        author: 'Đặng Kim Ngân',
        rating: 5,
        date: '24/07/2026',
        comment: 'Đai đeo êm ái, màu phản quang buổi tối nhìn rất rõ. Rất hài lòng!',
        verifiedPurchase: true,
      },
    ],
  },
];
