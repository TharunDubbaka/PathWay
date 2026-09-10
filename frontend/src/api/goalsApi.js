import API from "./axios";

export const getGoals = async () => {
  const response = await API.get("/goals");
  return response.data;
};

export const getGoal = async (goalId) => {
  const response = await API.get(`/goals/${goalId}`);
  return response.data;
};
