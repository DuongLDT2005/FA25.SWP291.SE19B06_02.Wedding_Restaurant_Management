import { useState } from "react";
import AuthLayout from "../../layouts/MainLayout";
import SearchBar from "../../components/searchbar/SearchBar";

const SAMPLE_VENUES = [
  {
    id: 1,
    name: "Grand Ballroom Palace",
    location: "Số 12 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
    rating: 4.8,
    reviews: 156,
    price: "50,000,000",
    capacity: "500-1000",
    image: "/luxury-ballroom-venue.jpg",
    discount: "15%",
    amenities: ["WiFi", "Bãi đỗ xe", "Máy lạnh", "Nhà bếp"],
    featured: true,
  },
  {
    id: 2,
    name: "Ocean View Gardens",
    location: "Số 23 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng",
    rating: 4.6,
    reviews: 98,
    price: "35,000,000",
    capacity: "300-600",
    image: "/beachside-garden-venue.jpg",
    discount: "10%",
    amenities: ["Lối ra biển", "Bãi đỗ xe", "Dịch vụ ăn uống", "Hệ thống đèn"],
    featured: false,
  },
  {
    id: 3,
    name: "Riverside Elegance",
    location: "Số 5 Trần Hưng Đạo, Sơn Trà, Đà Nẵng",
    rating: 4.7,
    reviews: 124,
    price: "45,000,000",
    capacity: "400-800",
    image: "/riverside-wedding-venue.jpg",
    discount: "20%",
    amenities: ["View sông", "Máy lạnh", "Bãi đỗ xe", "Sân khấu"],
    featured: true,
  },
  {
    id: 4,
    name: "Historic Villa Retreat",
    location: "Số 88 Ông Ích Đường, Cẩm Lệ, Đà Nẵng",
    rating: 4.5,
    reviews: 72,
    price: "40,000,000",
    capacity: "200-500",
    image: "/historic-villa-event-space.jpg",
    discount: null,
    amenities: ["Trang trí cổ điển", "Khu vườn", "Quầy bar", "Bãi đỗ xe"],
    featured: false,
  },
  {
    id: 5,
    name: "Modern Convention Hub",
    location: "Số 45 Lê Duẩn, Thanh Khê, Đà Nẵng",
    rating: 4.9,
    reviews: 203,
    price: "60,000,000",
    capacity: "800-1500",
    image: "/modern-convention-center.jpg",
    discount: "25%",
    amenities: ["WiFi", "Hỗ trợ kỹ thuật", "Dịch vụ ăn uống", "Phòng họp nhỏ"],
    featured: true,
  },
  {
    id: 6,
    name: "Tropical Paradise Resort",
    location: "Số 7 Nguyễn Tất Thành, Liên Chiểu, Đà Nẵng",
    rating: 4.7,
    reviews: 145,
    price: "55,000,000",
    capacity: "600-1200",
    image: "/tropical-resort-venue.jpg",
    discount: "12%",
    amenities: ["Hồ bơi", "Khu nghỉ dưỡng", "Spa", "Nhà hàng"],
    featured: false,
  },
];

