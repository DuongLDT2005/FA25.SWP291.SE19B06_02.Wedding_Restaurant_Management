import React, { useState } from "react";
import {
  Button,
  Modal,
  ListGroup,
  Accordion,
  Form,
  Badge,
} from "react-bootstrap";

const MenuSelectorModal = ({ menus = [], onSelect }) => {
  const [show, setShow] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState({});
  const primaryColor = "#E11D48";

  // Khi chọn menu
  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
    setSelectedDishes({});
  };

  // Khi chọn món trong category
  const handleDishToggle = (categoryName, dish, limit) => {
    setSelectedDishes((prev) => {
      const current = prev[categoryName] || [];
      const isSelected = current.includes(dish);
      let updated;
      if (isSelected) {
        updated = current.filter((d) => d !== dish);
      } else {
        if (current.length >= limit) return prev; // không vượt quá giới hạn
        updated = [...current, dish];
      }
      return { ...prev, [categoryName]: updated };
    });
  };

  // Hoàn tất chọn
  const handleConfirm = () => {
    onSelect({
      menu: selectedMenu, // pass full object so price is available
      dishes: selectedDishes,
    });
    setShow(false);
  };

  return (
    <>
      <Button
        variant="outline-danger"
        onClick={() => setShow(true)}
        style={{ borderColor: primaryColor, color: primaryColor }}
      >
        {selectedMenu ? selectedMenu.name : "Chọn thực đơn"}
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMenu ? "Chọn món ăn" : "Chọn thực đơn"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Nếu chưa chọn menu → hiển thị danh sách menu */}
          {!selectedMenu && (
            <ListGroup>
              {menus.map((menu) => (
                <ListGroup.Item
                  key={menu.id}
                  action
                  onClick={() => handleMenuSelect(menu)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{menu.name}</strong>
                    <div className="text-muted small">{menu.description}</div>
                  </div>
                  <span style={{ color: primaryColor, fontWeight: "500" }}>
                    {menu.price}₫/người
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Nếu đã chọn menu → hiển thị danh sách món */}
          {selectedMenu && (
            <>
              <h5 className="mb-3" style={{ color: primaryColor }}>
                {selectedMenu.name}
              </h5>

              <Accordion>
                {selectedMenu.categories.map((cat, idx) => (
                  <Accordion.Item eventKey={idx.toString()} key={cat.name}>
                    <Accordion.Header>
                      {cat.name}{" "}
                      <Badge
                        bg="light"
                        text="dark"
                        className="ms-2"
                        style={{
                          border: `1px solid ${primaryColor}`,
                          fontSize: "12px",
                        }}
                      >
                        Chọn tối đa {cat.limit}
                      </Badge>
                    </Accordion.Header>
                    <Accordion.Body>
                      {cat.dishes.map((dish) => {
                        const current = selectedDishes[cat.name] || [];
                        const isChecked = current.includes(dish);
                        const disabled =
                          !isChecked && current.length >= cat.limit;
                        return (
                          <Form.Check
                            key={dish}
                            type="checkbox"
                            id={`${cat.name}-${dish}`}
                            label={dish}
                            checked={isChecked}
                            disabled={disabled}
                            onChange={() =>
                              handleDishToggle(cat.name, dish, cat.limit)
                            }
                            className="mb-2"
                          />
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          {selectedMenu && (
            <Button
              variant="secondary"
              onClick={() => setSelectedMenu(null)}
              style={{ border: "none" }}
            >
              ← Quay lại danh sách menu
            </Button>
          )}
          <Button
            variant="danger"
            style={{
              backgroundColor: primaryColor,
              border: "none",
            }}
            disabled={!selectedMenu}
            onClick={handleConfirm}
          >
            Xác nhận lựa chọn
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MenuSelectorModal;