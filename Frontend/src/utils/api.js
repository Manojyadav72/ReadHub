import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://readhub-qkv1.onrender.com",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const data = localStorage.getItem("userInfo");
    if (data) {
        const parsed = JSON.parse(data);
        if (parsed.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
        }
    }
    return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("userInfo");
            // Only redirect if not already on login/signup
            if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/signup")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;
