import React from "react";
import { Form } from "react-bootstrap";
import { Utensils } from "lucide-react";
import { useSearchForm } from "../../hooks/useSearchForm";

const EVENT_TYPES = ["Tiệc cưới", "Sinh nhật", "Liên hoan", "Hội thảo", "Tiệc công ty"];

export default function EventTypeSelect() {
  const { state, setField } = useSearchForm();
  return (
    <div>
      <Form.Label>
        <Utensils className="me-1" style={{ color: '#E11D48'}} size={18}/>
        Loại sự kiện
      </Form.Label>
      <Form.Select
        value={state.eventType ? state.eventType : EVENT_TYPES[0]}
        onChange={(e) => setField("eventType", e.target.value)}
        className="custom-form-select"
      >
        {EVENT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Form.Select>
    </div>
  );
}
