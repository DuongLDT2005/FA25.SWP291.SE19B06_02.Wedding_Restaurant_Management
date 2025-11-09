import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Modal,
} from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";

export default function AdminLicensePage() {
  const [activeTab, setActiveTab] = useState("pending");

  // Danh sách đối tác chờ phê duyệt
  const [pendingPartners, setPendingPartners] = useState([
    {
      id: 1,
      name: "Trần Thị B",
      email: "tranb@example.com",
      phone: "0901234567",
      restaurantName: "Hoa Hồng Palace",
      licenseFile: "Giấy phép kinh doanh 12345.pdf",
      appliedDate: "2025-11-04",
      note: "Chuyên tổ chức tiệc cưới và sự kiện cao cấp.",
    },
    {
      id: 2,
      name: "Phạm Minh Khang",
      email: "khangp@example.com",
      phone: "0932123123",
      restaurantName: "Golden Lotus",
      licenseFile: "Giấy phép GoldenLotus.pdf",
      appliedDate: "2025-11-02",
      note: "Có kinh nghiệm phục vụ sự kiện ngoài trời.",
    },
  ]);

  // Danh sách đối tác đã hợp tác
  const [approvedPartners] = useState([
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0912345678",
      restaurantName: "Sunshine Wedding Hall",
      joinedDate: "2025-10-15",
      commissionRate: 0.15,
    },
    {
      id: 4,
      name: "Nguyễn Hồng D",
      email: "hongd@example.com",
      phone: "0909876543",
      restaurantName: "Moonlight Garden",
      joinedDate: "2025-09-22",
      commissionRate: 0.12,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const handleApprove = (partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const confirmApproval = () => {
    if (selectedPartner) {
      alert(`✅ Đã phê duyệt đối tác ${selectedPartner.name}.`);
      setPendingPartners((prev) =>
        prev.filter((p) => p.id !== selectedPartner.id)
      );
    }
    setShowModal(false);
  };

  const handleReject = (id) => {
    const partner = pendingPartners.find((p) => p.id === id);
    if (
      window.confirm(`❌ Từ chối yêu cầu hợp tác của ${partner.name}?`)
    ) {
      setPendingPartners((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleChat = (partner) => {
    alert(
      `💬 Mở cửa sổ đàm phán với ${partner.name} (tính năng chat sẽ được phát triển sau).`
    );
  };

  return (
    <AdminLayout title="Quản lý Đối tác & License">
      <div className="container py-4">
        <Tabs
          id="license-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          {/* ========== TAB 1: ĐANG CHỜ PHÊ DUYỆT ========== */}
          <Tab eventKey="pending" title="Đang chờ phê duyệt">
            {pendingPartners.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                <p>Không có đối tác nào đang chờ phê duyệt.</p>
              </div>
            ) : (
              <Row className="g-4">
                {pendingPartners.map((p) => (
                  <Col md={6} lg={4} key={p.id}>
                    <Card className="border-0 shadow-sm h-100 rounded-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="fw-semibold mb-1">{p.name}</h5>
                            <p className="text-muted small mb-0">{p.email}</p>
                          </div>
                          <Badge bg="warning" text="dark">
                            Đang chờ
                          </Badge>
                        </div>

                        <div className="small text-muted mb-2">
                          <strong>📞</strong> {p.phone} <br />
                          <strong>🏛️</strong> {p.restaurantName}
                        </div>

                        <p className="small mb-2">
                          <strong>📄 Hồ sơ:</strong>{" "}
                          <a href="#" className="text-decoration-none">
                            {p.licenseFile}
                          </a>
                        </p>

                        <p className="text-muted small mb-3">{p.note}</p>

                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() => handleApprove(p)}
                          >
                            <i className="fas fa-check me-1"></i> Phê duyệt
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() => handleReject(p.id)}
                          >
                            <i className="fas fa-times me-1"></i> Từ chối
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() => handleChat(p)}
                          >
                            <i className="fas fa-comments me-1"></i> Đàm phán
                          </Button>
                        </div>
                      </Card.Body>
                      <Card.Footer className="text-muted small text-end">
                        Nộp ngày:{" "}
                        {new Date(p.appliedDate).toLocaleDateString("vi-VN")}
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>

          {/* ========== TAB 2: ĐÃ HỢP TÁC ========== */}
          <Tab eventKey="approved" title="Đối tác đã hợp tác">
            {approvedPartners.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-user-slash fa-3x text-secondary mb-3"></i>
                <p>Chưa có đối tác nào được phê duyệt.</p>
              </div>
            ) : (
              <Row className="g-4">
                {approvedPartners.map((p) => (
                  <Col md={6} lg={4} key={p.id}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="fw-semibold mb-1">{p.name}</h5>
                            <p className="text-muted small mb-0">{p.email}</p>
                          </div>
                          <Badge bg="success">Đã hợp tác</Badge>
                        </div>

                        <div className="small text-muted mb-3">
                          <strong>🏛️</strong> {p.restaurantName}
                          <br />
                          <strong>📞</strong> {p.phone}
                          <br />
                          <strong>📅</strong>{" "}
                          {new Date(p.joinedDate).toLocaleDateString("vi-VN")}
                        </div>

                        <div className="border-top pt-2 mt-2 small">
                          <p className="mb-1">
                            <strong>💰 Tỷ lệ hoa hồng:</strong>{" "}
                            <span className="fw-semibold text-primary">
                              {(p.commissionRate * 100).toFixed(0)}%
                            </span>
                          </p>
                          <p className="text-muted mb-0">
                            Thỏa thuận giữa đối tác và admin.
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>
        </Tabs>

        {/* Modal xác nhận phê duyệt */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận phê duyệt đối tác</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPartner && (
              <>
                <p>
                  Bạn có chắc chắn muốn phê duyệt hợp tác với{" "}
                  <strong>{selectedPartner.name}</strong>?
                </p>
                <p className="text-muted small">
                  Sau khi phê duyệt, bạn có thể mở khung <b>Đàm phán</b> để trao
                  đổi và thống nhất tỷ lệ hoa hồng.
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={confirmApproval}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
}
