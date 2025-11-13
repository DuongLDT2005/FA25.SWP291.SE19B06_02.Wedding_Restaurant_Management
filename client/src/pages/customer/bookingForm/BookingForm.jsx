import React from "react";
import CustomerInfoSection from "./CustomerInfoSection";
import BookingInfoSection from "./BookingInforSection";
// import BookingItemsTable from "./BookingItemsTable";

const BookingForm = ({ menus = [], services = [] }) => {
  return (
    <form className="space-y-6">
      <CustomerInfoSection />
      <BookingInfoSection menus={menus} services={services} />
      {/* <BookingItemsTable /> */}
    </form>
  );
};

export default BookingForm;
