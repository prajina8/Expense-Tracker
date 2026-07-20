import React, { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest, googleLoginRequest, getMe } from "../api";
import { saveToken, getToken, clearToken } from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);


  useEffect(() => {
    async function checkSession() {
      if (!token) {
        setCheckingSession(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch (err) {
       
        clearToken();
        setToken(null);
        setUser(null);
      }
      setCheckingSession(false);
    }
    checkSession();
    
  }, []);

  
  const login = async (email, password, rememberMe) => {
    const res = await loginRequest(email, password);
    saveToken(res.data.token, rememberMe);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, rememberMe) => {
    const res = await registerRequest(name, email, password);
    saveToken(res.data.token, rememberMe);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const loginWithGoogle = async (credential, rememberMe) => {
    const res = await googleLoginRequest(credential);
    saveToken(res.data.token, rememberMe);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, checkingSession, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
