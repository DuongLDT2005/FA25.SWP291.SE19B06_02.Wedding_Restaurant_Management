import React from "react";
import CustomerInfoSection from "./CustomerInfoSection";
import BookingInfoSection from "./BookingInforSection";
// import BookingItemsTable from "./BookingItemsTable";

const BookingForm = ({ restaurant, hall, user, searchData, promotions }) => {
  const menus = restaurant?.menus || [];
  const services = restaurant?.services || [];
  return (
    <form className="space-y-6">
      <CustomerInfoSection user={user} />
      <BookingInfoSection menus={menus} services={services} restaurant={restaurant} hall={hall} searchData={searchData} promotions={promotions} />
      {/* <BookingItemsTable /> */}
    </form>
  );
};

export default BookingForm;
