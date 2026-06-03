import axios from "axios";

// one instance of axios with default config, can be used in all auth api calls
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, //must include, otherwise cookie not sent
});

export const loginUser = async (email: string, password: string) => {
  // axios otomatically throw if res.status 4xx/5xx
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
};

export const logoutUser = async () => {
  // Backend clear cookie
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data; // {id, email, isPremium}
};
