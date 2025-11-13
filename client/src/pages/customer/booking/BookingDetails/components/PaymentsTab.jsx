import React from "react";

const PRIMARY = "#D81C45";

export default function PaymentsTab({ booking }) {
    const payments = booking?.payments || [];

    return (
        <div className="tab-pane fade show active">
            <div
                className="card custom-contract-card"
                style={{ border: "none", boxShadow: "none" }}
            >
                <div
                    className="card-header"
                    style={{
                        backgroundColor: "#f8f9fa",
                        borderBottom: `2px solid ${PRIMARY}`,
                    }}
                >
                    <h5 className="card-title mb-0" style={{ color: PRIMARY }}>
                        <i className="fas fa-credit-card me-2"></i>
                        Lịch sử thanh toán
                    </h5>
                </div>

                <div className="card-body">
                    {payments.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead
                                    style={{
                                        backgroundColor: PRIMARY,
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                >
                                    <tr>
                                        <th>Loại thanh toán</th>
                                        <th>Số tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày thanh toán</th>
                                        <th>Phương thức</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((p, i) => (
                                        <tr key={i}>
                                            <td style={{ fontWeight: 600 }}>
                                                {p.type === 0
                                                    ? "Tiền cọc (30%)"
                                                    : "Thanh toán còn lại (70%)"}
                                            </td>

                                            <td>
                                                {p.amount.toLocaleString("vi-VN")} VNĐ
                                            </td>

                                            <td
                                                style={{
                                                    color: p.status === 1 ? PRIMARY : "#888",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {p.status === 1
                                                    ? "Đã thanh toán"
                                                    : "Chờ xử lý"}
                                            </td>

                                            <td>{p.paymentDate || "-"}</td>
                                            <td>{p.paymentMethod || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i
                                className="fas fa-credit-card"
                                style={{ fontSize: "3rem", color: PRIMARY }}
                            ></i>
                            <h5 className="mt-3" style={{ color: PRIMARY }}>
                                Chưa có lịch sử thanh toán
                            </h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
