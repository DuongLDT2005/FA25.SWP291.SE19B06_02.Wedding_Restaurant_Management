import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RestaurantTypeStyles.css";

const typeOfRestaurants = [
    {
        id: 1,
        name: "Thôi Nôi",
        image:
            "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/tiec_thoi_noi_b86acfaa72.jpg",
    },
    {
        id: 2,
        name: "Liên Hoan",
        image:
            "https://tiecsaigon.com/wp-content/uploads/thuc-don-bua-tiec-lien-hoan-dai-dien.jpg",
    },
    {
        id: 3,
        name: "Đám Hỏi",
        image:
            "https://7799wedding.vn/data/media/2458/images/phong-cuoi-trang-tri-dam-hoi-7799wst.jpg",
    },
    {
        id: 4,
        name: "Hội Nghị",
        image:
            "https://nhahangcham.com/wp-content/uploads/2024/03/nha-hang-hop-hoi-nghi-da-nang.jpg",
    },
    {
        id: 5,
        name: "Lễ Đầy Tháng",
        image:
            "https://azparty.vn/storage/product/1654770681_dia-diem-to-chuc-day-thang.jpg",
    }
];

export default function PropertyTypeCarousel() {
    const [index, setIndex] = useState(0);
    const visibleCount = 4;
    const maxIndex = typeOfRestaurants.length - visibleCount;

    const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
    const handleNext = () => setIndex((prev) => Math.min(prev + 1, maxIndex));

    // Dynamic card width based on screen size

    return (
        <div className="property-carousel-container-fluid">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h2 className="property-carousel-title">Loại sự kiện</h2>
                        <h6>Ngoài đám cưới, chúng tôi còn có các sự kiện khác dựa vào sự yêu thích.</h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="property-carousel-wrapper">
                {/* Left Navigation Button */}
                {/* <button
                    className={`property-carousel-nav property-carousel-nav-left ${index === 0 ? "disabled" : ""}`}
                    onClick={handlePrev}
                    aria-label="Previous"
                    disabled={index === 0}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button> */}

                {/* Carousel Track */}
                <div className="property-carousel-track-container">
                    <div
                        className="property-carousel-track"
                    >
                        {typeOfRestaurants.map((property) => (
                            <div key={property.id} className="property-card">
                                <div className="property-card-image-wrapper">
                                    <img
                                        src={property.image || "/placeholder.svg"}
                                        alt={property.name}
                                        className="property-card-image"
                                    />
                                    <div className="property-card-overlay"></div>
                                </div>
                                <div className="property-card-content">
                                    <h3 className="property-card-title">{property.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Navigation Button */}
                {/* <button
                    className={`property-carousel-nav property-carousel-nav-right ${index >= maxIndex ? "disabled" : ""}`}
                    onClick={handleNext}
                    aria-label="Next"
                    disabled={index >= maxIndex}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button> */}
                        </div>
                    </div>
                </div>

                {/* Progress Indicators
                <div className="property-carousel-indicators">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            className={`property-carousel-indicator ${i === index ? "active" : ""}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div> */}
            </div>
        </div>
    );
}