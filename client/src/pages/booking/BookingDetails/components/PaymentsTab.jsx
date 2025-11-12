import React from "react";

export default function PaymentsTab({ booking }) {
    return (
        <div className="tab-pane fade show active">
            <div className="card custom-contract-card">
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
                                    {booking.payments.map((payment, index) => (
                                        <tr key={index}>
                                            <td>
                                                {payment.type === 0
                                                    ? "Tiền cọc (30%)"
                                                    : "Thanh toán còn lại (70%)"}
                                            </td>
                                            <td>{payment.amount.toLocaleString()} VNĐ</td>
                                            <td>{payment.status === 1 ? "Đã thanh toán" : "Chờ"}</td>
                                            <td>{payment.paymentDate || "-"}</td>
                                            <td>{payment.paymentMethod || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="fas fa-credit-card text-muted" style={{ fontSize: "3rem" }}></i>
                            <h5 className="mt-3">Chưa có lịch sử thanh toán</h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
