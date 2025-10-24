 
import BookingStatus, { checkedStatus } from "../enums/BookingStatus.js";
import { bitToNumber } from "../utils/bitUtils.js";
class Booking {
  constructor({
    bookingID,
    customerID,
    eventTypeID,
    hallID,
    menuID,
    eventDate,
    startTime,
    endTime,
    tableCount = 1,
    specialRequest = "",
    status = BookingStatus.PENDING,
    originalPrice = 0,
    discountAmount = 0,
    VAT = 0,
    totalAmount = 0,
    createdAt = new Date(),
    isChecked = checkedStatus.unchecked,
  }) {
    this.bookingID = bookingID;
    this.customerID = customerID;
    this.eventTypeID = eventTypeID;
    this.hallID = hallID;
    this.menuID = menuID;
    this.eventDate = eventDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.tableCount = tableCount;
    this.specialRequest = specialRequest;
    this.status = status;
    this.originalPrice = originalPrice;
    this.discountAmount = discountAmount;
    this.VAT = VAT;
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;

    // Normalize isChecked using utility
    const numChecked = bitToNumber(isChecked);
    this.isChecked = numChecked === 1 ? checkedStatus.checked : checkedStatus.unchecked;

    this.dishes = [];
    this.services = [];
    this.promotions = [];
  }


  addDish(dish) {
    this.dishes.push(dish);
  }

  addService(service) {
    this.services.push(service);
  }

  addPromotion(promo) {
    this.promotions.push(promo);
  }

  calculateOriginalPrice() {
    const dishTotal = this.dishes.reduce((sum, d) => sum + d.price * (d.quantity || 1), 0);
    const serviceTotal = this.services.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);
    this.originalPrice = dishTotal + serviceTotal;
  }

  applyDiscount() {
    const discount = this.promotions.reduce((sum, p) => {
      if (p.type === "PERCENT") return sum + (this.originalPrice * p.value) / 100;
      return sum + p.value;
    }, 0);
    this.discountAmount = discount;
  }

  calculateVAT(rate = 10) {
    this.VAT = ((this.originalPrice - this.discountAmount) * rate) / 100;
  }

  calculateTotal() {
    this.calculateOriginalPrice();
    this.applyDiscount();
    this.calculateVAT();
    this.totalAmount = this.originalPrice - this.discountAmount + this.VAT;
  }

  updateStatus(newStatus) {
    if (!Object.values(BookingStatus).includes(newStatus)) {
      throw new Error("Invalid booking status");
    }
    this.status = newStatus;
  }

  markChecked() {
    this.isChecked = checkedStatus.checked;
  }

  toJSON() {
    return {
      bookingID: this.bookingID,
      customerID: this.customerID,
      eventTypeID: this.eventTypeID,
      hallID: this.hallID,
      menuID: this.menuID,
      eventDate: this.eventDate,
      startTime: this.startTime,
      endTime: this.endTime,
      tableCount: this.tableCount,
      specialRequest: this.specialRequest,
      status: this.status,
      originalPrice: this.originalPrice,
      discountAmount: this.discountAmount,
      VAT: this.VAT,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      isChecked: this.isChecked,
    };
  }
}

// Export class
export default Booking;
