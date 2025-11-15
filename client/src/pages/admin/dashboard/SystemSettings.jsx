import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

export default function SystemSettings() {
  const [settings, setSettings] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/api/dashboard/system-settings").then((res) => {
      setSettings(res.data);
    });
  }, []);

  const handleSave = async (id, newValue) => {
    setSaving(true);

    try {
      await axios.put(`/api/dashboard/system-settings/${id}`, {
        settingValue: newValue,
      });

      setSettings((prev) =>
        prev.map((s) => (s.settingID === id ? { ...s, settingValue: newValue } : s))
      );
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu cài đặt");
    }

    setSaving(false);
  };

  if (!settings.length) return <p>⏳ Đang tải cài đặt hệ thống...</p>;

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 20 }}>⚙️ Cài đặt hệ thống</h3>

      {settings.map((setting) => (
        <Card
          key={setting.settingID}
          className="mb-3"
          style={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
        >
          <Card.Body>
            <h5 style={{ fontWeight: 600, marginBottom: 10 }}>
              {setting.settingName}
            </h5>

            <Row className="align-items-center">
              <Col md={8}>
                <Form.Control
                  type="text"
                  defaultValue={setting.settingValue}
                  onChange={(e) => {
                    setting.settingValue = e.target.value;
                  }}
                />
                <small className="text-muted">{setting.description}</small>
              </Col>
              <Col md={4} className="text-end">
                <Button
                  variant="primary"
                  disabled={saving}
                  onClick={() => handleSave(setting.settingID, setting.settingValue)}
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
