import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import "../../styles/ListingRestaurant.css";
import { Link } from 'react-router-dom';
import RatingStars from "../../components/RatingStars";
import { restaurantDetail } from "./share/RestaurantValue";
function ListingRestaurant() {
    const { state } = useLocation();
    const [priceFilter, setPriceFilter] = useState("");
    const [starFilter, setStarFilter] = useState("");


    const filteredRestaurants = restaurants.filter((r) => {
        let matchPrice = true;
        let matchStar = true;
        let matchLocation = true;
        if (priceFilter) {
            matchPrice = r.minPrice >= Number(priceFilter);
        }
        if (starFilter) {
            if (starFilter === "2.5") {
                matchStar = r.rating <= 3.0;
            } else {
                matchStar = r.rating >= Number(starFilter);
            }
        }
        if (state?.location) {
            matchLocation = r.address.fullAddress.toLowerCase().includes(state.location.toLowerCase());
        }
        return matchPrice && matchStar && matchLocation;
    })

    return (
        <>
            {/* <Header /> */}

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
                                                    <p>Địa chỉ: {res.address.fullAddress}</p>
                                                    
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
        halls: restaurantDetail.halls,
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
