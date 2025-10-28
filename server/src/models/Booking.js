import BookingStatus from "./enums/BookingStatus.js";

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
    isChecked = false,
  } = {}) {
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
    this.isChecked = isChecked;

    this.dishes = [];
    this.services = [];
    this.promotions = [];
  }

  createBooking(data) {
    if (!data) throw new Error("Booking data is required");

    Object.assign(this, data);

    if (data.dishes) this.dishes = data.dishes;
    if (data.services) this.services = data.services;
    if (data.promotions) this.promotions = data.promotions;

    this.validate();

    this.calculateTotal();
    return this;
  }

  validate() {
    const errors = [];

    if (!this.bookingID || typeof this.bookingID !== "string") {
      errors.push("bookingID is required and must be a string.");
    }
    if (!this.customerID) errors.push("customerID is required.");
    if (!this.eventTypeID) errors.push("eventTypeID is required.");
    if (!this.hallID) errors.push("hallID is required.");
    if (!this.menuID) errors.push("menuID is required.");

    if (!this.eventDate || isNaN(new Date(this.eventDate))) {
      errors.push("eventDate must be a valid date.");
    }
    if (!this.startTime || !/^\d{2}:\d{2}$/.test(this.startTime)) {
      errors.push("startTime must be in HH:mm format.");
    }
    if (!this.endTime || !/^\d{2}:\d{2}$/.test(this.endTime)) {
      errors.push("endTime must be in HH:mm format.");
    }

    if (typeof this.tableCount !== "number" || this.tableCount <= 0) {
      errors.push("tableCount must be a positive number.");
    }

    const invalidDish = this.dishes.find(d => !d.name || d.price <= 0);
    if (invalidDish) errors.push("Each dish must have a valid name and positive price.");

    const invalidService = this.services.find(s => !s.name || s.price <= 0);
    if (invalidService) errors.push("Each service must have a valid name and positive price.");

    const invalidPromo = this.promotions.find(
      p => !p.type || (p.type === "PERCENT" && (p.value <= 0 || p.value > 100))
    );
    if (invalidPromo) errors.push("Each promotion must have valid type and value.");

    if (errors.length > 0) {
      throw new Error(`Booking validation failed:\n- ${errors.join("\n- ")}`);
    }
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

  calculateVAT(rate = 8) {
    this.VAT = ((this.originalPrice - this.discountAmount) * rate) / 100;
  }

  calculateTotal() {
    this.calculateOriginalPrice();
    this.applyDiscount();
    this.calculateVAT();
    this.totalAmount = this.originalPrice - this.discountAmount + this.VAT;
  }

  reset() {
    // Xóa dữ liệu
    this.dishes = [];
    this.services = [];
    this.promotions = [];
    this.originalPrice = 0;
    this.discountAmount = 0;
    this.VAT = 0;
    this.totalAmount = 0;
    this.status = BookingStatus.PENDING;
  }

  summary() {
    return {
      id: this.bookingID,
      total: this.totalAmount,
      tables: this.tableCount,
      dishes: this.dishes.length,
      services: this.services.length,
      status: this.status,
    };
  }

  updateStatus(newStatus) {
    if (!Object.values(BookingStatus).includes(newStatus)) {
      throw new Error("Invalid booking status");
    }
    this.status = newStatus;
  }

  markChecked() {
    this.isChecked = true;
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

export default Booking;
