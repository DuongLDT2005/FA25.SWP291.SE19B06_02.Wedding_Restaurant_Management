import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/ContractForm.css";

import { EVENT_TYPE_MAP } from "../restaurant/share/RestaurantValue";

export default function BookingForm() {
  const navigate = useNavigate();

  const [selectedRestaurant, setSelectedRestaurant] = useState(
    JSON.parse(localStorage.getItem("selectedRestaurant")) || null
  );
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    eventDate: "",
    eventTime: "",
    hall: "",
    eventType: "",
    numGuests: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [menus, setMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [showMenuPopup, setShowMenuPopup] = useState(false);

  // Lấy data mock nhà hàng (nếu chưa có)
  useEffect(() => {
    if (!selectedRestaurant) {
      const mockRestaurant = {
        id: 1,
        name: "Nhà hàng Minh Châu",
        halls: [
          { id: 1, name: "Sảnh A", capacity: 200 },
          { id: 2, name: "Sảnh B", capacity: 300 },
        ],
        menus: [
          { id: 1, name: "Thực đơn 1", price: 500000 },
          { id: 2, name: "Thực đơn 2", price: 600000 },
          { id: 3, name: "Thực đơn 3", price: 700000 },
        ],
      };
      setSelectedRestaurant(mockRestaurant);
      localStorage.setItem("selectedRestaurant", JSON.stringify(mockRestaurant));
    } else {
      setMenus(selectedRestaurant.menus);
    }
  }, [selectedRestaurant]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMenuSelect = (menu) => {
    if (selectedMenus.find((m) => m.id === menu.id)) {
      setSelectedMenus(selectedMenus.filter((m) => m.id !== menu.id));
    } else {
      setSelectedMenus([...selectedMenus, menu]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.eventDate) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    console.log("Dữ liệu đặt chỗ:", formData, selectedMenus);
    navigate("/customer/bookingConfirm", {
      state: { formData, selectedMenus, selectedRestaurant },
    });
  };

  const totalPrice =
    selectedMenus.reduce((sum, m) => sum + m.price, 0) * (formData.numGuests || 1);

  return (
    <>
      <Header />

      <div className="booking-container container mt-4">
        <h2 className="mb-3 text-center">Đặt tiệc tại {selectedRestaurant?.name}</h2>

        <div className="booking-form-wrapper p-4 shadow rounded bg-white">
          <form onSubmit={handleSubmit}>
            {/* Thông tin khách hàng */}
            <div className="mb-3">
              <label>Họ tên*</label>
              <input
                type="text"
                name="customerName"
                className="form-control"
                value={formData.customerName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Số điện thoại*</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Thông tin sự kiện */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Ngày tổ chức*</label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-control"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Giờ tổ chức</label>
                <input
                  type="time"
                  name="eventTime"
                  className="form-control"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Sảnh tiệc</label>
                <select
                  name="hall"
                  className="form-select"
                  value={formData.hall}
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn sảnh --</option>
                  {selectedRestaurant?.halls?.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} (tối đa {h.capacity} khách)
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Loại tiệc</label>
                <select
                  name="eventType"
                  className="form-select"
                  value={formData.eventType}
                  onChange={handleInputChange}
                >
                  <option value="">-- Chọn loại tiệc --</option>
                  {Object.entries(EVENT_TYPE_MAP).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label>Số lượng khách</label>
              <input
                type="number"
                name="numGuests"
                className="form-control"
                min="1"
                value={formData.numGuests}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label>Ghi chú</label>
              <textarea
                name="notes"
                className="form-control"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {/* Menu */}
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setShowMenuPopup(true)}
              >
                Chọn thực đơn
              </button>
            </div>

            {/* Tổng cộng */}
            {selectedMenus.length > 0 && (
              <div className="summary border p-3 rounded bg-light">
                <h5>Tổng cộng:</h5>
                <ul>
                  {selectedMenus.map((menu) => (
                    <li key={menu.id}>
                      {menu.name} - {menu.price.toLocaleString()}₫
                    </li>
                  ))}
                </ul>
                <p className="fw-bold">
                  Tổng: {totalPrice.toLocaleString()}₫
                </p>
              </div>
            )}

            {error && <p className="text-danger mt-2">{error}</p>}

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success px-5">
                Gửi yêu cầu đặt chỗ
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* POPUP CHỌN MÓN */}
      {showMenuPopup && (
        <div className="menu-popup-overlay">
          <div className="menu-popup bg-white p-4 rounded shadow">
            <h4>Chọn thực đơn</h4>
            <ul className="list-group mb-3">
              {menus.map((menu) => (
                <li
                  key={menu.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    selectedMenus.find((m) => m.id === menu.id)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleMenuSelect(menu)}
                  style={{ cursor: "pointer" }}
                >
                  {menu.name}
                  <span>{menu.price.toLocaleString()}₫</span>
                </li>
              ))}
            </ul>
            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowMenuPopup(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}