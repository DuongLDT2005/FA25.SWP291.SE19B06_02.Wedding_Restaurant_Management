
import { useState } from "react"
import { Card, Row, Col } from "react-bootstrap"
import StatusBadge from "./StatusBadge"
import BookingInfo from "./BookingInfo"
import BookingActions from "./BookingAction"
import ConfirmModal from "./ConfirmModal"
import CancelModal from "./CancelModal"
import ReviewModal from "./ReviewModal"
import ScrollToTopButton from "../../../components/ScrollToTopButton"

export default function BookingCard({
  booking,
  onConfirm,
  onCancel,
  onTransfer,
  onOpenContract,
  onReview,
  onViewContract,
}) {
  const b = booking

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  function handleConfirmSubmit(note) {
    onConfirm?.(b, note)
    setShowConfirmModal(false)
  }

  function handleCancelSubmit(reason) {
    onCancel?.(b, reason)
    setShowCancelModal(false)
  }

  function handleReviewSubmit(reviewPayload) {
    onReview?.(b, reviewPayload)
    setShowReviewModal(false)
  }

  function buildDetailPayload(b) {
    // Build customer info strictly from booking data (not auth)
    console.log(b);
    const embeddedUser = b.customer?.user || {}
    const customer = {
      fullName: b.customer?.fullName || embeddedUser.fullName || embeddedUser.name || "Khách hàng",
      phone: b.customer?.phone || embeddedUser.phone || "N/A",
      email: b.customer?.email || embeddedUser.email || "N/A",
    }
    return {
      bookingID: b.bookingID,
      status: b.status ?? 0,
      eventType: b.eventType || "Tiệc cưới",
      eventDate: b.eventDate,
      startTime: b.startTime || "18:00",
      endTime: b.endTime || "22:00",
      tableCount: b.tableCount || b.tables || 0,
      specialRequest: b.specialRequest || b.note || "",
      createdAt: b.createdAt || new Date().toISOString(),
      customer,
      restaurant: {
        name: b.restaurant?.name || "Nhà hàng",
        address: b.restaurant?.fullAddress || "Đang cập nhật",
        thumbnailURL: b.restaurant?.thumbnailURL || "",
      },
      hall: b.hall || {
        name: b.name || "Sảnh",
        capacity:  b.tableCount * 10,
        area: b.hallArea || 0,
      },
      menu: b.menu || {
        name: b.name || "Menu đã chọn",
        price: b.price || 0,
        categories: b.menu?.categories || [],
      },
      services: b.bookingservices || [],
      payments: b.payments || [],
      contract: b.contract || {
        content: "Hợp đồng dịch vụ...",
        status: 0,
        signedAt: null,
      },
      originalPrice: b.originalPrice || b.price || 0,
      discountAmount: b.discountAmount || 0,
      VAT: b.VAT || 0,
      totalAmount: b.totalAmount || b.total || b.price || 0,
    }
  }

  function prepareAndStore() {
    const payload = buildDetailPayload(b)
    try {
      sessionStorage.setItem(`booking_${payload.bookingID}`, JSON.stringify(payload))
      // keep legacy key for backward compatibility
      sessionStorage.setItem("currentBooking", JSON.stringify(payload))
    } catch {}
    return payload
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  return (
    <>
      <Card
        // className="border-0 overflow-hidden"
        style={{
          cursor: "pointer",
          background: '#ffffff',
          borderRadius: '12px'
        }}
      >
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col xs={3}>
              <Card.Img
                src={b.restaurant.thumbnailURL || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={b.restaurant.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  transition: 'transform 0.3s ease'
                }}
              />
            </Col>

            <Col xs={6}>
              <div>
                <h3
                  className="mb-2"
                  style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    letterSpacing: '-0.3px'
                  }}
                >
                  {b.restaurant.name}
                </h3>

                <div style={{
                  fontSize: "0.85rem",
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  {b.eventDate}
                </div>

                <div style={{
                  fontSize: "0.85rem",
                  color: '#6b7280',
                  marginBottom: '8px'
                }}>
                  {b.restaurant.fullAddress || "Chưa có địa chỉ"}
                </div>

                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  ...(b.status === 1 ? {
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: 'rgb(22, 163, 74)'
                  } : b.status === 2 ? {
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'rgb(220, 38, 38)'
                  } : {
                    background: 'rgba(250, 204, 21, 0.1)',
                    color: 'rgb(202, 138, 4)'
                  })
                }}>
                  {b.status === 1 ? 'Đã hoàn thành' : b.status === 2 ? 'Đã hủy' : 'Đang xử lý'}
                </div>
              </div>
            </Col>

            <Col xs={3} className="text-end">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px'
              }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'rgb(225, 29, 72)',
                }}>
                  {formatPrice(b.totalAmount || b.total || b.price || 0)} VND
                </div>

                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle menu click
                  }}
                >
                </button>
              </div>
            </Col>
          </Row>

          <div style={{
            borderTop: '1px solid #f3f4f6',
            marginTop: '12px',
            paddingTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '6px',
          }}>
            <BookingActions
              booking={b}
              onConfirm={() => setShowConfirmModal(true)}
              onCancel={() => setShowCancelModal(true)}
              onTransfer={() => onTransfer?.(b)}
              onReview={() => setShowReviewModal(true)}
              prepareAndStore={prepareAndStore}
              compact={true}
            />
          </div>
        </Card.Body>
      </Card>

      <ConfirmModal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} onConfirm={handleConfirmSubmit} />

      <CancelModal show={showCancelModal} onHide={() => setShowCancelModal(false)} onCancel={handleCancelSubmit} />

      <ReviewModal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        booking={b}
      />

      <ScrollToTopButton />
    </>
  )
}