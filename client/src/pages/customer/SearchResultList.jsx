import { useState } from "react";
import { Container } from "react-bootstrap";
import MainLayout from "../../layouts/MainLayout";
import SearchBar from "../../components/searchbar/SearchSection";
import FilterResult from "./components/FilterResult";
import ListResult from "./components/ListResult";

const SAMPLE_VENUES = [
  {
    id: 1,
    name: "Grand Ballroom Palace",
    image: "/assets/img/hotel.jpg",
    location: "56/12 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
    rating: 4.8,
    reviews: 156,
    price: "50,000,000",
    capacity: "500-1000",
    discount: "15%",
    amenities: ["WiFi", "Bãi đỗ xe", "Máy lạnh", "Nhà bếp"],
    featured: true,
  },
  {
    id: 2,
    name: "Ocean View Gardens",
    location: "56/23 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng",
    rating: 4.6,
    reviews: 98,
    price: "35,000,000",
    capacity: "300-600",
    image: "/beachside-garden-venue.jpg",
    discount: "10%",
    amenities: ["Lối ra biển", "Bãi đỗ xe", "Dịch vụ ăn uống", "Hệ thống đèn"],
    featured: false,
  },
];

const SearchResultList = () => {
  const [sortBy, setSortBy] = useState("recommended");
  const [filteredVenues, setFilteredVenues] = useState(SAMPLE_VENUES);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...SAMPLE_VENUES];
    if (value === "price-low")
      sorted.sort(
        (a, b) =>
          parseInt(a.price.replace(/,/g, "")) -
          parseInt(b.price.replace(/,/g, ""))
      );
    if (value === "price-high")
      sorted.sort(
        (a, b) =>
          parseInt(b.price.replace(/,/g, "")) -
          parseInt(a.price.replace(/,/g, ""))
      );
    if (value === "rating") sorted.sort((a, b) => b.rating - a.rating);

    setFilteredVenues(sorted);
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      {/* Search Section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <SearchBar noOverlap />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: "#fff", paddingBlock: "40px" }}>
        <div
          style={{
            paddingInline: "50px", // căn lề 50px như Header
            maxWidth: "1200px", // giữ giới hạn khung như Header
            margin: "0 auto", // căn giữa màn hình
            boxSizing: "border-box", // tránh cộng padding
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "32px",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: "26%", minWidth: "260px" }}>
              <FilterResult />
            </div>

            <div style={{ width: "74%", flex: 1 }}>
              <ListResult
                venues={filteredVenues}
                sortBy={sortBy}
                onSortChange={handleSort}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResultList;
