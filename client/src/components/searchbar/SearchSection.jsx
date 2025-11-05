import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
// import { useSearchForm } from "../../../hooks/useSearchForm";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import EventTypeSelect from "./EventTypeSelect";
import TablesSelect from "./TablesSelection";
import SearchButton from "./SearchButton";
import TimeSelect from "./TimeSelect";
import "../../../styles/SearchBarStyles.css"
export default function SearchSection() {
//   const { getQueryString } = useSearchForm();
//   Thêm hàm tạm thay thế để tránh lỗi khi submit
  const getQueryString = () => {
    return "?location=lien-chieu&date=2025-11-03&tables=10";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = getQueryString();
    console.log("Navigate to:", query);
    // TODO: navigate to result page
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
              <SearchButton />
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
}