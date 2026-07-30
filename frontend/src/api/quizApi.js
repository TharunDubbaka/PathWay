import API from "./axios";

export const generateQuiz = async (roadmapId) => {
  const response = await API.post("/quiz/", {
    roadmap_id: roadmapId,
  });
  return response.data;
};
