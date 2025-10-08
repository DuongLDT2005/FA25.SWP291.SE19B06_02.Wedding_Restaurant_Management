import React, { useState } from "react";
import { Link } from "react-router-dom";
// import "../../styles/BookingCardStyle.css";
const statusColor = {
  0: "#e67e22",
  1: "#27ae60",
  2: "#c0392b",
  3: "#2980b9",
  4: "#2ecc71"
};

const STATUS_BANNERS = {
  0: { text: "ĐANG CHỜ", color: statusColor[0] },
  1: { text: "ĐÃ XÁC NHẬN", color: statusColor[1] },
  2: { text: "ĐÃ HỦY", color: statusColor[2] },
  3: { text: "ĐÃ ĐẶT CỌC", color: statusColor[3] },
  4: { text: "ĐÃ HOÀN THÀNH", color: statusColor[4] }
};

function formatPrice(v) {
  if (v == null) return "N/A";
  return v.toLocaleString("vi-VN") + "₫";
}

export default function BookingCard({
  booking,
  onConfirm,
  onCancel,
  onTransfer,
  onOpenContract,
  onReview,
  onViewContract
}) {
  const b = booking;
  const banner = STATUS_BANNERS[b.status];
  const [pendingAction, setPendingAction] = useState(null); // 'confirm' | 'cancel' | null
  const [reason, setReason] = useState("");

  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);           // File[]
  const [imagePreviews, setImagePreviews] = useState([]); // urls

  function closePopup() {
    setPendingAction(null);
    setReason("");
  }
  function submitAction() {
    if (pendingAction === "confirm") onConfirm?.(b, reason);
    if (pendingAction === "cancel") onCancel?.(b, reason);
    closePopup();
  }

  function handleImages(e) {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const urls = files.map(f => URL.createObjectURL(f));
    setImagePreviews(urls);
  }
  function resetReview() {
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setImages([]);
    imagePreviews.forEach(u => URL.revokeObjectURL(u));
    setImagePreviews([]);
  }
  function submitReview() {
    // simple validation
    if (rating === 0) {
      alert("Chọn số sao trước khi gửi.");
      return;
    }
    const reviewPayload = {
      bookingID: b.bookingID,
      rating,
      content: reviewText.trim(),
      images
    };
    onReview?.(b, reviewPayload);
    resetReview();
    setShowReview(false);
  }

  function buildDetailPayload(b) {
    const tokenRaw = localStorage.getItem("token");
    let user = {};
    try { user = tokenRaw ? JSON.parse(tokenRaw) : {}; } catch {}
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
      customer: {
        fullName: user.fullName || b.customer?.fullName || "Khách hàng",
        phone: user.phone || b.customer?.phone || "N/A",
        email: user.email || b.customer?.email || "N/A"
      },
      restaurant: {
        name: b.restaurant?.name || "Nhà hàng",
        address: b.restaurant?.address || b.restaurant?.fullAddress || "Đang cập nhật",
        thumbnailURL: b.restaurant?.thumbnailURL || ""
      },
      hall: b.hall || {
        name: b.hallName || "Sảnh",
        capacity: b.tableCount ? b.tableCount * 10 : 0,
        area: b.hallArea || 0
      },
      menu: b.menu || {
        name: b.menuName || "Menu đã chọn",
        price: b.pricePerTable || 0,
        categories: b.menu?.categories || []
      },
      services: b.services || [],
      payments: b.payments || [],
      contract: b.contract || {
        content: "Hợp đồng dịch vụ...",
        status: 0,
        signedAt: null
      },
      originalPrice: b.originalPrice || b.price || 0,
      discountAmount: b.discountAmount || 0,
      VAT: b.VAT || 0,
      totalAmount: b.totalAmount || b.total || b.price || 0
    };
  }

  function prepareAndStore() {
    const payload = buildDetailPayload(b);
    sessionStorage.setItem("currentBooking", JSON.stringify(payload));
    return payload;
  }

  return (
    <div className="booking--item booking-item-root">
      <img
        className="booking--img booking-card-img"
        src={b.restaurant.thumbnailURL || "https://via.placeholder.com/220x140?text=No+Image"}
        alt={b.restaurant.name}
      />
      <div className="booking--details">
        <div className="booking--restaurant-name">{b.restaurant.name}</div>
        <div className="booking--address">
          {b.restaurant.address || "No address provided"}
        </div>
        <div className="booking--info-row">
          <strong>Event:</strong>&nbsp;
          {b.eventDate} | {b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : ""}
        </div>
        <div className="booking--info-row">
          <strong>Tables:</strong>&nbsp;{b.tableCount}
        </div>
        <div className="booking--info-row">
          <strong>Price:</strong>&nbsp;{formatPrice(b.price)}
        </div>
        <div className="booking--info-row">
          <strong>Special Request:</strong>&nbsp;{b.specialRequest || "None"}
        </div>
      </div>
      <div className="booking--right">
        {b.status === 0 && (
          <div className="booking--actions">
            <button className="booking--btn" onClick={() => setPendingAction("confirm")}>Xác nhận</button>
            <button className="booking--btn danger" onClick={() => setPendingAction("cancel")}>Hủy</button>
          </div>
        )}
        {b.status === 1 && (
          <div className="booking--actions">
            <button className="booking--btn" onClick={() => onTransfer?.(b)}>Đặt cọc</button>
            <Link
              to={`/booking/${b.bookingID}`}
              className="booking--btn secondary"
              state={{ booking: prepareAndStore() }}
            >
              Xem hợp đồng
            </Link>
          </div>
        )}
        {b.status === 3 && (
          <div className="booking--actions">
            <Link
              to={`/booking/${b.bookingID}`}
              className="booking--btn secondary"
              state={{ booking: prepareAndStore() }}
            >
              Xem hợp đồng
            </Link>
          </div>
        )}
        {b.status === 4 && (
          <div className="booking--actions">
            <button className="booking--btn" onClick={() => setShowReview(true)}>Tạo đánh giá</button>
          </div>
        )}
      </div>
      {banner && (
        <div
          className="booking-status-banner"
          style={{ backgroundColor: banner.color }}
        >
          {banner.text}
        </div>
      )}
      {pendingAction && (
        <div className="booking-overlay">
          <div className="booking-dialog">
            <div className="dialog-title">
              {pendingAction === "confirm" ? "Xác nhận đặt chỗ?" : "Hủy đặt chỗ?"}
            </div>
            <div className="dialog-text">
              {pendingAction === "confirm"
                ? "Bạn có chắc chắn muốn xác nhận đặt chỗ này? Thao tác sẽ cập nhật trạng thái."
                : "Bạn có chắc chắn muốn hủy đặt chỗ này? Thao tác không thể hoàn tác."}
            </div>
            <label className="dialog-label">
              Ghi chú (tuỳ chọn)
            </label>
            <textarea
              className="dialog-textarea"
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder={pendingAction === "confirm" ? "Ghi chú thêm khi xác nhận..." : "Lý do hủy..."}
            />
            <div className="dialog-actions">
              <button
                type="button"
                onClick={closePopup}
                className="dialog-btn dialog-btn-light"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={submitAction}
                className={`dialog-btn ${pendingAction === "confirm" ? "dialog-btn-confirm" : "dialog-btn-cancel"}`}
              >
                {pendingAction === "confirm" ? "Xác nhận" : "Hủy đặt chỗ"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showReview && (
        <div className="booking-overlay">
          <div
            className="booking-dialog review-dialog"
            onMouseLeave={() => setHoverRating(0)}
          >
            <div className="dialog-title">Đánh giá nhà hàng</div>
            <div className="rating-block">
              <div className="dialog-label inline">
                Chọn số sao (cho phép 0.5)<span className="required">*</span>
              </div>
              <div className="rating-stars">
                {[1,2,3,4,5].map(i => {
                  const display = hoverRating || rating;
                  const fill = display >= i ? 1 : display >= (i - 0.5) ? 0.5 : 0;
                  return (
                    <span
                      key={i}
                      className="rating-star-wrap"
                      aria-label={`Sao thứ ${i}`}
                    >
                      <span className="rating-star-base">★</span>
                      <span
                        className="rating-star-fill"
                        style={{ width: `${fill * 100}%` }}
                      >
                        ★
                      </span>
                      <span
                        className="rating-half-zone left"
                        onMouseEnter={() => setHoverRating(i - 0.5)}
                        onClick={() => setRating(i - 0.5)}
                        aria-label={`${i - 0.5} sao`}
                      />
                      <span
                        className="rating-half-zone right"
                        onMouseEnter={() => setHoverRating(i)}
                        onClick={() => setRating(i)}
                        aria-label={`${i} sao`}
                      />
                    </span>
                  );
                })}
              </div>
              <div className="rating-selected">
                Đã chọn: {rating ? `${rating.toFixed(1)} / 5` : "Chưa chọn"}
              </div>
            </div>

            <div className="dialog-label">Nội dung đánh giá</div>
            <textarea
              className="dialog-textarea review-textarea"
              rows={5}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về chất lượng món ăn, phục vụ, không gian..."
            />

            <div className="dialog-label">Hình ảnh (tối đa 6)</div>
            <input
              className="review-input-file"
              type="file"
              accept="image/*"
              multiple
              onChange={e => {
                const files = Array.from(e.target.files || []).slice(0,6);
                handleImages({ target: { files } });
              }}
            />
            {!!imagePreviews.length && (
              <div className="review-image-grid">
                {imagePreviews.map((src,i) => (
                  <div key={i} className="review-img-wrapper">
                    <img src={src} alt={`preview-${i}`} className="review-img" />
                    <button
                      type="button"
                      className="review-img-remove"
                      onClick={() => {
                        const newImgs = [...images];
                        newImgs.splice(i,1);
                        images[i] && URL.revokeObjectURL(imagePreviews[i]);
                        setImages(newImgs);
                        const newPrev = [...imagePreviews];
                        newPrev.splice(i,1);
                        setImagePreviews(newPrev);
                      }}
                      aria-label="Xóa ảnh"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="review-note">
              Chỉ chọn ảnh liên quan (jpg, png). Ấn nút × để xóa.
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                className="dialog-btn dialog-btn-light"
                onClick={() => { resetReview(); setShowReview(false); }}
              >
                Hủy
              </button>
              <button
                type="button"
                className="dialog-btn dialog-btn-submit"
                onClick={submitReview}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}