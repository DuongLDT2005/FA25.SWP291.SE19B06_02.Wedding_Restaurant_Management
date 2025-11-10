import PaymentDAO from "../../dao/PaymentDAO.js";
import PayoutsDAO from "../../dao/PayoutsDAO.js";
import paymentStatus from "../../models/enums/PaymentStatus.js";
class PaymentService {
  static async createPayment(data, opts = {}) {
    // Pass transaction or other options down to DAO
    return await PaymentDAO.createPayment(data, opts);
  }
  static async getPaymentsByBooking(bookingID) {
    // Let DAO handle model includes/associations internally
    return await PaymentDAO.getPaymentsByBooking(bookingID);
  }

  static async getPaymentByID(paymentID) {
    // Let DAO handle model includes/associations internally
    return await PaymentDAO.getPaymentByID(paymentID);
  }
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
  static async updatePaymentStatus(paymentID, newStatus) {
    return await PaymentDAO.updatePaymentStatus(paymentID, newStatus);
 }
}

export default PaymentService;
