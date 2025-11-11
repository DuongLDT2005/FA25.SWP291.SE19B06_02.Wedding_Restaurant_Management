import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSearchForm } from "../../hooks/useSearchForm";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import EventTypeSelect from "./EventTypeSelect";
import TablesSelect from "./TablesSelection";
import TimeSelect from "./TimeSelect";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/SearchBarStyles.css";

export default function SearchSection({ noOverlap = false }) {
  const { getQueryString, performSearch } = useSearchForm();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🟢 Gọi API tìm kiếm (nếu cần lưu Redux)
      await performSearch();

      // 🟢 Lấy query string từ hook
      const q = getQueryString();
      console.log("Navigating to:", `/searchresult?${q}`);

      // 🟢 Điều hướng đến trang kết quả
      navigate(`/searchresult?${q}`);
    } catch (err) {
      console.error("❌ Search error:", err);
      // Nếu có lỗi khi fetch, vẫn điều hướng để hiển thị thông báo ở trang SearchResult
      const q = getQueryString();
      navigate(`/searchresult?${q}`);
    }
  };

  return (
    <section
      style={{
        position: "relative",
        zIndex: 5,
        marginTop: noOverlap ? "20px" : "-70px",
      }}
    >
      <Container fluid style={{ padding: "0 50px", maxWidth: "1200px" }}>
        <Form
          onSubmit={handleSubmit}
          className="bg-white rounded-3 shadow p-4"
        >
          <Row className="g-1 align-items-end">
            {/* Vị trí */}
            <Col xs={12} md={6} lg={3}>
              <LocationInput />
            </Col>

            {/* Loại tiệc */}
            <Col xs={12} md={6} lg={2}>
              <EventTypeSelect />
            </Col>

            {/* Số bàn */}
            <Col xs={12} md={6} lg={1}>
              <TablesSelect />
            </Col>

            {/* Ngày */}
            <Col xs={12} md={6} lg={2}>
              <DateInput />
            </Col>

            {/* Giờ bắt đầu & kết thúc */}
            <Col xs={12} md={6} lg={3}>
              <TimeSelect />
            </Col>

            {/* Nút tìm kiếm */}
            <Col
              xs={12}
              md={6}
              lg={1}
              className="text-center d-flex justify-content-center"
            >
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
