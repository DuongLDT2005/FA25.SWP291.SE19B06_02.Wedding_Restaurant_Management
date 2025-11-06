import { Table } from "react-bootstrap"

export default function Logs() {
    const logs = [
        { time: "2025-11-03 08:42", action: "Admin login", user: "Thinh" },
        { time: "2025-11-02 21:10", action: "Cập nhật SystemSetting", user: "Admin02" },
        { time: "2025-11-02 10:15", action: "Thêm đối tác mới", user: "Admin03" },
    ]

    return (
        <div>
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>🧾 Nhật ký hệ thống</h3>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                        <th>Người thực hiện</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, i) => (
                        <tr key={i}>
                            <td>{log.time}</td>
                            <td>{log.action}</td>
                            <td>{log.user}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
