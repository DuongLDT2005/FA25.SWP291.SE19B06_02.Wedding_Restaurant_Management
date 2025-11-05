import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Clock } from "lucide-react";
// import { useSearchForm } from "../../../hooks/useSearchForm";

const TIME_SLOTS = [
  { label: "Buổi trưa (10:30 - 14:00)", startTime: "10:30", endTime: "14:00" },
  { label: "Buổi tối (17:30 - 21:00)", startTime: "17:30", endTime: "21:00" },
];

export default function TimeSelect() {
//   const { state, setField } = useSearchForm();
// Thêm state tạm để form vẫn chạy độc lập
  const [state, setState] = useState({
    startTime: TIME_SLOTS[0].startTime,
    endTime: TIME_SLOTS[0].endTime,
  });

  const setField = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };
  const handleChange = (e) => {
    const selected = TIME_SLOTS.find(
      (slot) => slot.label === e.target.value
    );
    if (selected) {
      setField("startTime", selected.startTime);
      setField("endTime", selected.endTime);
    } else {
      setField("startTime", "");
      setField("endTime", "");
    }
  };

  const currentLabel =
    TIME_SLOTS.find(
      (slot) =>
        slot.startTime === state.startTime && slot.endTime === state.endTime
    )?.label || TIME_SLOTS[0];

  return (
    <div>
      <Form.Label>
        <Clock className="me-1" style={{ color: '#E11D48' }} size={18} />
        Khung giờ
      </Form.Label>
      <Form.Select
        value={currentLabel}
        onChange={handleChange}
        className="custom-form-select"
      >
        {TIME_SLOTS.map((slot) => (
          <option key={slot.label} value={slot.label}>
            {slot.label}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}