import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setField as setFieldAction,
  setFields as setFieldsAction,
  resetSearch,
  selectSearch,
  performSearch as performSearchThunk,
} from "../redux/slices/searchSlice";

/**
 * useSearchForm hook
 */
export function useSearchForm() {
  const dispatch = useDispatch();
  const state = useSelector(selectSearch);

  const setField = useCallback(
    (key, value) => {
      if (key === "tables") value = value === "" ? "" : Number(value);
      dispatch(setFieldAction({ key, value }));
    },
    [dispatch]
  );

  const setFields = useCallback((obj) => dispatch(setFieldsAction(obj)), [dispatch]);
  const reset = useCallback(() => dispatch(resetSearch()), [dispatch]);

  const getQueryString = useCallback(() => {
    const qp = new URLSearchParams();
    if (state.location) qp.set("location", state.location);
    if (state.date) qp.set("date", state.date);
    if (state.eventType) qp.set("eventType", state.eventType);
    if (state.tables != null) qp.set("tables", String(state.tables));
    if (state.startTime) qp.set("startTime", state.startTime);
    if (state.endTime) qp.set("endTime", state.endTime);
    return qp.toString();
  }, [state]);

  const performSearch = useCallback(
    async (overrideParams = {}) => {
      const params = { ...state, ...overrideParams };
      const action = await dispatch(performSearchThunk(params));
      if (action.error) throw action.payload || action.error.message;
      return action.payload;
    },
    [dispatch, state]
  );

  return { state, setField, setFields, reset, getQueryString, performSearch };
}

export default useSearchForm;