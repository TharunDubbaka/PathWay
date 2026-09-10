import API from "./axios";

export const generateRoadmap = async (data) => {
    const response = await API.post(
        "/roadmap/generate",
        data
    );

    return response.data;
};

export const getGenerationStatus = async (jobId) => {
    const response = await API.get(`/roadmap/jobs/${jobId}`);
    return response.data;
};