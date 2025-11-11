import { Card } from "react-bootstrap"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function BookingAnalytics() {
    const bookingData = [
        { month: "T1", bookings: 120 },
        { month: "T2", bookings: 150 },
        { month: "T3", bookings: 180 },
        { month: "T4", bookings: 210 },
        { month: "T5", bookings: 250 },
    ]

    return (
        <div>
            <h3 style={{ fontWeight: 600, marginBottom: 20 }}>📅 Phân tích Booking</h3>
            <Card>
                <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bookingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        </div>
    )
}
