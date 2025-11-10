import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSearchForm } from "../../hooks/useSearchForm";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import EventTypeSelect from "./EventTypeSelect";
import TablesSelect from "./TablesSelection";
import { Search } from "lucide-react";
import TimeSelect from "./TimeSelect";
import "../../styles/SearchBarStyles.css"
import { useNavigate } from "react-router-dom";
export default function SearchSection() {
  const { getQueryString, performSearch, state } = useSearchForm();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // gọi API và lưu kết quả vào redux (performSearch đã làm việc đó)
      await performSearch(); // có thể truyền override nếu cần
      const q = getQueryString();
      navigate(`/search?${q}`);
    } catch (err) {
      // hiển thị lỗi đơn giản
      console.error("Search error", err);
      // bạn có thể show toast hoặc message UI
    }
  };

  return (
    <section style={{
      position: "relative",
      zIndex: 5,
      marginTop: "-70px",
    }}>
      <Container fluid style={{ padding: "0 50px", maxWidth: "1200px" }}>
        <Form onSubmit={handleSubmit} className="bg-white rounded-3 shadow p-4">
          {/* Hàng input */}
          <Row className="g-2 align-items-end">
            <Col xs={12} md={6} lg={3}>
              <LocationInput />
            </Col>

            <Col xs={12} md={6} lg={2}>
              <EventTypeSelect />
            </Col>

            <Col xs={12} md={6} lg={1}>
              <TablesSelect />
            </Col>

            <Col xs={12} md={6} lg={2}>
              <DateInput />
            </Col>

            <Col xs={12} md={6} lg={3}>
              <TimeSelect />
            </Col>

            {/* Nút Tìm kiếm cùng hàng */}
            <Col xs={12} md={6} lg={1} className="text-center d-flex justify-content-center">
              <Button
                type="submit"
                variant="danger"
                className="px-4 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: "#E11D48" }}
              >
                <Search size={18} color="white" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
}