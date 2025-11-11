import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Alert, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { restaurants } from "../../../restaurant/ListingRestaurant";

export default function OverviewTab({ booking, onApprove, onReject, isApproved, paymentCompleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState({});
    const PRIMARY = "#D81C45";
    const servicesSafe = Array.isArray(booking?.services) ? booking.services : [];
    const menuCategoriesSafe = Array.isArray(booking?.menu?.categories) ? booking.menu.categories : [];

    const formatCurrency = (amount) =>
        (amount || 0).toLocaleString("vi-VN") + " VNĐ";
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("vi-VN");

  const calculatePrices = () => {
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
    const servicesTotal = (data.services || servicesSafe).reduce((sum, service) => {
      return sum + ((service.price || 0) * (service.quantity || 1));
    }, 0);

    const originalPrice = hallPrice + menuPrice + servicesTotal;

    const discountAmount = Math.round(originalPrice * 0.3);

    const VAT = Math.round((originalPrice - discountAmount) * 0.1);

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

  useEffect(() => {
    if (isEditing) {
    }
  }, [isEditing, editingData, booking]);

  const handleEditToggle = () => {
    if (isEditing) {
      const confirmCancel = window.confirm(
        "Thông tin này chưa được lưu. Bạn vẫn muốn hủy chứ?"
      );
      if (!confirmCancel) return; // nếu bấm Cancel thì dừng
      setEditingData({});
    } else {
      // khi bắt đầu edit thì sao chép dữ liệu hiện tại vào editingData
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
    // Khách hàng không được chỉnh giá hoặc tên dịch vụ
    if (isCustomer && (field === "price" || field === "name")) {
      return;
    }
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

    alert("Đã lưu thay đổi. Yêu cầu chỉnh sửa đã được gửi tới Partner!");
    setIsEditing(false);
    Object.assign(booking, {
      customer: editingData.customer,
      eventDate: editingData.eventDetails.eventDate,
      startTime: editingData.eventDetails.startTime,
      endTime: editingData.eventDetails.endTime,
      tableCount: editingData.eventDetails.tableCount,
      specialRequest: editingData.eventDetails.specialRequest,
      menu: editingData.menu,
      services: editingData.services,
    });
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

  // Menu editing helpers (allow customer to propose menu changes)
  const handleMenuDishChange = (catIndex, dishIndex, value) => {
    setEditingData((prev) => {
      const updated = { ...prev };
      const categories = [...(updated.menu?.categories || [])];
      const dishes = [...(categories[catIndex]?.dishes || [])];
      dishes[dishIndex] = { ...(dishes[dishIndex] || {}), name: value };
      categories[catIndex] = { ...categories[catIndex], dishes };
      updated.menu = { ...(updated.menu || {}), categories };
      return updated;
    });
  };

  const handleAddDish = (catIndex) => {
    setEditingData((prev) => {
      const updated = { ...prev };
      const categories = [...(updated.menu?.categories || [])];
      const dishes = [...(categories[catIndex]?.dishes || [])];
      dishes.push({ name: "" });
      categories[catIndex] = { ...categories[catIndex], dishes };
      updated.menu = { ...(updated.menu || {}), categories };
      return updated;
    });
  };

  const handleRemoveDish = (catIndex, dishIndex) => {
    setEditingData((prev) => {
      const updated = { ...prev };
      const categories = [...(updated.menu?.categories || [])];
      const dishes = [...(categories[catIndex]?.dishes || [])].filter((_, i) => i !== dishIndex);
      categories[catIndex] = { ...categories[catIndex], dishes };
      updated.menu = { ...(updated.menu || {}), categories };
      return updated;
    });
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
          {/* ===== MENU & DỊCH VỤ ===== */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0" style={{ color: "#D81C45" }}>
                <i className="fas fa-utensils me-2"></i>Menu & Dịch vụ
              </h5>
              {isEditing && (
                <div>
                  <Button
                    size="sm"
                    className="me-2"
                    style={{
                        backgroundColor: "transparent",
                        border: "1px solid #D81C45",
                        color: "#D81C45",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#D81C45";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#D81C45";
                      }}
                    onClick={() => {
                      setShowMenuModal(true);
                      setTempMenu(null);
                      setSelectedMenuId("");
                      setSelectedDishes([]);
                    }}
                  >
                    <i className="fas fa-list me-1"></i>Chọn Menu
                  </Button>
                  <Button
                    size="sm"
                    style={{
                        backgroundColor: "transparent",
                        border: "1px solid #D81C45",
                        color: "#D81C45",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#D81C45";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#D81C45";
                      }}
                    onClick={() => setShowServiceModal(true)}
                  >
                    <i className="fas fa-concierge-bell me-1"></i>Chọn Dịch vụ
                  </Button>
                </div>
              )}
            </Card.Header>

            <Card.Body>
              {/* --- Hiển thị menu đã chọn --- */}
              {(isEditing ? editingData.menu : booking.menu) ? (
                <>
                  <h6 className="fw-bold" style={{ color: "#D81C45" }}>Menu đã chọn:</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>{(isEditing ? editingData.menu : booking.menu).name}</span>
                    <span>{formatCurrency((isEditing ? editingData.menu : booking.menu).price)}</span>
                  </div>

                  {(isEditing ? editingData.menu : booking.menu).categories?.map((cat, i) => (
                    <div key={i} className="ms-3 mb-2">
                      <strong className="text-uppercase" style={{ color: "#D81C45" }}>
                        {cat.name}:
                      </strong>
                      <ul className="mb-2">
                        {cat.dishes?.map((dish, j) => (
                          <li key={j}> {dish.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-muted">Chưa chọn menu nào.</p>
              )}

              <hr />

              {/* --- Hiển thị dịch vụ đã chọn --- */}
              {(isEditing ? editingData.services : booking.services)?.length > 0 ? (
                <>
                  <h6 className="fw-bold" style={{ color: "#D81C45" }}>Dịch vụ bổ sung:</h6>
                  {(isEditing ? editingData.services : booking.services).map((s, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between small border-bottom py-1"
                    >
                      <span>{s.name}</span>
                      <span>{formatCurrency(s.price)}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-muted">Chưa chọn dịch vụ nào.</p>
              )}
            </Card.Body>

          </Card>

          {/* ===== MODAL CHỌN MENU ===== */}

          <Modal
            show={showMenuModal}
            onHide={() => setShowMenuModal(false)}
            size="lg"
            centered
            scrollable
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#D81C45" }}>Chọn Menu & Món ăn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* --- Bước 1: chọn menu --- */}
              <Form.Group className="mb-3">
                <Form.Label><strong>Chọn menu có trong sảnh:</strong></Form.Label>
                <Form.Select
                  style={{
                    borderColor: "#D81C45",
                    boxShadow: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                  value={selectedMenuId}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setSelectedMenuId(id);
                    const menu = restaurantData?.menus?.find((m) => m.id === id);
                    setTempMenu(menu);
                    setSelectedDishes([]);
                  }}
                >
                  <option value="">-- Chọn menu --</option>
                  {restaurantData?.menus?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({formatCurrency(m.price)})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* --- Bước 2: tick chọn món --- */}
              {tempMenu ? (
                <>
                  <h6 className="mt-3">
                    Chọn món trong <strong>{tempMenu.name}</strong>:
                  </h6>
                  {tempMenu.categories?.map((cat, ci) => (
                    <Card
                      key={ci}
                      className="mb-3"
                      style={{
                        border: "1px solid #ddd",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Card.Header
                        className="fw-bold"
                        style={{ color: "#D81C45", backgroundColor: "transparent" }}
                      >
                        {cat.name}
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          {cat.dishes?.map((dish, di) => (
                            <Col
                              md={6}
                              key={di}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "6px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  cursor: "pointer",
                                  width: "100%",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  backgroundColor: "transparent",
                                  lineHeight: "1",
                                }}
                                onClick={() => {
                                  setSelectedDishes((prev) =>
                                    prev.includes(dish.name)
                                      ? prev.filter((d) => d !== dish.name)
                                      : [...prev, dish.name]
                                  );
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDishes.includes(dish.name)}
                                  onChange={() => { }}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    accentColor: "#D81C45",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    margin: "0",
                                    transform: "translateY(1px)",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "15px",
                                    color: "#222",
                                    userSelect: "none",
                                    flexGrow: 1,
                                    marginTop: "1px",
                                  }}
                                >
                                  {dish.name}
                                </span>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>



                    </Card>
                  ))}
                </>
              ) : (
                <p className="text-muted">Vui lòng chọn menu để xem các món ăn.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowMenuModal(false)}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                Hủy
              </Button>
              <Button
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#b4143b";
                  e.target.style.borderColor = "#b4143b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#D81C45";
                  e.target.style.borderColor = "#D81C45";
                }}
                style={{
                  backgroundColor: "#D81C45",
                  borderColor: "#D81C45",
                  color: "white",
                  borderRadius: "6px",
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => {
                  if (!tempMenu) return;
                  const newCategories = tempMenu.categories.map((cat) => ({
                    ...cat,
                    dishes: cat.dishes.filter((d) => selectedDishes.includes(d.name)),
                  }));
                  const newMenu = { ...tempMenu, categories: newCategories };
                  setEditingData((prev) => ({ ...prev, menu: newMenu }));
                  setShowMenuModal(false);
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>

          {/* --- Modal chọn dịch vụ --- */}
          <Modal
            show={showServiceModal}
            onHide={() => setShowServiceModal(false)}
            size="lg"
            centered
            scrollable
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#D81C45" }}>Chọn dịch vụ bổ sung</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {restaurantData?.services?.length > 0 ? (
                <Row>
                  {restaurantData.services.map((s, index) => (
                    <Col md={6} key={index}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(216, 28, 69, 0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                        onClick={() => {
                          setSelectedServiceIds((prev) =>
                            prev.includes(index)
                              ? prev.filter((id) => id !== index)
                              : [...prev, index]
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(index)}
                          onChange={() => { }}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#D81C45",
                            cursor: "pointer",
                            flexShrink: 0,
                            margin: "0",
                            transform: "translateY(1px)",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "15px",
                            color: "#222",
                            userSelect: "none",
                            marginTop: "1px",
                          }}
                        >
                          {s.name} ({formatCurrency(s.price)})
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted">Nhà hàng hiện chưa có dịch vụ bổ sung nào.</p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowServiceModal(false)}
                style={{ borderRadius: "6px", border: "1px solid #ccc" }}
              >
                Hủy
              </Button>
              <Button
                style={{
                  backgroundColor: "#D81C45",
                  borderColor: "#D81C45",
                  color: "white",
                  borderRadius: "6px",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#b4143b";
                  e.target.style.borderColor = "#b4143b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#D81C45";
                  e.target.style.borderColor = "#D81C45";
                }}
                onClick={() => {
                  const chosenServices =
                    restaurantData.services?.filter((_, index) =>
                      selectedServiceIds.includes(index)
                    ) || [];
                  setEditingData((prev) => ({ ...prev, services: chosenServices }));
                  setShowServiceModal(false);
                }}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          </Modal>





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
                    <i className="fa-solid fa-check me-1"></i>Xác nhận tiệc
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
