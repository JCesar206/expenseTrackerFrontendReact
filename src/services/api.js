import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Adjuntar el JWT automáticamente a las peticiones
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("expense-token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;