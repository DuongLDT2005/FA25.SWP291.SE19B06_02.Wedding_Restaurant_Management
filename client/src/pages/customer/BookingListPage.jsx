"use client"

import { useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import Header from "../../components/header/Header"
import Footer from "../../components/Footer"
import BookingCard from "./components/BookingCard"
import { useNavigate } from "react-router-dom"
import ScrollToTopButton from "../../components/ScrollToTopButton"
import { bookings as mockBookings } from "./ValueStore"
import "bootstrap/dist/css/bootstrap.min.css"

function BookingListPage() {
  const navigate = useNavigate()

  // Load persisted bookings from sessionStorage and merge with mock
  let persisted = []
  try {
    persisted = JSON.parse(sessionStorage.getItem("customerBookings") || "[]")
  } catch {}

  const mergedBookings = [
    ...persisted,
    ...mockBookings.filter((m) => !persisted.some((p) => p.bookingID === m.bookingID)),
  ]

  const [bookingsData, setBookingsData] = useState(mergedBookings)

  function persist(updated) {
    try {
      sessionStorage.setItem("customerBookings", JSON.stringify(updated))
    } catch (e) {
      console.warn("Persist bookings failed", e)
    }
  }

  function handleConfirm(b, note) {
    setBookingsData((prev) => {
      const updated = prev.map((it) =>
        it.bookingID === b.bookingID ? { ...it, status: 1, confirmNote: note || "" } : it,
      )
      persist(updated)
      return updated
    })
  }

  function handleCancel(b, note) {
    setBookingsData((prev) => {
      const updated = prev.map((it) =>
        it.bookingID === b.bookingID ? { ...it, status: 2, cancelReason: note || "" } : it,
      )
      persist(updated)
      return updated
    })
  }

  function handleTransfer(b) {
    console.log("Transfer deposit for booking", b.bookingID)
  }

  function handleReview(b, payload) {
    console.log("Review booking", b.bookingID, payload)
  }

  function handleOpenContract(b) {
    sessionStorage.setItem(`booking_${b.bookingID}`, JSON.stringify(b))
    navigate(`/booking/${b.bookingID}`)
  }

  function handleViewContract(b) {
    sessionStorage.setItem(`booking_${b.bookingID}`, JSON.stringify(b))
    navigate(`/booking/${b.bookingID}`)
  }

  return (
    <>
      <Header />
      <div style={{ 
        background: '#ffffff',
        minHeight: '100vh',
        paddingTop: '40px',
        paddingBottom: '60px'
      }}>
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col lg={6} md={8} xs={12} className="offset-lg-1">
              <div style={{
                borderLeft: '4px solid rgba(131, 18, 43, 1)',
                paddingLeft: '20px',
                marginBottom: '30px'
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'rgba(131, 18, 43, 1)',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px'
                }}>
                  Lịch sử đặt chỗ
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  margin: 0
                }}>
                  Quản lý và theo dõi các đặt chỗ của bạn
                </p>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col lg={10} md={10} xs={12} className="offset-lg-1 offset-md-1">
              <div>
                {bookingsData.length === 0 ? (
                  <div style={{
                    background: '#ffffff',
                    border: '2px dashed #e5e7eb',
                    borderRadius: '16px',
                    padding: '60px 40px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, rgb(225, 29, 72) 0%, rgb(190, 24, 61) 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 30px rgba(225, 29, 72, 0.2)'
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <p style={{ 
                      fontSize: '1.25rem', 
                      color: '#1f2937',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Chưa có đặt chỗ nào
                    </p>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      margin: 0
                    }}>
                      Bạn chưa thực hiện đặt chỗ nào. Hãy bắt đầu đặt chỗ ngay hôm nay!
                    </p>
                  </div>
                ) : (
                  bookingsData.map((b) => (
                    <div key={b.bookingID} style={{
                      marginBottom: '24px',
                      borderRadius: '12px',
                      border: '1px solid #f3f4f6',
                      transition: 'all 0.3s ease',
                      background: '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(225, 29, 72, 0.12)'
                      e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'
                      e.currentTarget.style.borderColor = '#f3f4f6'
                    }}>
                      <BookingCard
                        booking={b}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        onTransfer={handleTransfer}
                        onOpenContract={handleOpenContract}
                        onReview={handleReview}
                        onViewContract={handleViewContract}
                      />
                    </div>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ScrollToTopButton />
      <Footer />
    </>
  )
}

export default BookingListPage