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