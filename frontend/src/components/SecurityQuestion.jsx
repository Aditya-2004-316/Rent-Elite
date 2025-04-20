import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SecurityQuestion = ({ question, onSuccess }) => {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    // Track if component is mounted to avoid state updates after unmounting
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            setError("User email not found. Please try logging in again.");
            return;
        }

        // Check security answer from userData_{email} storage
        const userDataKey = `userData_${userEmail}`;
        const userDataStr = localStorage.getItem(userDataKey);

        console.log("2FA Check - Email:", userEmail);
        console.log("2FA Check - User data exists:", !!userDataStr);

        if (!userDataStr) {
            setError("User data not found. Please try logging in again.");
            return;
        }

        try {
            const userData = JSON.parse(userDataStr);
            console.log(
                "2FA Check - Security question:",
                userData.securityQuestion
            );
            console.log(
                "2FA Check - Has security answer:",
                !!userData.securityAnswer
            );

            if (!userData.securityAnswer) {
                // If no security answer is stored, consider this a setup error
                console.error("Security answer not found in user data");
                if (isMounted) {
                    setError(
                        "Security answer not set up properly. Please contact support."
                    );
                }
                return;
            }

            // Case-insensitive comparison
            const storedAnswer = userData.securityAnswer.toLowerCase().trim();
            const providedAnswer = answer.toLowerCase().trim();

            console.log(
                "2FA Check - Comparing answers (not showing actual values)"
            );
            console.log(
                "2FA Check - Stored answer length:",
                storedAnswer.length
            );
            console.log(
                "2FA Check - Provided answer length:",
                providedAnswer.length
            );

            if (providedAnswer === storedAnswer) {
                console.log(
                    "2FA Check - Answer is correct, proceeding with login"
                );

                // Get login data from localStorage
                const token = localStorage.getItem("authToken");
                const role = localStorage.getItem("userRole");

                // Ensure login data exists
                if (!token) {
                    if (isMounted) {
                        setError(
                            "Authentication data not found. Please try logging in again."
                        );
                    }
                    return;
                }

                // Create user object with necessary data
                const user = {
                    email: userEmail,
                    token: token,
                    role: role || "customer",
                };

                // Call login to ensure auth context is updated
                login(user);

                // Call onSuccess callback which should navigate to dashboard
                if (onSuccess && typeof onSuccess === "function") {
                    onSuccess();
                } else {
                    // Fallback if onSuccess isn't provided
                    navigate("/dashboard");
                }
            } else {
                console.log("2FA Check - Answer is incorrect");
                if (isMounted) {
                    setError(
                        "Incorrect answer. Please try again or contact support."
                    );
                }
            }
        } catch (error) {
            console.error("Error validating security answer:", error);
            if (isMounted) {
                setError("Error validating security answer. Please try again.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#252525] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    Security Verification
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {question}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            type={showAnswer ? "text" : "password"}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full p-2 border rounded-md mb-4 dark:bg-[#333333] dark:border-[#444444] dark:text-white pr-10"
                            placeholder="Enter your answer"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setShowAnswer(!showAnswer)}
                        >
                            {showAnswer ? (
                                <FaEyeSlash className="h-5 w-5" />
                            ) : (
                                <FaEye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SecurityQuestion;
