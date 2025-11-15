import React, { useEffect } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import useBooking from "../../../hooks/useBooking";
import SubmitBookingButton from "./SubmitBookingButton";

/**
 * PriceSummaryPanel
 * - show breakdown: menu, hall, services
 * - support promotions: percent discount OR gift service
 * - for gift service: list gifted services but DO NOT treat their value as discount
 */
export default function PriceSummaryPanel() {
  const { booking, summary, recalcPrice } = useBooking();

  const tables = booking?.bookingInfo?.tables ?? 0;

  // hall fee: prefer booking.hall.price, fallback to bookingInfo.hallPrice
  const hallFee = Number(booking?.hall?.price ?? booking?.bookingInfo?.hallPrice ?? 0);

  // ensure price summary up-to-date when relevant inputs change
  useEffect(() => {
    try {
      recalcPrice();
    } catch (e) { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    booking?.menu?.id,
    booking?.menu?.price,
    (booking?.services || []).length,
    booking?.services?.map?.((s) => `${s.id}:${s.quantity ?? 1}:${s.price ?? 0}`).join("|"),
    tables,
    booking?.appliedPromotion?.id,
    booking?.appliedPromotion?.type,
    booking?.appliedPromotion?.value,
    hallFee,
  ]);

  const fmt = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "₫";

  const menuPricePerTable = Number(booking?.menu?.price ?? 0);
  const menuTotal = Number(summary?.menuTotal ?? menuPricePerTable * tables);

  // normal services (charged)
  const normalServices = (booking?.services || []).map((s) => ({
    ...s,
    quantity: Number(s.quantity ?? 1),
    price: Number(s.price ?? 0),
    _gift: false,
  }));

  // promotion handling
  const applied = booking?.appliedPromotion || null;

  // gather gifted services if promotion gives services
  const giftedServicesRaw =
    (applied && (applied.giftServices || applied.gifts || applied.gift_items || [])) || [];
  const giftedServices = giftedServicesRaw.map((g, idx) => ({
    id: g.id ?? g.serviceID ?? `gift-${idx}`,
    name: g.name ?? g.title ?? "Dịch vụ tặng",
    quantity: Number(g.quantity ?? 1),
    price: Number(g.price ?? g.unitPrice ?? 0),
    _gift: true,
  }));

  // services list for display:
  // - if promotion is gift_service: show only gifted services in services area (per request)
  // - otherwise show normal services (and if there are gifted services also append them for info)
  const servicesListForDisplay =
    applied && applied.type === "gift_service" ? giftedServices : [...normalServices, ...giftedServices];

  // servicesTotal only counts normal (charged) services
  const servicesTotal =
    Number(summary?.servicesTotal) ??
    normalServices.reduce((s, it) => s + it.price * it.quantity, 0);

  // compute discount: use summary.discount which now includes hall fee in calculation
  let discount = Number(summary?.discount ?? 0);
  
  // subtotal includes hallFee and charged services + menu
  const subtotal = Number((menuTotal + servicesTotal)) + hallFee;
  const vat = Math.round((subtotal - discount) * 0.08);
  console.log(discount);
  const total = subtotal - discount + vat;
//  console.log(total)
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Tổng tiền đặt tiệc</Card.Title>

        <Table size="sm" responsive className="mb-2">
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-end">SL</th>
              <th className="text-end">Đơn giá</th>
              <th className="text-end">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {/* Hall fee */}
            <tr>
              <td>{booking.hall?.name ?? booking.bookingInfo?.hall ?? "—"}</td>
              <td className="text-end">1</td>
              <td className="text-end">{fmt(hallFee)}</td>
              <td className="text-end">{fmt(hallFee)}</td>
            </tr>

            {/* Menu (ngắn gọn) */}
            {booking.menu ? (
              <tr>
                <td>{booking.menu.name}</td>
                <td className="text-end">{tables}</td>
                <td className="text-end">{fmt(menuPricePerTable)}</td>
                <td className="text-end">{fmt(menuTotal)}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={4} className="text-muted text-center small">Chưa chọn thực đơn</td>
              </tr>
            )}

            {/* Services display:
                - if applied.type === "gift_service": show only gifted services (labelled 'Tặng')
                - otherwise show normal services (and any gifted appended for info)
            */}
            {servicesListForDisplay.length > 0 ? (
              servicesListForDisplay.map((s) => (
                <tr key={s.id ?? s.name}>
                  <td>
                    {s.name} {s._gift && <Badge bg="success" pill className="ms-2">Tặng</Badge>}
                  </td>
                  <td className="text-end">{s.quantity ?? 1}</td>
                  <td className="text-end">{fmt(s.price ?? 0)}</td>
                  <td className="text-end">
                    {s._gift ? <span className="text-success">Tặng</span> : fmt(s.price * s.quantity)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-muted text-center small">
                  {applied && applied.type === "gift_service" ? "Không có dịch vụ tặng" : "Không có dịch vụ bổ sung"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Table borderless size="sm" className="mt-2">
          <tbody>
            <tr>
              <td>Tạm tính</td>
              <td className="text-end">{fmt(subtotal)}</td>
            </tr>

            {/* Promotion display */}
            {applied ? (
              applied.type === "percent" && (
                <tr>
                  <td>Ưu đãi</td>
                  <td className="text-end">-{fmt(discount)}</td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={4} className="text-muted text-center small">Không có ưu đãi được áp dụng</td>
              </tr>
            )}

            <tr>
              <td>VAT (8%)</td>
              <td className="text-end">{fmt(vat)}</td>
            </tr>

            <tr className="fw-semibold">
              <td>Tổng phải trả</td>
              <td className="text-end">{fmt(total)}</td>
            </tr>
          </tbody>
        </Table>

        <div className="d-flex justify-content-end mt-1">
          <SubmitBookingButton />
        </div>
      </Card.Body>
    </Card>
  );
}