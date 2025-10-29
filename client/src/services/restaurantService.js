const API_URL = "/api/restaurants";

// Accept optional options: { signal }
export const getRestaurants = async (options = {}) => {
  const { signal } = options;
  console.log("[restaurantService] GET", API_URL);
  const res = await fetch(`${API_URL}`, { method: "GET", cache: "no-store", signal });
  const contentType = res.headers.get("content-type") || "";
  console.log("[restaurantService] status:", res.status, contentType);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  try {
    const data = await res.json();
    console.log("[restaurantService] items:", Array.isArray(data) ? data.length : data);
    return data;
  } catch (e) {
    console.error("[restaurantService] JSON parse error", e);
    throw e;
  }
};

export const getRestaurantById = async (id, options = {}) => {
  const { signal } = options;
  console.log("[restaurantService] GET", `${API_URL}/${id}`);
  const res = await fetch(`${API_URL}/${id}`, { method: "GET", cache: "no-store", signal });
  const contentType = res.headers.get("content-type") || "";
  console.log("[restaurantService] status:", res.status, contentType);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  try {
    return await res.json();
  } catch (e) {
    console.error("[restaurantService] JSON parse error", e);
    throw e;
  }
};

export const createRestaurant = async (restaurantData) => {
  console.log("[restaurantService] POST", API_URL, restaurantData);
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restaurantData),
  });
  const contentType = res.headers.get("content-type") || "";
  console.log("[restaurantService] status:", res.status, contentType);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  try {
    return await res.json();
  } catch (e) {
    console.error("[restaurantService] JSON parse error", e);
    throw e;
  }
};