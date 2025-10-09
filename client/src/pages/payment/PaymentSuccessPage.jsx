import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/PaymentSuccessStyles.css';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        // Lấy dữ liệu booking từ sessionStorage (đồng bộ với PaymentPage)
        const bookingInfo = JSON.parse(sessionStorage.getItem('currentBooking') || '{}');
        setBookingData(bookingInfo);
        
        // Tạo dữ liệu thanh toán từ booking info
        if (bookingInfo && bookingInfo.payments && bookingInfo.payments.length > 0) {
            const latestPayment = bookingInfo.payments[bookingInfo.payments.length - 1];
            setPaymentData({
                transactionId: 'TXN-' + Date.now(),
                amount: latestPayment.amount,
                paymentMethod: latestPayment.paymentMethod,
                paymentDate: latestPayment.paymentDate
            });
        }
    }, []);

    // Không cần các hàm này nữa vì sẽ dùng Link

    if (!paymentData) {
        return (
            <div className="payment-success-container">
                <div className="container">
                    <div className="alert alert-warning text-center">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Không tìm thấy thông tin thanh toán. Vui lòng quay lại trang chủ.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Success Header */}
                        <div className="success-header text-center">
                            <div className="success-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <h1 className="success-title">Thanh toán thành công!</h1>
                            <p className="success-subtitle">
                                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                            </p>
                        </div>

                        {/* Payment Details */}
                        <div className="card payment-details-card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-receipt"></i> Chi tiết thanh toán
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="detail-item">
                                            <label>Mã giao dịch:</label>
                                            <span>{paymentData.transactionId || 'TXN-' + Date.now()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Số tiền:</label>
                                            <span className="amount">{paymentData.amount?.toLocaleString()} VNĐ</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Phương thức:</label>
                                            <span>{paymentData.paymentMethod || 'Thẻ tín dụng'}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="detail-item">
                                            <label>Ngày thanh toán:</label>
                                            <span>{new Date().toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Thời gian:</label>
                                            <span>{new Date().toLocaleTimeString('vi-VN')}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Trạng thái:</label>
                                            <span className="status-success">Thành công</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        {bookingData && (
                            <div className="card booking-summary-card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">
                                        <i className="fas fa-calendar-alt"></i> Tóm tắt đặt tiệc
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="summary-item">
                                                <label>Nhà hàng:</label>
                                                <span>{bookingData.restaurant?.name || 'Nhà hàng ABC'}</span>
                                            </div>
                                            <div className="summary-item">
                                                <label>Ngày tổ chức:</label>
                                                <span>{new Date(bookingData.eventDate || new Date()).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="summary-item">
                                                <label>Sảnh:</label>
                                                <span>{bookingData.hall?.name || 'Sảnh VIP'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="summary-item">
                                                <label>Số bàn:</label>
                                                <span>{bookingData.tableCount || 20} bàn</span>
                                            </div>
                                            <div className="summary-item">
                                                <label>Menu:</label>
                                                <span>{bookingData.menu?.name || 'Menu cao cấp'}</span>
                                            </div>
                                            <div className="summary-item">
                                                <label>Tổng chi phí:</label>
                                                <span className="total-amount">{bookingData.totalAmount?.toLocaleString()} VNĐ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <Link
                                        to={`/booking/${bookingData?.bookingID || Date.now().toString()}?payment=1`}
                                        className="btn btn-primary w-100"
                                    >
                                        <i className="fas fa-file-contract me-2"></i>
                                        Xem hợp đồng
                                    </Link>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Link 
                                        to={`/booking/${bookingData?.bookingID || Date.now().toString()}?payment=1`}
                                        className="btn btn-success w-100"
                                    >
                                        <i className="fas fa-history me-2"></i>
                                        Lịch sử thanh toán
                                    </Link>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Link 
                                        to={`/booking/${bookingData?.bookingID || Date.now().toString()}?payment=1`}
                                        className="btn btn-outline-primary w-100"
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Quay lại đặt tiệc
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="card next-steps-card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-list-check"></i> Các bước tiếp theo
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="steps-list">
                                    <div className="step-item completed">
                                        <div className="step-icon">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <div className="step-content">
                                            <h6>Thanh toán hoàn tất</h6>
                                            <p>Bạn đã thanh toán thành công</p>
                                        </div>
                                    </div>
                                    <div className="step-item current">
                                        <div className="step-icon">
                                            <i className="fas fa-file-contract"></i>
                                        </div>
                                        <div className="step-content">
                                            <h6>Ký hợp đồng</h6>
                                            <p>Bây giờ bạn có thể ký hợp đồng dịch vụ</p>
                                        </div>
                                    </div>
                                    <div className="step-item">
                                        <div className="step-icon">
                                            <i className="fas fa-calendar-check"></i>
                                        </div>
                                        <div className="step-content">
                                            <h6>Chuẩn bị sự kiện</h6>
                                            <p>Chúng tôi sẽ liên hệ để chuẩn bị chi tiết</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
