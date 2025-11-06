import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/BookingListStyle.css"; // now only keeps bespoke overlay/rating styles
import { bookings as mockBookings } from "./ValueStore";
import BookingCard from "./components/BookingCard";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const statusMap = {
  0: "Pending",
  1: "Confirmed",
  2: "Cancelled",
  3: "Deposited",
  4: "Completed"
};

const statusColor = {
  0: "#e67e22",
  1: "#27ae60",
  2: "#c0392b",
  3: "#2980b9",
  4: "#2ecc71"
};

// NEW: banner mapping (VN labels)
const STATUS_BANNERS = {
  0: { text: "ĐANG CHỜ", color: statusColor[0] },
  1: { text: "ĐÃ XÁC NHẬN", color: statusColor[1] },
  2: { text: "ĐÃ HỦY", color: statusColor[2] },
  3: { text: "ĐÃ ĐẶT CỌC", color: statusColor[3] },
  4: { text: "ĐÃ HOÀN THÀNH", color: statusColor[4] }
};

// Placeholders (real logic implemented inside component)
function handleTransfer(b) { console.log("Transfer deposit for booking", b.bookingID); }
function handleReview(b) { console.log("Review booking", b.bookingID); }
// NEW: open contract detail in new tab
function handleViewContract(b) {
  // Nếu có mã hợp đồng dùng nó, fallback bookingID
  const code = b.contract?.code || b.bookingID;
  window.open(`/contract/${code}`, "_blank", "noopener");
}

function formatPrice(v) {
  if (v == null) return "N/A";
  return v.toLocaleString("vi-VN") + "₫";
}

function BookingListPage() {
  const navigate = useNavigate();
  // Load persisted bookings from sessionStorage and merge with mock (avoid duplicates by bookingID)
  let persisted = [];
  try {
    persisted = JSON.parse(sessionStorage.getItem("customerBookings") || "[]");
  } catch { }

  const mergedBookings = [...persisted, ...mockBookings.filter(m => !persisted.some(p => p.bookingID === m.bookingID))];

  // Local state to reflect status updates (confirm / cancel)
  const [bookingsData, setBookingsData] = useState(mergedBookings);

  function persist(updated) {
    try {
      // Lưu toàn bộ danh sách (bao gồm cả mock đã chỉnh sửa) để không mất trạng thái sau reload
      sessionStorage.setItem("customerBookings", JSON.stringify(updated));
    } catch (e) { console.warn("Persist bookings failed", e); }
  }

  function handleConfirm(b, note) {
    setBookingsData(prev => {
      const updated = prev.map(it => it.bookingID === b.bookingID ? { ...it, status: 1, confirmNote: note || "" } : it);
      persist(updated);
      return updated;
    });
  }

  function handleCancel(b, note) {
    setBookingsData(prev => {
      const updated = prev.map(it => it.bookingID === b.bookingID ? { ...it, status: 2, cancelReason: note || "" } : it);
      persist(updated);
      return updated;
    });
  }

  function handleTransferWrapper(b) { handleTransfer(b); }
  function handleReviewWrapper(b, payload) { handleReview(b, payload); }

  function handleOpenContract(b) {
    // Lưu toàn bộ dữ liệu booking để trang chi tiết dùng
    sessionStorage.setItem(`booking_${b.bookingID}`, JSON.stringify(b));
    navigate(`/booking/${b.bookingID}`);
  }

  // (Nếu muốn cả nút xem hợp đồng sau khi đặt cọc dùng chung:)
  function handleViewContract(b) {
    sessionStorage.setItem(`booking_${b.bookingID}`, JSON.stringify(b));
    navigate(`/booking/${b.bookingID}`);
  }

  return (
    <>
      <Header />
      <main className="container py-4 py-md-5" style={{marginTop: '3rem'}}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="h4 mb-0 theme-text-primary">Danh sách đặt nhà hàng</h2>
        </div>
        <div className="row g-4">
          {bookingsData.map(b => (
            <div key={b.bookingID} className="col-12">
              <BookingCard
                booking={b}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onTransfer={handleTransferWrapper}
                onOpenContract={handleOpenContract}
                onReview={handleReviewWrapper}
                onViewContract={handleViewContract}
              />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BookingListPage;