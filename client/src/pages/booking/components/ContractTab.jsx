import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";

const ContractTab = ({ booking }) => {
    const [isSigning, setIsSigning] = useState(false);
    const [signature, setSignature] = useState('');
    const [showPaymentRequiredModal, setShowPaymentRequiredModal] = useState(false);

    const handleDownloadPDF = () => {
        // Tạo PDF sử dụng jsPDF
        const doc = generateContractPDF(booking.bookingID);
        
        // Tải xuống file PDF
        doc.save(`HopDong_${booking.bookingID}.pdf`);
    };


    const generateContractPDF = (bookingID) => {
        const doc = new jsPDF();
        
        // Thêm font tiếng Việt (sử dụng font mặc định hỗ trợ Unicode)
        doc.setFont("helvetica");
        
        // Header
        doc.setFontSize(16);
        doc.setFont("helvetica", 'bold');
        doc.text("HOP DONG DICH VU TIEC CUOI", 20, 20);
        
        // Contract info
        doc.setFontSize(12);
        doc.setFont("helvetica", 'normal');
        doc.text(`So hop dong: HD-${bookingID}`, 20, 35);
        doc.text(`Ngay: ${new Date().toLocaleDateString('vi-VN')}`, 20, 45);
        
        // Customer info
        doc.setFont("helvetica", 'bold');
        doc.text("THONG TIN KHACH HANG:", 20, 60);
        doc.setFont("helvetica", 'normal');
        doc.text(`- Ho ten: ${booking.customer.fullName}`, 20, 70);
        doc.text(`- So dien thoai: ${booking.customer.phone}`, 20, 80);
        doc.text(`- Email: ${booking.customer.email}`, 20, 90);
        
        // Restaurant info
        doc.setFont("helvetica", 'bold');
        doc.text("THONG TIN NHA HANG:", 20, 105);
        doc.setFont("helvetica", 'normal');
        doc.text(`- Ten nha hang: ${booking.restaurant.name}`, 20, 115);
        doc.text(`- Dia chi: ${booking.restaurant.address}`, 20, 125);
        
        // Event details
        doc.setFont("helvetica", 'bold');
        doc.text("CHI TIET SU KIEN:", 20, 140);
        doc.setFont("helvetica", 'normal');
        doc.text(`- Loai su kien: ${booking.eventType}`, 20, 150);
        doc.text(`- Ngay to chuc: ${new Date(booking.eventDate).toLocaleDateString('vi-VN')}`, 20, 160);
        doc.text(`- Thoi gian: ${booking.startTime} - ${booking.endTime}`, 20, 170);
        doc.text(`- Sanh: ${booking.hall.name}`, 20, 180);
        doc.text(`- So ban: ${booking.tableCount} ban`, 20, 190);
        doc.text(`- Menu: ${booking.menu.name}`, 20, 200);
        
        // Total cost
        doc.setFont("helvetica", 'bold');
        doc.text(`TONG CHI PHI: ${booking.totalAmount.toLocaleString()} VND`, 20, 215);
        
        // Contract terms
        doc.setFont("helvetica", 'bold');
        doc.text("DIEU KHOA HOP DONG:", 20, 230);
        doc.setFont("helvetica", 'normal');
        doc.text("1. Khach hang cam ket thanh toan dung han theo thoa thuan.", 20, 240);
        doc.text("2. Nha hang cam ket cung cap dich vu dung chat luong da thoa thuan.", 20, 250);
        doc.text("3. Trong truong hop huy tiec, khach hang se bi phat theo quy dinh.", 20, 260);
        
        // Signatures
        doc.setFont("helvetica", 'bold');
        doc.text("Chu ky khach hang: _________________", 20, 280);
        doc.text("Chu ky nha hang: ___________________", 20, 290);
        
        return doc;
    };

    // Kiểm tra xem đã thanh toán chưa
    const hasPaid = () => {
        return booking.payments && booking.payments.some(payment => payment.status === 1);
    };

    const handleSignContract = async () => {
        if (!signature.trim()) {
            alert('Vui lòng nhập chữ ký của bạn');
            return;
        }

        // Kiểm tra xem đã thanh toán chưa
        if (!hasPaid()) {
            setShowPaymentRequiredModal(true);
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

    const handleCloseModal = () => {
        setShowPaymentRequiredModal(false);
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
                                    <i className="fas fa-file-pdf"></i> Hợp đồng dịch vụ
                                </h5>
                                <span className={`contract-status-badge ${contractStatus.class}`}>
                                    {contractStatus.text}
                                </span>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="contract-preview">
                                    <div className="text-center mb-4">
                                        <i className="fas fa-file-pdf" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
                                        <h4 className="mt-3">Hợp đồng dịch vụ tiệc cưới</h4>
                                        <p className="text-muted">
                                            Số hợp đồng: HD-{booking.bookingID} | Ngày: {new Date().toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>

                                    <div className="contract-summary">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h6>Thông tin khách hàng:</h6>
                                                <p><strong>Họ tên:</strong> {booking.customer.fullName}</p>
                                                <p><strong>Số điện thoại:</strong> {booking.customer.phone}</p>
                                                <p><strong>Email:</strong> {booking.customer.email}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <h6>Thông tin nhà hàng:</h6>
                                                <p><strong>Tên nhà hàng:</strong> {booking.restaurant.name}</p>
                                                <p><strong>Địa chỉ:</strong> {booking.restaurant.address}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <h6>Chi tiết sự kiện:</h6>
                                            <p><strong>Loại sự kiện:</strong> {booking.eventType}</p>
                                            <p><strong>Ngày tổ chức:</strong> {new Date(booking.eventDate).toLocaleDateString('vi-VN')}</p>
                                            <p><strong>Thời gian:</strong> {booking.startTime} - {booking.endTime}</p>
                                            <p><strong>Sảnh:</strong> {booking.hall.name}</p>
                                            <p><strong>Số bàn:</strong> {booking.tableCount} bàn</p>
                                            <p><strong>Menu:</strong> {booking.menu.name}</p>
                                        </div>

                                        <div className="mt-3">
                                            <h6>Tổng chi phí:</h6>
                                            <p className="h5 text-primary">{booking.totalAmount.toLocaleString()} VNĐ</p>
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
                                    onClick={handleDownloadPDF}
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
                                        backgroundColor: '#6c757d',
                                        color: '#fefaf9',
                                        borderColor: '#6c757d',
                                        border: '2px solid #6c757d'
                                    }}
                                >
                                    <i className="fas fa-print"></i> In hợp đồng
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card contract-signature-card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-signature"></i> Ký hợp đồng
                            </h5>
                        </div>
                        <div className="card-body">
                            {booking.contract.customerSignature ? (
                                <div className="signed-status">
                                    <div className="text-center">
                                        <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                                        <h6 className="mt-2 text-success">Đã ký hợp đồng</h6>
                                        <p className="text-muted small">
                                            Ký ngày: {formatDate(booking.contract.signedAt)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="signature-section">
                                    {!hasPaid() ? (
                                        <div className="alert alert-warning">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            <strong>Chưa thanh toán:</strong> Bạn cần thanh toán trước khi có thể ký hợp đồng.
                                            <div className="mt-2">
                                                <Link 
                                                    to="/payment/new"
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    <i className="fas fa-credit-card me-2"></i>
                                                    Đi đến thanh toán
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-success">
                                            <i className="fas fa-check-circle me-2"></i>
                                            <strong>Đã thanh toán:</strong> Bạn có thể ký hợp đồng.
                                        </div>
                                    )}

                                    <div className="signature-input">
                                        <label className="form-label">Chữ ký của bạn:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            placeholder="Nhập chữ ký của bạn"
                                            value={signature}
                                            onChange={(e) => setSignature(e.target.value)}
                                            disabled={!hasPaid()}
                                        />
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={handleSignContract}
                                            disabled={isSigning || !hasPaid()}
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
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Payment Required Modal */}
            {showPaymentRequiredModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                                    Cần thanh toán trước
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center">
                                    <i className="fas fa-credit-card text-warning" style={{ fontSize: '3rem' }}></i>
                                    <h5 className="mt-3">Bạn cần thanh toán trước khi ký hợp đồng</h5>
                                    <p className="text-muted">
                                        Để ký hợp đồng, bạn phải hoàn thành thanh toán trước. 
                                        Sau khi thanh toán thành công, bạn sẽ có thể ký hợp đồng và xem lịch sử thanh toán.
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <Link 
                                    to="/payment/new"
                                    className="btn btn-primary"
                                    onClick={handleCloseModal}
                                >
                                    <i className="fas fa-credit-card me-2"></i>
                                    Đi đến thanh toán
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractTab;
