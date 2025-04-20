// AuthSessionStorage.js - Manages authentication session state

/**
 * This utility manages the authentication state with respect to navigation,
 * tracking whether a user has navigated to a public page after being on a protected page
 */

// Session storage keys
const AUTH_SESSION_KEY = "auth_session_active";
const AUTH_LAST_PROTECTED_ACCESS = "auth_last_protected";
const AUTH_NAVIGATED_TO_PUBLIC = "auth_navigated_to_public";

/**
 * Initializes the auth session when a user logs in
 */
export const initAuthSession = () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    sessionStorage.setItem(AUTH_LAST_PROTECTED_ACCESS, Date.now().toString());
    sessionStorage.removeItem(AUTH_NAVIGATED_TO_PUBLIC);
};

/**
 * Records when a user accesses a protected route
 */
export const recordProtectedAccess = () => {
    sessionStorage.setItem(AUTH_LAST_PROTECTED_ACCESS, Date.now().toString());
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
};

/**
 * Records when a user navigates to a public route
 */
export const recordPublicAccess = () => {
    const hasActiveSession =
        sessionStorage.getItem(AUTH_SESSION_KEY) === "true";

    // Only mark navigation to public if there was an active session before
    if (hasActiveSession) {
        sessionStorage.setItem(AUTH_NAVIGATED_TO_PUBLIC, "true");
    }
};

/**
 * Checks if a user has navigated to a public page after being on a protected page
 * @returns {boolean} True if navigation to public page has occurred
 */
export const hasNavigatedToPublic = () => {
    return sessionStorage.getItem(AUTH_NAVIGATED_TO_PUBLIC) === "true";
};

/**
 * Clears the auth session when a user logs out
 */
export const clearAuthSession = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_LAST_PROTECTED_ACCESS);
    sessionStorage.removeItem(AUTH_NAVIGATED_TO_PUBLIC);
};

/**
 * Checks if the auth session is valid
 * @returns {boolean} True if session is valid
 */
export const isAuthSessionValid = () => {
    const hasSession = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
    const navigatedToPublic = hasNavigatedToPublic();

    // If user navigated to public page after protected access, session is invalid
    if (navigatedToPublic) {
        return false;
    }

    return hasSession;
};
