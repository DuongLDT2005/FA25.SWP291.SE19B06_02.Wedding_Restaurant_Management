// ContractTab.jsx
import React, { useState } from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

const PRIMARY = "#D81C45";

// PDF mẫu nếu chưa có hợp đồng
const SAMPLE_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export default function ContractTab({ booking }) {
  // Customer luôn là customer trong trang này
  const isCustomer = true;

  // Lấy URL hợp đồng
  const initialPdfUrl =
    booking?.contract?.pdfUrl ||
    booking?.contract?.contractUrl ||
    SAMPLE_PDF_URL;

  const [pdfUrl] = useState(initialPdfUrl);
  const [pdfName] = useState(booking?.contract?.pdfName || "HopDong.pdf");

  // Khách hàng được tải khi:
  // status >= 4: Đã đặt cọc
  const canDownload = booking?.status >= 4;

  const handleDownload = () => {
    if (!canDownload) {
      alert("Bạn cần đặt cọc trước khi tải hợp đồng về!");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfName;
    link.click();
  };

  const handleGoToPayment = () => {
    window.location.href = `/payment/${booking?.bookingID}`;
  };

  return (
    <Card className="custom-contract-card">
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "#f8f9fa",
          borderBottom: "2px solid #D81C45",
        }}
      >
        <h5 className="mb-0" style={{ color: PRIMARY }}>
          <FontAwesomeIcon icon={faFilePdf} className="me-2" />
          Hợp đồng đặt tiệc
        </h5>
      </Card.Header>

      <Card.Body>
        <Row>
          {/* ================= PDF VIEWER ================= */}
          <Col lg={8}>
            <div
              style={{
                height: "600px",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {/* KHÁCH HÀNG LUÔN ĐƯỢC XEM PDF */}
              <iframe
                src={pdfUrl}
                title="Hợp đồng PDF"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              ></iframe>
            </div>
          </Col>

          {/* ================= ACTION BUTTONS ================= */}
          <Col lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column justify-content-start align-items-center">

                {/* TRẠNG THÁI: CHƯA ĐẶT CỌC */}
                {!canDownload && (
                  <>
                    <Alert variant="warning" className="w-100 text-center">
                      <strong>Chưa đặt cọc</strong>
                      <br />
                      Bạn cần đặt cọc để tải hợp đồng xuống.
                    </Alert>

                    <Button
                      variant="success"
                      className="w-100 mb-3"
                      style={{ borderRadius: "25px" }}
                      onClick={handleGoToPayment}
                    >
                      <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                      Đặt cọc ngay
                    </Button>

                    <Button
                      disabled
                      className="w-100"
                      style={{ borderRadius: "25px" }}
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Không thể tải hợp đồng
                    </Button>
                  </>
                )}

                {/* TRẠNG THÁI: ĐÃ ĐẶT CỌC → KHÁCH HÀNG TẢI FILE */}
                {canDownload && (
                  <>
                    <Button
                      className="w-100 mb-3"
                      style={{
                        backgroundColor: PRIMARY,
                        border: "none",
                        borderRadius: "25px",
                      }}
                      onClick={handleDownload}
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Tải xuống hợp đồng
                    </Button>

                    <div className="mt-2 text-muted small text-center">
                      <i>File hiện tại: </i>
                      <b>{pdfName}</b>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
