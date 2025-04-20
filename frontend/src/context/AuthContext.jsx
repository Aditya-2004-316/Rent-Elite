import React, { createContext, useContext, useState, useEffect } from "react";
import { clearAuthSession, initAuthSession } from "../utils/AuthSessionStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for authentication data in various places
        const authToken = localStorage.getItem("authToken");
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem("userData");
        const userRole = localStorage.getItem("userRole");

        if (authToken && userEmail) {
            const user = {
                email: userEmail,
                role: userRole || (userData ? JSON.parse(userData).role : null),
                token: authToken,
            };
            setUser(user);
            // Initialize authentication session tracking
            initAuthSession();
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userData", JSON.stringify(userData));

        // Initialize authentication session tracking
        initAuthSession();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");

        // Clear authentication session
        clearAuthSession();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
