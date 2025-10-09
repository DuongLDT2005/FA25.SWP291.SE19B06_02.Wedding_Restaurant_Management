// File: src/pages/partner/Restaurant/MenuDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Button, Card, Form, Row, Col, Image, ListGroup, Badge, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import mock from "../../../mock/partnerMock";

export default function MenuDetailPage({ menu: propMenu, onBack }) {
  const mockMenu = propMenu || mock.menu?.[0] || {
    menuID: 1,
    restaurantID: 1,
    name: "Menu Tiệc Cưới A",
    price: 3500000,
    imageURL: "",
    status: 1,
    dishes: [1, 2, 5, 6, 7],
  };

  const [menu, setMenu] = useState(mockMenu);
  const [isEditing, setIsEditing] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (propMenu) setMenu(propMenu);
  }, [propMenu]);

  const dishesForRestaurant = mock.dish.filter(d => d.restaurantID === menu.restaurantID);
  const categories = mock.dishCategories || [];

  const handleChange = e => {
    const { name, value } = e.target;
    setMenu(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = e => {
    setMenu(prev => ({ ...prev, status: Number(e.target.value) }));
  };

  const handleDishToggle = dishID => {
    setMenu(prev => {
      const selected = prev.dishes || [];
      if (selected.includes(dishID)) {
        return { ...prev, dishes: selected.filter(id => id !== dishID) };
      } else {
        return { ...prev, dishes: [...selected, dishID] };
      }
    });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setMenu(prev => ({ ...prev, imageURL: preview }));
    }
  };

  const handleDeleteImage = () => {
    if (window.confirm("Bạn có chắc muốn xóa ảnh này không?")) {
      setMenu(prev => ({ ...prev, imageURL: "" }));
    }
  };

  const handleSave = () => {
    const missing = categories.reduce((acc, cat) => {
      const selectedInCat = (menu.dishes || [])
        .map(id => mock.dish.find(d => d.dishID === id))
        .filter(d => d && d.categoryID === cat.categoryID);
      if (selectedInCat.length < cat.requiredQuantity) {
        acc.push(`${cat.name} (thiếu ${cat.requiredQuantity - selectedInCat.length} món)`);
      }
      return acc;
    }, []);

    if (missing.length > 0) {
      setWarning(`Chưa đủ món trong các nhóm: ${missing.join(", ")}`);
      return;
    }

    setWarning("");
    console.log("Saving menu:", menu);
    alert("Lưu thành công (mock)");
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Chi tiết Menu</h4>
        <div>
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => (isEditing ? setIsEditing(false) : onBack?.())}
          >
            {isEditing ? "Hủy" : "← Quay lại"}
          </Button>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {isEditing && warning && (
        <Alert variant="warning" className="py-2">
          ⚠️ {warning}
        </Alert>
      )}

      <Form>
        {isEditing && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Tên menu</Form.Label>
              <Form.Control name="name" value={menu.name} onChange={handleChange} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (VNĐ)</Form.Label>
                  <Form.Control type="number" name="price" value={menu.price} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select value={menu.status} onChange={handleStatusChange}>
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Ngừng hoạt động</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Hình ảnh menu</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {menu.imageURL && (
                <div className="text-center mt-3">
                  <div className="position-relative d-inline-block" style={{ borderRadius: "10px", overflow: "hidden" }}>
                    <Image
                      src={menu.imageURL}
                      rounded
                      fluid
                      style={{ maxHeight: "200px", width: "auto", objectFit: "cover", display: "block" }}
                    />
                    <Button
                      onClick={handleDeleteImage}
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} size="sm" />
                    </Button>
                  </div>
                </div>
              )}
            </Form.Group>

            {/* --- Chọn món ăn theo category --- */}
            {categories.map(cat => {
              const dishesInCat = dishesForRestaurant.filter(d => d.categoryID === cat.categoryID);
              const selectedInCat = (menu.dishes || []).filter(id => {
                const dish = mock.dish.find(d => d.dishID === id);
                return dish?.categoryID === cat.categoryID;
              });
              const isFull = selectedInCat.length >= cat.requiredQuantity;

              return (
                <div key={cat.categoryID} className="mb-4">
                  <h5 className="d-flex align-items-center justify-content-between">
                    <span>
                      {cat.name}{" "}
                      <Badge bg={isFull ? "success" : "warning"}>
                        yêu cầu: {cat.requiredQuantity} | đã chọn: {selectedInCat.length}
                      </Badge>
                    </span>
                  </h5>
                  <Row>
                    {dishesInCat.length ? dishesInCat.map(dish => {
                      const isSelected = menu.dishes?.includes(dish.dishID);
                      return (
                        <Col md={3} key={dish.dishID} className="mb-3">
                          <Card
                            className={`p-2 ${isSelected ? "border-primary shadow-sm" : "border-light"}`}
                            style={{ cursor: "pointer", transition: "0.2s" }}
                            onClick={() => handleDishToggle(dish.dishID)}
                          >
                            <Image
                              src={dish.imageURL || "https://via.placeholder.com/150?text=No+Image"}
                              alt={dish.name}
                              fluid
                              rounded
                              style={{ height: "100px", objectFit: "cover", marginBottom: "8px" }}
                            />
                            <div className="d-flex align-items-center justify-content-between">
                              <span>{dish.name}</span>
                              <Form.Check
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  e.stopPropagation();
                                  handleDishToggle(dish.dishID);
                                }}
                              />
                            </div>
                          </Card>
                        </Col>
                      );
                    }) : (
                      <p className="text-muted">Không có món nào trong nhóm này.</p>
                    )}
                  </Row>
                </div>
              );
            })}

            <Button variant="success" onClick={handleSave}>Lưu</Button>
          </>
        )}

        {/* --- Xem chi tiết menu --- */}
        {!isEditing && (
          <>
            <Row className="mb-3">
              <Col md={4}>
                {menu.imageURL ? (
                  <Image src={menu.imageURL} alt="Menu" rounded fluid style={{ maxHeight: "250px" }} />
                ) : (
                  <div className="border p-3 text-center text-muted">Chưa có hình ảnh</div>
                )}
              </Col>
              <Col md={8}>
                <h4>{menu.name}</h4>
                <p><strong>Giá:</strong> {menu.price.toLocaleString("vi-VN")} ₫</p>
                <p><strong>Trạng thái:</strong> {menu.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</p>
              </Col>
            </Row>

            {categories.map(cat => {
              const dishesInCategory = (menu.dishes || [])
                .map(id => mock.dish.find(d => d.dishID === id))
                .filter(d => d && d.categoryID === cat.categoryID);

              return (
                <div key={cat.categoryID} className="mb-3">
                  <h6>{cat.name} <Badge bg="secondary">Yêu cầu: {cat.requiredQuantity}</Badge></h6>
                  <ListGroup>
                    {dishesInCategory.length ? dishesInCategory.map(dish => (
                      <ListGroup.Item key={dish.dishID} className="d-flex align-items-center">
                        <Image
                          src={dish.imageURL || "https://via.placeholder.com/100?text=No+Image"}
                          alt={dish.name}
                          rounded
                          style={{ height: "60px", width: "80px", objectFit: "cover", marginRight: "10px" }}
                        />
                        {dish.name}
                      </ListGroup.Item>
                    )) : (
                      <ListGroup.Item className="text-muted">(Chưa chọn món nào trong nhóm này)</ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              );
            })}
          </>
        )}
      </Form>
    </Card>
  );
}