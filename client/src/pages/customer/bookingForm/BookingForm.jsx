import React from "react";
import CustomerInfoSection from "./CustomerInfoSection";
import BookingInfoSection from "./BookingInforSection";
import SpecialRequestSection from "./SpecialRequestSection";
import SubmitBookingButton from "./SubmitBookingButton";

const BookingForm = () => {
  return (
    <form className="space-y-6">
      <CustomerInfoSection />
      <BookingInfoSection />
      <SpecialRequestSection />
      <SubmitBookingButton />
    </form>
  );
};

export default BookingForm;
