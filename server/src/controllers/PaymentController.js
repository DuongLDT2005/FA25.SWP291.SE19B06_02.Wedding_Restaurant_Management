import PayosServices from "../services/payment/PayosServices.js";
import BookingServices from "../services/Booking/BookingServices.js";
class PaymentController {
  static async createPayosCheckout(req, res) {
    try {
      const { bookingID } = req.params;
      const buyer = {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
      };
      const result = await PayosServices.createCheckoutForBooking(bookingID, buyer);
      return res.status(200).json({
        success: true,
        bookingID: result.bookingID,
        orderCode: result.orderCode,
        amount: result.amount,
        checkoutUrl: result.checkoutUrl,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err?.message || String(err) });
    }
  }

  static async payosWebhook(req, res) {
    try {
      const payload = req.body;
      const verified = await PayosServices.verifyWebhook(payload);
        
      // TODO: Update your Payment record and Booking status here based on verified data
      // Example fields (check SDK response):
      // const { code, desc, data } = verified;
      // const { orderCode, amount, status, transactionID } = data || {};
      // Update Payment record
      await BookingServices.updatePaymentStatusByOrderCode(orderCode, status);
      // For now, just acknowledge
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ success: false, message: err?.message || String(err) });
    }
  }

  static async getPayosStatus(req, res) {
    try {
      const { orderCode } = req.params;
      const info = await PayosServices.getLinkInfo(Number(orderCode));
      // Shape depends on SDK; common fields:
      // info.data.status could be 'PAID' | 'PENDING' | 'CANCELLED' etc.
      const status = info?.data?.status || info?.status;
      const amount = info?.data?.amount || info?.amount;
      const bookingID = info?.data?.orderCode || orderCode;
      return res.status(200).json({ success: true, bookingID, orderCode, status, amount, raw: info });
    } catch (err) {
      return res.status(400).json({ success: false, message: err?.message || String(err) });
    }
  }
}

export default PaymentController;
