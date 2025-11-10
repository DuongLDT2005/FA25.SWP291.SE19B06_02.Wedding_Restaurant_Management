// ...existing code...
const API_URL = "/api/bookings";

/**
 * Gọi backend để tạo booking
 * payload: { customer, bookingInfo, menu, services, promotion, priceSummary }
 */
export async function createBooking(payload) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Create booking failed");
  return data;
}

/**
 * Lấy danh sách promotion từ backend (có thể filter ở backend)
 * query params optional: eventType, date, tables, restaurantId
 */
export async function getPromotions(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qp.set(k, String(v));
  });
  const res = await fetch(`/api/promotions?${qp.toString()}`, {
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Fetch promotions failed");
  return Array.isArray(data) ? data : data?.promotions ?? [];
}

/**
 * Helper local price calculation (can be moved server-side)
 * menu: { name, price } price per guest
 * tables: number (guests = tables * avgGuestsPerTable)
 * services: [{ id, name, price }] (fixed price)
 * promotion: { id, type, value } type: percent | fixed
 */
export function calculatePrice({ menu, tables = 1, services = [], avgGuestsPerTable = 10, promotion = null }) {
  const guests = (tables || 1) * avgGuestsPerTable;
  const menuTotal = (menu?.price || 0) * guests;
  const servicesTotal = (services || []).reduce((s, it) => s + (it.price || 0), 0);
  let subtotal = menuTotal + servicesTotal;
  let discount = 0;
  if (promotion) {
    if (promotion.type === "percent") discount = Math.round((subtotal * (promotion.value || 0)) / 100);
    else discount = promotion.value || 0;
  }
  const vat = Math.round((subtotal - discount) * 0.08); // 8% VAT
  const total = subtotal - discount + vat;
  return { guests, menuTotal, servicesTotal, subtotal, discount, vat, total };
}