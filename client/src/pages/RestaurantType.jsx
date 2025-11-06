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
        <div className="container-fluid mb-2 mt-4">
            <h2 className="text-center">Thể Loại Nhà Hàng</h2>
            <h6 className="mb-4">Chọn từ các loại không gian phù hợp mọi sở thích.</h6>
            <div className="row mb-2">
                {typeOfRestaurants.slice(0, 2).map((property) => (
                    <div key={property.id} className="col-12 col-md-6">
                        <div className="property-card-image-wrapper">
                            <img
                                src={property.image || "/placeholder.svg"}
                                alt={property.name}
                                className="property-card-image"
                            />

                        </div>
                        <div className="property-card-content">
                            <h3 className="property-card-title">{property.name}</h3>
                        </div>

                    </div>
                ))}
            </div>
            <div className="row mb-2">
                {typeOfRestaurants.slice(2, 5).map((property) => (
                    <div key={property.id} className="col-12 col-md-4">
                        <div className="property-card-image-wrapper">
                            <img
                                src={property.image || "/placeholder.svg"}
                                alt={property.name}
                                className="property-card-image"
                            />
                        </div>
                        <div className="property-card-content">
                            <h3 className="property-card-title">{property.name}</h3>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}