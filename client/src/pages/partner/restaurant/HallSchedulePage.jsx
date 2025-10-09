import React, { useState, useEffect } from "react";
import mock from "../../../mock/partnerMock";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import PartnerLayout from "../../../layouts/PartnerLayout";

export default function HallSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [selectedRestaurantID, setSelectedRestaurantID] = useState(mock.restaurants[0]?.restaurantID || null);
  const [bookings, setBookings] = useState(mock.bookings);

  const restaurant = mock.restaurants.find((r) => r.restaurantID === selectedRestaurantID) || { halls: [], name: "" };
  const halls = restaurant.halls;

  const [displayHalls, setDisplayHalls] = useState([]);

  // Hiển thị tất cả hall khi load trang hoặc khi đổi nhà hàng
  useEffect(() => {
    const initialHalls = halls.map((hall) => {
      const occupied = bookings.some(
        (b) =>
          b.hallID === hall.hallID &&
          b.eventDate === selectedDate &&
          b.startTime === startTime &&
          b.endTime === endTime &&
          b.status === 1
      );
      return { ...hall, occupied };
    });
    setDisplayHalls(initialHalls);
  }, [halls, bookings, selectedDate, startTime, endTime]);

  const handleSearch = () => {
    const filtered = halls.map((hall) => {
      const occupied = bookings.some(
        (b) =>
          b.hallID === hall.hallID &&
          b.eventDate === selectedDate &&
          b.startTime === startTime &&
          b.endTime === endTime &&
          b.status === 1
      );
      return { ...hall, occupied };
    });
    setDisplayHalls(filtered);
  };

  const handleSetOccupied = (hallID) => {
    const newBooking = {
      bookingID: Date.now(),
      hallID,
      eventDate: selectedDate,
      status: 1,
      customerID: null,
      menuID: null,
      startTime,
      endTime,
    };
    setBookings([...bookings, newBooking]);
    setDisplayHalls((prev) =>
      prev.map((h) => (h.hallID === hallID ? { ...h, occupied: true } : h))
    );
  };

  const handleSetAvailable = (hallID) => {
    setBookings((prev) =>
      prev.filter(
        (b) =>
          !(
            b.hallID === hallID &&
            b.eventDate === selectedDate &&
            b.startTime === startTime &&
            b.endTime === endTime
          )
      )
    );
    setDisplayHalls((prev) =>
      prev.map((h) => (h.hallID === hallID ? { ...h, occupied: false } : h))
    );
  };

  return (
    <PartnerLayout>
      <div className="p-3">
        <h3>Lịch sử dụng sảnh - {restaurant.name}</h3>

        <Row className="mb-3 g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Chọn nhà hàng:</Form.Label>
              <Form.Select
                value={selectedRestaurantID}
                onChange={(e) => setSelectedRestaurantID(Number(e.target.value))}
              >
                {mock.restaurants.map((r) => (
                  <option key={r.restaurantID} value={r.restaurantID}>
                    {r.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Chọn ngày:</Form.Label>
              <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Giờ bắt đầu:</Form.Label>
              <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Giờ kết thúc:</Form.Label>
              <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </Col>
        </Row>

        <Table bordered hover>
          <thead>
            <tr>
              <th>Sảnh</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayHalls.map((hall) => (
              <tr key={hall.hallID}>
                <td>{hall.name}</td>
                <td>
                  {hall.occupied ? (
                    <span className="badge bg-danger">Đang sử dụng</span>
                  ) : (
                    <span className="badge bg-success">Sẵn sàng</span>
                  )}
                </td>
                <td>
                  {hall.occupied ? (
                    <Button size="sm" variant="success" className="text-white" onClick={() => handleSetAvailable(hall.hallID)}>
                      Đánh dấu trống
                    </Button>
                  ) : (
                    <Button size="sm" variant="danger" className="text-white" onClick={() => handleSetOccupied(hall.hallID)}>
                      Đánh dấu bận
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </PartnerLayout>
  );
}
