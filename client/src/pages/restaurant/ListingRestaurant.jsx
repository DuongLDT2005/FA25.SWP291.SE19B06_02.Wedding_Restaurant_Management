import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import "../../styles/ListingRestaurant.css";
import { Link } from 'react-router-dom';
import RatingStars from "../../components/RatingStars";
import { useRestaurants } from "../../hooks/useRestaurantData";
function ListingRestaurant() {
    const { state } = useLocation();
    const [priceFilter, setPriceFilter] = useState("");
    const [starFilter, setStarFilter] = useState("");
    const { data: restaurants = [], loading, error } = useRestaurants();

    const filteredRestaurants = useMemo(() => {
        return (restaurants || []).filter((r) => {
            const price = r.minPrice ?? r.price ?? 0; // backend may not provide minPrice; fallback to 0
            const rating = r.avgRating ?? r.rating ?? 0;
            const addrText = typeof r.address === 'string' ? r.address : r.address?.fullAddress;

            let matchPrice = true;
            let matchStar = true;
            let matchLocation = true;
            if (priceFilter) {
                matchPrice = Number(price) >= Number(priceFilter);
            }
            if (starFilter) {
                if (starFilter === "2.5") {
                    matchStar = Number(rating) <= 3.0;
                } else {
                    matchStar = Number(rating) >= Number(starFilter);
                }
            }
            if (state?.location && addrText) {
                matchLocation = addrText.toLowerCase().includes(state.location.toLowerCase());
            }
            return matchPrice && matchStar && matchLocation;
        });
    }, [restaurants, priceFilter, starFilter, state?.location]);

    return (
        <>
            <Header />

            <div className="listing-container">
                {/* Thanh search trên đầu */}
                <div className="listing-search">
                    <SearchBar />
                </div>

                <div className="listing-body">
                    {/* Sidebar bên trái */}
                    <aside className="listing-sidebar">
                        <h3>Bộ lọc</h3>
                        <div className="filter-group">
                            <label>Mức giá:</label>
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                <option value="10000000">10.000.000+</option>
                                <option value="20000000">20.000.000+</option>
                            </select>
                            <label>Đánh giá:</label>
                            <select
                                value={starFilter}
                                onChange={(e) => setStarFilter(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                <option value="2.5">Dưới 3.0 </option>
                                <option value="3.0">3.0+</option>
                                <option value="4.0">4.0+</option>
                                <option value="5.0">5.0</option>
                            </select>
                        </div>
                    </aside>

                    {/* Danh sách bên phải */}
                    <main className="listing-results">
                        <h2>Kết quả tìm kiếm {state?.location && `cho: ${state.location}`}</h2>
                        <div className="restaurant-list">
                            {loading && <p>Đang tải dữ liệu...</p>}
                            {error && <p>Lỗi khi tải dữ liệu: {String(error.message || error)}</p>}
                            {
                                filteredRestaurants.length > 0 ? (
                                    filteredRestaurants.map((res) => {
                                        const rating = (res.reviews && res.reviews.length > 0)
                                            ? res.reviews.reduce((sum, r) => sum + r.rating, 0) / res.reviews.length
                                            : (res.avgRating ?? res.rating ?? 0);
                                        const id = res.restaurantID ?? res.id;
                                        const addressText = typeof res.address === 'string' ? res.address : res.address?.fullAddress;
                                        return (
                                            <div key={id} className="restaurant-card">
                                                <img src={res.thumbnailURL} alt={res.name} />
                                                <div className="restaurant-info">
                                                    <h4>{res.name}</h4>
                                                    <RatingStars rating={rating}></RatingStars>
                                                    <p>Địa chỉ: {addressText || ""}</p>
                                                    
                                                    <button className="btn-detail"><Link to="/restaurant/details">Xem chi tiết</Link></button>
                                                </div>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>Không có nhà hàng nào. Vui lòng chọn lại thông tin</p>
                                )
                            }
                        </div>
                    </main>
                </div>
            </div>

            <ScrollToTopButton />
            <Footer />
        </>
    );
}

export default ListingRestaurant;
