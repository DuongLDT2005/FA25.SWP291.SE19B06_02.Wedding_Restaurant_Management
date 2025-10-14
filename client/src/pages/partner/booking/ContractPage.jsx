import React, { useState } from "react";
import { Card, Row, Col, Button, Form, Alert } from "react-bootstrap";
import {
  FileText,
  Download,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  Send,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PartnerLayout from "../../../layouts/PartnerLayout";

export default function ContractPage() {
  const navigate = useNavigate();

  const [contract, setContract] = useState({
    contractID: 1,
    bookingID: 101,
    contractName: "Hợp đồng đặt tiệc cưới - The Rose Hall",
    contractUrl:
      "https://res.cloudinary.com/dszkninft/raw/upload/v1759654063/kyhoc8b9x9rfp9vfbrvl.html",
    signedOwnerUrl: null,
    signedByOwner: false,
    signedByCustomer: false,
    createdAt: "2025-10-08T12:00:00",
    status: "Chưa ký",
  });

  const [confirmSign, setConfirmSign] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [infoMsg, setInfoMsg] = useState("");

  const formatDate = (s) =>
    new Date(s).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getIframeSrc = (url) =>
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  const handleOpenOriginal = () => {
    if (!contract.contractUrl) return;
    window.open(contract.contractUrl, "_blank", "noopener,noreferrer");
  };

  const handleConfirmSigned = () => {
    setConfirmSign(true);
    setInfoMsg("Bạn đã xác nhận đã ký. Hãy chọn file PDF bản đã ký để tải lên.");
    setTimeout(() => setInfoMsg(""), 2500);
  };

  // Khi người dùng chọn file (chưa xác nhận)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setInfoMsg(`Đã chọn file: ${file.name}. Bấm 'Xác nhận tải lên' để hoàn tất.`);
    }
  };

  // Khi người dùng bấm xác nhận tải file đã chọn
  const handleConfirmUpload = () => {
    if (!pendingFile) {
      alert("Vui lòng chọn file trước.");
      return;
    }

    setInfoMsg("Đang tải lên (mock)...");
    setTimeout(() => {
      const fakeUrl =
        "https://res.cloudinary.com/dszkninft/raw/upload/v1759654063/kyhoc8b9x9rfp9vfbrvl.html";
      setContract((prev) => ({
        ...prev,
        signedByOwner: true,
        signedOwnerUrl: fakeUrl,
        status: "Nhà hàng đã ký",
      }));
      setPendingFile(null);
      setConfirmSign(false);
      setInfoMsg("Đã xác nhận tải lên bản hợp đồng đã ký (mock).");
      setTimeout(() => setInfoMsg(""), 2500);
    }, 1200);
  };

  const handleSendToAdmin = () => {
    if (!contract.signedOwnerUrl) {
      alert("Chưa có bản ký — không thể gửi admin.");
      return;
    }
    if (!window.confirm("Gửi hợp đồng này cho admin xác nhận?")) return;
    setContract((prev) => ({ ...prev, status: "Đang chờ admin xác nhận" }));
    alert("Đã gửi admin (mock).");
  };

  return (
    <PartnerLayout>
      <div className="p-3">
        {/* Nút quay lại */}
        <Button
          variant="primary"
          className="text-decoration-none text-dark mb-3 d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Quay lại
        </Button>

        <Card className="shadow-sm rounded-4 border-0 p-4">
          <Row className="mb-3 align-items-center">
            <Col>
              <h4 className="fw-bold text-primary d-flex align-items-center gap-2">
                <FileText size={20} />
                {contract.contractName}
              </h4>
              <div className="text-muted small">
                Ngày tạo: <strong>{formatDate(contract.createdAt)}</strong>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Left: iframe */}
            <Col md={8} className="mb-3">
              <Card className="h-100 border-0 shadow-sm rounded-3">
                <Card.Body className="p-3">
                  <h6 className="text-primary fw-semibold">Nội dung hợp đồng</h6>
                  {contract.contractUrl ? (
                    <div style={{ minHeight: 520 }}>
                      <iframe
                        title="contract-viewer"
                        src={getIframeSrc(contract.contractUrl)}
                        width="100%"
                        height="560"
                        style={{ border: "none", borderRadius: 8 }}
                      />
                      <div className="mt-2 text-muted small">
                        Nếu không hiển thị, bấm "Mở hợp đồng gốc" hoặc "Tải xuống".
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted fst-italic">
                      Chưa có file hợp đồng.
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Right: hành động */}
            <Col md={4} className="mb-3">
              <Card className="p-3 shadow-sm rounded-3">
                <h6 className="fw-semibold mb-2">Trạng thái & hành động</h6>

                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    {contract.signedByOwner ? (
                      <CheckCircle size={16} color="green" />
                    ) : (
                      <XCircle size={16} color="red" />
                    )}
                    <div>
                      <div className="small text-muted">Nhà hàng</div>
                      <div className="fw-semibold">
                        {contract.signedByOwner ? "Đã ký" : "Chưa ký"}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {contract.signedByCustomer ? (
                      <CheckCircle size={16} color="green" />
                    ) : (
                      <XCircle size={16} color="red" />
                    )}
                    <div>
                      <div className="small text-muted">Khách hàng</div>
                      <div className="fw-semibold">
                        {contract.signedByCustomer ? "Đã ký" : "Chưa ký"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <Button
                    variant="outline-primary"
                    className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleOpenOriginal}
                  >
                    <Download size={16} /> Mở hợp đồng gốc
                  </Button>

                  {/* Bấm xác nhận ký */}
                  {!contract.signedByOwner && !confirmSign && (
                    <Button
                      variant="primary"
                      className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                      onClick={handleConfirmSigned}
                    >
                      <ClipboardCheck size={16} /> Xác nhận đã ký xong
                    </Button>
                  )}

                  {/* Chọn file & xác nhận upload */}
                  {confirmSign && !contract.signedByOwner && (
                    <>
                      <Form.Group controlId="uploadSignedFile" className="mb-2">
                        <Form.Label className="small text-muted">
                          Tải lên bản PDF đã ký
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileSelect}
                        />
                      </Form.Group>

                      {pendingFile && (
                        <Button
                          variant="success"
                          className="w-100 d-flex align-items-center justify-content-center gap-2"
                          onClick={handleConfirmUpload}
                        >
                          <Upload size={16} /> Xác nhận tải lên
                        </Button>
                      )}
                    </>
                  )}

                  {/* Sau upload */}
                  {contract.signedByOwner && contract.signedOwnerUrl && (
                    <>
                      <Button
                        variant="outline-success"
                        className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() =>
                          window.open(
                            contract.signedOwnerUrl,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <Download size={16} /> Xem bản đã ký
                      </Button>

                      <Button
                        variant="success"
                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleSendToAdmin}
                      >
                        <Send size={16} /> Gửi admin xác nhận
                      </Button>
                    </>
                  )}
                </div>

                {infoMsg && (
                  <Alert variant="info" className="py-2 small">
                    {infoMsg}
                  </Alert>
                )}

                <div className="mt-3 small text-muted">
                  Trạng thái hiện tại:{" "}
                  <strong className="ms-1">{contract.status}</strong>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </PartnerLayout>
  );
}