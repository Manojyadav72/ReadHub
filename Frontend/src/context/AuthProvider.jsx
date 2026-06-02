import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(() => {
        const stored = localStorage.getItem("userInfo");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (data) => {
        // data = { token, user }
        localStorage.setItem("userInfo", JSON.stringify(data));
        setAuthUser(data);
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setAuthUser(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
