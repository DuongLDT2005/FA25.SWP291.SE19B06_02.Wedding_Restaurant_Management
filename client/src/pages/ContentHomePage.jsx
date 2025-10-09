import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homePageStyles.css";
import { restaurants } from "../pages/restaurant/ListingRestaurant";
import RatingStars from "../components/RatingStars";
import RestaurantType from "./RestaurantType";
import ScrollToTopButton from "../components/ScrollToTopButton";

const checkScrollAbility = (scrollContainerRef, setCanScrollLeft, setCanScrollRight) => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
};

const scrollCarousel = (direction, scrollContainerRef, checkScrollAbility, setCanScrollLeft, setCanScrollRight) => {
    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cards = container.querySelectorAll(".restaurant-card-wrapper");
        if (cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth;
        let scrollAmount = container.scrollLeft;
        if (direction === "right") scrollAmount += cardWidth;
        else if (direction === "left") scrollAmount -= cardWidth;
        container.scrollTo({ left: scrollAmount, behavior: "smooth" });
        setTimeout(() => checkScrollAbility(scrollContainerRef, setCanScrollLeft, setCanScrollRight), 300);
    }
};

function ContentHomePage() {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleCheckScroll = useCallback(
        () => checkScrollAbility(scrollContainerRef, setCanScrollLeft, setCanScrollRight),
        [scrollContainerRef]
    );

    const handleScroll = useCallback(
        (direction) =>
            scrollCarousel(direction, scrollContainerRef, checkScrollAbility, setCanScrollLeft, setCanScrollRight),
        [scrollContainerRef]
    );

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleCheckScroll);
            window.addEventListener("resize", handleCheckScroll);
            handleCheckScroll();
            return () => {
                container.removeEventListener("scroll", handleCheckScroll);
                window.removeEventListener("resize", handleCheckScroll);
            };
        }
    }, [handleCheckScroll]);

    return (
        <div className="container-fluid">
            <div className="offers-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <h2>Ưu Đãi</h2>
                            <h6>Khuyến mãi, giảm giá và ưu đãi đặc biệt dành cho bạn</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12 mb-4">
                            <div
                                className="offer-card"
                                style={{
                                    backgroundImage:
                                        "url('https://www.sunlife.co.id/content/dam/sunlife/regional/indonesia/images/Article%202.jpeg')",
                                }}
                            >
                                <div className="offer-content">
                                    <span className="offer-tag">Late Escape Deals</span>
                                    <h3>Đi chơi thật vui, giá cực hời</h3>
                                    <p>Tận hưởng mùa cưới với ưu đãi giảm ít nhất 15%</p>
                                    <button className="btn-custom-red">Xem ưu đãi</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12 mb-4">
                            <div
                                className="offer-card"
                                style={{
                                    backgroundImage:
                                        "url('https://www.karismahotels.com/_next/image?url=https%3A%2F%2Fadmin.karismahotels.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Ffull_width_carousel_desktop%2Fpublic%2F2025-01%2FLifestyle%2520Weddings%2520Azul%2520Beach%2520Negril%25201.jpg%3Fitok%3D7w5PTtgp&w=3840&q=75')",
                                }}
                            >
                                <div className="offer-content">
                                    <span className="offer-tag">Wedding Packages</span>
                                    <h3>Sống trọn khoảnh khắc trong sảnh cưới sang trọng</h3>
                                    <p>Lựa chọn từ nhiều gói tiệc cưới hấp dẫn</p>
                                    <button className="btn-custom-red">Đặt ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content--section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <h2>Nhà Hàng Được Yêu Thích</h2>
                        </div>
                    </div>

                    <div className="carousel-container-fluid">
                        <button className="carousel-btn start-0" onClick={() => handleScroll("left")} disabled={!canScrollLeft}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    fillRule="evenodd"
                                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                                />
                            </svg>
                        </button>

                        <div className="carousel-list" ref={scrollContainerRef}>
                            {restaurants.map((res) => {
                                const avgRating =
                                    res.reviews && res.reviews.length > 0
                                        ? res.reviews.reduce((sum, r) => sum + r.rating, 0) / res.reviews.length
                                        : res.rating || 0;

                                return (
                                    <div key={res.id} className="restaurant-card-wrapper">
                                        <div className="content--card d-flex flex-column h-100">
                                            <div className="content--image">
                                                <img src={res.thumbnailURL} alt={res.name} className="img-fluid" />
                                            </div>
                                            <div className="content--info p-3 d-flex flex-column flex-grow-1">
                                                <h3 className="mb-1">{res.name}</h3>
                                                <div className="d-flex align-items-center mb-2">
                                                    <RatingStars rating={avgRating} />
                                                </div>
                                                <h5 className="content--price mb-2">{res.minPrice.toLocaleString()} VNĐ</h5>
                                                <p className="mb-3 text-muted">{res.address.fullAddress}</p>
                                                <div className="mt-auto text-end">
                                                    <Link to={`/restaurant/${res.id}`} className="text-decoration-none">
                                                        <button className="btn-sm btn-primary">
                                                            Xem thêm
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            className="carousel-btn end-0"
                            onClick={() => handleScroll("right")}
                            disabled={!canScrollRight}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    fillRule="evenodd"
                                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <RestaurantType />

            <div className="content--section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <h2>Các nhà hàng mới nổi</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h5>Hiện tại chúng tôi đang cập nhật thêm...</h5>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollToTopButton />
        </div>
    );
}

export default ContentHomePage;
