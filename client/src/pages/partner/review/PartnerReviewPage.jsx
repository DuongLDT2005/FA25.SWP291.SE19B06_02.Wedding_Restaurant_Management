import React, { useMemo, useState } from "react";
import { Card, Table, Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import PartnerLayout from "../../../layouts/PartnerLayout";
import RatingStars from "../../../components/RatingStars";
const mockReviews = [
    {
        reviewId: "R001",
        bookingID: "BK001",
        restaurant: "The Rose Hall",
        customerName: "Nguyễn Văn B",
        rating: 5,
        comment: "Dịch vụ tuyệt vời!",
        date: "2025-10-01T14:30:00",
        status: "Visible",
        bookingComplete: true,
    },
    {
        reviewId: "R002",
        bookingID: "BK002",
        restaurant: "Sunshine Hotel",
        customerName: "Trần Thị C",
        rating: 4,
        comment: "Rất đẹp nhưng món ăn hơi nhạt.",
        date: "2025-10-05T11:15:00",
        status: "Hidden",
        bookingComplete: true,
    },
];

export default function PartnerReviewPage() {
    const [selectedReview, setSelectedReview] = useState(null);

    // Chỉ lấy review hiển thị và bookingComplete
    const visibleReviews = useMemo(
        () =>
            mockReviews.filter(
                (r) => r.status === "Visible" && r.bookingComplete
            ),
        []
    );

    return (
        <PartnerLayout>
            <div className="p-3">
                <h3>
                    <i className="bi bi-chat-left-text me-2 text-primary"></i>
                    Đánh giá của khách
                </h3>

                <Card className="mt-3">
                    <Card.Body>
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Nhà hàng</th>
                                    <th>Nội dung</th>
                                    <th>Đánh giá</th>
                                    <th>Ngày review</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleReviews.map((r) => (
                                    <tr key={r.reviewId}>
                                        <td>
                                            <Link
                                                to={`/partner/bookings/${r.bookingID}`}
                                                className="text-primary text-decoration-none"
                                            >
                                                <i className="bi bi-bookmark me-1"></i>
                                                {r.bookingID}
                                            </Link>
                                        </td>
                                        <td>
                                            <i className="bi bi-shop me-1"></i>
                                            {r.restaurant}
                                        </td>
                                        <td>{r.comment}</td>
                                        <td>
                                            <RatingStars rating={r.rating} />
                                        </td>
                                        <td>
                                            <i className="bi bi-calendar-event me-1"></i>
                                            {new Date(r.date).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                onClick={() => setSelectedReview(r)}
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                Xem
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* Modal chi tiết review */}
                {selectedReview && (
                    <Modal
                        show={true}
                        onHide={() => setSelectedReview(null)}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <i className="bi bi-chat-left-text me-2"></i>
                                Review chi tiết
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                <strong>
                                    <i className="bi bi-bookmark me-1"></i>
                                    Booking ID:
                                </strong>{" "}
                                {selectedReview.bookingID}
                            </p>
                            <p>
                                <strong>
                                    <i className="bi bi-shop me-1"></i>
                                    Nhà hàng:
                                </strong>{" "}
                                {selectedReview.restaurant}
                            </p>
                            <p>
                                <strong>
                                    <i className="bi bi-person-circle me-1"></i>
                                    Khách:
                                </strong>{" "}
                                {selectedReview.customerName}
                            </p>
                            <p>
                                <strong>
                                    <i className="bi bi-star-fill me-1"></i>
                                    Đánh giá:
                                </strong>{" "}
                                <RatingStars rating={selectedReview.rating} />
                            </p>
                            <p>
                                <strong>
                                    <i className="bi bi-chat-text me-1"></i>
                                    Nội dung:
                                </strong>{" "}
                                {selectedReview.comment}
                            </p>
                            <p>
                                <strong>
                                    <i className="bi bi-calendar-event me-1"></i>
                                    Ngày review:
                                </strong>{" "}
                                {new Date(selectedReview.date).toLocaleString("vi-VN")}
                            </p>
                        </Modal.Body>
                    </Modal>
                )}
            </div>
        </PartnerLayout>
    );
}