import PaymentDAO from "../dao/PaymentDAO";
import PayoutsDAO from "../dao/PayoutsDAO";

class PaymentService {
  static async createPayment(data) {
    return await PaymentDAO.createPayment(data);
  }
    static async getPaymentsByBooking(bookingID) {
    const row = await PaymentDAO.getPaymentsByBooking(bookingID, {
            include: [
                { model: PayoutsDAO, as: 'payouts' }
            ]
        });
    return row;
    }
}

export default PaymentService;
