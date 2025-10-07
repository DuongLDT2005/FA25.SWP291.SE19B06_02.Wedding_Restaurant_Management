import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContractTab from './components/ContractTab';
import ReportIssueModal from './components/ReportIssueModal';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import '../../styles/BookingDetailsStyles.css';

const BookingDetailsPage = () => {
    const { bookingId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!hasLoaded) {
            fetchBookingDetails();
            setHasLoaded(true);
        }
    }, [bookingId, hasLoaded]);

    const fetchBookingDetails = () => {
        try {
            setLoading(true);

            // Kiểm tra nếu có booking data từ sessionStorage (từ form đặt chỗ)
            const bookingDataFromForm = sessionStorage.getItem('newBookingData');

            if (bookingDataFromForm) {
                const parsedData = JSON.parse(bookingDataFromForm);
                setBooking(parsedData);
                setLoading(false);
                setHasLoaded(true);
                return;
            }

            // Nếu không có data từ form, tạo booking từ selectedRestaurant
            const selectedRestaurant = sessionStorage.getItem('selectedRestaurant');

            if (selectedRestaurant) {
                const restaurant = JSON.parse(selectedRestaurant);
                const mockBooking = {
                    bookingID: bookingId,
                    customer: {
                        fullName: "Khách hàng",
                        phone: "0123456789",
                        email: "customer@email.com"
                    },
                    restaurant: {
                        name: restaurant.restaurantName,
                        address: restaurant.restaurantAddress
                    },
                    hall: restaurant.selectedHall ? {
                        name: restaurant.selectedHall.hallName,
                        capacity: restaurant.selectedHall.capacity,
                        area: restaurant.selectedHall.area
                    } : {
                        name: "Sảnh VIP",
                        capacity: 200,
                        area: 500.5
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
                    menu: restaurant.menus && restaurant.menus.length > 0 ? {
                        name: restaurant.menus[0].name,
                        price: restaurant.menus[0].price,
                        categories: restaurant.menus[0].categories || [
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
                    } : {
                        name: "Menu cưới cao cấp",
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
                    services: [],
                    payments: [],
                    contract: {
                        content: "Hợp đồng dịch vụ tiệc cưới...",
                        status: 0,
                        signedAt: null
                    }
                };
                setBooking(mockBooking);
                setLoading(false);
                setHasLoaded(true);
                return;
            }

            setBooking(null);

        } catch (error) {
            console.error('Error loading booking details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            0: { text: 'Chờ xác nhận', class: 'status-pending' },
            1: { text: 'Đã xác nhận', class: 'status-confirmed' },
            2: { text: 'Đã hủy', class: 'status-cancelled' },
            3: { text: 'Đã cọc', class: 'status-deposited' },
            4: { text: 'Hoàn thành', class: 'status-completed' }
        };
        return statusMap[status] || { text: 'Không xác định', class: 'status-unknown' };
    };

    const getPaymentStatusText = (status) => {
        const statusMap = {
            0: { text: 'Chờ thanh toán', class: 'payment-pending' },
            1: { text: 'Đã thanh toán', class: 'payment-confirmed' },
            2: { text: 'Thanh toán thất bại', class: 'payment-failed' },
            3: { text: 'Hết hạn', class: 'payment-expired' },
            4: { text: 'Đã hủy', class: 'payment-cancelled' }
        };
        return statusMap[status] || { text: 'Không xác định', class: 'payment-unknown' };
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString() + ' VNĐ';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="booking-details-container">
                <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="booking-details-container">
                <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Không tìm thấy thông tin đặt tiệc. Vui lòng quay lại trang chủ để đặt tiệc.
                </div>
            </div>
        );
    }

    const statusInfo = getStatusText(booking.status);

    return (
        <div className="booking-details-container">
            <div className="container-fluid">
                {/* Header */}
                <div
                    className="booking-header"
                    style={{
                        background: 'linear-gradient(135deg, #993344 0%, #993344 100%)',
                        color: '#fefaf9'
                    }}
                >
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1 className="booking-title" style={{ color: '#fefaf9' }}>Chi tiết đặt tiệc</h1>
                            <p className="booking-subtitle">
                                {booking.restaurant.name} • {booking.eventDate}
                            </p>
                        </div>
                        <div className="col-md-4 text-end">
                            <span
                                className="status-badge"
                                style={{
                                    backgroundColor: '#fefaf9',
                                    color: '#993344',
                                    border: '2px solid #993344',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {statusInfo.text}
                            </span>
                            <div className="mt-3">
                                {booking.status === 0 && (
                                    <>
                                        <Link
                                            to="/payment/new"
                                            className="btn me-2"
                                            style={{
                                                backgroundColor: '#28a745',
                                                color: '#fefaf9',
                                                borderColor: '#28a745',
                                                border: '2px solid #28a745',
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <i className="fas fa-credit-card me-2"></i> Thanh toán
                                        </Link>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                if (window.confirm('Bạn có chắc chắn muốn hủy đặt tiệc này?')) {
                                                    alert('Đã hủy đặt tiệc thành công!');
                                                    // Có thể thêm logic hủy booking ở đây
                                                }
                                            }}
                                            style={{
                                                backgroundColor: '#993344',
                                                color: '#fefaf9',
                                                borderColor: '#993344',
                                                border: '2px solid #993344',
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <i className="fas fa-times me-2"></i> Hủy đặt tiệc
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Navigation Tabs */}
                <nav className="booking-nav">
                    <div className="nav nav-tabs" id="bookingTabs" role="tablist">
                        <button
                            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                            style={{
                                backgroundColor: '#fefaf9',
                                color: '#993344',
                                borderColor: '#993344'
                            }}
                        >
                            <i className="fas fa-info-circle"></i> Tổng quan
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'contract' ? 'active' : ''}`}
                            onClick={() => setActiveTab('contract')}
                            style={{
                                backgroundColor: '#fefaf9',
                                color: '#993344',
                                borderColor: '#993344'
                            }}
                        >
                            <i className="fas fa-file-contract"></i> Hợp đồng
                        </button>
                        <button
                            className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payments')}
                            style={{
                                backgroundColor: '#fefaf9',
                                color: '#993344',
                                borderColor: '#993344'
                            }}
                        >
                            <i className="fas fa-credit-card"></i> Thanh toán
                        </button>
                    </div>
                </nav>

                {/* Tab Content */}
                <div className="tab-content" id="bookingTabContent">
                    {activeTab === 'overview' && (
                        <div className="tab-pane fade show active">
                            <div className="row">
                                {/* Booking Information */}
                                <div className="col-lg-8">
                                    <div className="card booking-info-card">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">
                                                <i className="fas fa-calendar-alt"></i> Thông tin đặt tiệc
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Khách hàng:</label>
                                                        <span>{booking.customer.fullName}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Số điện thoại:</label>
                                                        <span>{booking.customer.phone}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Email:</label>
                                                        <span>{booking.customer.email}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Nhà hàng:</label>
                                                        <span>{booking.restaurant.name}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Địa chỉ:</label>
                                                        <span>{booking.restaurant.address}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Loại sự kiện:</label>
                                                        <span>{booking.eventType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card booking-details-card">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">
                                                <i className="fas fa-info-circle"></i> Chi tiết sự kiện
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Ngày tổ chức:</label>
                                                        <span>{formatDate(booking.eventDate)}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Thời gian:</label>
                                                        <span>{booking.startTime} - {booking.endTime}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Số bàn:</label>
                                                        <span>{booking.tableCount} bàn</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Sảnh:</label>
                                                        <span>{booking.hall.name}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Sức chứa:</label>
                                                        <span>{booking.hall.capacity} khách</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Diện tích:</label>
                                                        <span>{booking.hall.area} m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {booking.specialRequest && (
                                                <div className="info-item mt-3">
                                                    <label>Yêu cầu đặc biệt:</label>
                                                    <span>{booking.specialRequest}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card menu-services-card">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">
                                                <i className="fas fa-utensils"></i> Menu & Dịch vụ
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="menu-section">
                                                <h6>Menu đã chọn:</h6>
                                                <div className="menu-item">
                                                    <span className="menu-name">{booking.menu.name} </span>
                                                    <span className="menu-price">{booking.menu.price.toLocaleString()} VNĐ/bàn</span>
                                                </div>
                                                
                                                {/* Hiển thị danh sách món đã chọn */}
                                                {booking.menu.categories && (
                                                    <div className="selected-dishes-list mt-3">
                                                        <h6>Món đã chọn:</h6>
                                                        <ul className="dishes-list">
                                                            {booking.menu.categories.map((category, catIdx) => 
                                                                category.dishes.map((dish) => (
                                                                    <li key={dish.id} className="selected-dish-item">
                                                                        <span className="dish-name">{dish.name}</span>
                                                                        <span className="dish-category">({category.name})</span>
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {booking.services && booking.services.length > 0 && (
                                                <div className="services-section mt-3">
                                                    <h6>Dịch vụ bổ sung:</h6>
                                                    {booking.services.map((service, index) => (
                                                        <div key={index} className="service-item">
                                                            <span className="service-name">{service.name} </span>
                                                            <span className="service-quantity">x{service.quantity}</span>
                                                            <span className="service-price">{(service.price * service.quantity).toLocaleString()} VNĐ</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="col-lg-4">
                                    <div className="card payment-summary-card">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">
                                                <i className="fas fa-receipt"></i> Tóm tắt thanh toán
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="payment-item">
                                                <span>Giá gốc:</span>
                                                <span>{booking.originalPrice.toLocaleString()} VNĐ</span>
                                            </div>
                                            <div className="payment-item discount">
                                                <span>Giảm giá:</span>
                                                <span>-{booking.discountAmount.toLocaleString()} VNĐ</span>
                                            </div>
                                            <div className="payment-item">
                                                <span>VAT (10%):</span>
                                                <span>{booking.VAT.toLocaleString()} VNĐ</span>
                                            </div>
                                            <hr />
                                            <div className="payment-item total">
                                                <span>Tổng cộng:</span>
                                                <span>{booking.totalAmount.toLocaleString()} VNĐ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card payment-history-card">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">
                                                <i className="fas fa-history"></i> Lịch sử thanh toán
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            {booking.payments && booking.payments.length > 0 ? (
                                                booking.payments.map((payment, index) => {
                                                    const paymentStatus = getPaymentStatusText(payment.status);
                                                    return (
                                                        <div key={index} className="payment-history-item">
                                                            <div className="payment-type">
                                                                {payment.type === 0 ? 'Tiền cọc (30%)' : 'Thanh toán còn lại (70%)'}
                                                            </div>
                                                            <div className="payment-amount">
                                                                {formatCurrency(payment.amount)}
                                                            </div>
                                                            <div className={`payment-status ${paymentStatus.class}`}>
                                                                {paymentStatus.text}
                                                            </div>
                                                            <div className="payment-method">
                                                                {payment.paymentMethod || 'Chưa chọn'}
                                                            </div>
                                                            {payment.paymentDate && (
                                                                <div className="payment-date">
                                                                    {formatDate(payment.paymentDate)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center text-muted">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    Chưa có thông tin thanh toán
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contract' && (
                        <ContractTab booking={booking} />
                    )}

                    {activeTab === 'payments' && (
                        <div className="tab-pane fade show active">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">
                                        <i className="fas fa-credit-card"></i> Chi tiết thanh toán
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Loại thanh toán</th>
                                                    <th>Số tiền</th>
                                                    <th>Trạng thái</th>
                                                    <th>Ngày thanh toán</th>
                                                    <th>Phương thức</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booking.payments.map((payment, index) => {
                                                    const paymentStatus = getPaymentStatusText(payment.status);
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {payment.type === 0 ? 'Tiền cọc' : 'Thanh toán còn lại'}
                                                            </td>
                                                            <td>{payment.amount.toLocaleString()} VNĐ</td>
                                                            <td>
                                                                <span className={`badge ${paymentStatus.class}`}>
                                                                    {paymentStatus.text}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {payment.paymentDate ? formatDate(payment.paymentDate) : '-'}
                                                            </td>
                                                            <td>{payment.paymentMethod || '-'}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Report Issue Modal */}
            {showReportModal && (
                <ReportIssueModal
                    booking={booking}
                    onClose={() => setShowReportModal(false)}
                />
            )}
            <ScrollToTopButton />
        </div>
    );
};

export default BookingDetailsPage;
