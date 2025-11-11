import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingActions from "../redux/slices/bookingSlice";
import { calculatePrice } from "../services/bookingService";

export function useBooking() {
  const dispatch = useDispatch();
  const booking = useSelector((s) => s.booking) || {};

  const setCustomerField = useCallback((key, value) => dispatch(bookingActions.setCustomerField({ key, value })), [dispatch]);
  const setBookingField = useCallback((key, value) => dispatch(bookingActions.setBookingField({ key, value })), [dispatch]);
  const setMenu = useCallback((menu) => dispatch(bookingActions.setMenu(menu)), [dispatch]);
  const setDishes = useCallback((dishes) => dispatch(bookingActions.setDishes(dishes)), [dispatch]);
  const setServices = useCallback((services) => dispatch(bookingActions.setServices(services)), [dispatch]);
  const toggleService = useCallback((svc) => dispatch(bookingActions.toggleService(svc)), [dispatch]);
  const applyPromotion = useCallback((p) => dispatch(bookingActions.applyPromotion(p)), [dispatch]);
  const fetchPromotions = useCallback((params) => dispatch(bookingActions.fetchPromotions(params)), [dispatch]);
  const setFinancial = useCallback((f) => dispatch(bookingActions.setFinancial(f)), [dispatch]);
  const hydrateFromDTO = useCallback((dto) => dispatch(bookingActions.hydrateFromDTO(dto)), [dispatch]);

  const recalcPrice = useCallback(() => {
    if (!booking) return { guests: 0, menuTotal: 0, servicesTotal: 0, subtotal: 0, discount: 0, vat: 0, total: 0 };
    const payload = {
      menu: booking.menu,
      tables: booking.bookingInfo?.tables,
      services: booking.services,
    };
    const summary = calculatePrice({ menu: payload.menu, tables: payload.tables, services: payload.services });
    dispatch(bookingActions.setPriceSummary(summary));
    return summary;
  }, [dispatch, booking.menu, booking.bookingInfo?.tables, booking.services]);

  // derived summary always available locally
  const summary = useMemo(() => {
    try {
      return booking.priceSummary || recalcPrice();
    } catch {
      return { guests: 0, menuTotal: 0, servicesTotal: 0, subtotal: 0, discount: 0, vat: 0, total: 0 };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.priceSummary, booking.menu, booking.bookingInfo?.tables, booking.services]);

  const submit = useCallback(
    async (extra = {}) => {
      // prepare payload
      const payload = {
        customer: booking.customer,
        bookingInfo: booking.bookingInfo,
        menu: booking.menu,
        services: booking.services,
        promotion: booking.appliedPromotion,
        priceSummary: booking.priceSummary,
        ...extra,
      };
      const action = await dispatch(bookingActions.submitBooking(payload));
      if (action.error) throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch, booking]
  );

  const clear = useCallback(() => dispatch(bookingActions.clearBooking()), [dispatch]);

  return {
    booking,
    setCustomerField,
    setBookingField,
    setMenu,
    setDishes,
    setServices,
    toggleService,
    applyPromotion,
    fetchPromotions,
    recalcPrice,
    summary,
    submit,
    setFinancial,
    hydrateFromDTO,
    clear,
  };
}

export default useBooking;