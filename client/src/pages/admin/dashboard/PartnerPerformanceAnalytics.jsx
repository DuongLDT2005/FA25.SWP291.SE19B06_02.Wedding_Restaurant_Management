import { Table } from "react-bootstrap"

export default function PartnerPerformanceAnalytics() {
    const partners = [
        { name: "The Rose Hall", revenue: 1200000000, rating: 4.7, bookings: 142 },
        { name: "Golden Lotus", revenue: 980000000, rating: 4.6, bookings: 130 },
        { name: "Diamond Palace", revenue: 850000000, rating: 4.5, bookings: 125 },
    ]

    return (
        <div>
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>🤝 Hiệu suất đối tác</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nhà hàng</th>
                        <th>Doanh thu (VNĐ)</th>
                        <th>Số booking</th>
                        <th>Đánh giá TB</th>
                    </tr>
                </thead>
                <tbody>
                    {partners.map((p, i) => (
                        <tr key={i}>
                            <td>{p.name}</td>
                            <td>{p.revenue.toLocaleString()}</td>
                            <td>{p.bookings}</td>
                            <td>{p.rating} ⭐</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
