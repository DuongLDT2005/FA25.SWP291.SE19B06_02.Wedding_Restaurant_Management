import { useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
    fetchRestaurants,
    fetchRestaurantById,
    performSearchRestaurants,
    fetchFeaturedRestaurants,
    fetchRestaurantsByPartner,
    fetchToggleRestaurantStatus,
    createRestaurant,
    updateRestaurant,
    addRestaurantImage,
    clearCurrent,
    clearError,
    selectRestaurants,
    selectFeaturedRestaurants,
    selectCurrentRestaurant,
    selectSearchResults,
} from "../redux/slices/restaurantSlice";

/**
 * ✅ useRestaurant Hook
 * Quản lý toàn bộ logic liên quan đến Restaurant (Redux Toolkit)
 * - Memo hóa selector bằng shallowEqual để tránh render lại không cần thiết
 * - Sử dụng useCallback cho các action async
 */
export function useRestaurant() {
    const dispatch = useDispatch();

    // ====== Selectors (State + Memo hóa bằng shallowEqual) ======
    const { list, status, error } = useSelector(
        selectRestaurants,
        shallowEqual
    );
    const featured = useSelector(selectFeaturedRestaurants, shallowEqual);
    const current = useSelector(selectCurrentRestaurant, shallowEqual);
    const searchResults = useSelector(selectSearchResults, shallowEqual);

    // ====== Actions (Async + Memo hóa) ======

    const loadAllPartner = useCallback(async (partnerID) => {
        const action = await dispatch(fetchRestaurantsByPartner(partnerID));
        if (action.error) throw action.payload || action.error.message;
        return action.payload;
    }, [dispatch]);

    const toggleStatus = useCallback(
        async ({ restaurantID, newStatus }) => {
            const action = await dispatch(fetchToggleRestaurantStatus({ restaurantID, newStatus }));
            if (action.error) throw action.payload || action.error.message;
            return action.payload;
        },
        [dispatch]
    );

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
    
    // **FIXED:** Đóng ngoặc của useCallback cho hàm search
    const search = useCallback(
        async (params) => {
            console.log("🔍 [useRestaurant] Searching with:", params);
            const action = await dispatch(performSearchRestaurants(params));
            if (action.error) throw action.payload || action.error.message;
            // Bạn có thể trả về action.payload ở đây nếu cần
            return action.payload; 
        },
        [dispatch]
    );

    const loadFeatured = useCallback(async () => {
        const action = await dispatch(fetchFeaturedRestaurants());
        if (action.error) throw action.payload || action.error.message;
        return action.payload;
    }, [dispatch]);
    
    const updateOne = useCallback(
        async ({ id, payload }) => {
            const action = await dispatch(updateRestaurant({ id, payload }));
            if (action.error) throw action.payload || action.error.message;
            return action.payload;
        },
        [dispatch]
    );
    
    // create
    const createOne = useCallback(
        async (payload) => {
            const action = await dispatch(createRestaurant(payload));
            if (action.error) throw action.payload || action.error.message;
            return action.payload;
        },
        [dispatch]
    );

    const addImage = useCallback(
        async ({ restaurantID, imageURL }) => {
            const action = await dispatch(addRestaurantImage({ restaurantID, imageURL }));
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
        updateOne,
        loadAllPartner,
        toggleStatus,
        search,
        loadFeatured,
        createOne,
        addImage,
        clear,
        clearErr,
    };
}