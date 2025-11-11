import { Form, Button, Card } from "react-bootstrap"

export default function SystemSetting() {
    return (
        <div>
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>⚙️ Cài đặt hệ thống</h3>
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email thông báo hệ thống</Form.Label>
                            <Form.Control type="email" placeholder="admin@example.com" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian auto backup (giờ)</Form.Label>
                            <Form.Control type="number" defaultValue={24} />
                        </Form.Group>

                        <Button variant="primary">Lưu thay đổi</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}
