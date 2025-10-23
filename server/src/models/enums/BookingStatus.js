const BookingStatus = {
  PENDING: 0,     // Khách gửi yêu cầu
  ACCEPTED: 1,    // Partner chấp nhận
  REJECTED: 2,    // Partner từ chối
  CONFIRMED: 3,   // Customer xác nhận
  DEPOSITED: 4,   // Đã đặt cọc
  EXPIRED: 5,     // Hết hạn
  CANCELLED: 6,   // Hủy
  COMPLETED: 7,   // Hoàn tất sau sự kiện
};

export default BookingStatus;