import dotenv from "dotenv";
import PayOS from "@payos/node";
import BookingDAO from "../../dao/BookingDAO.js";

dotenv.config();

const {
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  PAYOS_RETURN_URL,
  PAYOS_CANCEL_URL,
} = process.env;

function requireEnv(name, value) {
  if (!value) throw new Error(`[PayOS] Missing required env: ${name}`);
  return value;
}

function buildPayOSClient() {
  const clientId = requireEnv("PAYOS_CLIENT_ID", PAYOS_CLIENT_ID);
  const apiKey = requireEnv("PAYOS_API_KEY", PAYOS_API_KEY);
  const checksumKey = requireEnv("PAYOS_CHECKSUM_KEY", PAYOS_CHECKSUM_KEY);
  return new PayOS(clientId, apiKey, checksumKey);
}

function genOrderCode(seed = 0) {
  // PayOS expects a unique positive integer. Use time + seed and clamp to 9 digits.
  const now = Date.now();
  const code = Math.abs((now % 1_000_000_000) + (Number(seed) % 1_000_000_000));
  return code;
}

function toVndInt(n) {
  const v = Math.round(Number(n) || 0);
  if (v <= 0) throw new Error("[PayOS] Invalid amount, must be > 0");
  return v;
}

class PayosServices {
  // Create a PayOS checkout link for a booking and return the URL
  static async createCheckoutForBooking(bookingID, buyer = {}) {
    const payos = buildPayOSClient();

    // 1) Load booking and compute amount
    const booking = await BookingDAO.getBookingDetails(bookingID);
    if (!booking) throw new Error("Booking not found");

    const amount = toVndInt(
      booking.totalAmount ?? (Number(booking.originalPrice || 0) - Number(booking.discountAmount || 0) + Number(booking.VAT || 0))
    );

    const restaurantName = booking?.hall?.restaurant?.name || booking?.restaurantName || "Nhà hàng";
    const hallName = booking?.hall?.name || booking?.hallName || "Sảnh";
    const description = `Thanh toán đơn đặt tiệc #${bookingID} - ${restaurantName} (${hallName})`;

    const orderCode = genOrderCode(bookingID);

    const returnUrl = requireEnv("PAYOS_RETURN_URL", PAYOS_RETURN_URL);
    const cancelUrl = requireEnv("PAYOS_CANCEL_URL", PAYOS_CANCEL_URL);

    const payload = {
      amount,
      orderCode,
      description,
      returnUrl,
      cancelUrl,
      buyerName: buyer.name || booking?.customer?.fullName || "",
      buyerEmail: buyer.email || booking?.customer?.email || "",
      buyerPhone: buyer.phone || booking?.customer?.phone || "",
      items: [
        {
          name: `Đặt tiệc ${restaurantName} - ${hallName}`,
          quantity: 1,
          price: amount,
        },
      ],
    };

    const link = await payos.createPaymentLink(payload);

    return {
      bookingID,
      orderCode,
      amount,
      checkoutUrl: link?.checkoutUrl || link?.shortLink || link?.paymentUrl,
      raw: link,
    };
  }

  // Retrieve PayOS payment link info by orderCode
  static async getLinkInfo(orderCode) {
    const payos = buildPayOSClient();
    return await payos.getPaymentLinkInformation(orderCode);
  }

  // Verify webhook signature and return parsed data
  static async verifyWebhook(webhookData) {
    const payos = buildPayOSClient();
    // Depending on SDK version: confirmWebhookData or verifyWebhookData
    if (typeof payos.confirmWebhookData === "function") {
      return payos.confirmWebhookData(webhookData);
    }
    if (typeof payos.verifyWebhookData === "function") {
      return payos.verifyWebhookData(webhookData);
    }
    throw new Error("[PayOS] SDK version doesn't support webhook verification method");
  }
}

export default PayosServices;
