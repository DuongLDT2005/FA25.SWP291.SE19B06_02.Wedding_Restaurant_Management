import { useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchRestaurants,
  fetchRestaurantById,
  performSearchRestaurants,
  fetchFeaturedRestaurants,
  createRestaurant,
  clearCurrent,
  clearError,
  selectRestaurants,
  selectFeaturedRestaurants,
  selectCurrentRestaurant,
  selectSearchResults,
  selectStatus,
  selectError,
} from "../redux/slices/restaurantSlice";

/**
 * ✅ useRestaurant Hook
 * Quản lý toàn bộ logic liên quan đến Restaurant (Redux Toolkit)
 * - Memo hóa selector bằng shallowEqual để tránh render lại không cần thiết
 * - Sử dụng useCallback cho các action async
 */
export function useRestaurant() {
  const dispatch = useDispatch();

  // ====== Redux Selectors (đã memo hóa) ======
  const list = useSelector(selectRestaurants, shallowEqual);
  const featured = useSelector(selectFeaturedRestaurants, shallowEqual);
  const current = useSelector(selectCurrentRestaurant, shallowEqual);
  const searchResults = useSelector(selectSearchResults, shallowEqual);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  // ====== Actions (Async + Memo hóa) ======
  const loadAll = useCallback(async () => {
    const action = await dispatch(fetchRestaurants());
    if (action.error) throw action.payload || action.error.message;
    console.log("📦 [useRestaurant] Loaded all restaurants:", action.payload);
    return action.payload;
  }, [dispatch]);

  const loadById = useCallback(
    async (id) => {
      const action = await dispatch(fetchRestaurantById(id));
      if (action.error) throw action.payload || action.error.message;
      console.log("📄 [useRestaurant] Loaded restaurant by ID:", action.payload);
      return action.payload;
    },
    [dispatch]
  );

  const search = useCallback(
    async (params) => {
      console.log("🔍 [useRestaurant] Searching with:", params);
      const action = await dispatch(performSearchRestaurants(params));
      if (action.error) throw action.payload || action.error.message;

      console.log(
        "✅ [useRestaurant] Search completed. Found:",
        action.payload?.length,
        "restaurants"
      );

      return action.payload;
    },
    [dispatch]
  );

  const loadFeatured = useCallback(async () => {
    const action = await dispatch(fetchFeaturedRestaurants());
    if (action.error) throw action.payload || action.error.message;
    console.log("⭐ [useRestaurant] Loaded featured restaurants:", action.payload);
    return action.payload;
  }, [dispatch]);

  const createOne = useCallback(
    async (payload) => {
      const action = await dispatch(createRestaurant(payload));
      if (action.error) throw action.payload || action.error.message;
      console.log("🆕 [useRestaurant] Created new restaurant:", action.payload);
      return action.payload;
    },
    [dispatch]
  );

  // ====== Reset / Clear ======
  const clear = useCallback(() => {
    console.log("🧹 [useRestaurant] Clearing current restaurant");
    dispatch(clearCurrent());
  }, [dispatch]);

  const clearErr = useCallback(() => {
    console.log("🧽 [useRestaurant] Clearing error state");
    dispatch(clearError());
  }, [dispatch]);

  // ====== Return All Values ======
  return {
    list,
    featured,
    current,
    searchResults,
    status,
    error,
    loadAll,
    loadById,
    search,
    loadFeatured,
    createOne,
    clear,
    clearErr,
  };
}
