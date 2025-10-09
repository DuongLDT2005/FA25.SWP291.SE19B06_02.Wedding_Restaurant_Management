import React from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "../../../components/ImageCarousel";
export default function HallList({ restaurant, role = "CUSTOMER", onSelectHall }) {
  // NEW: map tên category -> code BookingForm dùng
  const CATEGORY_NAME_MAP = {
    "Món khai vị": "APPETIZER",
    "Khai vị": "APPETIZER",
    "Món chính": "MAIN",
    "Tráng miệng": "DESSERT"
  };

  // NEW: chuyển menus có cấu trúc categories -> menus.dishes phẳng
  function normalizeMenus(menus = []) {
    return menus.map(m => {
      if (m.categories && Array.isArray(m.categories)) {
        const dishes = m.categories.flatMap(cat =>
          (cat.dishes || []).map(d => ({
            id: String(d.id),
            name: d.name,
            category: CATEGORY_NAME_MAP[cat.name] || "MAIN"
          }))
        );
        return {
          id: m.id,
            name: m.name,
            price: m.price,
            dishes
        };
      }
      // đã đúng định dạng
      return m;
    });
  }

  // NEW: chuẩn hoá services từ DB (serviceID,eventTypeID,name,price,unit,status)
  function normalizeServices(services = []) {
    return services
      .filter(s => s && (s.status === 1 || s.status === true || s.status === undefined)) // chỉ lấy ACTIVE (status=1) hoặc nếu không có status thì giữ
      .map(s => ({
        // BookingForm hiện dùng field 'code' & 'label' để hiển thị và lưu; vẫn giữ thêm thông tin khác
        code: String(s.serviceID ?? s.id ?? s.code),
        label: s.name || s.label || 'Dịch vụ',
        price: s.price ?? 0,
        unit: s.unit || '',
        eventTypeID: s.eventTypeID ?? null,
        rawStatus: s.status,
        _original: s
      }));
  }

  const handleBookingClick = (hall) => {
    const fullData = {
      ...restaurant,
      selectedHall: hall,
      // giữ both: menus gốc + menusNormalized để BookingForm dùng
      menusOriginal: restaurant.menus,
      menus: normalizeMenus(restaurant.menus),
      servicesOriginal: restaurant.services || [],
      services: normalizeServices(restaurant.services || []),
      addressString: restaurant.address?.fullAddress || restaurant.address
    };
    sessionStorage.setItem("selectedRestaurant", JSON.stringify(fullData));
    sessionStorage.setItem("selectedHallId", String(hall.id));
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
                    to="/bookingForm"
                    className="btn btn-primary theme-btn-primary px-3 py-2 fw-semibold"
                    onClick={() => handleBookingClick(hall)}
                  >Gửi yêu cầu đặt chỗ</Link>
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