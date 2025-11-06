import React, { useState } from "react";
import { MapPin, Phone, Mail, Star, Heart, MessageSquare } from "lucide-react";
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
// import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EventTypeList from "./components/EventTypeList";
import PromotionList from "./components/PromotionList";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { restaurantDetail } from "./share/RestaurantValue";

export default function RestaurantDetailsPage() {
  const restaurant = restaurantDetail;
  const resImages = [restaurant.thumbnailURL, ...restaurant.images.map(img => img.imageURL)];
  const [expanded, setExpanded] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [liked, setLiked] = useState(false);

  const totalReviews = restaurant.reviews.length;
  const avgRating = restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const maxLength = 350;
  const isLong = restaurant.description.length > maxLength;
  const displayText = expanded
    ? restaurant.description
    : restaurant.description.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <>
      <div className="container my-4">
        <NavBar />
        <section id="overview">
          {/* Tên & Địa chỉ */}
          <div
            className="p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start"
            style={{
              borderRadius: "12px",
              backgroundColor: "#fff",
              boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Thông tin nhà hàng */}
            <div style={{ flex: "1 1 70%", lineHeight: "1.8" }}>
              <h1
                style={{
                  color: "#993344",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  fontSize: "2rem",
                }}
              >
                {restaurant.name}
              </h1>

              <p className="text-muted mb-2 d-flex align-items-center">
                <MapPin size={20} className="me-2" />
                {restaurant.address.fullAddress}
              </p>

              <div className="d-flex align-items-center mb-2 text-warning">
                <RatingStars rating={avgRating} />
                <span className="text-muted ms-2" style={{ fontSize: "0.95rem" }}>
                  {avgRating.toFixed(1)} / 5 ({totalReviews} đánh giá)
                </span>
              </div>

              <div className="d-flex align-items-center flex-wrap mb-3">
                <CapacityRange halls={restaurant.halls} />
                <span className="mx-2">•</span>
                <span className="d-inline-flex align-items-center me-3">
                  <FontAwesomeIcon
                    icon={faBuildingColumns}
                    style={{ color: "#993344" }}
                    className="me-1"
                  />
                  {restaurant.hallCount} sảnh
                </span>
              </div>

              {/* Nút Gửi yêu cầu tư vấn nằm trong card, bên dưới thông tin */}
              <button
                className="d-flex align-items-center justify-content-center mt-2"
                style={{
                  borderRadius: "50px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: "bold",
                  backgroundColor: "#f4c430", // vàng đất
                  color: "#000",
                  border: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                }}
              >
                <MessageSquare size={18} className="me-2" /> Gửi yêu cầu tư vấn
              </button>
            </div>

            {/* Nút Lưu hình tròn, nằm bên phải thông tin, căn giữa theo chiều dọc */}
            <div className="d-flex align-items-start mt-3 mt-md-0 ms-md-3">
              <button
                onClick={() => setLiked(!liked)}
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  padding: 0,
                  border: "1.5px solid #b80926ff",
                  backgroundColor: "#fff",
                  color: "#b80926ff",
                  transition: "all 0.2s",
                }}
              >
                <Heart size={22} fill={liked ? "#b80926ff" : "none"} />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              {/* Gallery */}
              <ImageCarousel id="restaurantImages" images={resImages} />
            </div>
            <div className="col-md-4">
              <div className="card mb-4"
                style={{
                  boxShadow: "0 4px 6px rgba(0,0,0,0.25)",
                  border: "none"
                }}
              >
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
                        <span className="amenity-name" style={{ color: "#993344" }}>{amenity.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bản đồ */}
              <div className="card"
                style={{
                  boxShadow: "0 4px 6px rgba(0,0,0,0.25)",
                  border: "none"
                }}
              >
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
          <div className="row mt-4 mb-4">
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
          </div >
          <EventTypeList restaurant={restaurant} />
        </section>
        <hr className="mt-4" />
        <section id="promotions">
          <PromotionList restaurant={restaurant} />
        </section>
        <hr className="mt-4" />
        <section id="halls">
          <HallList
            restaurant={{ ...restaurant, selectedHall }}
            onSelectHall={setSelectedHall}
          />
        </section>
        <hr className="mt-4" />
        <section id="menus">
          <MenuList restaurant={restaurant} />
        </section>
        <hr className="mt-4" />
        <section id="services">
          <ServiceList restaurant={restaurant} />
        </section>
        <hr className="mt-4" />
        <section id="reviews">
          <ReviewList reviews={restaurant.reviews} />
        </section>
      </div>
      <ScrollToTopButton />
    </>
  );
}

// Mock data
// static sample data
