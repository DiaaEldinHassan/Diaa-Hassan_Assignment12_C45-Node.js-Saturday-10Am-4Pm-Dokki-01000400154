import { useEffect, useState } from "react";
import { authService } from "../services/auth.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./CreateAuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await authService.userData(token);
        setUser(userData);
      } catch (err) {
        console.error("Session invalid:", err.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);


  async function register(credentials) {
    setAuthLoading(true);
    try {
      await authService.signUp(credentials);
  
      return true;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  async function login(credentials) {
    setAuthLoading(true);
    try {
      const data = await authService.signIn(credentials);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      throw error; 
    } finally {
      setAuthLoading(false);
    }
  }

  async function googleLogin(token) {
    setAuthLoading(true);
    try {
      const data = await authService.signIn({ token });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/signIn");
  }

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}