const API_URL = "http://localhost:5000/api/restaurants"; // 🔥 nên dùng URL tuyệt đối để tránh CORS khi dev

// === GET tất cả nhà hàng ===
export const getRestaurants = async (options = {}) => {
  const { signal } = options;
  console.log("[restaurantService] GET", API_URL);

  const res = await fetch(`${API_URL}`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  try {
    const data = await res.json();
    console.log("[restaurantService] ✅ items:", Array.isArray(data) ? data.length : data);
    return data;
  } catch (e) {
    console.error("[restaurantService] ❌ JSON parse error", e);
    throw e;
  }
};

// === GET nhà hàng theo ID ===
export const getRestaurantById = async (id, options = {}) => {
  const { signal } = options;
  console.log("[restaurantService] GET", `${API_URL}/${id}`);

  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  try {
    return await res.json();
  } catch (e) {
    console.error("[restaurantService] ❌ JSON parse error", e);
    throw e;
  }
};

// === Tạo mới nhà hàng ===
export const createRestaurant = async (restaurantData) => {
  console.log("[restaurantService] POST", API_URL, restaurantData);

  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(restaurantData),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// === 🔍 Tìm kiếm nhà hàng (search) ===
export const searchRestaurants = async (params = {}) => {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qp.set(k, String(v));
  });

  const url = qp.toString()
    ? `${API_URL}/search?${qp.toString()}`
    : `${API_URL}/search`;

  console.log("[restaurantService] 🔍 SEARCH:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("[restaurantService] ❌ JSON parse error:", err);
    throw new Error("Invalid JSON response from server");
  }

  if (!res.ok) {
    console.error("[restaurantService] ❌ Search failed:", data);
    throw data || new Error("Search restaurants failed");
  }

  // ✅ Chuẩn hóa dữ liệu trả về
  // backend trả về { restaurants: [...] }
  const restaurants = data?.restaurants || data?.results || data;
  console.log(`[restaurantService] ✅ Found ${Array.isArray(restaurants) ? restaurants.length : 0} restaurants`);

  return Array.isArray(restaurants) ? restaurants : [];
};

// === Nhà hàng nổi bật ===
export const getFeaturedRestaurants = async () => {
  const res = await fetch(`${API_URL}/featuredRestaurants`, {
    method: "GET",
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
