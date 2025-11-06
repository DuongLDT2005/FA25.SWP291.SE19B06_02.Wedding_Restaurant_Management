import fs from 'fs/promises';
import path from 'path';
import BookingDAO from '../dao/BookingDAO.js';
import ContractDAO, { ContractStatus } from '../dao/ContractDAO.js';

const CONTRACTS_DIR = path.resolve(process.cwd(), 'server', 'uploads', 'contracts');

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMoney(val) {
  if (val == null || val === '') return '';
  const n = Number(val);
  if (Number.isNaN(n)) return String(val);
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateContractHtml(booking) {
  const customer = booking.customer || {};
  const hall = booking.hall || {};
  const menu = booking.menu || {};
  const services = Array.isArray(booking.bookingservices) ? booking.bookingservices : [];
  const promotions = Array.isArray(booking.bookingpromotions) ? booking.bookingpromotions : [];
  const dishes = Array.isArray(booking.bookingdishes) ? booking.bookingdishes : [];

  const partner = hall.restaurant?.restaurantPartner || booking.partner || {};

  const servicesHtml = services.map(s => {
    const name = escapeHtml(s.service?.name || s.serviceName || '');
    const qty = s.quantity || 1;
    const price = s.appliedPrice != null ? formatMoney(s.appliedPrice) : '';
    return `<tr><td>${name}</td><td style="text-align:center">${qty}</td><td style="text-align:right">${price}</td></tr>`;
  }).join('\n');

  const dishesHtml = dishes.map(d => {
    const name = escapeHtml(d.dish?.name || d.name || '');
    const price = d.dish?.price != null ? formatMoney(d.dish.price) : '';
    return `<tr><td>${name}</td><td style="text-align:right">${price}</td></tr>`;
  }).join('\n');

  const promotionsHtml = promotions.map(p => {
    const title = escapeHtml(p.promotion?.title || p.title || '');
    const detail = p.promotion?.discountType ? ` (${escapeHtml(p.promotion.discountType)})` : '';
    return `<li>${title}${detail}</li>`;
  }).join('\n');

  const contractHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Contract for Booking ${escapeHtml(booking.bookingID)}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; font-size:13px; color:#222 }
    .container { max-width:900px; margin:20px auto; padding:18px; border:1px solid #ddd }
    h1 { font-size:20px }
    table { width:100%; border-collapse:collapse; margin-top:8px }
    th, td { border:1px solid #eee; padding:8px }
    .muted { color:#666; font-size:12px }
  </style>
</head>
<body>
  <div class="container">
    <h1>Service Contract</h1>
    <p><strong>Contract for booking:</strong> #${escapeHtml(booking.bookingID)} — <span class="muted">Created: ${escapeHtml(booking.createdAt)}</span></p>

    <h2>Parties</h2>
    <p><strong>Customer:</strong> ${escapeHtml(customer.fullName || customer.name || customer.email || 'N/A')} ${escapeHtml(customer.email ? `(${customer.email})` : '')}</p>
    <p><strong>Customer phone:</strong> ${escapeHtml(customer.phone || customer.mobile || '')}</p>
    <p><strong>Restaurant:</strong> ${escapeHtml(hall.restaurant?.name || booking.restaurantName || 'N/A')}</p>
    <p><strong>Partner:</strong> ${escapeHtml(partner.fullName || partner.name || partner.email || '')} ${escapeHtml(partner.email ? `(${partner.email})` : '')}</p>

    <h2>Event details</h2>
    <p><strong>Hall:</strong> ${escapeHtml(hall.name || '')}</p>
    <p><strong>Menu:</strong> ${escapeHtml(menu.name || '')}</p>
    <p><strong>Event date & time:</strong> ${escapeHtml(booking.eventDate)} ${escapeHtml(booking.startTime)} - ${escapeHtml(booking.endTime)}</p>
    <p><strong>Table count:</strong> ${escapeHtml(booking.tableCount)}</p>
    <p><strong>Special request:</strong> ${escapeHtml(booking.specialRequest || '')}</p>
    <p><strong>Status:</strong> ${escapeHtml(booking.status)}</p>

    <h3>Dishes</h3>
    <table>
      <thead><tr><th>Dish</th><th style="text-align:right">Price</th></tr></thead>
      <tbody>
        ${dishesHtml || '<tr><td colspan="2">No dishes selected</td></tr>'}
      </tbody>
    </table>

    <h3>Services & pricing</h3>
    <table>
      <thead><tr><th>Service</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th></tr></thead>
      <tbody>
        ${servicesHtml || '<tr><td colspan="3">No additional services</td></tr>'}
      </tbody>
    </table>

    <h3>Promotions</h3>
    <ul>${promotionsHtml || '<li>None</li>'}</ul>

    <h3>Totals</h3>
    <p><strong>Original price:</strong> ${escapeHtml(formatMoney(booking.originalPrice))}</p>
    <p><strong>Discount:</strong> ${escapeHtml(formatMoney(booking.discountAmount))}</p>
    <p><strong>VAT:</strong> ${escapeHtml(formatMoney(booking.VAT))}</p>
    <p><strong>Total:</strong> ${escapeHtml(formatMoney(booking.totalAmount))}</p>

    <h2>Signatures</h2>
    <p>Partner: _________________________ Date: __________</p>
    <p>Customer: ________________________ Date: __________</p>

    <hr/>
    <p class="muted">Generated on ${new Date().toISOString()}</p>
  </div>
</body>
</html>`;

  return contractHtml;
}

async function ensureContractsDir() {
  try {
    await fs.mkdir(CONTRACTS_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function createContractFromBooking(bookingID) {
  if (!bookingID) throw new Error('Missing bookingID');
  const booking = await BookingDAO.getBookingDetails(bookingID);
  if (!booking) throw new Error('Booking not found');

  const html = generateContractHtml(booking);
  await ensureContractsDir();

  const filename = `contract-${bookingID}-${Date.now()}.html`;
  const filepath = path.join(CONTRACTS_DIR, filename);
  await fs.writeFile(filepath, html, 'utf8');

  // Try to convert to PDF if puppeteer is available (optional dependency)
  let savedPath = filepath;
  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfPath = filepath.replace(/\.html?$/i, '.pdf');
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    await browser.close();
    savedPath = pdfPath;
  } catch (e) {
    // Puppeteer not installed or failed, fall back to HTML file
    // Log reason for debugging
    console.warn('PDF generation skipped or failed:', e?.message || e);
  }

  // Persist contract record in DB
  const restaurantID = booking.hall?.restaurant?.restaurantID || booking.restaurantID || null;
  const rel = await ContractDAO.addContract(bookingID, restaurantID, savedPath, null, ContractStatus.PENDING);
  return { file: savedPath, contract: rel };
}

export default {
  generateContractHtml,
  createContractFromBooking,
};
