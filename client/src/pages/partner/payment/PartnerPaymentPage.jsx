import React, { useState, useMemo } from "react";
import { Card, Table, Row, Col, Form, Button, Badge, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PartnerLayout from "../../../layouts/PartnerLayout";

export default function PartnerPaymentPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // mock data
  const payments = [
    {
      paymentID: 1,
      bookingID: "BK001",
      type: "DEPOSIT",
      amount: 5000000,
      method: "Bank Transfer",
      status: "Confirmed",
      transactionRef: "TXN12345",
      paymentDate: "2025-10-01T10:15:00",
      released: true,
    },
    {
      paymentID: 2,
      bookingID: "BK002",
      type: "REMAINING",
      amount: 10000000,
      method: "Momo",
      status: "Pending",
      transactionRef: "TXN12346",
      paymentDate: "2025-10-05T14:30:00",
      released: false,
    },
    {
      paymentID: 3,
      bookingID: "BK003",
      type: "DEPOSIT",
      amount: 3000000,
      method: "Cash",
      status: "Failed",
      transactionRef: "TXN12347",
      paymentDate: "2025-09-28T19:00:00",
      released: false,
    },
  ];

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      return (
        (!status || p.status === status) &&
        (!type || p.type === type) &&
        (!search || p.bookingID.toLowerCase().includes(search.toLowerCase())) &&
        (!fromDate || p.paymentDate >= fromDate) &&
        (!toDate || p.paymentDate <= toDate)
      );
    });
  }, [status, type, fromDate, toDate, search]);

  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (n) => n.toLocaleString("vi-VN") + " ₫";

  const renderStatusBadge = (s) => {
    switch (s) {
      case "Confirmed":
        return <Badge bg="success">Đã xác nhận</Badge>;
      case "Pending":
        return <Badge bg="secondary">Chờ xử lý</Badge>;
      case "Failed":
        return <Badge bg="danger">Thất bại</Badge>;
      default:
        return <Badge bg="light text-dark">{s}</Badge>;
    }
  };

  const renderTypeBadge = (t) => {
    return t === "DEPOSIT" ? (
      <Badge bg="primary">Cọc</Badge>
    ) : (
      <Badge bg="warning" text="dark">
        Còn lại
      </Badge>
    );
  };

  const handleShowDetail = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  return (
    <PartnerLayout>
      <div className="p-3">
        <h3>Thanh toán của khách hàng</h3>

        {/* Bộ lọc */}
        <Card className="mb-3">
          <Card.Body>
            <Row className="g-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Tất cả</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Failed">Failed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Loại thanh toán</Form.Label>
                  <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Tất cả</option>
                    <option value="DEPOSIT">Cọc</option>
                    <option value="REMAINING">Còn lại</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tìm Booking ID</Form.Label>
                  <Form.Control
                    placeholder="Nhập mã booking..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bảng dữ liệu */}
        <Card>
          <Card.Body>
            <div className="table-responsive">
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Loại</th>
                    <th className="text-end">Số tiền</th>
                    <th>Phương thức</th>
                    <th>Ngày thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Giải ngân</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.paymentID}>
                      <td>
                        <Link to={`/partner/bookings/${p.bookingID}`} className="text-primary text-decoration-none">
                          {p.bookingID}
                        </Link>
                      </td>
                      <td>{renderTypeBadge(p.type)}</td>
                      <td className="text-end fw-bold">{formatCurrency(p.amount)}</td>
                      <td>{p.method}</td>
                      <td>{new Date(p.paymentDate).toLocaleString("vi-VN")}</td>
                      <td>{renderStatusBadge(p.status)}</td>
                      <td className="text-center">
                        {p.released ? <CheckCircle size={18} color="green" /> : <XCircle size={18} color="red" />}
                      </td>
                      <td>
                        <Button size="sm" variant="info" onClick={() => handleShowDetail(p)}>
                          Xem
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="text-end fw-bold mt-2">
              Tổng khách đã thanh toán: {formatCurrency(totalAmount)}
            </div>
          </Card.Body>
        </Card>

        {/* Modal chi tiết */}
        <Modal show={showModal} onHide={() => setShowModal(false)} scrollable size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết thanh toán</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPayment && (
              <div>
                <p><strong>Booking ID:</strong> {selectedPayment.bookingID}</p>
                <p><strong>Loại thanh toán:</strong> {selectedPayment.type}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(selectedPayment.amount)}</p>
                <p><strong>Phương thức:</strong> {selectedPayment.method}</p>
                <p><strong>Trạng thái:</strong> {selectedPayment.status}</p>
                <p><strong>Ngày thanh toán:</strong> {new Date(selectedPayment.paymentDate).toLocaleString("vi-VN")}</p>
                <p><strong>Đã giải ngân?</strong> {selectedPayment.released ? "✅" : "❌"}</p>
                <p><strong>Mã giao dịch:</strong> {selectedPayment.transactionRef}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </PartnerLayout>
  );
}