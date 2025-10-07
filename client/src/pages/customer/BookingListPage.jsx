import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/BookingListStyle.css";
import { bookings } from "./ValueStore";
import BookingCard from "./components/BookingCard";

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

// NEW action handlers (placeholders)
function handleConfirm(b) { console.log("Confirm booking", b.bookingID); }
function handleCancel(b) { console.log("Cancel booking", b.bookingID); }
function handleTransfer(b) { console.log("Transfer deposit for booking", b.bookingID); }
function handleOpenContract(b) { console.log("Open contract form for booking", b.bookingID); }
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
  return (
    <>
      <Header />
      <div className="booking--list">
        <h2>Danh sách đặt nhà hàng</h2>
        {bookings.map(b => (
          <BookingCard
            key={b.bookingID}
            booking={b}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onTransfer={handleTransfer}
            onOpenContract={handleOpenContract}
            onReview={handleReview}
            onViewContract={handleViewContract}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default BookingListPage;