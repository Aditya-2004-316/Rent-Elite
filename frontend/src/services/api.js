import axios from "axios";

// Use environment variables for base URL
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If we're handling password reset errors, don't redirect to login
        const isPasswordResetError =
            error.config?.url?.includes("/auth/reset-password") ||
            error.config?.url?.includes("/auth/forgot-password");

        if (error.response?.status === 401 && !isPasswordResetError) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
