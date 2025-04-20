import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/reset-password",
                {
                    token,
                    newPassword: password,
                }
            );

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error resetting password");
            console.error("Reset password error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            <LandingNavbar />

            <div className="pt-20 flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Reset Your Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4">
                            <p className="text-green-700">
                                Password reset successful! Redirecting to
                                login...
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    to="/login"
                                    className="flex-1 flex justify-center items-center px-4 py-2 border border-emerald-600 rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Back to Login
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    {isLoading
                                        ? "Resetting..."
                                        : "Reset Password"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <LandingFooter />
        </div>
    );
};

export default ResetPassword;
