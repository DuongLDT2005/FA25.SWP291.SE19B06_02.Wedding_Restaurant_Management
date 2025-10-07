import React from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "../../../components/ImageCarousel";

export default function HallList({ restaurant, role = "CUSTOMER", onSelectHall }) {
  const handleBookingClick = (hall) => {
    // Lưu thông tin nhà hàng và sảnh đã chọn vào sessionStorage
    sessionStorage.setItem('selectedRestaurant', JSON.stringify({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address.fullAddress,
      halls: restaurant.halls,
      menus: restaurant.menus,
      services: restaurant.services,
      selectedHall: {
        hallId: hall.id,
        hallName: hall.name,
        capacity: hall.capacity,
        area: hall.area,
        price: hall.price,
        images: hall.images,
        description: hall.description
      }
    }));
  };

  return (
    <div>
      <h4 className="section-title">Danh sách sảnh</h4>

      {restaurant.halls.map((hall) => (
        <div key={hall.id} className="card mb-4 shadow-sm">
          <div className="row g-0 p-3">
            <div className="col-md-3 d-flex align-items-center">
              <img
                src={hall.images[0]}
                alt={hall.name}
                className="img-fluid rounded w-100"
                style={{ height: "180px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-9">
              <div className="card-body py-0">
                <h5
                  className="card-title"
                  style={{ color: "#993344", fontWeight: "bold", cursor: "pointer" }}
                  data-bs-toggle="modal"
                  data-bs-target="#hallModal"
                  onClick={() => onSelectHall(hall)}
                >
                  {hall.name}
                </h5>
                <p className="card-text mb-1">Diện tích: <strong>{hall.area} m²</strong></p>
                <p className="card-text mb-1">Sức chứa: <strong>{hall.capacity} khách</strong></p>
                <p className="card-text mb-1">Giá: <strong>{hall.price.toLocaleString()} VND</strong></p>
              </div>

              <div className="card-footer bg-transparent border-0 text-end">
                {role === "CUSTOMER" && (
                  <Link 
                    to="/restaurant/booking"
                    className="requestBtn"
                    onClick={() => handleBookingClick(hall)}
                    style={{
                      backgroundColor: '#993344',
                      color: '#fefaf9',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#7a2a2a';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#993344';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Gửi yêu cầu đặt chỗ
                  </Link>
                )}
                {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-primary">Sửa sảnh</button>
                    <button className="btn btn-outline-danger">Xóa sảnh</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal ảnh sảnh */}
      <div
        className="modal fade"
        id="hallModal"
        tabIndex="-1"
        aria-labelledby="hallModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="hallModalLabel">
                {restaurant.selectedHall?.name}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body px-4">
              {restaurant.selectedHall && (
                <div className="row">
                  <div className="col-md-6">
                    <ImageCarousel
                      id={`hallCarousel-${restaurant.selectedHall.id}`}
                      images={restaurant.selectedHall.images}
                    />
                  </div>
                  <div className="col-md-6">
                    <p style={{ textAlign: "justify" }}>
                      {restaurant.selectedHall.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}