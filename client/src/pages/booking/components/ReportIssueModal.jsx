import React, { useState } from 'react';

const ReportIssueModal = ({ booking, onClose }) => {
    const [formData, setFormData] = useState({
        targetType: 'RESTAURANT',
        reasonType: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const targetTypeOptions = [
        { value: 'RESTAURANT', label: 'Nhà hàng' },
        { value: 'REVIEW', label: 'Đánh giá' }
    ];

    const reasonTypeOptions = {
        RESTAURANT: [
            { value: 'FAKE_INFO', label: 'Thông tin giả mạo' },
            { value: 'SPAM', label: 'Spam' },
            { value: 'FRAUD', label: 'Lừa đảo' },
            { value: 'INAPPROPRIATE', label: 'Nội dung không phù hợp' },
            { value: 'OTHER', label: 'Khác' }
        ],
        REVIEW: [
            { value: 'FAKE_REVIEW', label: 'Đánh giá giả' },
            { value: 'SPAM', label: 'Spam' },
            { value: 'INAPPROPRIATE', label: 'Nội dung không phù hợp' },
            { value: 'IRRELEVANT', label: 'Không liên quan' },
            { value: 'OTHER', label: 'Khác' }
        ]
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.reasonType) {
            alert('Vui lòng chọn lý do báo cáo');
            return;
        }

        if (!formData.content.trim()) {
            alert('Vui lòng mô tả chi tiết vấn đề');
            return;
        }

        setIsSubmitting(true);
        try {
            // Mock API call - thay thế bằng API thực tế
            const reportData = {
                userID: 1, // Mock user ID
                restaurantID: booking.restaurant.restaurantID,
                reviewID: formData.targetType === 'REVIEW' ? 1 : null, // Mock review ID
                targetType: formData.targetType,
                reasonType: formData.reasonType,
                content: formData.content,
                status: 0 // PENDING
            };

            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert('Báo cáo đã được gửi thành công. Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.');
            onClose();
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentReasonOptions = reasonTypeOptions[formData.targetType] || [];

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-flag text-danger"></i> Báo cáo vấn đề
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={isSubmitting}
                        ></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle"></i>
                                <strong>Thông tin đặt tiệc:</strong> #{booking.bookingID} - {booking.restaurant.name}
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="targetType" className="form-label">
                                            <i className="fas fa-bullseye"></i> Đối tượng báo cáo *
                                        </label>
                                        <select
                                            className="form-select"
                                            id="targetType"
                                            name="targetType"
                                            value={formData.targetType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {targetTypeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="reasonType" className="form-label">
                                            <i className="fas fa-exclamation-triangle"></i> Lý do báo cáo *
                                        </label>
                                        <select
                                            className="form-select"
                                            id="reasonType"
                                            name="reasonType"
                                            value={formData.reasonType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn lý do báo cáo</option>
                                            {currentReasonOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">
                                    <i className="fas fa-comment-alt"></i> Mô tả chi tiết vấn đề *
                                </label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    name="content"
                                    rows="5"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                                    required
                                ></textarea>
                                <div className="form-text">
                                    Cung cấp thông tin chi tiết sẽ giúp chúng tôi xử lý báo cáo nhanh chóng hơn.
                                </div>
                            </div>

                            <div className="report-guidelines">
                                <h6><i className="fas fa-lightbulb"></i> Hướng dẫn báo cáo:</h6>
                                <ul className="list-unstyled">
                                    <li><i className="fas fa-check text-success"></i> Mô tả rõ ràng và cụ thể vấn đề</li>
                                    <li><i className="fas fa-check text-success"></i> Cung cấp bằng chứng nếu có thể</li>
                                    <li><i className="fas fa-check text-success"></i> Tránh sử dụng ngôn ngữ không phù hợp</li>
                                    <li><i className="fas fa-check text-success"></i> Báo cáo sẽ được xử lý trong vòng 24-48 giờ</li>
                                </ul>
                            </div>

                            <div className="report-examples">
                                <h6><i className="fas fa-examples"></i> Ví dụ báo cáo hiệu quả:</h6>
                                <div className="example-item">
                                    <strong>Ví dụ tốt:</strong>
                                    <p className="text-success small">
                                        "Nhà hàng đã thay đổi menu mà không thông báo trước, 
                                        và giá món ăn tăng 30% so với thỏa thuận ban đầu."
                                    </p>
                                </div>
                                <div className="example-item">
                                    <strong>Ví dụ không tốt:</strong>
                                    <p className="text-danger small">
                                        "Nhà hàng tệ quá" (quá chung chung, không cung cấp thông tin cụ thể)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                <i className="fas fa-times"></i> Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i> Gửi báo cáo
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportIssueModal;
