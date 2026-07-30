import API from "./axios";

export const generateStudyPlan = async (roadmapId) => {
  const response = await API.post("/study-plan/", {
    roadmap_id: roadmapId,
  });
  return response.data;
};
