import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap"; 
import DateInput from "./DateInput";
import EventTypeSelect from "./EventTypeSelect";
import LocationInput from "./LocationInput";
import SearchButton from "./SearchButton";
import TablesSelect from "./TablesSelection";
import TimeSelect from "./TimeSelect";

function SearchBar() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 5,
        marginTop: "-50px",
      }}
    >
      <Container fluid style={{ padding: "0 50px", maxWidth: "1200px" }}>
        <Form className="bg-white rounded-3 shadow p-4">
          <Row className="g-3 align-items-end">
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

            <Col
              xs={12}
              md={6}
              lg={1}
              className="text-center d-flex justify-content-center"
            >
              <SearchButton />
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
}

export default SearchBar;
