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
  const [isFavorite, setIsFavorite] = useState(false);

  const totalReviews = restaurant.reviews.length;
  const avgRating = restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const maxLength = 250;
  const isLong = restaurant.description.length > maxLength;
  const displayText = expanded
    ? restaurant.description
    : restaurant.description.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #fef3f4 0%, #ffffff 50%, #fff5f7 100%)", 
      minHeight: "100vh",
      paddingBottom: "40px"
    }}>
      <div className="container my-4">
        <NavBar />
        
        {/* Hero Header Section */}
        <div style={{
          background: "linear-gradient(135deg, #991b3a 0%, #cc2952 100%)",
          borderRadius: "24px",
          padding: "48px",
          marginTop: "32px",
          boxShadow: "0 20px 60px rgba(153, 52, 68, 0.15)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative circles */}
          <div style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "240px",
            height: "240px",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
            filter: "blur(50px)"
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-40px",
            left: "-40px",
            width: "180px",
            height: "180px",
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: "50%",
            filter: "blur(40px)"
          }}></div>

          <div className="d-flex justify-content-between align-items-start" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: "inline-block", 
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                padding: "8px 20px",
                borderRadius: "24px",
                marginBottom: "20px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}>
                ⭐ Premium Venue
              </div>
              
              <h1 style={{ 
                color: "#ffffff", 
                fontWeight: "800",
                fontSize: "48px",
                marginBottom: "20px",
                textShadow: "0 4px 20px rgba(0,0,0,0.15)",
                letterSpacing: "-0.5px"
              }}>
                {restaurant.name}
              </h1>
              
              <p style={{ 
                color: "rgba(255, 255, 255, 0.95)", 
                marginBottom: "16px", 
                fontSize: "17px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <MapPin size={20} />
                {restaurant.address.fullAddress}
              </p>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "20px", 
                flexWrap: "wrap",
                marginTop: "20px"
              }}>
                <div style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <RatingStars rating={avgRating} />
                  <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>
                    {avgRating.toFixed(1)} / 5
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "15px" }}>
                    ({totalReviews} đánh giá)
                  </span>
                </div>
                
                <div style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "15px",
                  fontWeight: "600"
                }}>
                  <CapacityRange halls={restaurant.halls} />
                  <span style={{ opacity: 0.6 }}>•</span>
                  <span className="d-inline-flex align-items-center">
                    <FontAwesomeIcon icon={faBuildingColumns} className="me-2" />
                    {restaurant.hallCount} sảnh
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              style={{
                background: isFavorite ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "15px",
                boxShadow: isFavorite ? "0 8px 20px rgba(0,0,0,0.15)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isFavorite ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isFavorite ? "0 8px 20px rgba(0,0,0,0.15)" : "none";
              }}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? "#fff" : "none"}
                strokeWidth={2.5}
              />
              {isFavorite ? "Đã lưu" : "Lưu vào danh sách"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="row" style={{ marginTop: "32px" }}>
          <div className="col-md-8">
            {/* Gallery */}
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              marginBottom: "28px",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
              <ImageCarousel id="restaurantImages" images={resImages} />
            </div>

            {/* Giới thiệu */}
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "36px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)",
              marginBottom: "28px"
            }}>
              <h4 style={{ 
                color: "#993344", 
                fontWeight: "700",
                fontSize: "28px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{
                  width: "6px",
                  height: "32px",
                  background: "linear-gradient(135deg, #991b3a 0%, #cc2952 100%)",
                  borderRadius: "3px",
                  marginRight: "14px"
                }}></span>
                Giới thiệu
              </h4>
              <p style={{ 
                color: "#4a5568",
                lineHeight: "1.8",
                fontSize: "16px",
                marginBottom: "20px"
              }}>
                {displayText}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  style={{
                    background: "linear-gradient(135deg, #991b3a 0%, #cc2952 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "15px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(153, 52, 68, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              )}
            </div>
          </div>

          <div className="col-md-4">
            {/* Tiện ích Card */}
            <div style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fef5f7 100%)",
              borderRadius: "24px",
              padding: "32px",
              marginBottom: "28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
              <h5 style={{
                color: "#993344",
                fontWeight: "700",
                fontSize: "22px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{
                  width: "5px",
                  height: "24px",
                  background: "linear-gradient(135deg, #991b3a 0%, #cc2952 100%)",
                  borderRadius: "3px",
                  marginRight: "12px"
                }}></span>
                Tiện ích nổi bật
              </h5>
              <ul className="list-unstyled mb-0">
                {restaurant.amenities.map((amenity, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                      padding: "12px",
                      borderRadius: "14px",
                      transition: "all 0.3s ease",
                      cursor: "default"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(153, 52, 68, 0.06)";
                      e.currentTarget.style.transform = "translateX(6px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={{ 
                        color: "#993344",
                        fontSize: "20px",
                        marginRight: "14px"
                      }}
                    />
                    <span style={{ 
                      color: "#2d3748", 
                      fontSize: "15px",
                      fontWeight: "500"
                    }}>
                      {amenity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bản đồ */}
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
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

        {/* Sections */}
        <div className="row mt-4">
          <div className="col-12">
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "36px",
              marginBottom: "28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
              <HallList
                restaurant={{ ...restaurant, selectedHall }}
                onSelectHall={setSelectedHall}
              />
            </div>

            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "36px",
              marginBottom: "28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
              <MenuList restaurant={restaurant} />
            </div>

            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "36px",
              marginBottom: "28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
              <ServiceList restaurant={restaurant} />
            </div>

            <div style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "36px",
              marginBottom: "40px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              border: "1px solid rgba(153, 52, 68, 0.08)"
            }}>
              <ReviewList reviews={restaurant.reviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data
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