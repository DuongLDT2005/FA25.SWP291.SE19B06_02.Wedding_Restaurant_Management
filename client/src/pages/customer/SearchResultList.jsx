import { useEffect, useState, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import SearchBar from "../../components/searchbar/SearchSection";
import FilterResult from "./components/FilterResult";
import ListResult from "./components/ListResult";
import { useRestaurant } from "../../hooks/useRestaurant";

const SearchResultList = () => {
  const { search, searchResults, status, error } = useRestaurant();

  const [filteredVenues, setFilteredVenues] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const locationHook = useLocation();

  // ✅ Dùng useMemo để đảm bảo params ổn định (tránh re-render vô ích)
  const params = useMemo(() => {
    const queryParams = new URLSearchParams(locationHook.search);
    return {
      location: queryParams.get("location") || null,
      eventType: queryParams.get("eventType") || null,
      capacity: queryParams.get("tables")
        ? Number(queryParams.get("tables"))
        : null, // ✅ chuyển sang number, tránh null
      date: queryParams.get("date") || null,
      startTime: queryParams.get("startTime") || null,
      endTime: queryParams.get("endTime") || null,
      minPrice: queryParams.get("minPrice") || null,
      maxPrice: queryParams.get("maxPrice") || null,
    };
  }, [locationHook.search]);

  // 🧠 1️⃣ Gọi search() khi query thay đổi, chỉ khi params thực sự có location hoặc eventType
  useEffect(() => {
    const fetchResults = async () => {
      if (!params.location && !params.eventType) return; // tránh gọi dư
      try {
        console.log("🚀 [SearchResultList] Trigger search with params:", params);
        await search(params);
      } catch (err) {
        console.error("❌ [SearchResultList] Error in search:", err);
      }
    };

    fetchResults();
  }, [params, search]);

  // 🧠 2️⃣ Khi Redux có dữ liệu => cập nhật filteredVenues
  useEffect(() => {
    if (status === "succeeded" && Array.isArray(searchResults)) {
      console.log("✅ [SearchResultList] Redux đã cập nhật:", searchResults);
      setFilteredVenues(searchResults);
    } else if (status === "loading") {
      console.log("⏳ [SearchResultList] Đang load dữ liệu...");
    } else if (status === "failed") {
      console.error("❌ [SearchResultList] Tải thất bại:", error);
    }
  }, [status, searchResults, error]);

  // 🧠 3️⃣ Sắp xếp
  const handleSort = (value) => {
    setSortBy(value);
    if (!filteredVenues?.length) return;

    const sorted = [...filteredVenues];
    if (value === "price-low") sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (value === "price-high") sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (value === "rating") sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));

    setFilteredVenues(sorted);
    setCurrentPage(1);
  };

  // 📄 Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVenues = filteredVenues.slice(startIndex, startIndex + itemsPerPage);

  // 📊 Debug
  console.log("📊 [SearchResultList] status:", status);
  console.log("📊 [SearchResultList] params:", params);
  console.log("📊 [SearchResultList] searchResults:", searchResults);
  console.log("📊 [SearchResultList] filteredVenues:", filteredVenues);

  // 🧠 4️⃣ Render
  return (
    <MainLayout>
      {/* Search bar */}
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

      {/* Content */}
      <div style={{ backgroundColor: "#fff", paddingBlock: "40px" }}>
        <div
          style={{
            paddingInline: "50px",
            maxWidth: "1200px",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
            {/* Sidebar filter */}
            <div style={{ width: "26%", minWidth: "260px" }}>
              <FilterResult venues={searchResults || []} onFilter={setFilteredVenues} />
            </div>

            {/* Main list */}
            <div style={{ width: "74%", flex: 1 }}>
              {status === "loading" ? (
                <div className="text-center my-5">
                  <Spinner animation="border" />
                  <p className="mt-3">Đang tìm kiếm nhà hàng phù hợp...</p>
                </div>
              ) : error ? (
                <p className="text-danger text-center my-5">{error}</p>
              ) : filteredVenues.length > 0 ? (
                <ListResult
                  venues={currentVenues}
                  sortBy={sortBy}
                  onSortChange={handleSort}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredVenues.length}
                />
              ) : (
                <p className="text-center my-5 text-muted">
                  Không tìm thấy nhà hàng nào phù hợp.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResultList;
