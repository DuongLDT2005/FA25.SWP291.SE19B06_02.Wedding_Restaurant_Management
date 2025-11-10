import React, { useState } from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload, faFilePdf, faCreditCard, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#D81C45";

export default function ContractTab({ booking }) {
    const navigate = useNavigate();
    const [pdfUrl, setPdfUrl] = useState(booking?.contract?.pdfUrl || null);
    const [uploading, setUploading] = useState(false);

    // Kiểm tra xem đã thanh toán chưa (status >= 4 DEPOSITED hoặc có payment confirmed)
    const hasPaid = booking?.status >= 4 || (booking?.payments && booking.payments.some(p => p.status === 1));
    
    // Kiểm tra xem có hợp đồng chưa (partner đã upload)
    const hasContract = pdfUrl || booking?.contract?.pdfUrl;

    // Giả lập upload file (chỉ dành cho partner, customer không thể upload)
    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);

        // Giả lập lưu file tạm vào URL (cục bộ)
        const fileURL = URL.createObjectURL(file);
        setTimeout(() => {
            setPdfUrl(fileURL);
            setUploading(false);
            alert("File PDF đã được tải lên thành công!");
        }, 1000);
    };

    const handleDownload = () => {
        // Kiểm tra xem đã thanh toán chưa
        if (!hasPaid) {
            alert("Vui lòng đặt cọc trước để tải hợp đồng về!");
            return;
        }

        if (!hasContract) {
            alert("Chưa có hợp đồng để tải xuống!");
            return;
        }

        const contractUrl = pdfUrl || booking?.contract?.pdfUrl;
        const link = document.createElement("a");
        link.href = contractUrl;
        link.download = "HopDong.pdf";
        link.click();
    };

    const handleGoToPayment = () => {
        navigate(`/payment/${booking?.bookingID}`);
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
                <h5 className="mb-0" style={{ color: "#D81C45" }}>
                    <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                    Hợp đồng đặt tiệc
                </h5>
            </Card.Header>

            <Card.Body>
                <Row>
                    {/* PDF hiển thị bên trái */}
                    <Col lg={8}>
                        {hasContract ? (
                            <div
                                style={{
                                    height: "600px",
                                    border: "1px solid #dee2e6",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                {!hasPaid && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            zIndex: 10,
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            style={{ fontSize: "3rem", color: "#fff", marginBottom: "1rem" }}
                                        />
                                        <h5 style={{ color: "#fff", marginBottom: "0.5rem" }}>
                                            Vui lòng đặt cọc để xem hợp đồng
                                        </h5>
                                        <p style={{ color: "#fff", textAlign: "center", padding: "0 2rem" }}>
                                            Bạn cần thanh toán đặt cọc trước khi có thể xem và tải hợp đồng về.
                                        </p>
                                    </div>
                                )}
                                <iframe
                                    src={pdfUrl || booking?.contract?.pdfUrl}
                                    title="Hợp đồng PDF"
                                    width="100%"
                                    height="100%"
                                    style={{ border: "none", pointerEvents: hasPaid ? "auto" : "none" }}
                                ></iframe>
                            </div>
                        ) : (
                            <div
                                className="text-center py-5"
                                style={{
                                    border: "1px dashed #D81C45",
                                    borderRadius: "10px",
                                    color: "#6c757d",
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faFilePdf}
                                    style={{ fontSize: "3rem", color: "#D81C45" }}
                                />
                                <h5 className="mt-3">Chưa có hợp đồng</h5>
                                <p className="text-muted">
                                    Partner chưa tải lên hợp đồng. Vui lòng đợi partner upload hợp đồng.
                                </p>
                            </div>
                        )}
                    </Col>

                    {/* Bên phải là các nút thao tác */}
                    <Col lg={4}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                {hasContract ? (
                                    <>
                                        {hasPaid ? (
                                            // Đã thanh toán - cho phép tải xuống
                                            <Button
                                                variant="danger"
                                                className="w-100 mb-3"
                                                style={{
                                                    backgroundColor: "#D81C45",
                                                    border: "none",
                                                    borderRadius: "25px",
                                                }}
                                                onClick={handleDownload}
                                            >
                                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                                Tải xuống hợp đồng
                                            </Button>
                                        ) : (
                                            // Chưa thanh toán - yêu cầu đặt cọc
                                            <>
                                                <Alert variant="warning" className="w-100 mb-3 text-center">
                                                    <FontAwesomeIcon icon={faLock} className="me-2" />
                                                    <strong>Yêu cầu đặt cọc</strong>
                                                    <br />
                                                    <small>Vui lòng đặt cọc để tải hợp đồng về</small>
                                                </Alert>
                                                <Button
                                                    variant="success"
                                                    className="w-100 mb-3"
                                                    style={{
                                                        borderRadius: "25px",
                                                    }}
                                                    onClick={handleGoToPayment}
                                                >
                                                    <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                    Đặt cọc ngay
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    className="w-100"
                                                    style={{
                                                        borderRadius: "25px",
                                                    }}
                                                    disabled
                                                >
                                                    <FontAwesomeIcon icon={faDownload} className="me-2" />
                                                    Tải xuống hợp đồng
                                                </Button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    // Chưa có hợp đồng
                                    <Alert variant="info" className="w-100 text-center">
                                        <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                                        <strong>Chưa có hợp đồng</strong>
                                        <br />
                                        <small>Vui lòng đợi partner upload hợp đồng</small>
                                    </Alert>
                                )}

                                {/* Upload chỉ dành cho partner (có thể ẩn đi nếu là customer) */}
                                {/* <label
                                    htmlFor="upload-contract"
                                    className="btn btn-outline-secondary w-100 mt-3"
                                    style={{
                                        borderRadius: "25px",
                                        borderColor: "#D81C45",
                                        color: "#D81C45",
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUpload} className="me-2" />
                                    {uploading ? "Đang tải lên..." : "Tải lên hợp đồng mới"}
                                </label>
                                <input
                                    id="upload-contract"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleUpload}
                                    hidden
                                /> */}

                                {hasContract && hasPaid && (
                                    <div className="mt-3 text-muted small text-center">
                                        <i>File hiện tại:</i> <br />
                                        <b>HopDong.pdf</b>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}
