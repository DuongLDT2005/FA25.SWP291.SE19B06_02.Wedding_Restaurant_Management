import PayosServices from "../services/payment/PayosServices.js";
import BookingServices from "../services/Booking/BookingServices.js";
import paymentStatus from "../models/enums/BookingStatus.js";

class PaymentController {
  /**
   * Tạo link thanh toán đặt cọc PayOS
   * @route POST /api/payments/deposit/:bookingID
   */
  static async createPayosCheckout(req, res) {
    try {
      const { bookingID } = req.params;
      const buyer = {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
      };

      const result = await PayosServices.createCheckoutForBooking(bookingID, buyer);

      // (Tuỳ chọn) có thể lưu tạm payment record vào DB ở đây
      // await PaymentDAO.create({
      //   bookingID,
      //   orderCode: result.orderCode,
      //   amount: result.amount,
      //   method: paymentStatus.paymentMethod.PAYOS,
      //   type: paymentStatus.type.DEPOSIT,
      //   status: paymentStatus.status.PENDING,
      // });

      return res.status(200).json({
        success: true,
        bookingID: result.bookingID,
        orderCode: result.orderCode,
        amount: result.amount,
        checkoutUrl: result.checkoutUrl,
      });
    } catch (err) {
      console.error("[PaymentController] ❌ createPayosCheckout:", err);
      return res.status(400).json({
        success: false,
        message: err?.message || String(err),
      });
    }
  }

  /**
   * PayOS gọi webhook về khi giao dịch có thay đổi
   * @route POST /api/payments/payos/webhook
   */
  static async payosWebhook(req, res) {
    try {
      const payload = req.body;
      const verified = await PayosServices.verifyWebhook(payload);

      if (!verified) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature" });
      }

      const { code, desc, data } = verified;
      const { orderCode, amount, status, transactionID } = data || {};

      console.log("[PayOS Webhook] 🔔 Received:", verified);

      // Kiểm tra trạng thái thành công từ PayOS
      if (status === "PAID" || status === "SUCCESS" || data?.status_code === "00") {
        // 1️⃣ Cập nhật payment record
        await BookingServices.updatePaymentStatusByOrderCode(
          orderCode,
          paymentStatus.status.SUCCESS,
          transactionID
        );

        // 2️⃣ Cập nhật trạng thái booking -> DEPOSITED
        await BookingServices.deposit(orderCode);

        // 3️⃣ Phản hồi về PayOS để xác nhận webhook OK
        return res.status(200).json({
          success: true,
          message: "Payment successful and booking updated",
        });
      } else if (status === "CANCELLED" || status === "FAILED") {
        await BookingServices.updatePaymentStatusByOrderCode(
          orderCode,
          paymentStatus.status.FAILED
        );
        return res.status(200).json({
          success: true,
          message: "Payment failed/cancelled, status updated",
        });
      }

      // Các trạng thái khác (pending, processing, v.v.)
      return res.status(200).json({
        success: true,
        message: `Webhook received: ${status}`,
      });
    } catch (err) {
      console.error("[PaymentController] ❌ payosWebhook:", err);
      return res.status(400).json({
        success: false,
        message: err?.message || String(err),
      });
    }
  }

  /**
   * Client có thể query trạng thái thanh toán theo orderCode
   * @route GET /api/payments/status/:orderCode
   */
  static async getPayosStatus(req, res) {
    try {
      const { orderCode } = req.params;
      const info = await PayosServices.getLinkInfo(Number(orderCode));

      const status =
        info?.data?.status ||
        info?.status ||
        "UNKNOWN";
      const amount = info?.data?.amount || info?.amount;
      const bookingID = info?.data?.orderCode || orderCode;

      return res.status(200).json({
        success: true,
        bookingID,
        orderCode,
        status,
        amount,
        raw: info,
      });
    } catch (err) {
      console.error("[PaymentController] ❌ getPayosStatus:", err);
      return res.status(400).json({
        success: false,
        message: err?.message || String(err),
      });
    }
  }
}

export default PaymentController;
