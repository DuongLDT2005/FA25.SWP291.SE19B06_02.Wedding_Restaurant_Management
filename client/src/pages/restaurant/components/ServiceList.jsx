// File: ServiceList.jsx
import React from "react";

const ServiceList = ({ restaurant, role = "CUSTOMER" }) => {
  return (
    <div>
      <h4 className="section-title mb-3">Dịch vụ</h4>
      <div className="row">
        {restaurant.services?.map((service) => (
          <div key={service.serviceID} className="col-md-3 mb-3">
            <div
              className="card text-white h-100"
              style={{
                backgroundColor: "#993344",
                borderRadius: "12px",
                position: "relative",
              }}
            >
              <div className="card-body text-center p-3">
                <h6 className="card-title fw-bold mb-3">{service.name}</h6>
                <p className="mb-0">
                  <small>
                    Giá: <strong>{parseFloat(service.price).toLocaleString()} VND/ {service.unit ?? "-"}</strong>
                  </small>
                </p>
              </div>

              {/* Owner/Admin controls */}
              {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
                <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-2">
                  <button className="btn btn-sm btn-outline-primary">Sửa</button>
                  <button className="btn btn-sm btn-outline-danger">Xóa</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Nút thêm dịch vụ mới */}
        {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
          <div className="col-md-3 mb-3">
            <button
              className="btn btn-lg btn-success w-100 h-100"
              // bạn có thể gắn data-bs-toggle/modal ở đây nếu muốn modal thêm mới
            >
              + Thêm dịch vụ mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;