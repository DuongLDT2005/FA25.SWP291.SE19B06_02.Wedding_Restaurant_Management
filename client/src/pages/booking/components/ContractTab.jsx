import React, { useState } from 'react';

const ContractTab = ({ booking }) => {
    const [isSigning, setIsSigning] = useState(false);
    const [signature, setSignature] = useState('');

    const handleSignContract = async () => {
        if (!signature.trim()) {
            alert('Vui lòng nhập chữ ký của bạn');
            return;
        }

        setIsSigning(true);
        try {
            // Mock API call - thay thế bằng API thực tế
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update contract status
            booking.contract.status = 1; // SIGNED
            booking.contract.customerSignature = signature;
            booking.contract.signedAt = new Date().toISOString();
            
            alert('Ký hợp đồng thành công!');
        } catch (error) {
            console.error('Error signing contract:', error);
            alert('Có lỗi xảy ra khi ký hợp đồng');
        } finally {
            setIsSigning(false);
        }
    };

    const getContractStatusText = (status) => {
        const statusMap = {
            0: { text: 'Chờ ký', class: 'contract-pending' },
            1: { text: 'Đã ký', class: 'contract-signed' },
            2: { text: 'Đã hủy', class: 'contract-cancelled' }
        };
        return statusMap[status] || { text: 'Không xác định', class: 'contract-unknown' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const contractStatus = getContractStatusText(booking.contract.status);

    return (
        <div className="tab-pane fade show active">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card contract-card">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-file-contract"></i> Hợp đồng dịch vụ
                                </h5>
                                <span className={`contract-status-badge ${contractStatus.class}`}>
                                    {contractStatus.text}
                                </span>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="contract-content">
                                <div className="contract-header">
                                    <h4 className="contract-title">HỢP ĐỒNG DỊCH VỤ TIỆC CƯỚI</h4>
                                    <p className="contract-subtitle">
                                        Số hợp đồng: HD-{booking.bookingID} | Ngày: {new Date().toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="alert alert-info">
                                        <i className="fas fa-info-circle me-2"></i>
                                        <strong>Thông tin đặt tiệc:</strong> {booking.restaurant.name} - {booking.hall.name} - {new Date(booking.eventDate).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>

                                <div className="contract-parties">
                                    <div className="party-section">
                                        <h6>BÊN A - KHÁCH HÀNG:</h6>
                                        <p><strong>Họ tên:</strong> {booking.customer.fullName}</p>
                                        <p><strong>Số điện thoại:</strong> {booking.customer.phone}</p>
                                        <p><strong>Email:</strong> {booking.customer.email}</p>
                                    </div>

                                    <div className="party-section">
                                        <h6>BÊN B - NHÀ HÀNG:</h6>
                                        <p><strong>Tên nhà hàng:</strong> {booking.restaurant.name}</p>
                                        <p><strong>Địa chỉ:</strong> {booking.restaurant.address}</p>
                                    </div>
                                </div>

                                <div className="contract-details">
                                    <h6>THÔNG TIN DỊCH VỤ:</h6>
                                    <div className="contract-info-grid">
                                        <div className="info-row">
                                            <span className="label">Loại sự kiện:</span>
                                            <span className="value">{booking.eventType}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Ngày tổ chức:</span>
                                            <span className="value">{new Date(booking.eventDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Thời gian:</span>
                                            <span className="value">{booking.startTime} - {booking.endTime}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Sảnh:</span>
                                            <span className="value">{booking.hall.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Số bàn:</span>
                                            <span className="value">{booking.tableCount} bàn</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Menu:</span>
                                            <span className="value">{booking.menu.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="contract-terms">
                                    <h6>ĐIỀU KHOẢN HỢP ĐỒNG:</h6>
                                    <div className="terms-content">
                                        <p><strong>Điều 1:</strong> Khách hàng cam kết thanh toán đúng hạn theo thỏa thuận.</p>
                                        <p><strong>Điều 2:</strong> Nhà hàng cam kết cung cấp dịch vụ đúng chất lượng đã thỏa thuận.</p>
                                        <p><strong>Điều 3:</strong> Trong trường hợp hủy tiệc, khách hàng sẽ bị phạt theo quy định.</p>
                                        <p><strong>Điều 4:</strong> Mọi thay đổi về thời gian, địa điểm phải được thông báo trước ít nhất 7 ngày.</p>
                                        <p><strong>Điều 5:</strong> Hợp đồng có hiệu lực từ ngày ký và có giá trị pháp lý.</p>
                                    </div>
                                </div>

                                <div className="contract-pricing">
                                    <h6>THÔNG TIN TÀI CHÍNH:</h6>
                                    <div className="pricing-table">
                                        <div className="pricing-row">
                                            <span>Menu ({booking.menu.name}):</span>
                                            <span>{(booking.menu.price * booking.tableCount).toLocaleString()} VNĐ</span>
                                        </div>
                                        
                                        {/* Hiển thị danh sách món ăn trong hợp đồng */}
                                        {booking.menu.categories && (
                                            <div className="contract-dishes-section">
                                                <div className="pricing-row">
                                                    <span>Chi tiết món ăn:</span>
                                                    <span></span>
                                                </div>
                                                {booking.menu.categories.map((category, catIdx) => (
                                                    <div key={catIdx} className="category-details">
                                                        <div className="pricing-row" style={{ paddingLeft: '20px', fontWeight: '600' }}>
                                                            <span>• {category.name}:</span>
                                                            <span></span>
                                                        </div>
                                                        {category.dishes.map((dish) => (
                                                            <div key={dish.id} className="pricing-row" style={{ paddingLeft: '40px' }}>
                                                                <span>- {dish.name}</span>
                                                                <span></span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {booking.services && booking.services.length > 0 && (
                                            <>
                                                <div className="pricing-row">
                                                    <span>Dịch vụ bổ sung:</span>
                                                    <span></span>
                                                </div>
                                                {booking.services.map((service, index) => (
                                                    <div key={index} className="pricing-row" style={{ paddingLeft: '20px' }}>
                                                        <span>• {service.name} (x{service.quantity}):</span>
                                                        <span>{(service.price * service.quantity).toLocaleString()} VNĐ</span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                        <div className="pricing-row">
                                            <span>Giá gốc:</span>
                                            <span>{booking.originalPrice.toLocaleString()} VNĐ</span>
                                        </div>
                                        <div className="pricing-row">
                                            <span>Giảm giá:</span>
                                            <span>-{booking.discountAmount.toLocaleString()} VNĐ</span>
                                        </div>
                                        <div className="pricing-row">
                                            <span>VAT (10%):</span>
                                            <span>{booking.VAT.toLocaleString()} VNĐ</span>
                                        </div>
                                        <div className="pricing-row total">
                                            <span>Tổng cộng:</span>
                                            <span>{booking.totalAmount.toLocaleString()} VNĐ</span>
                                        </div>
                                    </div>
                                </div>

                                {booking.specialRequest && (
                                    <div className="contract-special-request">
                                        <h6>YÊU CẦU ĐẶC BIỆT:</h6>
                                        <p>{booking.specialRequest}</p>
                                    </div>
                                )}

                                <div className="contract-signatures">
                                    <div className="signature-section">
                                        <h6>CHỮ KÝ KHÁCH HÀNG:</h6>
                                        {booking.contract.customerSignature ? (
                                            <div className="signed-signature">
                                                <i className="fas fa-check-circle text-success"></i>
                                                <span>Đã ký ngày: {formatDate(booking.contract.signedAt)}</span>
                                            </div>
                                        ) : (
                                            <div className="signature-input">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Nhập chữ ký của bạn"
                                                    value={signature}
                                                    onChange={(e) => setSignature(e.target.value)}
                                                />
                                                <button
                                                    className="btn btn-primary mt-2"
                                                    onClick={handleSignContract}
                                                    disabled={isSigning}
                                                >
                                                    {isSigning ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            Đang ký...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-signature me-2"></i>
                                                            Ký hợp đồng
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="signature-section">
                                        <h6>CHỮ KÝ NHÀ HÀNG:</h6>
                                        {booking.contract.restaurantPartnerSignature ? (
                                            <div className="signed-signature">
                                                <i className="fas fa-check-circle text-success"></i>
                                                <span>Đã ký</span>
                                            </div>
                                        ) : (
                                            <div className="pending-signature">
                                                <i className="fas fa-clock text-warning"></i>
                                                <span>Chờ ký</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card contract-actions-card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-tools"></i> Thao tác
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="action-buttons">
                                <button 
                                    className="btn w-100 mb-2"
                                    style={{
                                        backgroundColor: '#993344',
                                        color: '#fefaf9',
                                        borderColor: '#993344',
                                        border: '2px solid #993344'
                                    }}
                                >
                                    <i className="fas fa-download"></i> Tải xuống PDF
                                </button>
                                <button 
                                    className="btn w-100 mb-2"
                                    style={{
                                        backgroundColor: '#993344',
                                        color: '#fefaf9',
                                        borderColor: '#993344',
                                        border: '2px solid #993344'
                                    }}
                                >
                                    <i className="fas fa-print"></i> In hợp đồng
                                </button>
                                <button 
                                    className="btn w-100 mb-2"
                                    style={{
                                        backgroundColor: '#993344',
                                        color: '#fefaf9',
                                        borderColor: '#993344',
                                        border: '2px solid #993344'
                                    }}
                                >
                                    <i className="fas fa-share"></i> Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card contract-history-card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-history"></i> Lịch sử hợp đồng
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h6>Hợp đồng được tạo</h6>
                                        <p className="text-muted small">
                                            {formatDate(booking.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                
                                {booking.contract.signedAt && (
                                    <div className="timeline-item">
                                        <div className="timeline-marker success"></div>
                                        <div className="timeline-content">
                                            <h6>Khách hàng đã ký</h6>
                                            <p className="text-muted small">
                                                {formatDate(booking.contract.signedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractTab;
