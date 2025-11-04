import BookingDAO from '../dao/BookingDAO.js';
import { sendCustomerBookingEmail } from '../utils/mail/mailer.js';

// Map transitions to audiences based on your rules
// PENDING -> partner
// ACCEPTED/REJECTED -> customer (reason for rejected)
// CONFIRMED -> partner
// EXPIRED -> partner
// DEPOSITED (tiền cọc thành công) -> partner
// COMPLETED -> customer (optional)
// CANCELLED -> partner (optional)

export async function notifyByStatus(booking, status, { reason } = {}) {
  // Only send emails to customers. Previously partner-targeted statuses
  // (PENDING, CONFIRMED, EXPIRED, DEPOSITED, CANCELLED) will not trigger
  // partner emails anymore. For statuses that used to target customers,
  // keep sending customer emails.
  switch (status) {
    case 'ACCEPTED':
      return { customer: await sendCustomerBookingEmail(booking, 'ACCEPTED') };
    case 'REJECTED':
      return { customer: await sendCustomerBookingEmail(booking, 'REJECTED', { reason }) };
    case 'COMPLETED':
      return { customer: await sendCustomerBookingEmail(booking, 'COMPLETED') };
    default:
      // No customer notification for other statuses
      return { info: `no-customer-email-for-status:${status}` };
  }
}

export async function notifyByStatusById(bookingID, status, { reason } = {}) {
  const booking = await BookingDAO.getBookingDetails(bookingID);
  if (!booking) return { error: 'Booking not found' };
  return notifyByStatus(booking, status, { reason });
}
