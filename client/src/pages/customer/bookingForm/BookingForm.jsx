import React from "react";
import CustomerInfoSection from "./CustomerInfoSection";
import BookingInfoSection from "./BookingInforSection";
import SpecialRequestSection from "./SpecialRequestSection";
import BookingItemsTable from "./BookingItemsTable";

const BookingForm = ({ menus = [], services = [] }) => {
  return (
    <form className="space-y-6">
      <CustomerInfoSection />
      <BookingInfoSection menus={menus} services={services} />
      <BookingItemsTable />
      <SpecialRequestSection />
    </form>
  );
};

export default BookingForm;
