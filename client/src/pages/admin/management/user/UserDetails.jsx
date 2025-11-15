// src/pages/admin/management/user/UserDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import { Tabs, Tab, Card, Spinner } from "react-bootstrap";
import axios from "../../../../api/axios";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState(null);

  // helper: normalize status (db may store 1/0 or true/false or "1"/"0")
  const isActive = (s) =>
    s === 1 || s === "1" || s === true || s === "true";

  useEffect(() => {
    let mounted = true;

    const fetchUserAndRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Lấy thông tin user
        const userRes = await axios.get(`/admin/users/${id}`);
        const userData = userRes.data;
        if (!mounted) return;
        setUser(userData);

        // 2) Lấy dữ liệu tùy role
        setLoadingRelated(true);

        // CUSTOMER (role === 0) -> lịch sử booking
        if (userData.role === 0 || userData.role === "0") {
          try {
            // Fix: Sử dụng userID làm customerID (vì customerID = userID cho customers)
            const customerID = userData.userID || userData.id || id;
            console.log("🔍 Fetching bookings for customerID:", customerID);
            console.log("🔍 User data:", userData);
            
            const bookingRes = await axios.get(`/admin/bookings/customer/${customerID}`);
            console.log("🔍 Bookings API full response:", bookingRes);
            console.log("🔍 Bookings API data:", bookingRes.data);
            
            // API trả về: { success: true, data: [...] }
            const payload = bookingRes.data;
            let arr = [];
            
            if (Array.isArray(payload)) {
              arr = payload;
            } else if (payload?.data && Array.isArray(payload.data)) {
              arr = payload.data;
            } else if (payload?.success && payload?.data) {
              arr = Array.isArray(payload.data) ? payload.data : [];
            }
            
            console.log("🔍 Parsed bookings array:", arr);
            setBookings(arr);
          } catch (bErr) {
            console.error("❌ Error loading bookings:", bErr);
            console.error("❌ Error response:", bErr.response?.data);
            console.error("❌ Error status:", bErr.response?.status);
            console.error("❌ Error config:", bErr.config);
            setBookings([]);
          }
        }

        // PARTNER (role === 1) -> nhà hàng trực thuộc
        if (userData.role === 1 || userData.role === "1") {
          try {
            const restRes = await axios.get(`/restaurants/partner/${id}`);
            const payload = restRes.data;
            const arr =
              Array.isArray(payload) ? payload : payload?.data ?? payload ?? [];
            setRestaurants(arr);
            console.log("Restaurants loaded:", arr);
          } catch (rErr) {
            console.error("Error loading restaurants:", rErr);
            setRestaurants([]);
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err?.response?.data || err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    fetchUserAndRelated();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Chi tiết người dùng">
        <div className="container py-5 text-center">
          <Spinner animation="border" /> Đang tải...
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Chi tiết người dùng">
        <div className="container py-4 text-danger">
          Lỗi: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      </AdminLayout>
    );
  }

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
    role === 0 || role === "0"
      ? "Khách hàng"
      : role === 1 || role === "1"
      ? "Đối tác"
      : "Admin";

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
          <h4 className="mb-0">{user.fullName || user.email}</h4>
        </div>

        <div className="row g-4">
          {/* LEFT: Info */}
          <div className="col-md-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <img
                  src={user.avatarURL || "/placeholder-avatar.png"}
                  alt={user.fullName}
                  className="rounded-circle mb-3 shadow-sm"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
                <h5 className="fw-semibold mb-0">
                  {user.fullName || "—"}
                </h5>
                <p className="text-muted small">{user.email}</p>

                <div className="mt-2">
                  <span
                    className={`badge ${
                      isActive(user.status) ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {isActive(user.status) ? "Hoạt động" : "Bị khóa"}
                  </span>
                </div>

                <hr />
                <p className="mb-1">
                  <strong>Vai trò:</strong> {getRoleName(user.role)}
                </p>
                <p className="mb-1">
                  <strong>SĐT:</strong> {user.phone || "-"}
                </p>
                <p className="mb-1">
                  <strong>Tham gia:</strong>{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                    : "-"}
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* RIGHT: Tabs */}
          <div className="col-md-8">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tabs defaultActiveKey="profile" id="user-detail-tabs" className="mb-3">
                  <Tab eventKey="profile" title="Thông tin cá nhân">
                    <div>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {user.phone || "-"}
                      </p>
                      <p>
                        <strong>Ngày tạo:</strong>{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </p>
                      {/* nếu có thêm thông tin customer/partner từ backend (associations), hiển thị */}
                      {user.customer && (
                        <>
                          <hr />
                          <h6>Thông tin Customer</h6>
                          <p className="mb-1">Partner name: {user.customer.partnerName || "-"}</p>
                          <p className="mb-1">Wedding role: {user.customer.weddingRole || "-"}</p>
                        </>
                      )}
                      {/* Fix: Đổi restaurantpartner thành partner (theo alias trong init-models.cjs line 171) */}
                      {user.partner && (
                        <>
                          <hr/>
                          <h6>Thông tin Partner</h6>
                          <p className="mb-1">License URL: {user.partner.licenseUrl || "-"}</p>
                          <p className="mb-1">Negotiation status: {user.partner.status ?? "-"}</p>
                        </>
                      )}
                    </div>
                  </Tab>

                  {/* Customer bookings */}
                  {(user.role === 0 || user.role === "0") && (
                    <Tab eventKey="bookings" title={`Lịch sử đặt (${bookings.length})`}>
                      {loadingRelated ? (
                        <div className="text-center py-3"><Spinner animation="border" /></div>
                      ) : bookings.length === 0 ? (
                        <p className="text-muted">Chưa có đơn đặt nào.</p>
                      ) : (
                        <div className="list-group">
                          {bookings.map((b) => (
                            <div
                              key={b.bookingID || b.id || Math.random()}
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                // lưu nhanh vào session để có thể mở chi tiết booking admin
                                sessionStorage.setItem(
                                  `booking_${b.bookingID || b.bookingId || b.id}`,
                                  JSON.stringify(b)
                                );
                                navigate(`/admin/bookings/${b.bookingID || b.bookingId || b.id}`);
                              }}
                            >
                              <div>
                                <strong>Đơn #{b.bookingID || b.id}</strong>
                                <p className="mb-0 text-muted small">
                                  Ngày:{" "}
                                  {b.eventDate
                                    ? new Date(b.eventDate).toLocaleDateString("vi-VN")
                                    : "-"}{" "}
                                  • {b.tableCount ?? b.maxTable ?? "-"} bàn
                                </p>
                              </div>
                              <span className="fw-bold text-success">
                                ₫{(b.totalAmount || b.price || 0).toLocaleString("vi-VN")}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Tab>
                  )}

                  {/* Partner restaurants */}
                  {(user.role === 1 || user.role === "1") && (
                    <Tab eventKey="restaurants" title={`Nhà hàng (${restaurants.length})`}>
                      {loadingRelated ? (
                        <div className="text-center py-3"><Spinner animation="border" /></div>
                      ) : restaurants.length === 0 ? (
                        <p className="text-muted">Chưa có nhà hàng trực thuộc.</p>
                      ) : (
                        <div className="row g-3">
                          {restaurants.map((r) => (
                            <div className="col-md-12" key={r.restaurantID || r.id}>
                              <div className="card h-100 border-0 shadow-sm">
                                {r.thumbnailURL && (
                                  <img
                                    src={r.thumbnailURL}
                                    alt={r.name}
                                    className="card-img-top"
                                    style={{ height: "160px", objectFit: "cover" }}
                                  />
                                )}
                                <div className="card-body">
                                  <h6 className="fw-semibold mb-1">
                                    <Link
                                      to={`/admin/restaurants/${r.restaurantID || r.id}`}
                                      className="text-decoration-none text-dark"
                                    >
                                      {r.name}
                                    </Link>
                                  </h6>
                                  <p className="text-muted small mb-0">
                                    {r.description || r.address?.fullAddress || "-"}
                                  </p>
                                  <div className="mt-2 small text-muted">
                                    ⭐ {r.avgRating ?? r.rating ?? 0} ({r.totalReviews ?? 0} đánh giá)
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Tab>
                  )}

                  {/* Admin info */}
                  {(user.role === 2 || user.role === "2") && (
                    <Tab eventKey="admin" title="Thông tin quản trị">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Mật khẩu:</strong> <code>********</code> (được mã hóa)
                      </p>
                    </Tab>
                  )}
                </Tabs>

              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
