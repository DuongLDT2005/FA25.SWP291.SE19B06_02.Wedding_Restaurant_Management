import React, { useState, useEffect } from "react";
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
import axios from "../../../../api/axios";
import AdminLayout from "../../../../layouts/AdminLayout";

export default function AdminLicensePage() {
  const [activeTab, setActiveTab] = useState("approved");

  const [approvedPartners, setApprovedPartners] = useState([]);
  const [pendingPartners, setPendingPartners] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Load partner lists
  useEffect(() => {
    loadApprovedPartners();
    loadPendingPartners();
  }, []);

  const loadApprovedPartners = async () => {
    try {
      const res = await axios.get("/admin/users/partners/approved");
      if (res.data?.success) {
        setApprovedPartners(res.data.data || []);
      }
    } catch (err) {
      console.error("❌ Load approved failed:", err);
    }
  };

  const loadPendingPartners = async () => {
    try {
      const res = await axios.get("/admin/users/partners/pending");
      if (res.data?.success) {
        setPendingPartners(res.data.data || []);
      }
    } catch (err) {
      console.error("❌ Load pending failed:", err);
    }
  };

  // Approve
  const handleApprove = (partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedPartner) return;

    try {
      await axios.put(
        `/admin/users/partners/${selectedPartner.userID}/approve`
      );

      loadApprovedPartners();
      loadPendingPartners();

      alert(`✅ Đã phê duyệt đối tác ${selectedPartner.fullName}`);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi phê duyệt đối tác.");
    }

    setShowModal(false);
  };

  // Reject
  const handleReject = async (id) => {
    if (!window.confirm("❌ Bạn chắc chắn muốn từ chối đối tác này?")) return;

    try {
      await axios.put(`/admin/users/partners/${id}/reject`);
      loadPendingPartners();
      alert("🚫 Đã từ chối đối tác.");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi từ chối.");
    }
  };

  const handleChat = (partner) => {
    alert(`💬 Chat với ${partner.fullName} (dev sau)`);
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
          {/* PENDING */}
          <Tab eventKey="pending" title="Đang chờ phê duyệt">
            {pendingPartners.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                <p>Không có đối tác đang chờ.</p>
              </div>
            ) : (
              <Row className="g-4">
                {pendingPartners.map((p) => (
                  <Col md={6} lg={4} key={p.userID}>
                    <Card className="border-0 shadow-sm h-100 rounded-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="fw-semibold mb-1">{p.fullName}</h5>
                            <p className="text-muted small mb-0">{p.email}</p>
                          </div>
                          <Badge bg="warning" text="dark">
                            Đang chờ
                          </Badge>
                        </div>

                        <div className="small text-muted mb-2">
                          <strong>📞</strong> {p.phone} <br />
                          <strong>📄 License:</strong> {p.partner?.licenseUrl}
                        </div>

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
                            onClick={() => handleReject(p.userID)}
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
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>

          {/* APPROVED */}
          <Tab eventKey="approved" title="Đối tác đã hợp tác">
            {approvedPartners.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-user-slash fa-3x text-secondary mb-3"></i>
                <p>Chưa có đối tác được phê duyệt.</p>
              </div>
            ) : (
              <Row className="g-4">
                {approvedPartners.map((p) => (
                  <Col md={6} lg={4} key={p.userID}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="fw-semibold mb-1">{p.fullName}</h5>
                            <p className="text-muted small mb-0">{p.email}</p>
                          </div>
                          <Badge bg="success">Đã hợp tác</Badge>
                        </div>

                        <div className="small text-muted mb-3">
                          <strong>📞</strong> {p.phone} <br />
                          <strong>📄 License:</strong>{" "}
                          {p.partner?.licenseUrl}
                          <br />
                          <strong>💰 Hoa hồng:</strong>{" "}
                          <span className="fw-semibold text-primary">
                            {(p.partner?.commissionRate * 100).toFixed(
                              0
                            ) || 0}
                            %
                          </span>
                        </div>

                        <div className="border-top pt-2 mt-2 small">
                          <p className="text-muted mb-0">
                            Đối tác đã hoàn tất đàm phán.
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

        {/* MODAL */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận phê duyệt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPartner && (
              <>
                <p>
                  Bạn có chắc chắn muốn phê duyệt{" "}
                  <strong>{selectedPartner.fullName}</strong>?
                </p>
                <p className="text-muted small">
                  Sau khi phê duyệt, đối tác sẽ có quyền đăng nhà hàng.
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
