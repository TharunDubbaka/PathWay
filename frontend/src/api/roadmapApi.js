import API from "./axios";

export const generateRoadmap = async (data) => {
    const response = await API.post(
        "/roadmap/generate",
        data
    );

    return response.data;
};