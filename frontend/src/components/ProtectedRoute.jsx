import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAuthSessionValid } from "../utils/AuthSessionStorage";

const ProtectedRoute = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Check both for user authentication and valid navigation session
    const isAuthenticated = user !== null;
    const hasValidSession = isAuthSessionValid();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If user has navigated to a public page after accessing protected routes
    if (!hasValidSession) {
        // Log the user out
        logout();
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                    message:
                        "Your session has expired. Please log in again to continue.",
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;
