const mock = {
  partner: { id: 4, name: "Nguyen Van A" },
  stats: { upcoming: 3, pendingPayouts: 2, revenueMonth: 125000000 },
  restaurants: [
    { id: 1, name: "Golden Palace", address: "12 Tran Hung Dao, Da Nang", halls: 3 },
  ],
  bookings: [
    { id: 101, customer: "Alice Nguyen", date: "2025-11-15", status: "Pending", total: 12000000 },
    { id: 102, customer: "Bob Tran", date: "2025-12-01", status: "Confirmed", total: 25000000 },
  ],
  services: [
    { id: 1, name: "Photography", price: 3000000 },
    { id: 2, name: "Wedding Planner", price: 5000000 },
  ],
  promotions: [
    { id: 1, title: "Autumn Promo - 10% off", active: true, from: "2025-10-01", to: "2025-10-31" },
  ],
  reviews: [
    { id: 1, bookingId: 100, customer: "Alice", rating: 5, comment: "Great service!" },
  ],
  negotiations: [
    { id: 1, partnerId: 4, proposed: 12.5, platform: 15.0, status: "Negotiation" }
  ],
};

export default mock;