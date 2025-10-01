import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar"; // tái sử dụng luôn
import "../../styles/ListingRestaurant.css";

function ListingRestaurant() {
    const { state } = useLocation();
    const [priceFilter, setPriceFilter] = useState("");

    // Demo danh sách nhà hàng (mock data)
    const restaurants = [
        {
            id: 1,
            name: "Nhà hàng Sen Đà Nẵng",
            location: "Ngũ Hành Sơn",
            price: "500.000 - 1.000.000đ",
            img: "/assets/img/restaurant1.jpg",
        },
        {
            id: 2,
            name: "Nhà hàng Biển Xanh",
            location: "Sơn Trà",
            price: "700.000 - 1.200.000đ",
            img: "/assets/img/restaurant2.jpg",
        },
        {
            id: 3,
            name: "Nhà hàng Luxury",
            location: "Liên Chiểu",
            price: "1.000.000 - 2.000.000đ",
            img: "/assets/img/restaurant3.jpg",
        },
    ];

    // Lọc theo giá (demo)
    const filteredRestaurants = priceFilter
        ? restaurants.filter((r) => r.price.includes(priceFilter))
        : restaurants;

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
                                <option value="500.000">500.000+</option>
                                <option value="1.000.000">1.000.000+</option>
                            </select>
                        </div>
                    </aside>

                    {/* Danh sách bên phải */}
                    <main className="listing-results">
                        <h2>Kết quả tìm kiếm {state?.location && `cho: ${state.location}`}</h2>
                        <div className="restaurant-list">
                            {filteredRestaurants.map((res) => (
                                <div key={res.id} className="restaurant-card">
                                    <img src={res.img} alt={res.name} />
                                    <div className="restaurant-info">
                                        <h3>{res.name}</h3>
                                        <p>📍 {res.location}</p>
                                        <p>💰 {res.price}</p>
                                        <button className="btn-detail">Xem chi tiết</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default ListingRestaurant;
