const mock = {
  partner: { id: 4, name: "Nguyen Van A" },
  stats: { upcoming: 3, pendingPayouts: 2, revenueMonth: 125000000 },
  restaurants: [
    {
      id: 1,
      name: "Nhà hàng Tiệc Cưới A",
      description: "Không gian sang trọng, phục vụ chuyên nghiệp.",
      hallCount: 3,
      thumbnailURL: "https://source.unsplash.com/400x250/?wedding,restaurant",
      address: "123 Lê Lợi, Đà Nẵng",
      amenities: ["Wifi", "Bãi đỗ xe", "Sân khấu"],
      halls: [
        {
          name: "Sảnh Ruby",
          capacity: 300,
          area: "500m²",
          priceMin: 5000000,
          priceMax: 7000000,
        },
        {
          name: "Sảnh Diamond",
          capacity: 500,
          area: "800m²",
          priceMin: 7000000,
          priceMax: 10000000,
        },
      ],
      menu: { minPrice: 5000000 },
      review: { avgRating: 4.5, count: 120 },
      promotion: "Giảm 10% cho tiệc cưới tháng 10",
      status: "Active",
    },
    {
      id: 2,
      name: "Nhà hàng Tiệc Cưới B",
      description: "Không gian thoáng đãng, phù hợp tiệc gia đình.",
      hallCount: 2,
      thumbnailURL: "https://source.unsplash.com/400x250/?banquet,hall",
      address: "45 Nguyễn Văn Linh, Đà Nẵng",
      amenities: ["Âm thanh ánh sáng", "Máy lạnh"],
      halls: [
        {
          name: "Sảnh Pearl",
          capacity: 200,
          area: "300m²",
          priceMin: 4000000,
          priceMax: 6000000,
        },
      ],
      menu: { minPrice: 4000000 },
      review: { avgRating: 4.0, count: 50 },
      promotion: null,
      status: "Active",
    },
  ],
  bookings: [
    {
      id: 101,
      customer: "Alice Nguyen",
      date: "2025-11-15",
      status: "Pending",
      total: 12000000,
    },
    {
      id: 102,
      customer: "Bob Tran",
      date: "2025-12-01",
      status: "Confirmed",
      total: 25000000,
    },
  ],
  services: [
    { id: 1, name: "Photography", price: 3000000 },
    { id: 2, name: "Wedding Planner", price: 5000000 },
  ],
  promotions: [
    {
      id: 1,
      title: "Autumn Promo - 10% off",
      active: true,
      from: "2025-10-01",
      to: "2025-10-31",
    },
  ],
  reviews: [
    {
      id: 1,
      bookingId: 100,
      customer: "Alice",
      rating: 5,
      comment: "Great service!",
      status: "Visible",
    },
    {
      id: 2,
      bookingId: 101,
      customer: "Bob",
      rating: 4,
      comment: "Nice hall but food can improve.",
      status: "Hidden",
    },
  ],
  negotiations: [
    {
      id: 1,
      partnerId: 4,
      proposed: 12.5,
      platform: 15.0,
      status: "Negotiation",
    },
  ],
  notifications: [
    {
      id: 1,
      type: "booking",
      title: "Yêu cầu đặt tiệc mới",
      message: "Khách hàng Alice Nguyen vừa gửi yêu cầu đặt tiệc ngày 15/11.",
      date: "2025-10-01",
    },
    {
      id: 2,
      type: "payment",
      title: "Thanh toán đã xử lý",
      message: "Bạn vừa nhận được khoản thanh toán 25,000,000 VNĐ.",
      date: "2025-10-02",
    },
    {
      id: 3,
      type: "system",
      title: "Cập nhật chính sách",
      message: "Nền tảng vừa cập nhật chính sách hoa hồng.",
      date: "2025-10-03",
    },
  ],
  dish: [
    { id: 1, name: "Gà quay mật ong", price: 250000, category: "Món chính" },
    { id: 2, name: "Súp hải sản", price: 150000, category: "Khai vị" },
    { id: 3, name: "Salad rau củ", price: 100000, category: "Khai vị" },
    {
      id: 4,
      name: "Tôm hùm nướng bơ tỏi",
      price: 600000,
      category: "Món chính",
    },
    { id: 5, name: "Bò sốt tiêu đen", price: 400000, category: "Món chính" },
    {
      id: 6,
      name: "Trái cây tổng hợp",
      price: 120000,
      category: "Tráng miệng",
    },
    { id: 7, name: "Bánh kem cưới", price: 2000000, category: "Tráng miệng" },
  ],

  menu: [
    { id: 1, name: "Menu Tiệc Cưới A", dishes: [1, 2, 5, 6, 7] },
    { id: 2, name: "Menu Tiệc Cưới B", dishes: [3, 4, 5, 6] },
    { id: 3, name: "Menu VIP", dishes: [2, 4, 5, 7] },
  ],
};

export default mock;
