import API from "./axios";

export const getDashboard = async (roadmapId) => {
  const response = await API.get(`/dashboard/${roadmapId}`);
  return response.data;
};
