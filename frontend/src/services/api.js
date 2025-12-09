import axios from "axios";

// create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
});

// named export fetchCustomers
export const fetchCustomers = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
  );
  const res = await API.get("/api/customers", { params: cleanParams });
  return res.data;
};
