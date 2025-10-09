import React, { useState } from "react";
import { MapPin, Phone, Mail, Star, Heart, MessageSquare } from "lucide-react";
import ImageCarousel from "../../components/ImageCarousel";
import "../../styles/RestaurantDetailsStyles.css";
import RatingStars from "../../components/RatingStars";
import CapacityRange from "../../components/CapacityRange";
import NavBar from "../../components/RestaurantNavBar.jsx";
import { faBuildingColumns, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HallList from "./components/HallList";
import MenuList from "./components/MenuList";
import ServiceList from "./components/ServiceList";
import ReviewList from "./components/ReviewList";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EventTypeList from "./components/EventTypeList";
import PromotionList from "./components/PromotionList";
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
      <Header />
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
                        <span className="text-dark">{amenity.name}</span>
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
      <Footer />
    </>
  );
}

export const restaurantDetail = {
  id: 1, // restaurantID
  restaurantPartnerID: 1,
  name: "Nhà Hàng Tiệc Cưới Hoa Sen",
  description: "Nhà Hàng Tiệc Cưới Hoa Sen tọa lạc trên mặt tiền đường 3 Tháng 2 sầm uất, trung tâm TP. HCM, là địa điểm lý tưởng cho các sự kiện và tiệc cưới sang trọng. Với diện tích lên đến 5.000 m2, nhà hàng sở hữu nhiều sảnh lớn nhỏ phù hợp với các quy mô tiệc khác nhau: Sảnh Hoa Hồng rộng 500 khách, nội thất hiện đại; Sảnh Tulip ấm cúng với sức chứa 200 khách. Thực đơn đa dạng, phong phú với các món khai vị, món chính và tráng miệng được chế biến bởi đội ngũ đầu bếp chuyên nghiệp, đảm bảo hương vị tinh tế và trình bày đẹp mắt. Nhà hàng cung cấp đầy đủ các tiện ích hiện đại như bãi đỗ xe rộng rãi, hệ thống âm thanh ánh sáng cao cấp, máy chiếu màn hình LED, cùng dịch vụ trang trí, ban nhạc sống, MC chuyên nghiệp để biến mọi sự kiện trở nên hoàn hảo. Với đội ngũ nhân viên tận tình và chuyên nghiệp, Nhà Hàng Tiệc Cưới Hoa Sen cam kết mang đến trải nghiệm tiệc cưới và sự kiện đáng nhớ cho khách hàng.",
  hallCount: 2,
  address: {
    addressID: 1,
    number: "123",
    street: "Nguyễn Văn Linh",
    ward: "Hải Châu",
    fullAddress: "123 Nguyễn Văn Linh, Hải Châu"
  },
  thumbnailURL: "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/463825213_1023607009564051_740775010435508594_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHuPANdVSq7fR-8N3LTrYLQJJ8Ov0H9l4kknw6_Qf2Xid6r0nfMA_OWkZpBYRpQt-bQPF6eDMNJ1t2j9Rkvebxa&_nc_ohc=dIvPHPrbQiIQ7kNvwGg-TMG&_nc_oc=AdnlfPDW5QfU3wVUVrXBT27EGbASb_jJi__nAlKyXjiV8hx2A4xG9fwkoAQpQniuIyE36taFXMfdUmJ1CY6KBcwm&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=53fOIGuKKzTK8_h1UEfo0g&oh=00_AffH_VKPJkJdKLVCGrPgxultCz0ai5vQJcw0hHEVT7vGKQ&oe=68EC3700",
  avgRating: 4.5,
  totalReviews: 10,
  status: 1, // ACTIVE
  images: [
    { imageID: 1, imageURL: "https://diamondplace.vn/wp-content/uploads/2022/07/LONG1702-min.jpg" },
    { imageID: 2, imageURL: "https://huongpho.com.vn/wp-content/uploads/2018/03/RUBY.jpg" },
    { imageID: 3, imageURL: "https://admin.theadora.vn/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk4MCwicHVyIjoiYmxvYl9pZCJ9fQ==--c1e648b98ef923e4de6bae39066c810e461f2d46/the-adora-dynasty%20(2).jpg" },
  ],
  amenities: [
    { amenityID: 1, name: "Bãi đỗ xe", status: 1 },
    { amenityID: 2, name: "Âm thanh ánh sáng", status: 1 },
    { amenityID: 3, name: "Máy chiếu màn hình LED", status: 1 }
  ],

  halls: [
    {
      id: 1, // hallID
      name: "Sảnh Hoa Hồng",
      description: "Sảnh rộng 500 khách, nội thất hiện đại, thích hợp tiệc cưới sang trọng.",
      capacity: 500,
      area: 600,
      price: 30000000,
      status: 1,
      images: [
        { imageID: 1, imageURL: "https://nhuminhplazahotel.com/wp-content/uploads/2024/07/bang-gia-nha-hang-tiec-cuoi5.jpg" },
        { imageID: 2, imageURL: "https://mgs-storage.sgp1.digitaloceanspaces.com/satellite/50522f6c-9942-4cfb-8ccd-b6efc45eed72" }
      ]
    },
    {
      id: 2,
      name: "Sảnh Tulip",
      description: "Sảnh nhỏ 200 khách, thích hợp tiệc ấm cúng.",
      capacity: 200,
      area: 250,
      price: 15000000,
      status: 1,
      images: [
        { imageID: 3, imageURL: "https://mgs-storage.sgp1.digitaloceanspaces.com/satellite/50522f6c-9942-4cfb-8ccd-b6efc45eed72" }
      ]
    }
  ],

  menus: [
    {
      id: 1, // menuID
      name: "Menu Truyền Thống",
      price: 3500000,
      imageURL: "https://file.hstatic.net/200000944907/file/menu_lunch_resize_web_5_5e7ac9c611aa4bc190f3e8f0a285fe93_master.jpg",
      status: 1,
      categories: [
        {
          categoryID: 1,
          name: "Món khai vị",
          requiredQuantity: 2,
          status: 1,
          dishes: [
            { dishID: 1, name: "Salad rau củ", status: 1, imageURL: "https://cookingwithayeh.com/wp-content/uploads/2023/11/Healthy-Caesar-Salad-Without-Anchovies-SQ-5.jpg" },
            { dishID: 2, name: "Súp hải sản", status: 1, imageURL: "https://i.ytimg.com/vi/bkdzyAHyxtc/hq720.jpg" },
            { dishID: 3, name: "Pad thái", status: 1, imageURL: "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/178275/Originals/Pad-Thai-1.jpg" }
          ]
        },
        {
          categoryID: 2,
          name: "Món chính",
          requiredQuantity: 3,
          status: 1,
          dishes: [
            { dishID: 4, name: "Gà quay mật ong", status: 1, imageURL: "https://file.hstatic.net/200000700229/article/lam-dui-ga-nuong-mat-ong-bang-lo-nuong-1_e17f9ace600a40018ed4fd25b8d1f30f.jpg" },
            { dishID: 5, name: "Bò sốt tiêu đen", status: 1, imageURL: "https://i.pinimg.com/1200x/82/2b/6f/822b6f17349bc8a626dd6de9169122ea.jpg" },
            { dishID: 6, name: "Tôm hùm nướng bơ tỏi", status: 1, imageURL: "https://beachgirlgrills.com/wp-content/uploads/IMG_6686-1.jpg" },
            { dishID: 7, name: "Cá hồi sốt cam", status: 1, imageURL: "https://hips.hearstapps.com/hmg-prod/images/baked-salmon-index-650b19174ffc1.jpg" },
            { dishID: 8, name: "Đuôi bò hầm tiêu đen Nigeria", status: 1, imageURL: "https://i.ytimg.com/vi/W0Qit8PfPpQ/maxresdefault.jpg" },
            { dishID: 9, name: "Tôm nhật hấp bia", status: 1, imageURL: "https://shiros.com/wp-content/uploads/2020/08/amaebi_ht.jpg" },
          ]
        },
        {
          categoryID: 3,
          name: "Tráng miệng",
          requiredQuantity: 1,
          status: 1,
          dishes: [
            { dishID: 5, name: "Trái cây tổng hợp", status: 1, imageURL: "https://www.healthyfood.com/wp-content/uploads/2024/11/Dessert-platter.jpg" },
            { dishID: 5, name: "Tiramisu", status: 1, imageURL: "https://atavolagastronomia.com/wp-content/uploads/tiramisu-4583.jpg" }
          ]
        }
      ]
    }
  ],

  services: [
    // Tiệc cưới
    { id: 1, name: "Trang trí hoa tươi", price: 5000000, unit: "gói", status: 1, eventTypeID: 1 },
    { id: 2, name: "Ban nhạc sống", price: 8000000, unit: "buổi", status: 1, eventTypeID: 1 },
    { id: 3, name: "MC chuyên nghiệp", price: 4000000, unit: "buổi", status: 1, eventTypeID: 1 },
    { id: 4, name: "Nến và ánh sáng decor", price: 2000000, unit: "bộ", status: 1, eventTypeID: 1 },

    // Hội nghị
    { id: 5, name: "Cho thuê máy chiếu", price: 1000000, unit: "buổi", status: 1, eventTypeID: 2 },
    { id: 6, name: "Âm thanh hội nghị", price: 3000000, unit: "buổi", status: 1, eventTypeID: 2 },
    { id: 7, name: "Bàn ghế hội nghị", price: 500000, unit: "bộ", status: 1, eventTypeID: 2 },

    // Sinh nhật
    { id: 8, name: "Bánh kem", price: 1500000, unit: "cái", status: 1, eventTypeID: 3 },
    { id: 9, name: "Trang trí bong bóng", price: 1200000, unit: "set", status: 1, eventTypeID: 3 },
    { id: 10, name: "MC hoạt náo", price: 2500000, unit: "buổi", status: 1, eventTypeID: 3 }
  ],

  promotions: [
    {
      id: 1, // promotionID
      name: "Giảm 10% cho tiệc từ 30 bàn",
      description: "Ưu đãi mùa cưới",
      minTable: 30,
      discountType: 0, // 0: PERCENT, 1: FREE
      discountValue: 0.1,
      startDate: "2025-09-01",
      endDate: "2025-12-31",
      status: 1
    }
  ],

  reviews: [
    {
      id: 1, // reviewID
      customerID: 1,
      customerName: "Nguyễn Văn A",
      rating: 4,
      comment: "Nhà hàng đẹp, phục vụ tận tình, món ăn ngon!",
      createdAt: "2025-09-20 12:30:00"
    },
    {
      id: 2, // reviewID
      customerID: 2,
      customerName: "Lê Thị B",
      rating: 5,
      comment: "Nhà hàng đẹp, phục vụ tận tình, món ăn ngon!",
      createdAt: "2025-09-30 15:30:00"
    }
  ]
};