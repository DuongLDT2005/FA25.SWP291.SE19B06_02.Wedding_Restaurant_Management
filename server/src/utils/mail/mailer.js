import nodemailer from 'nodemailer';
import { bookingAcceptedTemplate, bookingRejectedTemplate } from './mailCustomerTemplates.js';
import { getBookingTemplate as getPartnerTemplate } from './mailPartnerTemplates.js';

// Create a singleton transporter using ENV variables
let transporter;

function getBoolean(value, def = false) {
  if (value === undefined || value === null) return def;
  const v = String(value).toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function getTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    GMAIL_USER,
    GMAIL_APP_PASSWORD,
    SMTP_SECURE,
    SMTP_FROM,
  } = process.env;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    secure: getBoolean(SMTP_SECURE, false),
    auth: GMAIL_USER && GMAIL_APP_PASSWORD ? { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } : undefined,
  });

  transporter._defaultFrom = SMTP_FROM || GMAIL_USER || 'no-reply@example.com';
  return transporter;
}

export async function sendEmail({ to, subject, text, html, from }) {
  const t = getTransporter();
  const mailOptions = {
    from: from || t._defaultFrom,
    to,
    subject,
    text,
    html,
  };
  return await t.sendMail(mailOptions);
}

export async function sendBookingStatusEmail(to, booking, status, { reason } = {}) {
  let subject = `Your booking update`;
  let html = '';
  let text = '';

  if (status === 'ACCEPTED') {
    const tpl = bookingAcceptedTemplate(booking);
    subject = tpl.subject; html = tpl.html; text = tpl.text;
  } else if (status === 'REJECTED') {
    const tpl = bookingRejectedTemplate(booking, reason);
    subject = tpl.subject; html = tpl.html; text = tpl.text;
  } else {
    // Fallback generic template
    const { bookingID, eventDate, startTime, endTime } = booking || {};
    subject = `Your booking #${bookingID} has been ${String(status).toLowerCase()}`;
    const lines = [
      `Booking ID: ${bookingID}`,
      `Time: ${eventDate || ''} ${startTime || ''} - ${endTime || ''}`,
      `Status: ${status}`
    ];
    text = lines.join('\n');
    html = lines.map(l => `<p>${l}</p>`).join('');
  }

  try {
    await sendEmail({ to, subject, text, html });
    return true;
  } catch (err) {
    console.error('Failed to send booking status email:', err?.message || err);
    return false;
  }
}

// --- New helpers: separate customer vs partner emails ---

function resolveCustomerEmail(booking, explicit) {
  return explicit || booking?.customer?.email || booking?.customerEmail || null;
}

function resolvePartnerEmail(booking, explicit) {
  // Try a few likely locations; caller can always pass `to` explicitly
  return (
    explicit ||
    booking?.partnerEmail ||
    booking?.hall?.restaurant?.restaurantPartner?.email ||
    null
  );
}

export async function sendCustomerBookingEmail(booking, status, { to, reason } = {}) {
  const target = resolveCustomerEmail(booking, to);
  if (!target) {
    console.warn('sendCustomerBookingEmail: missing customer email. Provide `to` explicitly.');
    return false;
  }

  let subject = `Cập nhật đơn đặt tiệc`;
  let html = '';
  let text = '';

  if (status === 'ACCEPTED') {
    const tpl = bookingAcceptedTemplate(booking);
    subject = tpl.subject; html = tpl.html; text = tpl.text;
  } else if (status === 'REJECTED') {
    const tpl = bookingRejectedTemplate(booking, reason);
    subject = tpl.subject; html = tpl.html; text = tpl.text;
  } else {
    const { bookingID, eventDate, startTime, endTime } = booking || {};
    subject = `Đơn đặt tiệc #${bookingID} đã được cập nhật (${String(status).toLowerCase()})`;
    const lines = [
      `Mã đơn: ${bookingID}`,
      `Thời gian: ${eventDate || ''} ${startTime || ''} - ${endTime || ''}`,
      `Trạng thái: ${status}`,
    ];
    text = lines.join('\n');
    html = lines.map((l) => `<p>${l}</p>`).join('');
  }

  try {
    await sendEmail({ to: target, subject, text, html });
    return true;
  } catch (err) {
    console.error('Failed to send customer booking email:', err?.message || err);
    return false;
  }
}

export async function sendPartnerBookingEmail(booking, status, { to } = {}) {
  const target = resolvePartnerEmail(booking, to);
  if (!target) {
    console.warn('sendPartnerBookingEmail: missing partner email. Provide `to` explicitly or include restaurantPartner.email in booking.');
    return false;
  }

  const tpl = getPartnerTemplate(status, booking?.bookingID);
  const subject = tpl.subject || `Cập nhật đơn đặt tiệc #${booking?.bookingID}`;
  const html = tpl.html || `<p>Đơn #${booking?.bookingID} đã cập nhật trạng thái: ${status}</p>`;
  const text = html
    .replace(/<[^>]*>/g, ' ') // strip tags for a simple text version
    .replace(/\s+/g, ' ')
    .trim();

  try {
    await sendEmail({ to: target, subject, text, html });
    return true;
  } catch (err) {
    console.error('Failed to send partner booking email:', err?.message || err);
    return false;
  }
}

// Convenience: send emails to intended audiences based on partner template `target`
export async function sendBookingStatusEmails(booking, status, { customerEmail, partnerEmail, reason } = {}) {
  const tpl = getPartnerTemplate(status, booking?.bookingID);
  const targets = tpl?.target || 'both';
  const results = { customer: null, partner: null };

  if (targets === 'customer' || targets === 'both') {
    results.customer = await sendCustomerBookingEmail(booking, status, { to: customerEmail, reason });
  }
  if (targets === 'partner' || targets === 'both') {
    results.partner = await sendPartnerBookingEmail(booking, status, { to: partnerEmail });
  }
  return results;
}
