import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL as string;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const { logout } = useAuthStore.getState();

const handleAuthorizationError = () => {
    logout();
    window.location.replace('/login');
};

const refreshAccessToken = async () => {
    try {
        await axios.post(
            `${baseURL}/auth/refreshToken`,
            {},
            {
                withCredentials: true,
            }
        );
    } catch (error) {
        console.log('Session expiry');
        handleAuthorizationError();
        throw error;
    }
};

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshAccessToken();
                // Retry the request without modifying headers (cookies will be sent automatically)
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
