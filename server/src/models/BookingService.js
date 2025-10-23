class BookingServiceModel {
  constructor({ bookingID, serviceID, quantity, appliedPrice }) {
    this.bookingID = bookingID;
    this.serviceID = serviceID;
    this.quantity = quantity;
    this.appliedPrice = appliedPrice;
  }
}

export default BookingServiceModel;
