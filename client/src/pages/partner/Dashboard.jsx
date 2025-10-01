import React from "react";
import { Row, Col, Card, Table, Badge, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppLayout from "../../layouts/PartnerLayout";
import mock from "../../mock/partnerMock";

export default function Dashboard() {
  return (
    <AppLayout>
      <Row className="g-3">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Welcome back, {mock.partner.name.split(" - ")[0]}</Card.Title>
              <Row>
                <Col><Stat title="Upcoming" value={mock.stats.upcoming} /></Col>
                <Col><Stat title="Pending Payouts" value={mock.stats.pendingPayouts} /></Col>
                <Col><Stat title="Revenue (This month)" value={`${mock.stats.revenueMonth.toLocaleString()} VND`} /></Col>
              </Row>

              <h6 className="mt-4">Recent Bookings</h6>
              <Table hover>
                <thead><tr><th>ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {mock.bookings.map(b => (
                    <tr key={b.id}>
                      <td><Link to={`/partner/bookings/${b.id}`}>{b.id}</Link></td>
                      <td>{b.customer}</td>
                      <td>{b.date}</td>
                      <td><Badge bg={b.status==="Confirmed" ? "success":"secondary"}>{b.status}</Badge></td>
                      <td>{b.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Notifications</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>New booking request #{mock.bookings[0].id}</ListGroup.Item>
                <ListGroup.Item>Payout scheduled</ListGroup.Item>
                <ListGroup.Item>New review posted</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Shortcuts</Card.Title>
              <div className="d-grid gap-2">
                <Button as={Link} to="/partner/bookings">Manage Bookings</Button>
                <Button variant="outline-primary" as={Link} to="/partner/restaurants">Edit Listing</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

function Stat({ title, value }) {
  return (
    <Card className="text-center">
      <Card.Body>
        <h3>{value}</h3>
        <div>{title}</div>
      </Card.Body>
    </Card>
  );
}