import axios from "axios";

const instance = axios.create({
  // Use relative baseURL so CRA dev proxy can forward to backend without CORS
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;