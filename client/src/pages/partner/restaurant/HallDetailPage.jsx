import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Image, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function HallProfile(props) {

    // Mock data nếu không có props.hall
    const mockHall = {
        name: "Sảnh A",
        description: "Sảnh tiệc lớn, thích hợp tổ chức hội nghị và tiệc cưới.",
        capacity: 500,
        area: 600,
        price: 20000000,
        status: 1,
        imageURLs: [
            "https://mgs-storage.sgp1.digitaloceanspaces.com/satellite/50522f6c-9942-4cfb-8ccd-b6efc45eed72",
            "https://nhuminhplazahotel.com/wp-content/uploads/2024/07/bang-gia-nha-hang-tiec-cuoi5.jpg",
        ],
    };

    const [profile, setProfile] = useState({
        name: "",
        description: "",
        capacity: "",
        area: "",
        price: "",
        status: true,
        imageURLs: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const hall = mockHall; // dùng mock nếu props không có
        setProfile({
            name: hall.name || "",
            description: hall.description || "",
            capacity: hall.capacity || "",
            area: hall.area || "",
            price: hall.price || "",
            status: hall.status === 1,
            imageURLs: hall.imageURLs || [],
        });
    }, [props.hall]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setProfile((prev) => ({
            ...prev,
            imageURLs: [...prev.imageURLs, ...newPreviews],
        }));
    };

    const handleSave = () => {
        console.log("Saving hall profile:", profile);
        alert("Lưu thành công!");
        // TODO: gọi API update
    };

    const handleViewImage = (url) => {
        setSelectedImage(url);
        setShowModal(true);
    };

    const handleDeleteImage = (url) => {
        if (window.confirm("Bạn có chắc muốn xóa ảnh này không?")) {
            setProfile((prev) => ({
                ...prev,
                imageURLs: prev.imageURLs.filter((img) => img !== url),
            }));
        }
    };

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Thông tin sảnh</h4>
                    <Button variant="secondary" className="mb-3" onClick={props.onBack}>
                        ← Quay lại
                    </Button>
                </div>

                <Form>
                    {/* --- Thông tin cơ bản --- */}
                    <Form.Group controlId="hallName" className="mb-3">
                        <Form.Label>Tên sảnh</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="hallCapacity">
                                <Form.Label>Sức chứa (khách)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="capacity"
                                    value={profile.capacity}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="hallArea">
                                <Form.Label>Diện tích (m²)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="area"
                                    value={profile.area}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="hallPrice">
                                <Form.Label>Giá thuê (₫)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={profile.price}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="hallDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="description"
                            value={profile.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* --- Ảnh --- */}
                    <Form.Group className="mb-4" controlId="hallImages">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type="file" multiple accept="image/*" onChange={handleImagesChange} />
                        <Row className="mt-3">
                            {profile.imageURLs && profile.imageURLs.length > 0 ? (
                                profile.imageURLs.map((img, idx) => (
                                    <Col md={3} key={idx} className="mb-3 text-center">
                                        <div style={{ position: "relative" }}>
                                            <Image
                                                src={img}
                                                thumbnail
                                                onClick={() => handleViewImage(img)}
                                                style={{
                                                    width: "100%",
                                                    height: "150px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    cursor: "pointer",
                                                }}
                                            />
                                            <Button
                                                onClick={() => handleDeleteImage(img)}
                                                style={{
                                                    position: "absolute",
                                                    top: "6px",
                                                    right: "6px",
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <em>Chưa có ảnh nào.</em>
                                </Col>
                            )}
                        </Row>
                    </Form.Group>

                    <Button variant="primary" onClick={handleSave}>
                        Lưu
                    </Button>

                    {/* --- Modal xem ảnh --- */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                        <Modal.Body className="text-center">
                            {selectedImage && (
                                <Image
                                    src={selectedImage}
                                    fluid
                                    style={{ maxHeight: "80vh", borderRadius: "10px" }}
                                />
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            </Card.Body>
        </Card>
    );
}
