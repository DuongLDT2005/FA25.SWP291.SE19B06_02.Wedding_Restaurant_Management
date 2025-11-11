import React, { useState, useEffect, useCallback } from "react";
import mock from "../../../mock/partnerMock";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import PartnerLayout from "../../../layouts/PartnerLayout";

const TIME_SLOTS = [
  { label: "Buổi trưa (10:30 - 14:00)", startTime: "10:30", endTime: "14:00" },
  { label: "Buổi tối (17:30 - 21:00)", startTime: "17:30", endTime: "21:00" },
];

export default function HallSchedulePage() {
  const today = new Date().toISOString().slice(0, 10);
  const initialSlot = TIME_SLOTS[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [startTime, setStartTime] = useState(initialSlot.startTime);
  const [endTime, setEndTime] = useState(initialSlot.endTime);
  const [selectedRestaurantID, setSelectedRestaurantID] = useState(
    mock.restaurants[0]?.restaurantID ?? null
  );
  const [bookings, setBookings] = useState(mock.bookings);

  const restaurant =
    mock.restaurants.find((r) => r.restaurantID === selectedRestaurantID) || {
      halls: [],
      name: "",
    };
  const halls = restaurant.halls || [];

  const [displayHalls, setDisplayHalls] = useState([]);

  const computeOccupied = useCallback(
    (date, sTime, eTime) =>
      halls.map((hall) => {
        const occupied = bookings.some(
          (b) =>
            b.hallID === hall.hallID &&
            b.eventDate === date &&
            b.startTime === sTime &&
            b.endTime === eTime &&
            b.status === 1
        );
        return { ...hall, occupied };
      }),
    [halls, bookings]
  );

  // Init / update display halls when dependencies change
  useEffect(() => {
    setDisplayHalls(computeOccupied(selectedDate, startTime, endTime));
  }, [computeOccupied, selectedDate, startTime, endTime]);

  const handleSearch = () => {
    setDisplayHalls(computeOccupied(selectedDate, startTime, endTime));
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
    setBookings((prev) => [...prev, newBooking]);
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

  // change timeslot -> update start/end
  const handleSlotChange = (e) => {
    const label = e.target.value;
    const slot = TIME_SLOTS.find((s) => s.label === label);
    if (slot) {
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
    }
  };

  const currentLabel =
    TIME_SLOTS.find((slot) => slot.startTime === startTime && slot.endTime === endTime)
      ?.label || TIME_SLOTS[0].label;

  return (
    <PartnerLayout>
      <div className="p-3">
        <h3>Lịch sử dụng sảnh - {restaurant.name}</h3>

        <Row className="mb-3 g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Chọn nhà hàng:</Form.Label>
              <Form.Select
                value={selectedRestaurantID ?? ""}
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
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Khung giờ</Form.Label>
              <Form.Select value={currentLabel} onChange={handleSlotChange}>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.label} value={slot.label}>
                    {slot.label}
                  </option>
                ))}
              </Form.Select>
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
                    <Button
                      size="sm"
                      variant="success"
                      className="text-white"
                      onClick={() => handleSetAvailable(hall.hallID)}
                    >
                      Đánh dấu trống
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="danger"
                      className="text-white"
                      onClick={() => handleSetOccupied(hall.hallID)}
                    >
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