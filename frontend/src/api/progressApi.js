import API from "./axios";

export const getProgress = async (
  roadmapId
) => {
  const response = await API.get(
    `/progress/${roadmapId}`
  );

  return response.data;
};

export const completeTopic = async (
  roadmapId,
  phaseIndex,
  topicIndex
) => {
  const response = await API.patch(
    `/progress/${roadmapId}/topic`,
    {
      phase_index: phaseIndex,
      topic_index: topicIndex,
    }
  );

  return response.data;
};