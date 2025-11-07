import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "../redux/slices/restaurantSlice";

/**
 * useRestaurant hook
 * - exposes selectors and actions for restaurants
 */
export function useRestaurant() {
    const dispatch = useDispatch();
    const list = useSelector(selectRestaurants);
    const featured = useSelector(selectFeaturedRestaurants);
    const current = useSelector(selectCurrentRestaurant);
    const searchResults = useSelector(selectSearchResults);
    const status = useSelector((s) => s.restaurants?.status);
    const error = useSelector((s) => s.restaurants?.error);

    const loadAll = useCallback(async () => {
        const action = await dispatch(fetchRestaurants());
        if (action.error) throw action.payload || action.error.message;
        return action.payload;
    }, [dispatch]);

    const loadById = useCallback(
        async (id) => {
            const action = await dispatch(fetchRestaurantById(id));
            if (action.error) throw action.payload || action.error.message;
            return action.payload;
        },
        [dispatch]
    );

    const search = useCallback(
        async (params) => {
            const action = await dispatch(performSearchRestaurants(params));
            if (action.error) throw action.payload || action.error.message;
            return action.payload;
        },
        [dispatch]
    );

    const loadFeatured = useCallback(async () => {
        const action = await dispatch(fetchFeaturedRestaurants());
        if (action.error) throw action.payload || action.error.message;
        return action.payload;
    }, [dispatch]);

    const createOne = useCallback(
        async (payload) => {
            const action = await dispatch(createRestaurant(payload));
            if (action.error) throw action.payload || action.error.message;
            return action.payload;
        },
        [dispatch]
    );

    const clear = useCallback(() => dispatch(clearCurrent()), [dispatch]);
    const clearErr = useCallback(() => dispatch(clearError()), [dispatch]);

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