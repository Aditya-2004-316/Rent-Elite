import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import useScrollToTop from "../hooks/useScrollToTop";
import SecurityQuestion from "./SecurityQuestion";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    useScrollToTop();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
    const [userSecurityQuestion, setUserSecurityQuestion] = useState("");

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value.trim(),
        });
        setError("");
    };

    const validateForm = () => {
        if (!credentials.email || !credentials.password) {
            setError("Please fill in all fields");
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: credentials.email.toLowerCase(),
                    password: credentials.password,
                }
            );

            // Debug logging
            console.log("Login response:", response.data);
            console.log("Role from response:", response.data.role);
            console.log("User from response:", response.data.user);

            if (response.data.success) {
                // Store basic auth data before 2FA check
                localStorage.setItem(
                    "userEmail",
                    credentials.email.toLowerCase()
                );
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem(
                    "userRole",
                    response.data.role || "customer"
                );

                // Check for user-specific data in localStorage
                const userDataKey = `userData_${credentials.email.toLowerCase()}`;
                let userData = localStorage.getItem(userDataKey);
                let parsedUserData = null;

                console.log("Login - Checking for user data at:", userDataKey);
                console.log("Login - User data exists:", !!userData);

                if (userData) {
                    try {
                        parsedUserData = JSON.parse(userData);
                        console.log(
                            "Login - Parsed user data:",
                            !!parsedUserData
                        );
                        console.log(
                            "Login - 2FA enabled:",
                            !!parsedUserData.twoFactorAuth
                        );
                        console.log(
                            "Login - Has security question:",
                            !!parsedUserData.securityQuestion
                        );
                        console.log(
                            "Login - Has security answer:",
                            !!parsedUserData.securityAnswer
                        );
                    } catch (e) {
                        console.error("Error parsing user data:", e);
                    }
                }

                // Check for 2FA
                if (
                    parsedUserData &&
                    parsedUserData.twoFactorAuth === true &&
                    parsedUserData.securityQuestion &&
                    parsedUserData.securityAnswer
                ) {
                    console.log(
                        "Login - 2FA is enabled, showing security question"
                    );
                    setUserSecurityQuestion(parsedUserData.securityQuestion);
                    setShowSecurityQuestion(true);
                    setIsLoading(false);
                    return;
                }

                // If no 2FA or it's not properly configured, proceed with login
                console.log(
                    "Login - No 2FA or not properly configured, proceeding with login"
                );

                // Initialize with default values if no existing user data
                if (!parsedUserData) {
                    const initialUserData = {
                        name: response.data.user?.name || "",
                        email: credentials.email.toLowerCase(),
                        phone: response.data.user?.phone || "",
                        address: "",
                        license: "",
                        joinDate: new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        }),
                        emailNotifications: false,
                        smsNotifications: false,
                        darkMode: false,
                        profileVisibility: false,
                        activityStatus: false,
                        language: "english",
                        currency: "usd",
                        twoFactorAuth: false,
                    };
                    localStorage.setItem(
                        userDataKey,
                        JSON.stringify(initialUserData)
                    );
                }

                // Store general user data
                localStorage.setItem(
                    "userData",
                    JSON.stringify(response.data.user)
                );

                // Use AuthContext login for global state
                login({
                    email: credentials.email.toLowerCase(),
                    token: response.data.token,
                    role: response.data.role || "customer",
                    ...response.data.user,
                });

                // Redirect to dashboard
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message ||
                    "Login failed. Please check your credentials."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate("/signup"); // Navigate to the sign-up page
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        navigate("/forgot-password"); // Navigate to forgot password page
    };

    const handleSecurityQuestionSuccess = () => {
        console.log("2FA verification successful, navigating to dashboard");
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />
            <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="absolute top-0 left-0 w-full h-64 bg-emerald-600 rounded-b-[30%] -z-10"></div>

                {/* Logo and Website Name */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center space-x-4 mb-12 mt-16"
                >
                    <img
                        src={logo}
                        alt="RentElite Logo"
                        className="h-20 w-auto drop-shadow-lg"
                    />
                    <h1 className="text-5xl font-bold text-gray-300">
                        <span className="text-emerald-300">RentElite</span>
                    </h1>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-md w-full space-y-6 bg-white p-10 rounded-2xl shadow-2xl"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to continue your luxury experience
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
                        >
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {resetEmailSent && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md"
                        >
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">
                                        Password reset instructions have been
                                        sent to your email.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all duration-300"
                                        placeholder="Enter your email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                        className="pl-10 pr-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all duration-300"
                                        placeholder="Enter your password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-emerald-500" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400 hover:text-emerald-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-300 ${
                                    isLoading
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 transform hover:-translate-y-1 hover:shadow-lg"
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-1/3 h-48 bg-emerald-600 opacity-10 rounded-tl-full -z-10"></div>
            </div>
            <LandingFooter />

            {/* Security Question Modal */}
            {showSecurityQuestion && (
                <SecurityQuestion
                    question={userSecurityQuestion}
                    onSuccess={handleSecurityQuestionSuccess}
                />
            )}
        </div>
    );
};

export default Login;
