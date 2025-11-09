import BookingDAO from '../dao/BookingDAO.js';
import { sendCustomerBookingEmail, sendPartnerBookingEmail } from '../utils/mail/mailer.js';

// Map transitions to audiences based on your rules
// PENDING -> partner
// ACCEPTED/REJECTED -> customer (reason for rejected)
// CONFIRMED -> partner
// EXPIRED -> partner
// DEPOSITED (tiền cọc thành công) -> partner
// COMPLETED -> customer (optional)
// CANCELLED -> partner (optional)

export async function notifyByStatus(booking, status, { reason } = {}) {
  switch (status) {
    case 'PENDING':
      return { partner: await sendPartnerBookingEmail(booking, 'PENDING') };
    case 'ACCEPTED':
      return { customer: await sendCustomerBookingEmail(booking, 'ACCEPTED') };
    case 'REJECTED':
      return { customer: await sendCustomerBookingEmail(booking, 'REJECTED', { reason }) };
    case 'CONFIRMED':
      return { partner: await sendPartnerBookingEmail(booking, 'CONFIRMED') };
    case 'EXPIRED':
      return { partner: await sendPartnerBookingEmail(booking, 'EXPIRED') };
    case 'DEPOSITED':
      return { partner: await sendPartnerBookingEmail(booking, 'DEPOSITED') };
    case 'COMPLETED':
      return { customer: await sendCustomerBookingEmail(booking, 'COMPLETED') };
    case 'CANCELLED':
      return { partner: await sendPartnerBookingEmail(booking, 'CANCELLED') };
    default:
      // If needed, send to both with a generic message
      return { partner: await sendPartnerBookingEmail(booking, status) };
  }
}

export async function notifyByStatusById(bookingID, status, { reason } = {}) {
  const booking = await BookingDAO.getBookingDetails(bookingID);
  if (!booking) return { error: 'Booking not found' };
  return notifyByStatus(booking, status, { reason });
}
