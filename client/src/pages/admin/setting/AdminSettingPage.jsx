import React, { useState } from "react";
import { Tabs, Tab, Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../../layouts/AdminLayout";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const [settings, setSettings] = useState({
    fullName: "Admin LifEvent",
    email: "admin@lifevent.vn",
    theme: "light",
    notifications: true,
    companyName: "LifEvent Platform",
    supportEmail: "support@lifevent.vn",
  });

  const handleChange = (field, value) =>
    setSettings((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    alert("✅ Lưu thay đổi thành công (mock)");
  };

  return (
    <AdminLayout title="Cài đặt hệ thống">
      <div className="container py-4">
        <h2 className="fw-bold text-primary mb-4">Cài đặt</h2>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              id="settings-tabs"
              className="mb-3"
            >
              {/* TAB 1: Hồ sơ tài khoản */}
              <Tab eventKey="account" title="Tài khoản">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ tên</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSave}>
                    Lưu thay đổi
                  </Button>
                </Form>
              </Tab>

              {/* TAB 2: Hệ thống */}
              <Tab eventKey="system" title="Hệ thống">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên hệ thống</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email hỗ trợ</Form.Label>
                    <Form.Control
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Giao diện</Form.Label>
                    <Form.Select
                      value={settings.theme}
                      onChange={(e) => handleChange("theme", e.target.value)}
                    >
                      <option value="light">Sáng</option>
                      <option value="dark">Tối</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" onClick={handleSave}>
                    Lưu thay đổi
                  </Button>
                </Form>
              </Tab>

              {/* TAB 3: Thông báo */}
              <Tab eventKey="notifications" title="Thông báo">
                <Form>
                  <Form.Check
                    type="switch"
                    id="notifications-switch"
                    label="Nhận thông báo qua email"
                    checked={settings.notifications}
                    onChange={(e) =>
                      handleChange("notifications", e.target.checked)
                    }
                    className="mb-3"
                  />
                  <Button variant="primary" onClick={handleSave}>
                    Lưu thay đổi
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
}
