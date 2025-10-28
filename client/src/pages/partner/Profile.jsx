import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import PartnerLayOut from "../../layouts/PartnerLayout";
import "../../styles/ProfileStyles.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    email: "example@email.com",
    fullName: "Nguyễn Văn A",
    phone: "0905123456",
    password: "",
    createdAt: "2025-10-04",
    status: 1,
    licenseUrl: "https://example.com/license.pdf",
    commissionRate: 0.1,
    restaurantName: "Nhà hàng Biển Xanh",
    restaurantAddress: "123 Đường Võ Nguyên Giáp, Đà Nẵng",
    openTime: "08:00",
    closeTime: "22:00",
    description: "Nhà hàng chuyên hải sản tươi sống và món Việt.",
    avatar: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu cập nhật:", formData);
    alert("Thông tin đã được lưu thành công!");
  };

  return (
    <PartnerLayOut>
    <Container className="my-5">
      <Row className="g-4">
        {/* LEFT: Thông tin avatar */}
        <Col lg={4}>
          <div className="sticky-sidebar">
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
              <Card.Body
                className="text-center"
              >
                {/* Avatar với border trắng */}
                <div className="d-inline-block position-relative mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center shadow-lg mx-auto"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #7b6b6cff 0%, #b08a8eff 100%)",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      color: "white",
                      border: "4px solid white",
                    }}
                  >
                    {formData.fullName.charAt(0).toUpperCase()}
                  </div>

                  {/* Badge trạng thái */}
                  <Badge
                    bg="success"
                    className="position-absolute"
                    style={{
                      bottom: "5px",
                      right: "5px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid white",
                      padding: 0,
                    }}
                  />
                </div>

                {/* Nút đổi ảnh */}
                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    id="avatarUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`Bạn đã chọn ảnh: ${file.name} (chưa upload)`);
                      }
                    }}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="avatarUpload"
                    className="btn btn-sm rounded-pill px-4"
                    style={{
                      border: "1px solid #140d0eff",
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-camera me-2"></i>
                    Đổi ảnh đại diện
                  </label>
                </Form.Group>

                {/* Thông tin cá nhân */}
                <h4 className="fw-bold mb-1" style={{color: "#000"}}>{formData.fullName}</h4>
                <p className="small mb-3" style={{ color: "#000" }}>
                  <i className="bi bi-envelope me-2" style={{ color: "#000" }}></i>
                  {formData.email}
                </p>

                <div className="border-top pt-3 mt-3">
                  <Row className="text-center g-3">
                    <Col xs={6}>
                      <div className="p-2 phone-info">
                        <i className="bi bi-telephone-fill text-primary fs-5 d-block mb-1"></i>
                        <small className="text-muted d-block">Điện thoại</small>
                        <strong className="small">{formData.phone}</strong>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="p-2 phone-info">
                        <i className="bi bi-calendar-check-fill text-success fs-5 d-block mb-1"></i>
                        <small className="text-muted d-block">Tham gia</small>
                        <strong className="small">{formData.createdAt}</strong>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>

        {/* RIGHT: Nội dung chi tiết */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="flex-grow-1">
                  <h4 className="fw-bold mb-1" style={{ color: "#000" }}>Thông tin đại diện nhà hàng</h4>
                  <p className="text-muted mb-0 small">
                    Cập nhật thông tin cá nhân và tài khoản của bạn
                  </p>
                </div>
                <Badge bg="success" className="px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  Đã xác thực
                </Badge>
              </div>

              <Form onSubmit={handleSubmit}>
                {/* --- Tài khoản */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        background:
                          "#6610f2",
                      }}
                    >
                      <i className="bi bi-person-fill text-white"></i>
                    </div>
                    <h5 className="mb-0 fw-bold" style={{ color: "#000" }}>Thông tin tài khoản</h5>
                  </div>

                  <div className="ps-5">
                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Email
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-envelope"></i>
                            </span>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled
                              className="border-start-0 bg-light"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Số điện thoại
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-telephone"></i>
                            </span>
                            <Form.Control
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="border-start-0"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Họ và tên
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-person"></i>
                            </span>
                            <Form.Control
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              className="border-start-0"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Ngày tạo tài khoản
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-calendar"></i>
                            </span>
                            <Form.Control
                              type="text"
                              value={formData.createdAt}
                              disabled
                              className="border-start-0 bg-light"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>

                <hr className="my-4" />

                {/* --- Hợp tác & Giấy phép */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        background:
                          "#6610f2",
                      }}
                    >
                      <i className="bi bi-file-earmark-text-fill text-white"></i>
                    </div>
                    <h5 className="mb-0 fw-bold" style={{ color: "#000" }}>Hợp tác & Giấy phép</h5>
                  </div>

                  <div className="ps-5">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Giấy phép kinh doanh
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="bi bi-link-45deg"></i>
                            </span>
                            <Form.Control
                              type="text"
                              name="licenseUrl"
                              value={formData.licenseUrl}
                              onChange={handleChange}
                              placeholder="Nhập hoặc dán đường dẫn..."
                              className="border-start-0"
                            />
                          </div>
                          {formData.licenseUrl && (
                            <a
                              href={formData.licenseUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="small text-decoration-none d-inline-flex align-items-center mt-2"
                            >
                              <i className="bi bi-eye me-1"></i>
                              Xem giấy phép
                            </a>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Tỷ lệ hoa hồng (%)
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-percent"></i>
                            </span>
                            <Form.Control
                              type="number"
                              name="commissionRate"
                              value={formData.commissionRate}
                              disabled
                              className="border-start-0 bg-light"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                  <Button
                    variant="outline-secondary"
                    className="px-4 rounded-pill"
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 rounded-pill"
                    style={{
                      background:
                        "#6610f2",
                      border: "none",
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </PartnerLayOut>
  );
}
