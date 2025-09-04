import { createContext, useState, useEffect } from "react";

// Create context
export const UserInfoContext = createContext();

// Provider
export const UserInfoProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setAccessToken(savedToken);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  // Logout helper
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <UserInfoContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout }}>
      {children}
    </UserInfoContext.Provider>
  );
};
