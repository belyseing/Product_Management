import axios from "axios";

const API_BASE_URL = 'https://dummyjson.com/auth/login';

// API service for authentication
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials";
      return { success: false, message };
    }
  },

  logout: async () => {
    // For dummyjson, we don't have a logout endpoint
    // This would typically clear tokens on the server in a real app
    return { success: true };
  },
};