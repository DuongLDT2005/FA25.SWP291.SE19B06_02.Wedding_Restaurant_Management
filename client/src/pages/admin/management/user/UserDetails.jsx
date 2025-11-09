import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import mock, { usersMock } from "../../../../mock/partnerMock";
import { Tabs, Tab } from "react-bootstrap";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const foundUser = usersMock.find((u) => u.userID === Number(id));
    setUser(foundUser);
  }, [id]);

  if (!user) {
    return (
      <AdminLayout title="Chi tiết người dùng">
        <div className="container py-4 text-center text-muted">
          Không tìm thấy người dùng.
        </div>
      </AdminLayout>
    );
  }

  const getRoleName = (role) =>
    role === 0 ? "Khách hàng" : role === 1 ? "Đối tác" : "Admin";

  const customerBookings = mock.bookings.filter(
    (b) => b.customerID === user.userID
  );
  const partnerRestaurants = mock.restaurants.filter(
    (r) => r.restaurantPartnerID === user.userID
  );

  return (
    <AdminLayout title="Chi tiết người dùng">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate("/admin/users")}
          >
            ← Quay lại danh sách
          </button>
          <h4 className="mb-0">{user.fullName}</h4>
        </div>

        <div className="row g-4">
          {/* LEFT: Info card */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <img
                  src={user.avatarURL}
                  alt={user.fullName}
                  className="rounded-circle mb-3 shadow-sm"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
                <h5 className="fw-semibold mb-0">{user.fullName}</h5>
                <p className="text-muted small">{user.email}</p>
                <span
                  className={`badge ${
                    user.status === 1 ? "bg-success" : "bg-danger"
                  }`}
                >
                  {user.status === 1 ? "Hoạt động" : "Bị khóa"}
                </span>

                <hr />
                <p className="mb-1">
                  <strong>Vai trò:</strong> {getRoleName(user.role)}
                </p>
                <p className="mb-1">
                  <strong>SĐT:</strong> {user.phone || "-"}
                </p>
                <p className="mb-1">
                  <strong>Tham gia:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Tabs */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  id="user-detail-tabs"
                  className="mb-3"
                >
                  <Tab eventKey="profile" title="Thông tin cá nhân">
                    <div>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {user.phone}
                      </p>
                      <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </Tab>

                  {/* CUSTOMER TAB */}
                  {user.role === 0 && (
                    <Tab eventKey="bookings" title="Lịch sử đặt nhà hàng">
                      {customerBookings.length === 0 ? (
                        <p className="text-muted">Chưa có đơn đặt nào.</p>
                      ) : (
                        <div className="list-group">
                          {customerBookings.map((b) => (
                            <div
                              key={b.bookingID}
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                // ✅ Lưu booking hiện tại vào sessionStorage
                                sessionStorage.setItem(
                                  `booking_${b.bookingID}`,
                                  JSON.stringify(b)
                                );
                                // ✅ Chuyển sang trang chi tiết booking admin
                                navigate(`/admin/bookings/${b.bookingID}`);
                              }}
                            >
                              <div>
                                <strong>Đặt bàn #{b.bookingID}</strong>
                                <p className="mb-0 text-muted small">
                                  Ngày:{" "}
                                  {new Date(b.eventDate).toLocaleDateString(
                                    "vi-VN"
                                  )}{" "}
                                  • {b.tableCount} bàn
                                </p>
                              </div>
                              <span className="fw-bold text-success">
                                ₫
                                {(b.totalAmount || b.price || 0).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Tab>
                  )}

                  {/* PARTNER TAB */}
                  {user.role === 1 && (
                    <Tab eventKey="restaurants" title="Nhà hàng trực thuộc">
                      {partnerRestaurants.length === 0 ? (
                        <p className="text-muted">Chưa có nhà hàng nào.</p>
                      ) : (
                        <div className="row g-3">
                          {partnerRestaurants.map((r) => (
                            <div className="col-md-6" key={r.restaurantID}>
                              <div className="card h-100 border-0 shadow-sm">
                                <img
                                  src={r.thumbnailURL}
                                  alt={r.name}
                                  className="card-img-top"
                                  style={{
                                    height: "160px",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "0.5rem",
                                    borderTopRightRadius: "0.5rem",
                                  }}
                                />
                                <div className="card-body">
                                  <h6 className="fw-semibold mb-1">
                                    <Link
                                      to={`/admin/restaurants/${r.restaurantID}`}
                                      className="text-decoration-none text-dark"
                                    >
                                      {r.name}
                                    </Link>
                                  </h6>
                                  <p className="text-muted small mb-0">
                                    {r.description}
                                  </p>
                                  <div className="mt-2 small text-muted">
                                    ⭐ {r.avgRating} ({r.totalReviews} đánh giá)
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Tab>
                  )}

                  {/* ADMIN TAB */}
                  {user.role === 2 && (
                    <Tab eventKey="admin" title="Thông tin quản trị">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Mật khẩu:</strong> <code>********</code> (được
                        mã hóa)
                      </p>
                    </Tab>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
