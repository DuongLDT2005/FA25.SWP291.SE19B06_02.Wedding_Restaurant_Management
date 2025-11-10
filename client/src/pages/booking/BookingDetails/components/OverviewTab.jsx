import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Alert, Form } from "react-bootstrap";

export default function OverviewTab({ booking, onApprove, onReject, isApproved, paymentCompleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState({});
    const PRIMARY = "#D81C45";

    const formatCurrency = (amount) =>
        (amount || 0).toLocaleString("vi-VN") + " VNĐ";
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("vi-VN");

    // Tính toán giá dựa trên dữ liệu thực tế
    const calculatePrices = () => {
        // Lấy dữ liệu từ editingData nếu đang chỉnh sửa, nếu không thì từ booking
        const data = isEditing ? editingData : {
            menu: booking.menu,
            services: booking.services || [],
            eventDetails: {
                tableCount: booking.tableCount
            }
        };

        // Giá sảnh (nếu có)
        const hallPrice = booking.hall?.price || 0;

        // Giá menu = giá menu * số bàn
        const menuPrice = (data.menu?.price || booking.menu?.price || 0) * (data.eventDetails?.tableCount || booking.tableCount || 0);

        // Tổng giá dịch vụ
        const servicesTotal = (data.services || booking.services || []).reduce((sum, service) => {
            return sum + ((service.price || 0) * (service.quantity || 1));
        }, 0);

        // Giá gốc = sảnh + menu + dịch vụ
        const originalPrice = hallPrice + menuPrice + servicesTotal;

        // Giảm giá = 30% của giá gốc
        const discountAmount = Math.round(originalPrice * 0.3);

        // VAT = 10% của (giá gốc - giảm giá)
        const VAT = Math.round((originalPrice - discountAmount) * 0.1);

        // Tổng cộng = giá gốc - giảm giá + VAT
        const totalAmount = originalPrice - discountAmount + VAT;

        return {
            originalPrice,
            discountAmount,
            VAT,
            totalAmount,
            hallPrice,
            menuPrice,
            servicesTotal
        };
    };

    const prices = calculatePrices();

    // Thêm useEffect để tự động tính lại giá khi editingData thay đổi
    useEffect(() => {
        if (isEditing) {
            // Tự động tính lại giá khi đang chỉnh sửa
            // Giá sẽ được tính lại mỗi khi render
        }
    }, [isEditing, editingData, booking]);

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditingData({
                customer: { ...booking.customer },
                eventDetails: {
                    eventDate: booking.eventDate,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    tableCount: booking.tableCount,
                    specialRequest: booking.specialRequest,
                },
                menu: { ...booking.menu },
                services: [...(booking.services || [])],
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (section, field, value) => {
        setEditingData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleServiceChange = (index, field, value) => {
        setEditingData(prev => ({
            ...prev,
            services: prev.services.map((s, i) => 
                i === index ? { ...s, [field]: value } : s
            )
        }));
    };

    const handleAddService = () => {
        setEditingData(prev => ({
            ...prev,
            services: [...(prev.services || []), { name: "", quantity: 1, price: 0 }]
        }));
    };

    const handleRemoveService = (index) => {
        setEditingData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    const handleSaveChanges = () => {
        // Tính lại giá sau khi chỉnh sửa
        const newPrices = calculatePrices();
        
        // TODO: Gọi API để lưu thay đổi
        const updatedBooking = {
            ...booking,
            customer: editingData.customer,
            eventDate: editingData.eventDetails.eventDate,
            startTime: editingData.eventDetails.startTime,
            endTime: editingData.eventDetails.endTime,
            tableCount: editingData.eventDetails.tableCount,
            specialRequest: editingData.eventDetails.specialRequest,
            menu: editingData.menu,
            services: editingData.services,
            // Cập nhật giá
            originalPrice: newPrices.originalPrice,
            discountAmount: newPrices.discountAmount,
            VAT: newPrices.VAT,
            totalAmount: newPrices.totalAmount,
        };
        
        // Lưu vào sessionStorage
        sessionStorage.setItem("currentBooking", JSON.stringify(updatedBooking));
        
        alert("✅ Đã lưu thay đổi thành công!");
        setIsEditing(false);
        // Reload page để cập nhật UI
        window.location.reload();
    };

    const displayData = isEditing ? editingData : {
        customer: booking.customer,
        eventDetails: {
            eventDate: booking.eventDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            tableCount: booking.tableCount,
            specialRequest: booking.specialRequest,
        },
        menu: booking.menu,
        services: booking.services || [],
    };

    return (
        <div className="tab-pane fade show active">
            <Row>
                {/* ==== Cột trái: thông tin chính ==== */}
                <Col lg={8}>
                    {/* Thông tin khách hàng */}
                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" style={{ color: "#D81C45" }}>
                                <i className="fas fa-calendar-alt me-2"></i>Thông tin đặt tiệc
                            </h5>
                            {!isApproved && (
                                <Button
                                    size="sm"
                                    style={{ backgroundColor: PRIMARY, borderColor: PRIMARY }}
                                    onClick={handleEditToggle}
                                >
                                    <i className="fas fa-edit me-1"></i>
                                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                                </Button>
                            )}
                        </Card.Header>

                        <Card.Body>
                            {isEditing ? (
                                <Form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Khách hàng:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editingData.customer?.fullName || ""}
                                                    onChange={(e) => handleInputChange("customer", "fullName", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Số điện thoại:</strong></Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    value={editingData.customer?.phone || ""}
                                                    onChange={(e) => handleInputChange("customer", "phone", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Email:</strong></Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={editingData.customer?.email || ""}
                                                    onChange={(e) => handleInputChange("customer", "email", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Nhà hàng:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={booking.restaurant?.name || ""}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Địa chỉ:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={booking.restaurant?.address || ""}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Loại sự kiện:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={booking.eventType || ""}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            ) : (
                                <Row>
                                    <Col md={6}>
                                        <p>
                                            <strong>Khách hàng:</strong> {booking.customer.fullName}
                                        </p>
                                        <p>
                                            <strong>Số điện thoại:</strong> {booking.customer.phone}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {booking.customer.email}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p>
                                            <strong>Nhà hàng:</strong> {booking.restaurant?.name}
                                        </p>
                                        <p>
                                            <strong>Địa chỉ:</strong> {booking.restaurant?.address}
                                        </p>
                                        <p>
                                            <strong>Loại sự kiện:</strong> {booking.eventType}
                                        </p>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Chi tiết sự kiện */}
                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Header className="bg-transparent">
                            <h5 className="mb-0" style={{ color: "#D81C45" }}>
                                <i className="fas fa-info-circle me-2"></i>Chi tiết sự kiện
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {isEditing ? (
                                <Form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Ngày tổ chức:</strong></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={editingData.eventDetails?.eventDate || ""}
                                                    onChange={(e) => handleInputChange("eventDetails", "eventDate", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Thời gian bắt đầu:</strong></Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    value={editingData.eventDetails?.startTime || ""}
                                                    onChange={(e) => handleInputChange("eventDetails", "startTime", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Thời gian kết thúc:</strong></Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    value={editingData.eventDetails?.endTime || ""}
                                                    onChange={(e) => handleInputChange("eventDetails", "endTime", e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Số bàn:</strong></Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={editingData.eventDetails?.tableCount || ""}
                                                    onChange={(e) => handleInputChange("eventDetails", "tableCount", parseInt(e.target.value) || 0)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Sảnh:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={booking.hall?.name || ""}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Sức chứa:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={`${booking.hall?.capacity || 0} khách`}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label><strong>Diện tích:</strong></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={`${booking.hall?.area || 0} m²`}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Yêu cầu đặc biệt:</strong></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={editingData.eventDetails?.specialRequest || ""}
                                            onChange={(e) => handleInputChange("eventDetails", "specialRequest", e.target.value)}
                                            placeholder="Nhập yêu cầu đặc biệt..."
                                        />
                                    </Form.Group>
                                </Form>
                            ) : (
                                <>
                                    <Row>
                                        <Col md={6}>
                                            <p>
                                                <strong>Ngày tổ chức:</strong> {formatDate(booking.eventDate)}
                                            </p>
                                            <p>
                                                <strong>Thời gian bắt đầu:</strong> {booking.startTime}
                                            </p>
                                            <p>
                                                <strong>Thời gian kết thúc:</strong> {booking.endTime}
                                            </p>
                                            <p>
                                                <strong>Số bàn:</strong> {booking.tableCount} bàn
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <strong>Sảnh:</strong> {booking.hall?.name}
                                            </p>
                                            <p>
                                                <strong>Sức chứa:</strong> {booking.hall?.capacity} khách
                                            </p>
                                            <p>
                                                <strong>Diện tích:</strong> {booking.hall?.area} m²
                                            </p>
                                        </Col>
                                    </Row>
                                    <p className="mt-2">
                                        <strong>Yêu cầu đặc biệt:</strong>{" "}
                                        {booking.specialRequest || "Không có"}
                                    </p>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Menu & Dịch vụ */}
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-transparent">
                            <h5 className="mb-0" style={{ color: "#D81C45" }}>
                                <i className="fas fa-utensils me-2"></i>Menu & Dịch vụ
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <h6>Menu đã chọn:</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span>{booking.menu.name}</span>
                                <span>{formatCurrency(booking.menu.price)}</span>
                            </div>
                            
                            <h6 className="mt-3">Món đã chọn:</h6>
                            {isEditing ? (
                                <div className="mb-3">
                                    {editingData.menu?.categories?.map((cat, catIndex) => (
                                        <div key={catIndex} className="mb-2">
                                            <strong className="text-muted">{cat.name}:</strong>
                                            <ul className="list-unstyled ms-3">
                                                {cat.dishes.map((dish, dishIndex) => (
                                                    <li key={dish.id || dishIndex}>
                                                        {dish.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <small className="text-muted">(Menu không thể chỉnh sửa)</small>
                                </div>
                            ) : (
                                <ul className="list-unstyled">
                                    {booking.menu.categories.map((cat) =>
                                        cat.dishes.map((dish) => (
                                            <li key={dish.id}>
                                                {dish.name} <em className="text-muted">({cat.name})</em>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}

                            {isEditing ? (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Dịch vụ bổ sung:</h6>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={handleAddService}
                                        >
                                            <i className="fas fa-plus me-1"></i>Thêm dịch vụ
                                        </Button>
                                    </div>
                                    {editingData.services?.map((s, i) => (
                                        <Card key={i} className="mb-2 border">
                                            <Card.Body className="p-3">
                                                <Row className="align-items-center">
                                                    <Col md={4}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Tên dịch vụ"
                                                            value={s.name || ""}
                                                            onChange={(e) => handleServiceChange(i, "name", e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            placeholder="Số lượng"
                                                            value={s.quantity || 1}
                                                            onChange={(e) => handleServiceChange(i, "quantity", parseInt(e.target.value) || 1)}
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control
                                                            type="number"
                                                            min="0"
                                                            placeholder="Giá"
                                                            value={s.price || 0}
                                                            onChange={(e) => handleServiceChange(i, "price", parseFloat(e.target.value) || 0)}
                                                        />
                                                    </Col>
                                                    <Col md={3} className="mt-2 mt-md-0">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="text-muted small">
                                                                = {formatCurrency((s.price || 0) * (s.quantity || 1))}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() => handleRemoveService(i)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                    {(!editingData.services || editingData.services.length === 0) && (
                                        <p className="text-muted text-center py-3">
                                            Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để thêm.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {booking.services.length > 0 && (
                                        <>
                                            <h6 className="mt-3">Dịch vụ bổ sung:</h6>
                                            {booking.services.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="d-flex justify-content-between small border-bottom py-1"
                                                >
                                                    <span>
                                                        {s.name} x{s.quantity}
                                                    </span>
                                                    <span>{formatCurrency(s.price * s.quantity)}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Nút Lưu thay đổi - chỉ hiển thị khi đang chỉnh sửa */}
                    {isEditing && (
                        <div className="mt-3 text-end">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={handleEditToggle}
                            >
                                <i className="fas fa-times me-1"></i>Hủy
                            </Button>
                            <Button
                                style={{ backgroundColor: PRIMARY, borderColor: PRIMARY }}
                                onClick={handleSaveChanges}
                            >
                                <i className="fas fa-save me-1"></i>Lưu thay đổi
                            </Button>
                        </div>
                    )}
                </Col>

                {/* ==== Cột phải: Tóm tắt thanh toán ==== */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-transparent">
                            <h5 className="mb-0 " style={{ color: "#D81C45" }}>
                                <i className="fas fa-receipt me-2"></i>Tóm tắt thanh toán
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Chi tiết giá (có thể ẩn/hiện) */}
                            {isEditing && (
                                <div className="mb-3 p-2 bg-light rounded small">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Sảnh:</span>
                                        <span>{formatCurrency(prices.hallPrice)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Menu ({booking.tableCount || editingData.eventDetails?.tableCount || 0} bàn):</span>
                                        <span>{formatCurrency(prices.menuPrice)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>Dịch vụ:</span>
                                        <span>{formatCurrency(prices.servicesTotal)}</span>
                                    </div>
                                    <hr className="my-2" />
                                </div>
                            )}

                            <Row className="mb-2">
                                <Col>Giá gốc:</Col>
                                <Col className="text-end">
                                    {formatCurrency(prices.originalPrice)}
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>Giảm giá (30%):</Col>
                                <Col className="text-end text-danger">
                                    -{formatCurrency(prices.discountAmount)}
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>VAT (10%):</Col>
                                <Col className="text-end">{formatCurrency(prices.VAT)}</Col>
                            </Row>
                            <hr />
                            <Row className="fw-bold mb-3">
                                <Col>Tổng cộng:</Col>
                                <Col className="text-end">
                                    {formatCurrency(prices.totalAmount)}
                                </Col>
                            </Row>

                            {/* Chỉ hiển thị nút khi status = 0 (PENDING) */}
                            {booking.status === 0 && !paymentCompleted && (
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="success"
                                        className="flex-fill"
                                        style={{ borderRadius: "30px", color: "white" }}
                                        onClick={onApprove}
                                    >
                                        <i className="fa-solid fa-check me-1"></i>Đồng ý tiệc
                                    </Button>
                                    <Button
                                        className="flex-fill"
                                        style={{
                                            backgroundColor: PRIMARY,
                                            borderColor: PRIMARY,
                                            borderRadius: "30px",
                                            color: "white"
                                        }}
                                        onClick={onReject}
                                    >
                                        <i className="fa-solid fa-x me-1"></i>Hủy tiệc
                                    </Button>
                                </div>
                            )}

                            {/* Chỉ hiển thị khi status = 1 (ACCEPTED) hoặc 3 (CONFIRMED), không phải REJECTED */}
                            {(booking.status === 1 || booking.status === 3) && !paymentCompleted && (
                                <Alert variant="success" className="text-center mt-3 mb-0 py-2">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Đã đồng ý! Bạn có thể xem hợp đồng và thanh toán.
                                </Alert>
                            )}

                            {/* Hiển thị thông báo khi bị từ chối */}
                            {booking.status === 2 && (
                                <Alert variant="danger" className="text-center mt-3 mb-0 py-2">
                                    <i className="fas fa-times-circle me-2"></i>
                                    Đặt tiệc đã bị từ chối.
                                </Alert>
                            )}

                            {/* Hiển thị thông báo khi hết hạn */}
                            {booking.status === 5 && (
                                <Alert variant="warning" className="text-center mt-3 mb-0 py-2">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    Đặt tiệc đã hết hạn (quá 7 ngày sau khi chấp nhận).
                                </Alert>
                            )}

                            {/* Hiển thị thông báo khi đã hủy */}
                            {booking.status === 6 && (
                                <Alert variant="secondary" className="text-center mt-3 mb-0 py-2">
                                    <i className="fas fa-ban me-2"></i>
                                    Đặt tiệc đã bị hủy.
                                </Alert>
                            )}

                            {paymentCompleted && (
                                <Alert variant="info" className="text-center mt-3 mb-0 py-2">
                                    <i className="fas fa-credit-card me-2"></i>
                                    Đã thanh toán cọc! Bạn có thể xem hợp đồng và lịch sử thanh toán.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
