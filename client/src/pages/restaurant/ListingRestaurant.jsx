import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import "../../styles/ListingRestaurant.css";
import { Link } from 'react-router-dom';
import RatingStars from "../../components/RatingStars";
import CapacityRange from "../../components/CapacityRange";
import { restaurantDetail } from "./share/RestaurantValue";
function ListingRestaurant() {
    const { state } = useLocation();
    const [priceFilters, setPriceFilters] = useState([]);
    const [starFilters, setStarFilters] = useState([]);
    const [capacityFilters, setCapacityFilters] = useState([]);

    // Helper functions for checkbox handling
    const handlePriceFilterChange = (filter) => {
        setPriceFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const handleStarFilterChange = (filter) => {
        setStarFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const handleCapacityFilterChange = (filter) => {
        setCapacityFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const filteredRestaurants = restaurants.filter((r) => {
        let matchPrice = true;
        let matchStar = true;
        let matchCapacity = true;
        let matchLocation = true;

        // Filter by price
        // if (priceFilters.length > 0) {
        //     matchPrice = priceFilters.some(filter => {
        //         if (filter === "10M") return r.minPrice >= 10000000;
        //         if (filter === "20M") return r.minPrice >= 20000000;
        //         if (filter === "30M") return r.minPrice >= 30000000;
        //         return false;
        //     });
        // }

        // Filter by rating
        if (starFilters.length > 0) {
            matchStar = starFilters.some(filter => {
                if (filter === "2.5") return r.rating <= 3.0;
                if (filter === "3.0") return r.rating >= 3.0;
                if (filter === "4.0") return r.rating >= 4.0;
                if (filter === "5.0") return r.rating >= 5.0;
                return false;
            });
        }

        // Filter by rating
        if (starFilters.length > 0) {
            matchStar = starFilters.some(filter => {
                if (filter === "2.5") return r.rating <= 3.0;
                if (filter === "3.0") return r.rating >= 3.0;
                if (filter === "4.0") return r.rating >= 4.0;
                if (filter === "5.0") return r.rating >= 5.0;
                return false;
            });
        }

        // Filter by capacity
        if (capacityFilters.length > 0) {
            const minCapacity = Math.min(...r.halls.map(h => h.capacity));
            const maxCapacity = Math.max(...r.halls.map(h => h.capacity));
            matchCapacity = capacityFilters.some(filter => {
                if (filter === "200") return maxCapacity >= 200;
                if (filter === "500") return maxCapacity >= 500;
                if (filter === "800") return maxCapacity >= 800;
                if (filter === "1000") return maxCapacity >= 1000;
                return false;
            });
        }

        // Filter by location
        if (state?.location) {
            matchLocation = r.address.fullAddress.toLowerCase().includes(state.location.toLowerCase());
        }

        return matchPrice && matchStar && matchCapacity && matchLocation;
    })

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

                        {/* <div className="filter-group">
                            <label>Mức giá:</label>
                            <div className="checkbox-group">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={priceFilters.includes("10M")}
                                        onChange={() => handlePriceFilterChange("10M")}
                                    />
                                    <span>10.000.000+ VNĐ</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={priceFilters.includes("20M")}
                                        onChange={() => handlePriceFilterChange("20M")}
                                    />
                                    <span>20.000.000+ VNĐ</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={priceFilters.includes("30M")}
                                        onChange={() => handlePriceFilterChange("30M")}
                                    />
                                    <span>30.000.000+ VNĐ</span>
                                </label>
                            </div>
                        </div> */}

                        <div className="filter-group">
                            <label>Đánh giá:</label>
                            <div className="checkbox-group">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={starFilters.includes("2.5")}
                                        onChange={() => handleStarFilterChange("2.5")}
                                    />
                                    <span>Dưới 3.0</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={starFilters.includes("3.0")}
                                        onChange={() => handleStarFilterChange("3.0")}
                                    />
                                    <span>3.0+</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={starFilters.includes("4.0")}
                                        onChange={() => handleStarFilterChange("4.0")}
                                    />
                                    <span>4.0+</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={starFilters.includes("5.0")}
                                        onChange={() => handleStarFilterChange("5.0")}
                                    />
                                    <span>5.0</span>
                                </label>
                            </div>
                        </div>

                        <hr className="filter-divider" />

                        <div className="filter-group">
                            <label>Sức chứa:</label>
                            <div className="checkbox-group">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={capacityFilters.includes("200")}
                                        onChange={() => handleCapacityFilterChange("200")}
                                    />
                                    <span>200+ khách</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={capacityFilters.includes("500")}
                                        onChange={() => handleCapacityFilterChange("500")}
                                    />
                                    <span>500+ khách</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={capacityFilters.includes("800")}
                                        onChange={() => handleCapacityFilterChange("800")}
                                    />
                                    <span>800+ khách</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={capacityFilters.includes("1000")}
                                        onChange={() => handleCapacityFilterChange("1000")}
                                    />
                                    <span>1000+ khách</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Danh sách bên phải */}
                    <main className="listing-results">
                        <h2>Kết quả tìm kiếm {state?.location && `cho: ${state.location}`}</h2>
                        <div className="restaurant-list">
                            {
                                filteredRestaurants.length > 0 ? (
                                    filteredRestaurants.map((res) => {
                                        const avgRating = res.reviews && res.reviews.length > 0
                                            ? res.reviews.reduce((sum, r) => sum + r.rating, 0) / res.reviews.length
                                            : res.rating;
                                        return (
                                            <div key={res.id} className="restaurant-card">
                                                <img src={res.thumbnailURL} alt={res.name} />
                                                <div className="restaurant-info">
                                                    <h4>{res.name}</h4>
                                                    <RatingStars rating={avgRating}></RatingStars>
                                                    <p><strong>Số sảnh:</strong> {res.hallCount} sảnh</p>
                                                    <div className="capacity-info">
                                                        <p><strong>Sức chứa:</strong> <CapacityRange halls={res.halls} /></p>
                                                    </div>
                                                    <p><strong>Địa chỉ:</strong> {res.address.fullAddress}</p>

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
export const restaurants = [
    {
        id: 1,
        name: "Quảng Đại Gold",
        description: "Minh Châu Palace tự hào là điểm đến lý tưởng cho những sự kiện đặc biệt như tiệc Gala, hội nghị, sinh nhật và nhiều dịp quan trọng khác...",
        thumbnailURL: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noGTsTV_OhfAXpXJr9G1AWEUuuTP9ofLpcxffVIqO6I6hhXlfks0rblJR0ktmaqv99EHpTD4y-hZukclHdrp8vbT660gBAkkrLQYmhVLl2K6q2OnFJnCWa-BpZ0PLvTkDJzXxNk=s1360-w1360-h1020-rw",
        address: { fullAddress: "8 30 Tháng 4, Hải Châu" },
        hallCount: 2,
        minPrice: 15000000,
        images: restaurantDetail.images,
        amenities: restaurantDetail.amenities,
        halls: [
            { id: 1, name: "Sảnh Vàng", capacity: 300 },
            { id: 2, name: "Sảnh Bạc", capacity: 500 }
        ],
        menus: [
            {
                id: 1,
                name: "Menu Truyền Thống",
                price: 3500000,
                categories: [
                    {
                        name: "Món khai vị",
                        requiredQuantity: 2,
                        dishes: [
                            { id: 1, name: "Gỏi ngó sen tôm thịt" },
                            { id: 2, name: "Súp cua gà xé" }
                        ]
                    },
                    {
                        name: "Món chính",
                        requiredQuantity: 3,
                        dishes: [
                            { id: 3, name: "Gà hấp lá chanh" },
                            { id: 4, name: "Bò nướng tiêu đen" }
                        ]
                    }
                ]
            },
            {
                id: 2,
                name: "Menu Cao Cấp",
                price: 4500000,
                categories: [
                    {
                        name: "Món khai vị",
                        requiredQuantity: 3,
                        dishes: [
                            { id: 1, name: "Gỏi tôm thịt" },
                            { id: 2, name: "Súp cua" },
                            { id: 3, name: "Nem nướng" }
                        ]
                    }
                ]
            }
        ],
        services: restaurantDetail.services,
        promotions: restaurantDetail.promotions,
        reviews: restaurantDetail.reviews
    },
    {
        id: 2,
        name: "Trung tâm Hội nghị & Tiệc cưới Minh Châu Việt",
        description: "Nhà hàng Minh Châu Việt có không gian thoáng mát, rộng rãi...",
        thumbnailURL: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npmSGnTftuYWVjFda_WN8MWwdLAggADcw66Q7ZFximmY2jzK47JfHYKD5tf3cyWjLqQ_cpIxXnGhM2rvUsYImWZuW8I3zykc9UDMBaTAXaLGBtSmnbz2khswz-3eivFTuqGt0j4NA=s1360-w1360-h1020-rw",
        address: { fullAddress: "45 Nguyễn Tri Phương, Hải Châu" },
        hallCount: 3,
        minPrice: 20000000,
        halls: [
            { id: 1, name: "Sảnh Hội Nghị", capacity: 200 },
            { id: 2, name: "Sảnh Tiệc Cưới", capacity: 500 },
            { id: 3, name: "Sảnh VIP", capacity: 800 }
        ],
        rating: 3.5,
        menus: [
            {
                id: 1,
                name: "Menu Hội Nghị",
                price: 2800000,
                categories: [
                    {
                        name: "Món chính",
                        requiredQuantity: 4,
                        dishes: [
                            { id: 1, name: "Cá hấp xì dầu" },
                            { id: 2, name: "Thịt bò xào" },
                            { id: 3, name: "Tôm chiên" },
                            { id: 4, name: "Gà nướng" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Nhà hàng Phì Lũ",
        description: "Nhà hàng được xây dựng hiện đại, sang trọng với sức chứa khoảng 1.000 khách và một phòng VIP...",
        thumbnailURL: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nowyLjMakqdNyN7D52562Uc8PiwQalV_Q7sKO1zlMW2_X0wQFNWVqM23_duuUk8QVlP0xrMn9t0JLTQFtSnVPZNLuQRuAE7MVFDSJy-Va0WdzXXu8KshyjF9jDhtPMwmIOQ0Fq6=s1360-w1360-h1020-rw",
        address: { fullAddress: "88 Nguyễn Văn Cừ, Liên Chiểu" },
        hallCount: 1,
        minPrice: 6000000,
        halls: [
            { id: 1, name: "Sảnh Chính", capacity: 1000 }
        ],
        rating: 4.0,
        menus: [
            {
                id: 1,
                name: "Menu Tiệc Cưới",
                price: 3200000,
                categories: [
                    {
                        name: "Món khai vị",
                        requiredQuantity: 2,
                        dishes: [
                            { id: 1, name: "Gỏi cuốn tôm thịt" },
                            { id: 2, name: "Chả cá Lã Vọng" }
                        ]
                    },
                    {
                        name: "Món chính",
                        requiredQuantity: 5,
                        dishes: [
                            { id: 3, name: "Cá chép hấp" },
                            { id: 4, name: "Gà nướng mật ong" },
                            { id: 5, name: "Tôm sú rang me" },
                            { id: 6, name: "Bò bít tết" },
                            { id: 7, name: "Cua rang muối" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "White Swan Wedding & Event",
        description: "Phong cách sang trọng, dịch vụ chuẩn 5 sao...",
        thumbnailURL: "https://lh3.googleusercontent.com/p/AF1QipM47idwbQ65tkwuxfv8_doq5mSsHnDa3rhQcFJu=s1360-w1360-h1020-rw",
        address: { fullAddress: "1-2-3 2 Tháng 9, Hải Châu" },
        hallCount: 1,
        minPrice: 25000000,
        halls: [
            { id: 1, name: "Sảnh White Swan", capacity: 300 }
        ],
        rating: 5.0,
        menus: [
            {
                id: 1,
                name: "Menu Premium",
                price: 5500000,
                categories: [
                    {
                        name: "Món khai vị",
                        requiredQuantity: 3,
                        dishes: [
                            { id: 1, name: "Súp cua Hoàng đế" },
                            { id: 2, name: "Gỏi tôm thịt đặc biệt" },
                            { id: 3, name: "Nem cua bể" }
                        ]
                    },
                    {
                        name: "Món chính",
                        requiredQuantity: 6,
                        dishes: [
                            { id: 4, name: "Cá song hấp" },
                            { id: 5, name: "Tôm hùm nướng" },
                            { id: 6, name: "Bò Wagyu" },
                            { id: 7, name: "Gà Đông Tảo" },
                            { id: 8, name: "Cua Hoàng đế" },
                            { id: 9, name: "Lẩu hải sản" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Minh Châu Palace",
        description: "Phong cách sang trọng, dịch vụ chuẩn 5 sao...",
        thumbnailURL: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noh15ko_d1OItd-QWBr8zuzVETOmqkgR8nNZeQQ3RuO3-Ovc2tPQZggwJjXzaOtUjfEHZ23nJLAl5j8gjmrdjFldxrWKA8JXn_u00vHqIgsBoU5oXd2GGSHVoWJIk-59XHTSZdkcQ=s1360-w1360-h1020-rw",
        address: { fullAddress: "122b Lý Thái Tông, Liên Chiểu" },
        hallCount: 1,
        minPrice: 5000000,
        halls: [
            { id: 1, name: "Sảnh Minh Châu", capacity: 400 }
        ],
        rating: 4.5,
        menus: [
            {
                id: 1,
                name: "Menu Cơ Bản",
                price: 2500000,
                categories: [
                    {
                        name: "Món chính",
                        requiredQuantity: 3,
                        dishes: [
                            { id: 1, name: "Cá kho tộ" },
                            { id: 2, name: "Thịt kho tàu" },
                            { id: 3, name: "Canh chua cá" }
                        ]
                    }
                ]
            }
        ]
    },
];

export default ListingRestaurant;
