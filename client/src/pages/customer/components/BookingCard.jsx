import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const statusColor = { 0: "#e67e22", 1: "#27ae60", 2: "#c0392b", 3: "#2980b9", 4: "#2ecc71" };
const STATUS_BANNERS = {
  0: { text: "ĐANG CHỜ", color: statusColor[0] },
  1: { text: "ĐÃ XÁC NHẬN", color: statusColor[1] },
  2: { text: "ĐÃ HỦY", color: statusColor[2] },
  3: { text: "ĐÃ ĐẶT CỌC", color: statusColor[3] },
  4: { text: "ĐÃ HOÀN THÀNH", color: statusColor[4] }
};

function formatPrice(v) { return v == null ? "N/A" : v.toLocaleString("vi-VN") + "₫"; }

export default function BookingCard({ booking, onConfirm, onCancel, onTransfer, onOpenContract, onReview, onViewContract }) {
  const b = booking;
  const banner = STATUS_BANNERS[b.status];
  const [pendingAction, setPendingAction] = useState(null); // confirm | cancel
  const [reason, setReason] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  function closePopup() { setPendingAction(null); setReason(""); }
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
    setRating(0); setHoverRating(0); setReviewText("");
    images.forEach((_,i) => imagePreviews[i] && URL.revokeObjectURL(imagePreviews[i]));
    setImages([]); setImagePreviews([]);
  }
  function submitReview() {
    if (rating === 0) { alert("Chọn số sao trước khi gửi."); return; }
    const reviewPayload = { bookingID: b.bookingID, rating, content: reviewText.trim(), images };
    onReview?.(b, reviewPayload);
    resetReview();
    setShowReview(false);
  }

  function buildDetailPayload(b) {
    const tokenRaw = localStorage.getItem("token");
    let user = {}; try { user = tokenRaw ? JSON.parse(tokenRaw) : {}; } catch {}
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
      contract: b.contract || { content: "Hợp đồng dịch vụ...", status: 0, signedAt: null },
      originalPrice: b.originalPrice || b.price || 0,
      discountAmount: b.discountAmount || 0,
      VAT: b.VAT || 0,
      totalAmount: b.totalAmount || b.total || b.price || 0
    };
  }
  function prepareAndStore() { const payload = buildDetailPayload(b); sessionStorage.setItem("currentBooking", JSON.stringify(payload)); return payload; }

  return (
    <div className="card shadow-sm position-relative overflow-hidden">
  {banner && <span className={`badge booking-status-badge status-${b.status}`}>{banner.text}</span>}
      <div className="row g-0">
        <div className="col-12 col-md-4 col-lg-5">{/* 33.33% trên màn hình lớn */}
          <div className="h-100 w-100" style={{ minHeight: 180 }}>
            <img className="booking-card-img rounded-start" src={b.restaurant.thumbnailURL || "https://via.placeholder.com/400x300?text=No+Image"} alt={b.restaurant.name} />
          </div>
        </div>
  <div className="col-12 col-md-8 col-lg-7 p-3 p-md-4 d-flex flex-column flex-lg-row gap-3">
          <div className="flex-grow-1">
            <h5 className="mb-1 theme-text-primary fw-semibold">{b.restaurant.name}</h5>
            <div className="text-muted small mb-2">{b.restaurant.address || "No address provided"}</div>
            <div className="small mb-1"><strong>Sự kiện:</strong> {b.eventDate} {b.startTime && b.endTime ? `| ${b.startTime} - ${b.endTime}` : ""}</div>
            <div className="small mb-1"><strong>Bàn:</strong> {b.tableCount}</div>
            <div className="small mb-1"><strong>Giá:</strong> {formatPrice(b.price)}</div>
            <div className="small"><strong>Ghi chú:</strong> {b.specialRequest || "None"}</div>
          </div>
          <div className="d-flex flex-column align-items-start align-items-md-end justify-content-between" style={{marginTop:"15px"}}>
            <div className="d-flex flex-wrap gap-2">
              {b.status === 0 && <>
                <button className="btn btn-sm btn-success" onClick={() => setPendingAction("confirm")}>Xác nhận</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setPendingAction("cancel")}>Hủy</button>
              </>}
              {b.status === 1 && <>
                <button className="btn btn-sm btn-warning" onClick={() => onTransfer?.(b)}>Đặt cọc</button>
                <Link to={`/booking/${b.bookingID}`} className="btn btn-sm btn-outline-primary" state={{ booking: prepareAndStore() }}>Xem hợp đồng</Link>
              </>}
              {b.status === 3 && <Link to={`/booking/${b.bookingID}`} className="btn btn-sm btn-outline-primary" state={{ booking: prepareAndStore() }}>Xem hợp đồng</Link>}
              {b.status === 4 && <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowReview(true)}>Đánh giá</button>}
            </div>
          </div>
        </div>
      </div>

      {pendingAction && (
        <div className="booking-overlay">
          <div className="booking-dialog">
            <div className="dialog-title">{pendingAction === "confirm" ? "Xác nhận đặt chỗ?" : "Hủy đặt chỗ?"}</div>
            <div className="dialog-text">{pendingAction === "confirm" ? "Bạn có chắc chắn muốn xác nhận đặt chỗ này? Thao tác sẽ cập nhật trạng thái." : "Bạn có chắc chắn muốn hủy đặt chỗ này? Thao tác không thể hoàn tác."}</div>
            <label className="dialog-label">Ghi chú (tuỳ chọn)</label>
            <textarea className="dialog-textarea" value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder={pendingAction === "confirm" ? "Ghi chú thêm khi xác nhận..." : "Lý do hủy..."} />
            <div className="dialog-actions">
              <button type="button" onClick={closePopup} className="btn btn-sm btn-light border">Đóng</button>
              <button type="button" onClick={submitAction} className={`btn btn-sm ${pendingAction === "confirm" ? "btn-success" : "btn-danger"}`}>{pendingAction === "confirm" ? "Xác nhận" : "Hủy đặt chỗ"}</button>
            </div>
          </div>
        </div>
      )}

      {showReview && (
        <div className="booking-overlay">
          <div className="booking-dialog review-dialog" onMouseLeave={() => setHoverRating(0)}>
            <div className="dialog-title">Đánh giá nhà hàng</div>
            <div className="rating-block">
              <div className="dialog-label inline">Chọn số sao (cho phép 0.5)<span className="required">*</span></div>
              <div className="rating-stars">
                {[1,2,3,4,5].map(i => {
                  const display = hoverRating || rating;
                  const fill = display >= i ? 1 : display >= (i - 0.5) ? 0.5 : 0;
                  return (
                    <span key={i} className="rating-star-wrap" aria-label={`Sao thứ ${i}`}>
                      <span className="rating-star-base">★</span>
                      <span className="rating-star-fill" style={{ width: `${fill * 100}%` }}>★</span>
                      <span className="rating-half-zone left" onMouseEnter={() => setHoverRating(i - 0.5)} onClick={() => setRating(i - 0.5)} aria-label={`${i - 0.5} sao`} />
                      <span className="rating-half-zone right" onMouseEnter={() => setHoverRating(i)} onClick={() => setRating(i)} aria-label={`${i} sao`} />
                    </span>
                  );
                })}
              </div>
              <div className="rating-selected">Đã chọn: {rating ? `${rating.toFixed(1)} / 5` : "Chưa chọn"}</div>
            </div>
            <div className="dialog-label">Nội dung đánh giá</div>
            <textarea className="dialog-textarea review-textarea" rows={5} value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn về chất lượng món ăn, phục vụ, không gian..." />
            <div className="dialog-label">Hình ảnh (tối đa 6)</div>
            <input className="form-control form-control-sm mb-2" type="file" accept="image/*" multiple onChange={e => { const files = Array.from(e.target.files || []).slice(0,6); handleImages({ target: { files } }); }} />
            {!!imagePreviews.length && (
              <div className="review-image-grid">
                {imagePreviews.map((src,i) => (
                  <div key={i} className="review-img-wrapper">
                    <img src={src} alt={`preview-${i}`} className="review-img" />
                    <button type="button" className="review-img-remove" onClick={() => {
                      const newImgs = [...images]; newImgs.splice(i,1);
                      images[i] && URL.revokeObjectURL(imagePreviews[i]);
                      setImages(newImgs);
                      const newPrev = [...imagePreviews]; newPrev.splice(i,1); setImagePreviews(newPrev);
                    }} aria-label="Xóa ảnh">×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="review-note">Chỉ chọn ảnh liên quan (jpg, png). Ấn nút × để xóa.</div>
            <div className="dialog-actions">
              <button type="button" className="btn btn-sm btn-light border" onClick={() => { resetReview(); setShowReview(false); }}>Hủy</button>
              <button type="button" className="btn btn-sm btn-primary" onClick={submitReview}>Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}