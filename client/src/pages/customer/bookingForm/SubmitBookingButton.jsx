import React, { useState } from "react";
import useBooking from "../../../hooks/useBooking";
import { useNavigate } from "react-router-dom";

const SubmitBookingButton = () => {
  const { submit, recalcPrice, booking } = useBooking();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ensure price up-to-date
      recalcPrice();
      await submit();
      // redirect to booking confirmation or orders page
      navigate("/customer/bookings");
    } catch (err) {
      alert(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      <button onClick={handleSubmit} disabled={loading} className="btn-primary px-6 py-2 rounded-lg">
        {loading ? "Đang gửi..." : "Submit Booking Request"}
      </button>
    </div>
  );
};

export default SubmitBookingButton;