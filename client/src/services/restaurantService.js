const API_URL = "/api/restaurants";

export const getRestaurants = async () => {
  const res = await fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Fetch restaurants failed");
  return data;
};

export const getRestaurantById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Fetch restaurant failed");
  return data;
};

export const getRestaurantsByPartner = async (partnerID) => {
  const res = await fetch(`${API_URL}/partner/${partnerID}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Fetch partner restaurants failed");
  return data;
};

export const createRestaurant = async (restaurantData) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(restaurantData),
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Create restaurant failed");
  return data;
};

export const updateRestaurant = async (id, payload) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Update restaurant failed");
  return data;
};

export const toggleRestaurantStatus = async (id) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let data = null;
    try { data = await res.json(); } catch {}
    throw data || new Error("Toggle status failed");
  }
  return true;
};

export const addRestaurantImage = async (id, imageURL) => {
  const res = await fetch(`${API_URL}/${id}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ imageURL }),
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Add image failed");
  return data; // { imageID, imageURL }
};

export const deleteRestaurantImage = async (imageID) => {
  const res = await fetch(`${API_URL}/images/${imageID}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || new Error("Delete image failed");
  return true;
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
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw data || new Error("Fetch featured restaurants failed");
  return data;
};

export const getTopBookedRestaurants = async () => {
  const res = await fetch(`${API_URL}/top-booked`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw data || new Error("Fetch top booked restaurants failed");
  return data;
};