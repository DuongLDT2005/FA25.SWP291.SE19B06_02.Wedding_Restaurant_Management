import React from "react";
import { Link } from "react-router-dom";
import "../styles/homePageStyles.css"
import { restaurants } from "../pages/restaurant/ListingRestaurant"
import RatingStars from "../components/RatingStars";
import RestaurantType from "./RestaurantType";
import ScrollToTopButton from "../components/ScrollToTopButton";
function ContentHomePage() {
    return (
        <>
            {/* Offers & Discounts*/}
            <div className="offers-section">
                <h2>Ưu Đãi</h2>
                <h6>Khuyến mãi, giảm giá và ưu đãi đặc biệt dành cho bạn</h6>
                <div className="offers-list">
                    <div className="offer-card" style={{ backgroundImage: "url('https://www.sunlife.co.id/content/dam/sunlife/regional/indonesia/images/Article%202.jpeg')" }}>
                        <div className="offer-content">
                            <span className="offer-tag">Late Escape Deals</span>
                            <h3>Đi chơi thật vui, giá cực hời</h3>
                            <p>Tận hưởng mùa cưới với ưu đãi giảm ít nhất 15%</p>
                            <button className="btn btn-primary">Xem ưu đãi</button>
                        </div>
                    </div>
                    <div className="offer-card" style={{ backgroundImage: "url('https://www.karismahotels.com/_next/image?url=https%3A%2F%2Fadmin.karismahotels.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Ffull_width_carousel_desktop%2Fpublic%2F2025-01%2FLifestyle%2520Weddings%2520Azul%2520Beach%2520Negril%25201.jpg%3Fitok%3D7w5PTtgp&w=3840&q=75')" }}>
                        <div className="offer-content">
                            <span className="offer-tag">Wedding Packages</span>
                            <h3>Sống trọn khoảnh khắc trong sảnh cưới sang trọng</h3>
                            <p>Lựa chọn từ nhiều gói tiệc cưới hấp dẫn</p>
                            <button className="btn btn-primary">Đặt ngay</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Favourites Restaurant*/}
            <div className="content--section">
                <h2>Nhà Hàng Được Yêu Thích</h2>
                <div className="content--list">
                    {restaurants.map((res) => {
                        const avgRating = res.reviews && res.reviews.length > 0
                            ? res.reviews.reduce((sum, r) => sum + r.rating, 0) / res.reviews.length
                            : res.rating;

                        return (
                            <Link key={res.id} to={`/restaurant/${res.id}`}>
                                <div className="content--card">
                                    <div className="content--image">
                                        <img src={res.thumbnailURL} alt={res.name} />
                                    </div>
                                    <div className="content--info">
                                        <h3>{res.name}</h3>
                                        <div className="d-flex align-items-center">
                                            <RatingStars rating={avgRating} />
                                        </div>
                                        <h5 className="content--price">{res.minPrice.toLocaleString()} VNĐ</h5>
                                        <p>{res.address.fullAddress}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                </div>
            </div>
            {/* Type of Restaurant */}
            <RestaurantType />
            {/* Content 2 */}
            <div className="content--section">
                <h2>Các nhà hàng mới nổi</h2>
                <div className="content--list">
                    <h5>Hiện tại chúng tôi đang cập nhật thêm...</h5>
                </div>
            </div>
            <ScrollToTopButton />
        </>
    );
}
export default ContentHomePage;