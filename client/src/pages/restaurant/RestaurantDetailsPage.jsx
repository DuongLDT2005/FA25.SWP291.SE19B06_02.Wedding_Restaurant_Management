import React, { useState } from "react";
import { MapPin, Phone, Mail, Star, Heart } from "lucide-react";
import ImageCarousel from "../../components/ImageCarousel";
import "../../styles/RestaurantDetailsStyles.css";
import RatingStars from "../../components/RatingStars";
import CapacityRange from "../../components/CapacityRange";
import NavBar from "../../components/NavBar";
import { faBuildingColumns, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HallList from "./components/HallList";
import MenuList from "./components/MenuList";
import ServiceList from "./components/ServiceList";
import ReviewList from "./components/ReviewList";

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
          <h1 style={{ color: "#993344", fontWeight: "bold" }}>{restaurant.name}</h1>
          <p className="text-muted mb-1">
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
        <button className="btn btn-outline-danger">
          <Heart size={18} className="me-1" />
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
        <hr className="mt-4" />
        <HallList
          restaurant={{ ...restaurant, selectedHall }}
          onSelectHall={setSelectedHall}
        />

        <hr className="mt-4" />
        <MenuList restaurant={restaurant} />
        <hr className="mt-4" />
        <ServiceList restaurant={restaurant} />
        <hr className="mt-4" />
        <ReviewList reviews={restaurant.reviews} />
      </div>
    </div>
  );
}

// Mock data
// static sample data
export const restaurantDetail = {
  id: 1,
  name: "Nhà Hàng Tiệc Cưới Hoa Sen",
  description: "Tọa lạc trên mặt tiền đường 3 tháng 2 sầm uất, Capella Gallery Hall là một trong những trung tâm hội nghị tiệc cưới thuộc tập đoàn Capella Holding sở hữu diện tích lên đến 5.000 m2 và ngay trung tâm TP. HCM, thuận tiện cho việc di chuyển giữa các quận nội thành. Nhà hàng Capella Gallery Hall 3/2 là địa điểm cưới nổi bật với phong cách kiến trúc đương đại Đông Tây kết hợp và chất lượng dịch vụ đẳng cấp, tiện ích hiện đại theo tiêu chuẩn quốc tế cùng hệ thống sảnh tiệc đa dạng về quy mô và thiết kế. Việc tự thực hiện tất cả các khâu chuẩn bị cho một đám cưới hoàn chỉnh chưa bao giờ là chuyện dễ dàng đối với những ai đang chuẩn bị bước vào con đường hôn nhân. Chính vì lễ cưới không chỉ là một nghi thức diễn ra theo đúng trình tự, mà còn là cột mốc lưu giữ những kỉ niệm đáng nhớ của cô dâu chú rể trên hành trình yêu và cưới. Nên hầu hết các cặp thường dành nhiều thời gian cho việc tham khảo các địa điểm tổ chức đến tìm đơn vị cung cấp những dịch vụ cưới đi kèm phù hợp với sở thích và ngân sách như: Váy Cưới, Vest Chú Rể, Áo Dài, Makeup Artist,... để ngày trọng đại trọn vẹn nhất có thể.",
  thumbnailURL: "https://picsum.photos/seed/restaurant/600/400",
  address: {
    number: "123",
    street: "Nguyễn Văn Linh",
    ward: "Hải Châu",
    fullAddress: "123 Nguyễn Văn Linh, Hải Châu"
  },
  hallCount: 2,
  images: [
    "https://picsum.photos/seed/rs1/800/600",
    "https://picsum.photos/seed/rs2/800/600"
  ],
  amenities: ["Bãi đỗ xe", "Âm thanh ánh sáng", "Máy chiếu màn hình LED"],

  halls: [
    {
      id: 1,
      name: "Sảnh Hoa Hồng",
      description: "Guests will have a special experience as this villa provides a pool with a view. The air-conditioned villa features 1 bedroom and 1 bathroom with a shower and a hairdryer. Featuring a balcony with pool views, this villa also offers soundproof walls and a flat-screen TV with streaming services. The unit offers 2 beds.",
      capacity: 500,
      area: 600,
      price: 30000000,
      images: ["https://picsum.photos/seed/hall1/800/600", "https://citgroup.vn/wp-content/uploads/2021/08/vendor-la-gi-1.jpg"]
    },
    {
      id: 2,
      name: "Sảnh Tulip",
      description: "Sảnh nhỏ 200 khách",
      capacity: 200,
      area: 250,
      price: 15000000,
      images: ["https://citgroup.vn/wp-content/uploads/2021/08/vendor-la-gi-1.jpg"]
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
      customerName: "Nguyễn Thị A",
      rating: 4,
      comment: "Nhà hàng đẹp, phục vụ tận tình, món ăn ngon!",
      createdAt: "2025-09-20 12:30:00"
    }
  ]
};