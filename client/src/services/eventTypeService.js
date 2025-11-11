import axios from "axios";

const API_URL = "http://localhost:5000/eventTypes";

export const getEventTypes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};