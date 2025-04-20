import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
    recordProtectedAccess,
    recordPublicAccess,
    hasNavigatedToPublic,
    isAuthSessionValid,
} from "./utils/AuthSessionStorage";

// Define your protected/password-protected routes here
const PROTECTED_ROUTES = [
    "/dashboard",
    "/profile",
    "/my-bookings",
    "/favourites",
    "/compare",
    "/dashboard/privacy-policy",
    "/dashboard/terms-of-service",
    "/dashboard/contact-us",
    "/dashboard/about-us",
    "/dashboard/faqs",
    "/dashboard/support",
    // Add any other protected routes here
];

// Define admin routes separately
const ADMIN_ROUTES = [
    "/admin/newsletter",
    // Add other admin routes here
];

// Define public routes explicitly
const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/cars",
    "/privacy-policy",
    "/terms-of-service",
    "/contact-us",
    "/about-us",
    "/faqs",
    "/register",
    "/reset-password",
];

const isProtectedRoute = (pathname) => {
    return PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
};

const isAdminRoute = (pathname) => {
    return ADMIN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
};

const isPublicRoute = (pathname) => {
    return PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
};

export default function ProtectedRoutePopHandler() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Check if the current route is protected, admin, or public
    const currentPath = location.pathname;
    const isCurrentRouteProtected = isProtectedRoute(currentPath);
    const isCurrentRouteAdmin = isAdminRoute(currentPath);
    const isCurrentRoutePublic = isPublicRoute(currentPath);

    // Track navigation between route types
    useEffect(() => {
        if (isCurrentRouteProtected || isCurrentRouteAdmin) {
            if (user) {
                // Record that user accessed a protected route
                recordProtectedAccess();
            }
        } else if (isCurrentRoutePublic) {
            // Record that user navigated to a public route
            recordPublicAccess();
        }
    }, [
        location.pathname,
        user,
        isCurrentRouteProtected,
        isCurrentRouteAdmin,
        isCurrentRoutePublic,
    ]);

    // Handle initial page load - this is important for direct URL access
    useEffect(() => {
        const path = window.location.pathname;

        // If navigating to a protected route
        if (isProtectedRoute(path) || isAdminRoute(path)) {
            if (!user) {
                // If not logged in, redirect to landing page
                navigate("/", { replace: true });
            } else if (isAdminRoute(path) && user.role !== "admin") {
                // If logged in but not admin for admin routes, redirect to dashboard
                navigate("/dashboard", { replace: true });
            } else if (hasNavigatedToPublic()) {
                // If navigated to public page after protected access, enforce a new login
                console.log(
                    "Session invalidated due to navigation to public page"
                );
                logout();
                navigate("/login", {
                    replace: true,
                    state: {
                        message:
                            "Your session has expired. Please log in again to continue.",
                    },
                });
            }
        }
    }, [user, navigate, location.pathname, logout]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;

            // Handle protected routes
            if (isProtectedRoute(path) || isAdminRoute(path)) {
                if (!user) {
                    // If not logged in, redirect to landing page
                    navigate("/", { replace: true });
                } else if (isAdminRoute(path) && user.role !== "admin") {
                    // If logged in but not admin, redirect to dashboard
                    navigate("/dashboard", { replace: true });
                } else if (hasNavigatedToPublic()) {
                    // If navigated to public page after protected access, enforce a new login
                    console.log(
                        "Session invalidated due to popstate navigation"
                    );
                    logout();
                    navigate("/login", {
                        replace: true,
                        state: {
                            message:
                                "Your session has expired. Please log in again to continue.",
                        },
                    });
                }
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [user, navigate, logout]);

    return null;
}
