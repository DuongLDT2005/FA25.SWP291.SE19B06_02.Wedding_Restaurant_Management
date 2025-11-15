import axios from "axios";

const API = "http://localhost:8080/api/amenities"; // đổi theo backend của em

export const getAmenities = async () => {
  const res = await axios.get(API);
  return res.data;
};
