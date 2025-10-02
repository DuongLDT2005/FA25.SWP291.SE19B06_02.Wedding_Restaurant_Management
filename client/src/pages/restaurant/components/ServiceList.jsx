import React, { useState } from "react";

// Component hiển thị danh sách service trong package
const ServiceTable = ({ services, role }) => {
  if (!services || services.length === 0) {
    return <p className="text-muted">Chưa có dịch vụ trong gói này</p>;
  }

  return (
    <table className="table table-bordered table-striped align-middle">
      <thead style={{ backgroundColor: "#993344", color: "white" }}>
        <tr>
          <th>Tên dịch vụ</th>
          <th>Giá</th>
          <th>Đơn vị</th>
          {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && <th>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.serviceID}>
            <td>{service.name}</td>
            <td>{parseFloat(service.price).toLocaleString()} VND</td>
            <td>{service.unit ?? "-"}</td>
            {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
              <td>
                <button className="btn btn-sm btn-outline-primary me-2">Sửa</button>
                <button className="btn btn-sm btn-outline-danger">Xóa</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Component chính
const ServiceList = ({ restaurant, role = "CUSTOMER" }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div>
      <h4 className="section-title mb-3">Gói dịch vụ</h4>

      {/* Nếu chưa chọn package thì hiện list */}
      {!selectedPackage && (
        <div className="row">
          {restaurant.servicePackages?.map((pkg) => (
            <div
              key={pkg.packageID}
              className="col-md-3 mb-3"
              onClick={() => setSelectedPackage(pkg)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="card text-white h-100"
                style={{
                  backgroundColor: "#993344",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="card-body text-center p-3">
                  <h6 className="fw-bold mb-2">{pkg.name}</h6>
                </div>
              </div>
            </div>
          ))}

          {/* Nút thêm package mới */}
          {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
            <div className="col-md-4 mb-3">
              <button className="btn btn-lg btn-success w-100 h-100">
                + Thêm gói mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* Khi đã chọn package */}
      {selectedPackage && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold" style={{ color: "#993344" }}>
              {selectedPackage.name}
            </h5>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSelectedPackage(null)}
            >
              ← Quay lại danh sách gói
            </button>
          </div>

          {/* Bảng dịch vụ */}
          <ServiceTable services={selectedPackage.services} role={role} />

          {/* Nút thêm dịch vụ mới */}
          {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
            <button className="btn btn-success mt-2">+ Thêm dịch vụ mới</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceList;