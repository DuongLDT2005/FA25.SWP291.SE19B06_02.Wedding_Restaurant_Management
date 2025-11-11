import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Star, Heart, MapPin, CircleDollarSign, Gem } from "lucide-react";
import RatingStars from "../../components/RatingStars";
import { formatFullCurrency } from "../../utils/formatter";
import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
    return (
        <Card
            className="border-0 shadow-sm rounded-3 d-flex flex-column"
            style={{ overflow: "hidden", height: "99%" }}
        >
            <Card.Img
                src={restaurant.thumbnailURL}
                alt={restaurant.name}
                style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                    borderBottomLeftRadius: "0",
                    borderBottomRightRadius: "0"
                }}
                className="restaurant-img"
            />

            <Card.Body className="px-3">
                <Card.Title className="fw-bold fs-5 mb-2">
                    <Link
                        to={`/restaurants/${restaurant.restaurantID}`}
                        className="text-dark text-decoration-none"
                    >
                        {restaurant.name}
                    </Link>
                </Card.Title>

                {/* Rating */}
                <div className="d-flex align-items-center mb-1">
                    <RatingStars rating={restaurant.avgRating} />
                    <span className="small fw-semibold text-secondary">
                        {restaurant.avgRating} ({restaurant.totalReviews})
                    </span>
                </div>

                {/* Address */}
                <div className="d-flex align-items-start gap-2 mb-2">
                    <MapPin size={16} className="flex-shrink-0 mt-1" />
                    <p className="text-muted small mb-0">
                        {restaurant.fullAddress}
                    </p>
                </div>
                {/* <Row className="justify-content-between">
                                        <Col xs="auto" className="d-flex align-items-center gap-2 mb-2">
                                            <Users size={16} color="#e11d48" />
                                            <p className="small mb-0">
                                                {restaurant.minCapacity} - {restaurant.maxCapacity} bàn
                                            </p>
                                        </Col>

                                        <Col xs="auto" className="d-flex align-items-center gap-2 mb-2">
                                            <Landmark size={16} color="#e11d48" />
                                            <p className="small mb-0">{restaurant.hallCount} sảnh</p>
                                        </Col>
                                    </Row> */}

                {/* ✅ Promotion nổi bật */}
                {restaurant.bestPromotion && (
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span
                            className="px-2 py-1 small fw-semibold d-flex align-items-center"
                            style={{
                                background: "linear-gradient(90deg, #f43f5e, #f87171)", // gradient đỏ – hồng
                                color: "white",
                                borderRadius: "6px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                            }}
                            title={restaurant.bestPromotion} // hiển thị full text khi hover
                        >
                            <Gem size={16} color="white" className="me-1" />
                            {restaurant.bestPromotion}
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="d-flex align-items-center gap-1 mb-2">
                    <CircleDollarSign size={16} color="#e11d48" />
                    <p className="mb-0 small text-secondary">
                        Giá chỉ từ{" "}
                        <span className="fw-semibold" style={{ color: "#e11d48" }}>
                            {formatFullCurrency(restaurant.priceFrom)}
                        </span>
                    </p>
                </div>
            </Card.Body>

            {/* Hover effect */}
            <style>{`
        .restaurant-img:hover {
          transform: scale(1.1);
        }
      `}</style>
        </Card>
    );
}