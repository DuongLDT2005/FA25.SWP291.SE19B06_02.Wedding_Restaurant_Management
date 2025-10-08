import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom';
import ContractTab from './components/ContractTab';
import ReportIssueModal from './components/ReportIssueModal';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import '../../styles/BookingDetailsStyles.css';

const BookingDetailsPage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    // search params: need setter to enforce payment=0 when pending
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingData, setEditingData] = useState({});
    const [isApproved, setIsApproved] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    useEffect(() => {
        if (!hasLoaded) {
            // 1. state từ Link
            if (location.state?.booking) {
                setBooking(location.state.booking);
                setLoading(false);
                setHasLoaded(true);
                return;
            }
            // 2. sessionStorage key chung
            const stored = sessionStorage.getItem("currentBooking");
            if (stored) {
                try {
                    setBooking(JSON.parse(stored));
                    setLoading(false);
                    setHasLoaded(true);
                    return;
                } catch {}
            }
            // 3. fallback logic cũ
            fetchBookingDetails();
            setHasLoaded(true);
        }
        
        // Kiểm tra trạng thái thanh toán từ URL parameter
        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === '1') {
            setPaymentCompleted(true);
            // Thêm dữ liệu thanh toán mock
            if (booking) {
                const mockPayment = {
                    type: 0,
                    amount: booking.totalAmount * 0.3, // 30% tiền cọc
                    status: 1, // Đã thanh toán
                    paymentMethod: 'Thẻ tín dụng',
                    paymentDate: new Date().toISOString()
                };
                setBooking(prev => ({
                    ...prev,
                    payments: [mockPayment],
                    status: 3 // DEPOSITED
                }));
            }
        } else if (paymentStatus === '0') {
            // Có param payment=0 -> trạng thái chờ thanh toán
            setPaymentCompleted(false);
        } else {
            // Không có param payment hoặc giá trị khác: nếu booking chưa thanh toán thì ép thêm payment=0 vào URL
            if (booking && (!booking.payments || booking.payments.length === 0) && !paymentCompleted) {
                // Bảo toàn các params khác nếu có
                const paramsObj = {};
                for (const [k, v] of searchParams.entries()) {
                    paramsObj[k] = v;
                }
                // Chỉ set nếu hiện chưa có payment
                if (!paramsObj.payment) {
                    paramsObj.payment = '0';
                    setSearchParams(paramsObj, { replace: true });
                }
            }
        }

        // Không cần đọc tab parameter nữa, để người dùng tự chọn tab
    }, [bookingId, hasLoaded, searchParams, booking]);

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

            // Nếu không có data từ form, tạo mock booking
            const selectedRestaurant = sessionStorage.getItem('selectedRestaurant');
            let restaurantData = null;
            
            if (selectedRestaurant) {
                restaurantData = JSON.parse(selectedRestaurant);
            }

            const mockBooking = {
                bookingID: bookingId,
                customer: {
                    fullName: "Nguyễn Văn A",
                    phone: "0123456789",
                    email: "customer@email.com"
                },
                restaurant: {
                    name: restaurantData?.restaurantName || "Quảng Đại Gold",
                    address: restaurantData?.restaurantAddress || "8 30 Tháng 4, Hải Châu, Đà Nẵng"
                },
                hall: restaurantData?.selectedHall ? {
                    name: restaurantData.selectedHall.hallName,
                    capacity: restaurantData.selectedHall.capacity,
                    area: restaurantData.selectedHall.area
                } : {
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
                    signedAt: null,
                    customerSignature: null,
                    restaurantSignature: null
                }
            };
            
            setBooking(mockBooking);
            setLoading(false);
            setHasLoaded(true);

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

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditingData({
                customer: { ...booking.customer },
                eventDetails: {
                    eventDate: booking.eventDate,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    tableCount: booking.tableCount,
                    specialRequest: booking.specialRequest
                },
                menu: { ...booking.menu }
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = () => {
        // Cập nhật booking data với dữ liệu đã chỉnh sửa
        const updatedBooking = {
            ...booking,
            customer: editingData.customer,
            eventDate: editingData.eventDetails.eventDate,
            startTime: editingData.eventDetails.startTime,
            endTime: editingData.eventDetails.endTime,
            tableCount: editingData.eventDetails.tableCount,
            specialRequest: editingData.eventDetails.specialRequest,
            menu: editingData.menu
        };
        setBooking(updatedBooking);
        setIsEditing(false);
        alert('Đã lưu thay đổi thành công!');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingData({});
    };

    const handleApprove = () => {
        if (window.confirm('Bạn có chắc chắn muốn đồng ý với thông tin đặt tiệc này?')) {
            setIsApproved(true);
            setActiveTab('contract'); // Chuyển sang tab hợp đồng
            alert('Đã đồng ý! Bây giờ bạn có thể xem và tải hợp đồng.');
        }
    };

    const handleReject = () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đặt tiệc này?')) {
            alert('Đã hủy đặt tiệc thành công!');
            // Có thể thêm logic hủy booking ở đây
        }
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

    // (Nếu muốn tránh lỗi khi thiếu customer / restaurant)
    if (booking) {
        booking.customer = booking.customer || { fullName: "Khách hàng", phone: "N/A", email: "N/A" };
        booking.restaurant = booking.restaurant || { name: "Nhà hàng", address: "Đang cập nhật" };
        booking.hall = booking.hall || { name: "Sảnh", capacity: 0, area: 0 };
        booking.menu = booking.menu || { name: "Menu", price: 0, categories: [] };
        booking.payments = Array.isArray(booking.payments) ? booking.payments : [];
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
                        {(isApproved || paymentCompleted) && (
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
                        )}
                        {(isApproved || paymentCompleted) && (
                            <button
                                className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
                                onClick={() => setActiveTab('payments')}
                                style={{
                                    backgroundColor: '#fefaf9',
                                    color: '#993344',
                                    borderColor: '#993344'
                                }}
                            >
                                <i className="fas fa-credit-card"></i> Lịch sử thanh toán
                            </button>
                        )}
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
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h5 className="card-title mb-0">
                                                <i className="fas fa-calendar-alt"></i> Thông tin đặt tiệc
                                            </h5>
                                            {!isApproved && (
                                                <button 
                                                    className="btn btn-sm btn-outline-light"
                                                    onClick={handleEditToggle}
                                                >
                                                    <i className="fas fa-edit"></i> {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Khách hàng:</label>
                                                        {isEditing ? (
                                                            <input 
                                                                type="text" 
                                                                className="form-control"
                                                                value={editingData.customer?.fullName || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    customer: { ...editingData.customer, fullName: e.target.value }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{booking.customer.fullName}</span>
                                                        )}
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Số điện thoại:</label>
                                                        {isEditing ? (
                                                            <input 
                                                                type="text" 
                                                                className="form-control"
                                                                value={editingData.customer?.phone || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    customer: { ...editingData.customer, phone: e.target.value }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{booking.customer.phone}</span>
                                                        )}
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Email:</label>
                                                        {isEditing ? (
                                                            <input 
                                                                type="email" 
                                                                className="form-control"
                                                                value={editingData.customer?.email || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    customer: { ...editingData.customer, email: e.target.value }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{booking.customer.email}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Nhà hàng:</label>
                                                        <span>{booking.restaurant?.name}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Địa chỉ:</label>
                                                        <span>{booking.restaurant?.address}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Loại sự kiện:</label>
                                                        <span>{booking.eventType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="mt-3 text-end">
                                                    <button 
                                                        className="btn btn-success me-2"
                                                        onClick={handleSaveChanges}
                                                    >
                                                        <i className="fas fa-save"></i> Lưu thay đổi
                                                    </button>
                                                    <button 
                                                        className="btn btn-secondary"
                                                        onClick={handleCancelEdit}
                                                    >
                                                        <i className="fas fa-times"></i> Hủy
                                                    </button>
                                                </div>
                                            )}
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
                                                        {isEditing ? (
                                                            <input 
                                                                type="date" 
                                                                className="form-control"
                                                                value={editingData.eventDetails?.eventDate || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    eventDetails: { ...editingData.eventDetails, eventDate: e.target.value }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{formatDate(booking.eventDate)}</span>
                                                        )}
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Thời gian bắt đầu:</label>
                                                        {isEditing ? (
                                                            <input 
                                                                type="time" 
                                                                className="form-control"
                                                                value={editingData.eventDetails?.startTime || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    eventDetails: { ...editingData.eventDetails, startTime: e.target.value }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{booking.startTime}</span>
                                                        )}
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Thời gian kết thúc:</label>
                                                        {isEditing ? (
                                                            <input 
                                                                type="time" 
                                                                className="form-control"
                                                                value={editingData.eventDetails?.endTime || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    eventDetails: { ...editingData.eventDetails, endTime: e.target.value }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{booking.endTime}</span>
                                                        )}
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Số bàn:</label>
                                                        {isEditing ? (
                                                            <input 
                                                                type="number" 
                                                                className="form-control"
                                                                value={editingData.eventDetails?.tableCount || ''}
                                                                onChange={(e) => setEditingData({
                                                                    ...editingData,
                                                                    eventDetails: { ...editingData.eventDetails, tableCount: parseInt(e.target.value) }
                                                                })}
                                                            />
                                                        ) : (
                                                            <span>{booking.tableCount} bàn</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <label>Sảnh:</label>
                                                        <span>{booking.hall?.name}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Sức chứa:</label>
                                                        <span>{booking.hall?.capacity} khách</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <label>Diện tích:</label>
                                                        <span>{booking.hall?.area} m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="info-item mt-3">
                                                <label>Yêu cầu đặc biệt:</label>
                                                {isEditing ? (
                                                    <textarea 
                                                        className="form-control"
                                                        rows="3"
                                                        value={editingData.eventDetails?.specialRequest || ''}
                                                        onChange={(e) => setEditingData({
                                                            ...editingData,
                                                            eventDetails: { ...editingData.eventDetails, specialRequest: e.target.value }
                                                        })}
                                                        placeholder="Nhập yêu cầu đặc biệt..."
                                                    />
                                                ) : (
                                                    <span>{booking.specialRequest || 'Không có'}</span>
                                                )}
                                            </div>
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
                                                {isEditing ? (
                                                    <div className="mb-3">
                                                        <input 
                                                            type="text" 
                                                            className="form-control mb-2"
                                                            value={editingData.menu?.name || ''}
                                                            onChange={(e) => setEditingData({
                                                                ...editingData,
                                                                menu: { ...editingData.menu, name: e.target.value }
                                                            })}
                                                            placeholder="Tên menu"
                                                        />
                                                        <input 
                                                            type="number" 
                                                            className="form-control"
                                                            value={editingData.menu?.price || ''}
                                                            onChange={(e) => setEditingData({
                                                                ...editingData,
                                                                menu: { ...editingData.menu, price: parseInt(e.target.value) }
                                                            })}
                                                            placeholder="Giá menu (VNĐ/bàn)"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="menu-item">
                                                        <span className="menu-name">{booking.menu.name} </span>
                                                        <span className="menu-price">{booking.menu.price.toLocaleString()} VNĐ/bàn</span>
                                                    </div>
                                                )}

                                                {/* Hiển thị danh sách món đã chọn */}
                                                {booking.menu?.categories && (
                                                    <div className="selected-dishes-list mt-3">
                                                        <h6>Món đã chọn:</h6>
                                                        {isEditing ? (
                                                            <div className="alert alert-info">
                                                                <i className="fas fa-info-circle me-2"></i>
                                                                Danh sách món ăn sẽ được cập nhật sau khi lưu thay đổi menu.
                                                            </div>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {booking.services && booking.services.length > 0 && (
                                                <div className="services-section mt-3">
                                                    <h6>Dịch vụ bổ sung:</h6>
                                                    {isEditing ? (
                                                        <div className="alert alert-info">
                                                            <i className="fas fa-info-circle me-2"></i>
                                                            Dịch vụ bổ sung sẽ được cập nhật sau khi lưu thay đổi.
                                                        </div>
                                                    ) : (
                                                        booking.services.map((service, index) => (
                                                            <div key={index} className="service-item">
                                                                <span className="service-name">{service.name} </span>
                                                                <span className="service-quantity">x{service.quantity}</span>
                                                                <span className="service-price">{(service.price * service.quantity).toLocaleString()} VNĐ</span>
                                                            </div>
                                                        ))
                                                    )}
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
                                            <div className="mt-3">
                                {booking.status === 0 && (
                                    <>
                                        <Link
                                            to="/payment/new"
                                            className="btn me-1 w-100"
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
                                    </>
                                )}
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
                                    {!isApproved && !paymentCompleted && (
                                        <div className="deny-accept">
                                            <div className="accept" onClick={handleApprove} style={{ cursor: 'pointer' }}>
                                                <h5 className="mb-0">
                                                    <i className="fa-solid fa-check"></i> Đồng ý
                                                </h5>
                                            </div>
                                            <div className="deny" onClick={handleReject} style={{ cursor: 'pointer' }}>
                                                <h5 className="mb-0">
                                                    <i className="fa-solid fa-x"></i> Hủy
                                                </h5>
                                            </div>
                                        </div>
                                    )}
                                    {isApproved && !paymentCompleted && (
                                        <div className="alert alert-success text-center">
                                            <i className="fas fa-check-circle me-2"></i>
                                            <strong>Đã đồng ý!</strong><br/>
                                            <small>Bạn có thể xem hợp đồng và thanh toán</small>
                                        </div>
                                    )}
                                    {paymentCompleted && (
                                        <div className="alert alert-info text-center">
                                            <i className="fas fa-credit-card me-2"></i>
                                            <strong>Đã thanh toán cọc!</strong><br/>
                                            <small>Bạn có thể xem hợp đồng và lịch sử thanh toán</small>
                                        </div>
                                    )}
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
                                        <i className="fas fa-credit-card"></i> Lịch sử thanh toán
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {booking.payments && booking.payments.length > 0 ? (
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
                                                                    {payment.type === 0 ? 'Tiền cọc (30%)' : 'Thanh toán còn lại (70%)'}
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
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-credit-card text-muted" style={{ fontSize: '3rem' }}></i>
                                            <h5 className="mt-3 text-muted">Chưa có lịch sử thanh toán</h5>
                                            <p className="text-muted">Lịch sử thanh toán sẽ hiển thị sau khi bạn hoàn thành thanh toán.</p>
                                        </div>
                                    )}
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
