import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const authService = {
  signUp: async (data) => {
    const res = await axios.post(`${API}/auth/signUp`, data);
    return res.data?.data || res.data;
  },

  signIn: async (data) => {
    const res = await axios.post(`${API}/auth/signIn`, data);
    const responseData = res.data;
    return {
      user: responseData.data,
      accessToken: responseData.token?.accessToken || responseData.token,
      refreshToken: responseData.token?.refreshToken,
    };
  },

  userData: async (token) => {
    const res = await axios.get(`${API}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data?.data || res.data;
  },

  refreshToken: async (token) => {
    const res = await axios.post(`${API}/auth/refreshToken`, { token });
    const responseData = res.data;
    
    return {
      accessToken: responseData.token?.accessToken || responseData.token,
      refreshToken: responseData.token?.refreshToken,
    };
  },
};