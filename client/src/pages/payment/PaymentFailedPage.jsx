import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/PaymentFailedStyles.css';

const PaymentFailedPage = () => {
    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        // Lấy dữ liệu thanh toán từ location state hoặc sessionStorage
        const paymentInfo = location.state?.paymentData || JSON.parse(sessionStorage.getItem('paymentFailedData') || '{}');
        const bookingInfo = location.state?.bookingData || JSON.parse(sessionStorage.getItem('bookingData') || '{}');
        
        setPaymentData(paymentInfo);
        setBookingData(bookingInfo);

        // Xóa dữ liệu tạm thời sau khi lấy
        sessionStorage.removeItem('paymentFailedData');
    }, [location.state]);

    // Không cần các hàm này nữa vì sẽ dùng Link

    if (!paymentData) {
        return (
            <div className="payment-failed-container">
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
        <div className="payment-failed-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Failed Header */}
                        <div className="failed-header text-center">
                            <div className="failed-icon">
                                <i className="fas fa-times-circle"></i>
                            </div>
                            <h1 className="failed-title">Thanh toán thất bại</h1>
                            <p className="failed-subtitle">
                                Rất tiếc, giao dịch của bạn không thể hoàn tất
                            </p>
                        </div>

                        {/* Error Details */}
                        <div className="card error-details-card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-exclamation-triangle"></i> Chi tiết lỗi
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
                                            <label>Thời gian:</label>
                                            <span>{new Date().toLocaleString('vi-VN')}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Trạng thái:</label>
                                            <span className="status-failed">Thất bại</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Lý do:</label>
                                            <span className="error-reason">{paymentData.errorMessage || 'Không xác định'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Possible Causes */}
                        <div className="card causes-card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-question-circle"></i> Có thể do các nguyên nhân sau
                                </h5>
                            </div>
                            <div className="card-body">
                                <ul className="causes-list">
                                    <li>
                                        <i className="fas fa-credit-card text-warning me-2"></i>
                                        Thông tin thẻ không chính xác hoặc thẻ đã hết hạn
                                    </li>
                                    <li>
                                        <i className="fas fa-ban text-warning me-2"></i>
                                        Thẻ bị khóa hoặc không được phép giao dịch trực tuyến
                                    </li>
                                    <li>
                                        <i className="fas fa-wallet text-warning me-2"></i>
                                        Số dư tài khoản không đủ để thực hiện giao dịch
                                    </li>
                                    <li>
                                        <i className="fas fa-wifi text-warning me-2"></i>
                                        Kết nối mạng không ổn định trong quá trình thanh toán
                                    </li>
                                    <li>
                                        <i className="fas fa-clock text-warning me-2"></i>
                                        Giao dịch bị timeout do mất quá nhiều thời gian
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <Link 
                                        to="/payment/new"
                                        state={{ 
                                            bookingData: bookingData,
                                            retryPayment: true 
                                        }}
                                        className="btn btn-primary w-100"
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Thử lại thanh toán
                                    </Link>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Link 
                                        to={`/booking-details/${bookingData?.bookingID || '201130'}?payment=0`}
                                        className="btn btn-outline-primary w-100"
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Quay lại đặt tiệc
                                    </Link>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <Link 
                                        to="/contact"
                                        className="btn btn-outline-secondary w-100"
                                    >
                                        <i className="fas fa-headset me-2"></i>
                                        Liên hệ hỗ trợ
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="card help-card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-life-ring"></i> Cần hỗ trợ?
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="help-item">
                                            <h6>
                                                <i className="fas fa-phone text-primary me-2"></i>
                                                Hotline hỗ trợ
                                            </h6>
                                            <p>1900 1234 (24/7)</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="help-item">
                                            <h6>
                                                <i className="fas fa-envelope text-primary me-2"></i>
                                                Email hỗ trợ
                                            </h6>
                                            <p>support@weddingrestaurant.com</p>
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

export default PaymentFailedPage;
