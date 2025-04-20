import api from "./api";

export const login = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("userRole", response.data.role);
            localStorage.setItem("userEmail", email);

            // Apply dark mode settings immediately after login if needed
            const darkModeKey = `darkMode_${email}`;
            const darkMode = localStorage.getItem(darkModeKey);

            if (darkMode === "true") {
                document.documentElement.classList.add("dark");
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#E4E6EB";
            }
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("userRole", response.data.role);
            localStorage.setItem("userEmail", userData.email);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Registration failed" };
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authData");
};

export const isAdmin = () => {
    return localStorage.getItem("userRole") === "admin";
};

export const resetPassword = async (
    email,
    newPassword,
    currentPassword = null
) => {
    try {
        // For profile-based password update (has current password)
        if (currentPassword) {
            const response = await api.post("/auth/update-password", {
                email,
                currentPassword,
                newPassword,
            });

            // Also update in localStorage as fallback
            await updatePasswordInLocalStorage(email, newPassword);

            return response.data;
        }
        // For token-based password reset (no current password)
        else {
            // Update in localStorage
            await updatePasswordInLocalStorage(email, newPassword);

            try {
                // Try to update on the server too
                const response = await api.post("/auth/reset-password", {
                    email,
                    password: newPassword,
                });
                return response.data;
            } catch (error) {
                // Return success anyway since localStorage is updated
                return {
                    success: true,
                    message: "Password reset successful in local storage",
                };
            }
        }
    } catch (error) {
        throw { success: false, message: "Password reset failed" };
    }
};

const updatePasswordInLocalStorage = async (email, newPassword) => {
    try {
        const bcryptjs = await import("bcryptjs");
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        try {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.length > 0) {
                const updatedUsers = users.map((user) => {
                    if (user.email === email) {
                        return { ...user, password: hashedPassword, salt };
                    }
                    return user;
                });
                localStorage.setItem("users", JSON.stringify(updatedUsers));
            }
        } catch (e) {
            console.error("Error updating users array:", e);
        }

        try {
            const registeredUsers =
                JSON.parse(localStorage.getItem("registeredUsers")) || [];
            if (registeredUsers.length > 0) {
                const updatedRegisteredUsers = registeredUsers.map((user) => {
                    if (user.email === email) {
                        return { ...user, password: hashedPassword, salt };
                    }
                    return user;
                });
                localStorage.setItem(
                    "registeredUsers",
                    JSON.stringify(updatedRegisteredUsers)
                );
            }
        } catch (e) {
            console.error("Error updating registeredUsers array:", e);
        }

        try {
            const userDataKey = `userData_${email}`;
            const userData = localStorage.getItem(userDataKey)
                ? JSON.parse(localStorage.getItem(userDataKey))
                : null;

            if (userData) {
                userData.password = hashedPassword;
                userData.salt = salt;
                localStorage.setItem(userDataKey, JSON.stringify(userData));
            }
        } catch (e) {
            console.error("Error updating userData:", e);
        }

        try {
            const authData = localStorage.getItem("authData")
                ? JSON.parse(localStorage.getItem("authData"))
                : null;

            if (authData && authData.email === email) {
                authData.password = hashedPassword;
                localStorage.setItem("authData", JSON.stringify(authData));
            }
        } catch (e) {
            console.error("Error updating authData:", e);
        }

        localStorage.setItem(`passwordFor_${email}`, hashedPassword);

        return true;
    } catch (error) {
        throw error;
    }
};

export const requestPasswordReset = async (email) => {
    try {
        // First check if user exists
        const response = await api.post("/auth/forgot-password", { email });

        return {
            success: true,
            message: "Password reset link generated successfully",
            ...response.data,
        };
    } catch (error) {
        throw {
            success: false,
            message:
                error.response?.data?.message ||
                "Request password reset failed",
        };
    }
};

export const resetPasswordWithToken = async (token, newPassword) => {
    try {
        const response = await api.post("/auth/reset-password", {
            token,
            newPassword,
        });

        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                success: false,
                message: "Password reset failed",
            }
        );
    }
};

export const deleteAccount = async (email, password) => {
    try {
        const response = await api.post("/auth/delete-account", {
            email,
            password,
        });

        if (response.data.success) {
            // Clear all user data from localStorage
            logout();

            // Clear any user-specific data
            localStorage.removeItem(`userData_${email}`);
            localStorage.removeItem(`paymentMethods_${email}`);
            localStorage.removeItem(`preferences_${email}`);
            localStorage.removeItem(`bookings_${email}`);
            localStorage.removeItem(`darkMode_${email}`);
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Account deletion failed" };
    }
};
