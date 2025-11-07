import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";
import './ContractTabStyles.css';
const ContractTab = ({ booking }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

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

    // Partner-provided PDF URL (mock or from booking.contract)
    const partnerPdfUrl = booking?.contract?.partnerPdfUrl
        || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    const handleChoosePdf = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert('Vui lòng chọn file PDF.');
            return;
        }
        setSelectedPdf(file);
    };

    const handleUploadPdf = async () => {
        if (!selectedPdf) {
            alert('Vui lòng chọn file PDF để tải lên.');
            return;
        }
        try {
            setIsUploading(true);
            // Giả lập upload
            await new Promise(resolve => setTimeout(resolve, 1500));
            const objectUrl = URL.createObjectURL(selectedPdf);
            // Lưu vào sessionStorage cho mock flow
            const key = `customerUploadedContractPdf_${booking.bookingID}`;
            sessionStorage.setItem(key, objectUrl);
            // Gắn vào booking.contract nếu có
            booking.contract = booking.contract || {};
            booking.contract.customerUploadedPdf = objectUrl;
            alert('Tải lên hợp đồng đã ký thành công!');
        } catch (err) {
            console.error(err);
            alert('Tải lên thất bại, vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    // Signing flow removed

    return (
        <div className="tab-pane fade show active">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card contract-card custom-contract-card" >
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-file-pdf"></i> Hợp đồng dịch vụ
                            </h5>
                        </div>
                        <div className="card-body">
                            {booking?.contract?.customerUploadedPdf ? (
                                // Hiển thị file PDF đã upload
                                <div className="text-center">
                                    <div className="mb-4">
                                        <i className="fas fa-file-pdf text-success" style={{ fontSize: '4rem' }}></i>
                                        <h4 className="mt-3 text-success">Hợp đồng đã ký</h4>
                                        <p className="text-muted">
                                            File PDF đã được tải lên thành công
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-center gap-3">
                                        <a
                                            href={booking.contract.customerUploadedPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-lg"
                                            style={{
                                                backgroundColor: '#934',
                                                color: '#fff',
                                                borderColor: '#934'
                                            }}
                                        >
                                            <i className="fas fa-eye me-2"></i>
                                            Xem hợp đồng đã ký
                                        </a>
                                        <a
                                            href={booking.contract.customerUploadedPdf}
                                            download
                                            className="btn btn-lg"
                                            style={{
                                                backgroundColor: '#6c757d',
                                                color: '#fff',
                                                borderColor: '#6c757d'
                                            }}
                                        >
                                            <i className="fas fa-download me-2"></i>
                                            Tải xuống
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                // Hiển thị thông báo chưa có file
                                <div className="text-center">
                                    <i className="fas fa-file-pdf text-muted" style={{ fontSize: '4rem' }}></i>
                                    <h4 className="mt-3 text-muted">Chưa có hợp đồng đã ký</h4>
                                    <p className="text-muted">
                                        Hợp đồng sẽ xuất hiện ở đây sau khi bạn tải lên file PDF đã ký
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card contract-actions-card custom-contract-card" >
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
                                        backgroundColor: '#993344',
                                        color: '#fefaf9',
                                        borderColor: '#993344',
                                        border: '2px solid #993344'
                                    }}
                                >
                                    <i className="fas fa-print"></i> In hợp đồng
                                </button>
                                {/* View partner-provided PDF before payment */}
                                {!hasPaid() && (
                                    <a
                                        href={partnerPdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn w-100"
                                        style={{
                                            backgroundColor: '#0d6efd',
                                            color: '#fff',
                                            border: '2px solid #0d6efd'
                                        }}
                                    >
                                        <i className="fas fa-file-pdf me-2"></i>
                                        Xem hợp đồng (PDF) từ nhà hàng
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload signed PDF after payment */}
                    {hasPaid() && (
                        <div className="card mt-3 custom-contract-card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-upload me-2"></i>
                                    Tải lên hợp đồng đã ký (PDF)
                                </h5>
                            </div>
                            <div className="card-body">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="form-control mb-2"
                                    onChange={handleChoosePdf}
                                />
                                <button
                                    className="btn w-100"
                                    onClick={handleUploadPdf}
                                    disabled={isUploading}
                                    style={{
                                        backgroundColor: '#934',
                                        color: '#fff',
                                        borderColor: '#934'
                                    }}
                                >
                                    {isUploading ? 'Đang tải lên...' : 'Tải lên PDF'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Signing removed */}

                </div>
            </div>

            {/* Payment required modal removed */}
        </div>
    );
};

export default ContractTab;