const SearchResultList = () => {
  const [sortBy, setSortBy] = useState("recommended");
  const [filteredVenues, setFilteredVenues] = useState(SAMPLE_VENUES);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...SAMPLE_VENUES];
    if (value === "price-low")
      sorted.sort(
        (a, b) => Number.parseInt(a.price) - Number.parseInt(b.price)
      );
    if (value === "price-high")
      sorted.sort(
        (a, b) => Number.parseInt(b.price) - Number.parseInt(a.price)
      );
    if (value === "rating") sorted.sort((a, b) => b.rating - a.rating);
    setFilteredVenues(sorted);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthLayout>
      <section style={{ marginTop: "100px" }}>
        <SearchBar />
      </section>
      <main style={{ backgroundColor: "#fafafa", padding: "30px 0" }}>
        <div
          style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 30px" }}
        >
          <div style={{ display: "flex", gap: "30px" }}>
            {/* BỘ LỌC */}
            <aside style={{ width: "280px" }}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "20px",
                  }}
                >
                  Bộ lọc kết quả
                </h3>

                {/* Khoảng giá */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "600" }}>
                    Khoảng giá
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      20 triệu
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "4px",
                        backgroundColor: "#E11D48",
                        borderRadius: "2px",
                      }}
                    />
                    <span style={{ fontSize: "13px", color: "#666" }}>
                      70 triệu
                    </span>
                  </div>
                </div>

                {/* Đánh giá */}
                <div
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "20px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "600" }}>
                    Đánh giá
                  </label>
                  {[4.5, 4.6, 4.7, 4.8, 4.9].map((rating) => (
                    <label
                      key={rating}
                      style={{ display: "flex", gap: "8px", marginTop: "6px" }}
                    >
                      <input
                        type="checkbox"
                        style={{ accentColor: "#E11D48" }}
                      />
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {rating}+ ⭐
                      </span>
                    </label>
                  ))}
                </div>

                {/* Tiện nghi */}
                <div
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "20px",
                  }}
                >
                  <label style={{ fontSize: "14px", fontWeight: "600" }}>
                    Tiện nghi
                  </label>
                  {[
                    "WiFi",
                    "Bãi đỗ xe",
                    "Nhà bếp",
                    "Máy lạnh",
                    "Hồ bơi",
                    "Khu vườn",
                  ].map((amenity) => (
                    <label
                      key={amenity}
                      style={{ display: "flex", gap: "8px", marginTop: "6px" }}
                    >
                      <input
                        type="checkbox"
                        style={{ accentColor: "#E11D48" }}
                      />
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Sức chứa */}
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600" }}>
                    Sức chứa
                  </label>
                  {["200-500", "500-800", "800-1000", "1000+"].map((cap) => (
                    <label
                      key={cap}
                      style={{ display: "flex", gap: "8px", marginTop: "6px" }}
                    >
                      <input
                        type="checkbox"
                        style={{ accentColor: "#E11D48" }}
                      />
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {cap} khách
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ưu đãi */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #E11D48 0%, #c91841 100%)",
                  borderRadius: "8px",
                  padding: "20px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  Ưu đãi hấp dẫn 🎉
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.95,
                    marginBottom: "12px",
                  }}
                >
                  Giảm đến 25% cho các địa điểm nổi bật
                </p>
                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "#E11D48",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Xem ngay
                </button>
              </div>
            </aside>

            {/* KẾT QUẢ */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                  borderBottom: "2px solid #e0e0e0",
                  paddingBottom: "15px",
                }}
              >
                <h2 style={{ fontSize: "24px", fontWeight: "700" }}>
                  {filteredVenues.length} sảnh tiệc khả dụng
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  <option value="recommended">Đề xuất</option>
                  <option value="price-low">Giá: Thấp đến cao</option>
                  <option value="price-high">Giá: Cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>

              {paginatedVenues.map((venue) => (
                <div
                  key={venue.id}
                  style={{
                    display: "flex",
                    gap: "20px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    border: "1px solid #f0f0f0",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={venue.image}
                    alt={venue.name}
                    style={{
                      width: "280px",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "16px 20px" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "6px",
                      }}
                    >
                      {venue.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      {venue.location}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#E11D48",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      ⭐ {venue.rating} ({venue.reviews} đánh giá)
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      {venue.amenities.map((a, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #eee",
                            fontSize: "12px",
                            color: "#555",
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#555",
                        marginBottom: "6px",
                      }}
                    >
                      Sức chứa: <strong>{venue.capacity} khách</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "20px",
                        color: "#E11D48",
                        fontWeight: "700",
                        marginTop: "8px",
                      }}
                    >
                      {venue.price} VND
                    </p>
                    <button
                      style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#E11D48",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
};

export default SearchResultList;
