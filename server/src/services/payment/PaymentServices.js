import PaymentDAO from "../../dao/PaymentDAO.js";
import PayoutsDAO from "../../dao/PayoutsDAO.js";

class PaymentService {
  // Payments
  static async createPayment(data, opts = {}) {
    return await PaymentDAO.createPayment(data, opts);
  }

  static async getPaymentsByBooking(bookingID) {
    return await PaymentDAO.getByBookingID(bookingID);
  }

  static async getPaymentsByRestaurant(restaurantID) {
    return await PaymentDAO.getByRestaurantID(restaurantID);
  }

  static async getPaymentByTransactionRef(transactionRef) {
    return await PaymentDAO.getByTransactionRef(transactionRef);
  }

  static async updatePaymentStatus(paymentID, newStatus) {
    return await PaymentDAO.updatePaymentStatus(paymentID, newStatus);
  }

  static async markPaymentReleased(paymentID, options = {}) {
    return await PaymentDAO.markReleased(paymentID, options);
  }

  static async refundPayment(paymentID, options = {}) {
    return await PaymentDAO.refundPayment(paymentID, options);
  }

  static async getPaymentsByStatus(statusList = []) {
    return await PaymentDAO.getPaymentsByStatus(statusList);
  }

  // Payouts (kept as-is)
  static async createPayout(data, opts = {}) {
    return await PayoutsDAO.createPayout(data, opts);
  }

  static async getPayoutsByRestaurantPartnerID(restaurantPartnerId) {
    return await PayoutsDAO.getByRestaurantPartnerID(restaurantPartnerId);
  }

  static async getPayoutsByPaymentID(paymentId) {
    return await PayoutsDAO.getByPaymentID(paymentId);
  }

  static async getPayoutByTransactionRef(transactionRef) {
    return await PayoutsDAO.getByTransactionRef(transactionRef);
  }

  static async updatePayoutStatus(payoutId, newStatus) {
    return await PayoutsDAO.updatePayoutStatus(payoutId, newStatus);
  }
}

export default PaymentService;
