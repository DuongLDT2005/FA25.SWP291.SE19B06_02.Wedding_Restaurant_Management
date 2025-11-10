import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingActions from "../redux/slices/bookingSlice";
import { calculatePrice } from "../services/bookingService";

export function useBooking() {
  const dispatch = useDispatch();
  const booking = useSelector((s) => s.booking);

  const setCustomerField = useCallback((key, value) => dispatch(bookingActions.setCustomerField({ key, value })), [dispatch]);
  const setBookingField = useCallback((key, value) => dispatch(bookingActions.setBookingField({ key, value })), [dispatch]);
  const setMenu = useCallback((menu) => dispatch(bookingActions.setMenu(menu)), [dispatch]);
  const toggleService = useCallback((svc) => dispatch(bookingActions.toggleService(svc)), [dispatch]);
  const applyPromotion = useCallback((p) => dispatch(bookingActions.applyPromotion(p)), [dispatch]);
  const fetchPromotions = useCallback((params) => dispatch(bookingActions.fetchPromotions(params)), [dispatch]);

  const recalcPrice = useCallback(() => {
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
    return booking.priceSummary || recalcPrice();
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
    toggleService,
    applyPromotion,
    fetchPromotions,
    recalcPrice,
    summary,
    submit,
    clear,
  };
}

export default useBooking;