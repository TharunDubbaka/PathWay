import API from "./axios";

export const login = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};
