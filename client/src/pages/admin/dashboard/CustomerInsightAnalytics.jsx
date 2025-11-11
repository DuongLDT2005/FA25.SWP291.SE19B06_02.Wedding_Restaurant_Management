import { Card } from "react-bootstrap"

export default function CustomerInsightAnalytics() {
    return (
        <div>
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>👥 Thông tin khách hàng</h3>
            <Card>
                <Card.Body>
                    <p>Tổng số khách hàng: 487</p>
                    <p>Khách hàng mới tháng này: 36</p>
                    <p>Khách hàng quay lại: 74%</p>
                </Card.Body>
            </Card>
        </div>
    )
}
