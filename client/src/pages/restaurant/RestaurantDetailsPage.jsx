import React, { useState } from "react";
import { MapPin, Phone, Mail, Star, Heart } from "lucide-react";
import ImageCarousel from "../../components/ImageCarousel";
import "../../styles/RestaurantDetailsStyles.css";
import RatingStars from "../../components/RatingStars";
import CapacityRange from "../../components/CapacityRange";
import NavBar from "./components/NavBar";
import { faBuildingColumns, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HallList from "./components/HallList";
import MenuList from "./components/MenuList";
import ServiceList from "./components/ServiceList";
import ReviewList from "./components/ReviewList";
import ScrollToTopButton from "../../components/ScrollToTopButton"; // nút scroll khi người dùng kéo xuống

export default function RestaurantDetailsPage() {
  const restaurant = restaurantDetail;
  const resImages = [restaurant.thumbnailURL, ...restaurant.images];
  const [expanded, setExpanded] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const totalReviews = restaurant.reviews.length;
  const avgRating = restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const maxLength = 250;
  const isLong = restaurant.description.length > maxLength;
  const displayText = expanded
    ? restaurant.description
    : restaurant.description.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div className="container my-4">
      <NavBar />
      <hr />
      {/* Tên & Địa chỉ */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 style={{ color: "#993344", fontWeight: "bold" }} id="overview">{restaurant.name}</h1>
          <p className="text-muted mb-1 ">
            <MapPin size={16} /> {restaurant.address.fullAddress}
          </p>
          <p className="text-warning mb-1">
            <div className="d-inline-flex align-items-center">
              <RatingStars rating={avgRating} />
              <span className="text-muted">{avgRating.toFixed(1)} / 5 ({totalReviews} đánh giá)</span>
            </div>
          </p>
          <p className="mb-1 d-flex align-items-center">
            <CapacityRange halls={restaurant.halls} />
            <span className="mx-2">•</span>
            <span className="d-inline-flex align-items-center">
              <FontAwesomeIcon icon={faBuildingColumns} style={{ color: "#993344" }} className="me-1" />
              {restaurant.hallCount} sảnh
            </span>
          </p>
        </div>
        <button className="btn btn-outline-danger" style={{ transition: "0.3s" }} onMouseOver={(e) => (e.currentTarget.style.color = "white")} onMouseOut={(e) => (e.currentTarget.style.color = "")}>
          <Heart size={18} className="me-1 mb-1" />
          Lưu vào danh sách
        </button>
      </div>
      <div className="row">
        <div className="col-md-8">
          {/* Gallery */}
          <ImageCarousel id="restaurantImages" images={resImages} />
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body p-4">
              <h5 className="mb-3 text-uppercase fw-bold" style={{ color: "#993344" }}>
                Tiện ích
              </h5>
              <ul className="list-unstyled mb-0">
                {restaurant.amenities.map((amenity, idx) => (
                  <li
                    key={idx}
                    className="d-flex align-items-center mb-2"
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="me-2"
                      style={{ color: "#993344" }}
                    />
                    <span className="text-dark">{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bản đồ */}
          <div className="card">
            <div className="ratio ratio-4x3">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.address.fullAddress)}&output=embed`}
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="row mt-4">
        {/* Thông tin */}
        <div className="col-md-8">
          {/* Giới thiệu */}
          <h4 className="section-title">Giới thiệu</h4>
          <p className="description-text">{displayText}</p>
          {isLong && (
            <button
              className="btn-toggle"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
            </button>
          )}
        </div>
        <hr className="mt-4" id="hallist" />
        <HallList
          restaurant={{ ...restaurant, selectedHall }}
          onSelectHall={setSelectedHall}
        />

        <hr className="mt-4" id="menu" />
        <MenuList restaurant={restaurant} />
        <hr className="mt-4" id="services" />
        <ServiceList restaurant={restaurant} />
        <hr className="mt-4" id="reviews" />
        <ReviewList reviews={restaurant.reviews} />
      </div>
      <ScrollToTopButton />
    </div>
  );
}

// Mock data
// static sample data
export const restaurantDetail = {
  id: 1,
  name: "Quảng Đại Gold",
  description: "Quảng Đại Gold là một địa điểm ấn tượng tọa lạc tại Lô 25-27, đường 30/4, phường Hòa Cường Bắc, quận Hải Châu, Đà Nẵng . Với vị trí đắc địa, Quảng Đại Gold vừa thuận tiện cho việc tiếp cận vừa nổi bật giữa trung tâm thành phố. Là một nhà hàng – trung tâm tiệc cưới cao cấp, Quảng Đại Gold mang đến cho thực khách không gian sang trọng, hiện đại nhưng vẫn ấm cúng, phù hợp cho các dịp lễ trọng đại hoặc những buổi gặp gỡ trang trọng. Khách đến đây sẽ cảm nhận được sự tinh tế trong thiết kế: tông màu vàng ánh kim chủ đạo hài hoà với ánh sáng ấm, kết hợp cùng vật liệu cao cấp, chi tiết decor nhẹ nhàng nhưng tinh xảo.",
  thumbnailURL: "https://phongsucuoidanang.com/wp-content/uploads/2024/10/voan-che-dau-danh-cho-co-dau-mum-mim.webp",
  address: {
    number: "8",
    street: "30 Tháng 4",
    ward: "Hải Châu",
    fullAddress: "8 30 Tháng 4, Hải Châu"
  },
  hallCount: 2,
  images: [
    "https://phongsucuoidanang.com/wp-content/uploads/2024/09/nha-hang-tiec-cuoi-da-nang-minh-chau-viet.webp",
    "https://phongsucuoidanang.com/wp-content/uploads/2024/09/nha-hang-tiec-cuoi-da-nang-quang-dai-gold-anh-3.webp"
  ],
  amenities: ["Bãi đỗ xe", "Âm thanh ánh sáng", "Máy chiếu màn hình LED"],

  halls: [
    {
      id: 1,
      name: "Sảnh Hoa Hồng",
      description: "Gs a pool with a view. The air-conditioned villa features 1 bedroom and 1 bathroom with a shower and a hairdryer. Featuring a balcony with pool views, this villa also offers soundproof walls and a flat-screen TV with streaming services. The unit offers 2 beds.",
      capacity: 500,
      area: 600,
      price: 30000000,
      images: ["https://phongsucuoidanang.com/wp-content/uploads/2024/09/nha-hang-tiec-cuoi-da-nang-quang-dai-gold.webp", "https://phongsucuoidanang.com/wp-content/uploads/2024/10/voan-che-dau-danh-cho-co-dau-mum-mim.webp"]
    },
    {
      id: 2,
      name: "Sảnh Tulip",
      description: "Sảnh nhỏ 200 khách",
      capacity: 200,
      area: 250,
      price: 15000000,
      images: ["https://phongsucuoidanang.com/wp-content/uploads/2024/10/tiec-cuoi-hanh-phuc-ben-nguoi-than-gp-wedding.webp"]
    }
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
        },
        {
          name: "Tráng miệng",
          requiredQuantity: 1,
          dishes: [
            { id: 5, name: "Chè hạt sen long nhãn" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Menu Chay",
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
        },
        {
          name: "Tráng miệng",
          requiredQuantity: 1,
          dishes: [
            { id: 5, name: "Chè hạt sen long nhãn" }
          ]
        }
      ]
    }
  ],

  services: [
    { id: 1, name: "Trang trí hoa tươi", price: 5000000, unit: "gói" },
    { id: 2, name: "Ban nhạc sống", price: 8000000, unit: "buổi" },
    { id: 3, name: "MC chuyên nghiệp", price: 4000000, unit: "buổi" }
  ],

  promotions: [
    {
      id: 1,
      name: "Giảm 10% cho tiệc từ 30 bàn",
      description: "Ưu đãi mùa cưới",
      minTable: 30,
      discountType: "PERCENT",
      discountValue: 0.1,
      startDate: "2025-09-01",
      endDate: "2025-12-31"
    }
  ],

  reviews: [
    {
      id: 1,
      customerName: "Nguyễn Thị Thắm",
      rating: 4,
      comment: "Nhà hàng đẹp, phục vụ tận tình, món ăn ngon!",
      createdAt: "2025-09-20 12:30:00"
    },
    {
      id: 2,
      customerName: "Nguyễn Văn Tài",
      rating: 5,
      comment: "Thật sự là nhà hàng này quá ngon, rất tuyệt vời!",
      createdAt: "2025-09-21 12:30:00"
    },
    {
      id: 3,
      customerName: "Anh Mộ Xum Xuê",
      rating: 3,
      comment: "Alo Quảng Đại à, phải Quảng Đại đó không?",
      createdAt: "2025-09-30 12:30:00"
    }
  ]
};