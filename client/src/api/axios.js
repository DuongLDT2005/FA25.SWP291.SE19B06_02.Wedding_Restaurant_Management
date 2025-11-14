import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
});

// Xoá default Content-Type JSON để axios tự set khi gửi FormData
instance.defaults.headers.post["Content-Type"] = undefined;

export default instance;
