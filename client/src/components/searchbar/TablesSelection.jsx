import React from "react";
import { Form } from "react-bootstrap";
import { Users } from "lucide-react";
import { useSearchForm } from "../../hooks/useSearchForm";

export default function TablesSelect() {
  const { state, setField } = useSearchForm();

  return (
    <div>
      <Form.Label>
        <Users className="me-1" style={{ color: '#E11D48' }} size={18} />
        Số bàn
      </Form.Label>
      <Form.Control
        type="number"
        min={1}
        value={state.tables ? state.tables : 1}
        onChange={(e) => setField("tables", e.target.value)}
        className="custom-form-input"
      />
    </div>
  );
}