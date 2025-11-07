const API_URL = "/api/restaurants";

export const getRestaurants = async () => {
  const res = await fetch(`${API_URL}`, {
    method: "GET",
  });
  return res.json();
};

export const getRestaurantById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
  });
  return res.json();
};

export const createRestaurant = async (restaurantData) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(restaurantData),
  });
  return res.json();
};
export const searchRestaurants = async (params = {}) => {
  // params có thể: location, date, eventType, tables, startTime, endTime, page, limit, sort, ...
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qp.set(k, String(v));
  });

  const url = qp.toString() ? `${API_URL}/search?${qp.toString()}` : `${API_URL}/search`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // nếu cần gửi cookie/token
  });

  const data = await res.json();
  if (!res.ok) throw data || new Error("Search restaurants failed");
  return data;
};
export const getFeaturedRestaurants = async () => {
  const res = await fetch(`${API_URL}/featuredRestaurants`, {
    method: "GET",
  });
  return res.json();
};