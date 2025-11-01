import BookingStatus from "../../models/enums/BookingStatus.js";

/**
 * Trả về nội dung email tùy theo trạng thái Booking
 * @param {number} status - Giá trị enum trong BookingStatus
 * @param {string} bookingID - Mã booking để chèn vào link hoặc nội dung
 * @returns {object} { subject, html, target }
 */
export function getBookingTemplate(status, bookingID) {
  switch (status) {
    // ---------------- PENDING ----------------
    case BookingStatus.PENDING:
      return {
        subject: "📩 Yêu cầu đặt tiệc mới từ khách hàng",
        html: `
          <h2>Yêu cầu đặt tiệc mới</h2>
          <p>Mã đơn: <b>${bookingID}</b></p>
          <p>Khách hàng vừa gửi yêu cầu đặt tiệc. Vui lòng kiểm tra và xác nhận sảnh của bạn.</p>
          <p><a href="https://yourdomain.com/partner/bookings/${bookingID}">Xem chi tiết</a></p>
        `,
        target: "partner"
      };

    // ---------------- ACCEPTED ----------------
    case BookingStatus.ACCEPTED:
      return {
        subject: "🎉 Đơn đặt tiệc của bạn đã được chấp nhận!",
        html: `
          <h2>Chúc mừng!</h2>
          <p>Đơn đặt tiệc <b>${bookingID}</b> của bạn đã được nhà hàng chấp nhận.</p>
          <p>Hãy xác nhận lại để tiến hành đặt cọc và hoàn tất quy trình.</p>
          <p><a href="https://yourdomain.com/customer/bookings/${bookingID}">Xem chi tiết</a></p>
        `,
        target: "customer"
      };

    // ---------------- REJECTED ----------------
    case BookingStatus.REJECTED:
      return {
        subject: "❌ Đơn đặt tiệc của bạn đã bị từ chối",
        html: `
          <h2>Rất tiếc!</h2>
          <p>Đơn đặt tiệc <b>${bookingID}</b> của bạn đã bị nhà hàng từ chối.</p>
          <p>Bạn có thể chọn sảnh hoặc thời gian khác để tiếp tục đặt.</p>
        `,
        target: "customer"
      };

    // ---------------- CONFIRMED ----------------
    case BookingStatus.CONFIRMED:
      return {
        subject: "✅ Khách hàng đã xác nhận đơn đặt tiệc",
        html: `
          <h2>Xác nhận thành công</h2>
          <p>Khách hàng đã xác nhận đơn đặt tiệc <b>${bookingID}</b>.</p>
          <p>Bạn có thể liên hệ khách hàng để tiến hành đặt cọc.</p>
        `,
        target: "partner"
      };

    // ---------------- DEPOSITED ----------------
    case BookingStatus.DEPOSITED:
      return {
        subject: "💰 Đơn đặt tiệc đã được đặt cọc",
        html: `
          <h2>Đặt cọc thành công</h2>
          <p>Khách hàng đã đặt cọc cho đơn <b>${bookingID}</b>.</p>
          <p>Hệ thống sẽ cập nhật trạng thái khi tiệc hoàn tất.</p>
        `,
        target: "both"
      };

    // ---------------- EXPIRED ----------------
    case BookingStatus.EXPIRED:
      return {
        subject: "⏰ Đơn đặt tiệc đã hết hạn",
        html: `
          <h2>Đơn đặt tiệc hết hạn</h2>
          <p>Đơn <b>${bookingID}</b> đã hết thời gian chờ xác nhận.</p>
          <p>Khách hàng hoặc partner cần tạo lại đơn mới nếu muốn tiếp tục.</p>
        `,
        target: "both"
      };

    // ---------------- CANCELLED ----------------
    case BookingStatus.CANCELLED:
      return {
        subject: "🚫 Đơn đặt tiệc đã bị hủy",
        html: `
          <h2>Đơn đặt tiệc bị hủy</h2>
          <p>Đơn <b>${bookingID}</b> đã bị hủy bởi người dùng hoặc nhà hàng.</p>
          <p>Vui lòng kiểm tra lại lịch trình hoặc liên hệ hỗ trợ.</p>
        `,
        target: "both"
      };

    // ---------------- COMPLETED ----------------
    case BookingStatus.COMPLETED:
      return {
        subject: "🎊 Tiệc đã hoàn tất – Cảm ơn bạn!",
        html: `
          <h2>Cảm ơn bạn đã sử dụng dịch vụ!</h2>
          <p>Đơn đặt tiệc <b>${bookingID}</b> đã được hoàn tất thành công.</p>
          <p>Chúc bạn có một buổi tiệc tuyệt vời, hẹn gặp lại!</p>
        `,
        target: "customer"
      };

    // ---------------- DEFAULT ----------------
    default:
      return {
        subject: "📢 Cập nhật trạng thái đơn đặt tiệc",
        html: `
          <h2>Cập nhật trạng thái</h2>
          <p>Đơn <b>${bookingID}</b> đã được cập nhật trạng thái mới (${status}).</p>
        `,
        target: "both"
      };
  }
}
