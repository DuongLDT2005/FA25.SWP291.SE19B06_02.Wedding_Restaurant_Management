import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import mock from "../../mock/partnerMock";

export default function Profile() {
  const { name, phone, address } = mock.partner;

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <h2 className="mb-4 fw-bold" style={{ color: "#993344" }}>
          👤 Partner Profile
        </h2>

        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <Image
                src="https://via.placeholder.com/80"
                roundedCircle
                className="me-3 border"
                alt="Partner Avatar"
              />
              <div>
                <h5 className="mb-1 fw-bold" style={{ color: "#993344" }}>
                  {name.split(" - ")[0]}
                </h5>
                <small className="text-muted">{name.split(" - ")[1]}</small>
              </div>
            </div>

            <div className="ms-1">
              <p className="mb-2">
                <strong>📞 Phone:</strong> {phone}
              </p>
              <p className="mb-2">
                <strong>🏠 Address:</strong> {address}
              </p>
              <p className="mb-0">
                <strong>🏢 Restaurant:</strong> {mock.restaurants[0].name}
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
