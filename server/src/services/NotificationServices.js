import EmailService from "./EmailServices.js";
import { getBookingTemplate } from "../utils/mail/mailTemplates.js";

class NotificationService {
  /**
   * Gửi thông báo khi có thay đổi trạng thái Booking
   * @param {Object} param0
   * @param {string} param0.bookingID
   * @param {string} param0.customerEmail
   * @param {string} param0.partnerEmail
   * @param {number} param0.status - BookingStatus enum
   */
  async sendBookingStatusChange({ bookingID, customerEmail, partnerEmail, status }) {
    const template = getBookingTemplate(status, bookingID);
    if (!template) throw new Error(`No mail template found for status: ${status}`);

    const { subject, html, target } = template;

    if (!customerEmail && !partnerEmail)
      throw new Error("No recipient email provided for booking notification.");

    if (target === "customer" && customerEmail) {
      await EmailService.sendMail(customerEmail, subject, html);
    } 
    else if (target === "partner" && partnerEmail) {
      await EmailService.sendMail(partnerEmail, subject, html);
    } 
    else if (target === "both") {
      await Promise.all([
        customerEmail ? EmailService.sendMail(customerEmail, subject, html) : null,
        partnerEmail ? EmailService.sendMail(partnerEmail, subject, html) : null
      ]);
    }

    console.log(`📩 Notification sent for booking ${bookingID} (target: ${target})`);
    return { success: true, sentTo: target };
  }

  async sendCustomMail(to, subject, html) {
    if (!to) throw new Error("Recipient email is required.");
    await EmailService.sendMail(to, subject, html);
  }
}

export default new NotificationService();
