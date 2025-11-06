import React from "react";
import BookingForm from "./BookingForm";
import PriceSummaryPanel from "./PriceSummaryPanel";

const BookingPage = () => {
  return (
    <div className="booking-page grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <BookingForm />
      </div>
      <div className="col-span-1">
        <PriceSummaryPanel />
      </div>
    </div>
  );
};

export default BookingPage;