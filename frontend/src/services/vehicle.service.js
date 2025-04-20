import api from "./api";

export const getAllVehicles = async (filters = {}) => {
    try {
        const response = await api.get("/vehicles", { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch vehicles" };
    }
};

export const getVehicleById = async (id) => {
    try {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch vehicle" };
    }
};
