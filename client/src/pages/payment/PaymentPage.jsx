import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../styles/PaymentPage.css';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [booking, setBooking] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Load booking data
    useEffect(() => {
        if (!hasLoaded) {
            const loadBookingData = () => {
                // Tạo dữ liệu ảo giống như trong BookingDetailsPage
                const mockBooking = {
                    bookingID: bookingId || '201130',
                    customer: {
                        fullName: "Nguyễn Văn A",
                        phone: "0123456789",
                        email: "customer@email.com"
                    },
                    restaurant: {
                        name: "Quảng Đại Gold",
                        address: "8 30 Tháng 4, Hải Châu, Đà Nẵng"
                    },
                    hall: {
                        name: "Sảnh Hoa Hồng",
                        capacity: 500,
                        area: 600
                    },
                    eventType: "Tiệc cưới",
                    eventDate: "2024-12-25",
                    startTime: "18:00",
                    endTime: "22:00",
                    tableCount: 20,
                    specialRequest: "Trang trí hoa hồng đỏ",
                    status: 0,
                    originalPrice: 50000000,
                    discountAmount: 5000000,
                    VAT: 4500000,
                    totalAmount: 49500000,
                    createdAt: new Date().toISOString(),
                    menu: {
                        name: "Menu Truyền Thống",
                        price: 2500000,
                        categories: [
                            {
                                name: "Món khai vị",
                                requiredQuantity: 2,
                                dishes: [
                                    { id: 1, name: "Gỏi ngó sen tôm thịt" },
                                    { id: 2, name: "Súp cua gà xé" }
                                ]
                            },
                            {
                                name: "Món chính",
                                requiredQuantity: 3,
                                dishes: [
                                    { id: 3, name: "Gà hấp lá chanh" },
                                    { id: 4, name: "Bò nướng tiêu đen" },
                                    { id: 5, name: "Cá hấp xì dầu" }
                                ]
                            },
                            {
                                name: "Tráng miệng",
                                requiredQuantity: 1,
                                dishes: [
                                    { id: 6, name: "Chè hạt sen long nhãn" }
                                ]
                            }
                        ]
                    },
                    services: [
                        { name: "Trang trí hoa tươi", quantity: 1, price: 5000000 },
                        { name: "Ban nhạc sống", quantity: 1, price: 8000000 }
                    ],
                    payments: [],
                    contract: {
                        content: "Hợp đồng dịch vụ tiệc cưới...",
                        status: 0,
                        signedAt: null
                    }
                };
                
                setBooking(mockBooking);
                setHasLoaded(true);
            };
            loadBookingData();
        }
    }, [hasLoaded, bookingId]);

    // Countdown timer
    useEffect(() => {
        if (!hasLoaded) return; // Chỉ chạy timer khi đã load xong data
        
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    // Time expired - redirect back
                    alert('Thời gian thanh toán đã hết hạn!');
                    navigate(-1);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, hasLoaded]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // Simulate payment processing - loading 2 giây
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock successful payment
            alert('Thanh toán thành công!');

            // Update booking status
            if (booking) {
                const updatedBooking = {
                    ...booking,
                    status: 3, // DEPOSITED
                    payments: [
                        {
                            type: 0, // DEPOSIT
                            amount: booking.totalAmount * 0.3,
                            status: 1, // CONFIRMED
                            paymentMethod: paymentMethod,
                            paymentDate: new Date().toISOString()
                        }
                    ]
                };

                // Save updated booking
                sessionStorage.setItem('newBookingData', JSON.stringify(updatedBooking));
            }

            // Navigate to booking details
            navigate(`/booking/${bookingId || '201130'}`);

        } catch (error) {
            console.error('Payment error:', error);
            alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString() + ' VNĐ';
    };

    if (!hasLoaded || !booking) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Đang tải thông tin thanh toán...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header */}
                        <div className="card payment-header-card mb-4">
                            <div className="card-body text-center">
                                <h2 className="payment-title">
                                    <i className="fas fa-credit-card me-2"></i>
                                    Thanh toán đặt tiệc
                                </h2>
                                <p className="payment-subtitle">
                                    {booking.restaurant?.name} • {booking.eventDate}
                                </p>
                            </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="card countdown-card mb-4">
                            <div className="card-body text-center">
                                <div className="countdown-container">
                                    <i className="fas fa-clock countdown-icon"></i>
                                    <div className="countdown-text">
                                        <span className="countdown-label">Thời gian còn lại:</span>
                                        <span className="countdown-time">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Payment Summary */}
                            <div className="col-md-6">
                                <div className="card payment-summary-card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">
                                            <i className="fas fa-receipt me-2"></i>
                                            Tóm tắt thanh toán
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="payment-item">
                                            <span>Giá gốc:</span>
                                            <span>{formatCurrency(booking.originalPrice || booking.totalAmount)}</span>
                                        </div>
                                        <div className="payment-item">
                                            <span>Giảm giá:</span>
                                            <span className="text-success">-{formatCurrency(booking.discount || 0)}</span>
                                        </div>
                                        <div className="payment-item">
                                            <span>VAT (10%):</span>
                                            <span>{formatCurrency(booking.VAT || 0)}</span>
                                        </div>
                                        <hr />
                                        <div className="payment-item total">
                                            <span>Tổng cộng:</span>
                                            <span>{formatCurrency(booking.totalAmount)}</span>
                                        </div>
                                        <div className="payment-item deposit">
                                            <span>Tiền cọc (30%):</span>
                                            <span className="deposit-amount">{formatCurrency(booking.totalAmount * 0.3)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="col-md-6">
                                <div className="card payment-methods-card">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">
                                            <i className="fas fa-credit-card me-2"></i>
                                            Phương thức thanh toán
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="payment-methods">
                                            <div className="form-check payment-method-item">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="bank_transfer"
                                                    value="bank_transfer"
                                                    checked={paymentMethod === 'bank_transfer'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor="bank_transfer">
                                                    <i className="fas fa-university me-2"></i>
                                                    Chuyển khoản ngân hàng
                                                </label>
                                            </div>
                                            <div className="form-check payment-method-item">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="momo"
                                                    value="momo"
                                                    checked={paymentMethod === 'momo'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor="momo">
                                                <i class="fa-solid fa-money-check me-2"></i>
                                                    Ví MoMo
                                                </label>
                                            </div>
                                            <div className="form-check payment-method-item">
                                                <input
                                                    className="form-check-input me-2"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="zalopay"
                                                    value="zalopay"
                                                    checked={paymentMethod === 'zalopay'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor="zalopay">
                                                    <i className="fas fa-mobile-alt me-2"></i>
                                                    ZaloPay
                                                </label>
                                            </div>
                                        </div>

                                        {/* Payment Button */}
                                        <div className="payment-actions mt-4">
                                            <button
                                                className="btn btn-payment w-100"
                                                onClick={handlePayment}
                                                disabled={isProcessing || timeLeft <= 0}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-credit-card me-2"></i>
                                                        Thanh toán {formatCurrency(booking.totalAmount * 0.3)}
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Back Button */}
                                        <div className="text-center mt-3">
                                            <Link
                                                to="/booking/new"
                                                className="btn btn-outline-secondary"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <i className="fas fa-arrow-left me-2"></i>
                                                Quay lại
                                            </Link>
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

export default PaymentPage;
