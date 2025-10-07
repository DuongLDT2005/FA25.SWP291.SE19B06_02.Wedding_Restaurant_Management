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
import { restaurantDetail } from "./share/RestaurantValue";
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
