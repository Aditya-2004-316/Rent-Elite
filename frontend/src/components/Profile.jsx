import { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaIdCard,
    FaCar,
    FaHistory,
    FaCreditCard,
    FaEdit,
    FaSave,
    FaTimes,
    FaTrash,
    FaLock,
} from "react-icons/fa";
import styled from "styled-components";
import { useSettings } from "../context/SettingsContext";
import ChatBot from "./ChatBot";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useBookings } from "../context/BookingContext";
import { resetPassword, deleteAccount } from "../services/auth.service";

const Button = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    ${(props) =>
        props.$buttonType === "edit" &&
        `
        background-color: transparent;
        border: 1px solid #10b981;
        color: #10b981;
        
        &:hover {
            background-color: #10b981;
            color: white;
        }
    `}

    ${(props) =>
        props.$buttonType === "save" &&
        `
        background-color: #10b981;
        border: 1px solid #10b981;
    color: white;

    &:hover {
            background-color: #059669;
        }
    `}

    ${(props) =>
        props.$buttonType === "cancel" &&
        `
        background-color: transparent;
        border: 1px solid #ef4444;
        color: #ef4444;
        
        &:hover {
            background-color: #ef4444;
            color: white;
        }
    `}
`;

const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const safeJsonParse = (item, defaultValue = []) => {
    if (!item || item === "undefined") return defaultValue;
    try {
        return JSON.parse(item);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return defaultValue;
    }
};

const Profile = () => {
    const {
        darkMode,
        setDarkMode,
        currency,
        setCurrency,
        language,
        setLanguage,
        translate,
        formatCurrency,
    } = useSettings();

    const { bookings } = useBookings();

    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [newPayment, setNewPayment] = useState({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });
    const [showAllRentals, setShowAllRentals] = useState(false);

    // Move these declarations before userData initialization
    const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");

    const [userData, setUserData] = useState(() => {
        const userEmail = localStorage.getItem("userEmail");
        const userDataKey = `userData_${userEmail}`;
        const savedUserData = userEmail
            ? localStorage.getItem(userDataKey)
            : null;

        if (savedUserData && userEmail) {
            const parsed = safeJsonParse(savedUserData, {
                name: "",
                email: userEmail || "",
                phone: "",
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
                securityQuestion: "",
                securityAnswer: "",
            });

            // Update state variables after initialization
            if (parsed.securityQuestion) {
                // Use setTimeout to update these after render
                setTimeout(() => {
                    setSelectedQuestion(parsed.securityQuestion);
                    setSecurityQuestion(parsed.securityQuestion);

                    // Show security question UI if 2FA is enabled
                    if (parsed.twoFactorAuth) {
                        setShowSecurityQuestion(true);
                    }
                }, 0);
            }

            return parsed;
        }

        return {
            name: "",
            email: userEmail || "",
            phone: "",
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
            securityQuestion: "",
            securityAnswer: "",
        };
    });

    const [editedData, setEditedData] = useState({ ...userData });

    const [paymentMethods, setPaymentMethods] = useState(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) return [];

        // Special case for adityavishwakarma0316@gmail.com - migrate data if needed
        if (userEmail === "adityavishwakarma0316@gmail.com") {
            const oldPaymentMethodsItem =
                localStorage.getItem("paymentMethods");
            const userPaymentMethodsItem = localStorage.getItem(
                `paymentMethods_${userEmail}`
            );

            const oldPaymentMethods = safeJsonParse(oldPaymentMethodsItem, []);
            const userPaymentMethods = safeJsonParse(
                userPaymentMethodsItem,
                []
            );

            if (
                oldPaymentMethods.length > 0 &&
                userPaymentMethods.length === 0
            ) {
                localStorage.setItem(
                    `paymentMethods_${userEmail}`,
                    JSON.stringify(oldPaymentMethods)
                );
                console.log(
                    "Migrated payment methods for adityavishwakarma0316@gmail.com"
                );
                return oldPaymentMethods;
            }
        }

        const savedPaymentMethods = localStorage.getItem(
            `paymentMethods_${userEmail}`
        );
        return safeJsonParse(savedPaymentMethods, []);
    });

    const [preferences, setPreferences] = useState(() => {
        try {
            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) return [];

            // Special case for adityavishwakarma0316@gmail.com - migrate data if needed
            if (userEmail === "adityavishwakarma0316@gmail.com") {
                const oldPreferencesItem = localStorage.getItem("preferences");
                const userPreferencesItem = localStorage.getItem(
                    `preferences_${userEmail}`
                );

                // Check if items exist before parsing
                const oldPreferences = oldPreferencesItem
                    ? safeJsonParse(oldPreferencesItem, [])
                    : [];
                const userPreferences = userPreferencesItem
                    ? safeJsonParse(userPreferencesItem, [])
                    : [];

                if (oldPreferences.length > 0 && userPreferences.length === 0) {
                    localStorage.setItem(
                        `preferences_${userEmail}`,
                        JSON.stringify(oldPreferences)
                    );
                    console.log(
                        "Migrated preferences for adityavishwakarma0316@gmail.com"
                    );
                    return oldPreferences;
                }

                // If user preferences exist, return those
                if (userPreferencesItem) {
                    return userPreferences;
                }
            }

            const savedPreferences = localStorage.getItem(
                `preferences_${userEmail}`
            );
            return savedPreferences ? safeJsonParse(savedPreferences, []) : [];
        } catch (error) {
            console.error("Error in preferences initialization:", error);
            return [];
        }
    });

    const [preferencesChanged, setPreferencesChanged] = useState(false);
    const [settingsChanged, setSettingsChanged] = useState(false);

    const securityQuestions = [
        "What was the name of your first pet?",
        "In what city were you born?",
        "What is your mother's maiden name?",
        "What high school did you attend?",
        "What was the make of your first car?",
        "What is your favorite movie?",
        "What is your favorite book?",
    ];

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            localStorage.setItem(
                `userData_${userEmail}`,
                JSON.stringify(userData)
            );
        }
    }, [userData]);

    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 3000);
    };

    const getMostBookedCars = () => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) return [];

        const bookingsItem = localStorage.getItem(`bookings_${userEmail}`);
        const bookings = safeJsonParse(bookingsItem, []);
        if (!bookings || bookings.length === 0) return [];

        const carFrequency = bookings.reduce((acc, booking) => {
            const carName = booking?.car?.name;
            if (carName) {
                acc[carName] = (acc[carName] || 0) + 1;
            }
            return acc;
        }, {});

        const sortedCars = Object.entries(carFrequency)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        return sortedCars.slice(0, 3);
    };

    const [preferredCars, setPreferredCars] = useState(() => {
        const mostBookedCars = getMostBookedCars();
        return mostBookedCars.map((car) => car.name);
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const mostBookedCars = getMostBookedCars();
            setPreferredCars(mostBookedCars.map((car) => car.name));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const carCount = bookings.reduce((acc, rental) => {
            // Only count cars with valid names
            if (rental?.car?.name && rental.car.name !== "Unknown Car") {
                const carName = rental.car.name;
                acc[carName] = (acc[carName] || 0) + 1;
            }
            return acc;
        }, {});

        const sortedCars = Object.entries(carCount)
            .sort((a, b) => b[1] - a[1])
            .map(([carName]) => carName);

        setPreferredCars(sortedCars.slice(0, 3));
    }, [bookings]);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            localStorage.setItem(
                `bookings_${userEmail}`,
                JSON.stringify(bookings)
            );
        }
    }, [bookings]);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            localStorage.setItem(
                `preferences_${userEmail}`,
                JSON.stringify(editedData.preferences)
            );
        }
    }, [editedData.preferences]);

    const handlePreferencesChange = (key, value) => {
        setEditedData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handlePreferencesSave = () => {
        const updatedData = {
            ...userData,
            ...editedData,
        };

        setUserData(updatedData);
        setPreferencesChanged(false);
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            localStorage.setItem(
                `userData_${userEmail}`,
                JSON.stringify(updatedData)
            );
        }
        showNotification("Preferences saved successfully!");
    };

    const handleSettingsChange = (key, value) => {
        setEditedData((prev) => ({
            ...prev,
            [key]: value,
        }));
        setSettingsChanged(true);
    };

    const handleSettingsSave = () => {
        if (editedData.darkMode !== darkMode) {
            setDarkMode(editedData.darkMode);
        }
        if (editedData.currency !== currency) {
            setCurrency(editedData.currency);
        }

        if (editedData.twoFactorAuth) {
            if (!selectedQuestion || !securityQuestion || !securityAnswer) {
                showNotification(
                    "Please select a security question and provide an answer"
                );
                return;
            }

            const updatedData = {
                ...editedData,
                securityQuestion: securityQuestion || selectedQuestion,
                securityAnswer: securityAnswer,
            };
            setUserData(updatedData);

            const userEmail = localStorage.getItem("userEmail");
            if (userEmail) {
                const userDataKey = `userData_${userEmail}`;
                localStorage.setItem(userDataKey, JSON.stringify(updatedData));
                console.log("2FA settings saved to:", userDataKey);
            }
        } else {
            setUserData(editedData);

            const userEmail = localStorage.getItem("userEmail");
            if (userEmail) {
                const userDataKey = `userData_${userEmail}`;
                localStorage.setItem(userDataKey, JSON.stringify(editedData));
                console.log("2FA disabled in:", userDataKey);
            }
        }

        setSettingsChanged(false);
        showNotification("Settings saved successfully!");
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setUserData(editedData);
        setIsEditing(false);
        showNotification("Profile updated successfully!");
    };

    const handleCancel = () => {
        setEditedData(userData);
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditedData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "userEmail" && !e.newValue) {
                setUserData({
                    name: "",
                    email: "",
                    phone: "",
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
                    currency: "usd",
                });
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tabParam = params.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [location]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
        setPasswordError("");
        setPasswordSuccess(false);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setIsResettingPassword(true);

        try {
            // Validate passwords
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordError("New passwords do not match");
                setIsResettingPassword(false);
                return;
            }

            if (passwordData.newPassword.length < 6) {
                setPasswordError("Password must be at least 6 characters long");
                setIsResettingPassword(false);
                return;
            }

            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
                setPasswordError("User email not found, please log in again");
                setIsResettingPassword(false);
                return;
            }

            // Call the resetPassword function with current password
            await resetPassword(
                userEmail,
                passwordData.newPassword,
                passwordData.currentPassword
            );

            setPasswordSuccess(true);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            // Show success for 3 seconds, then reset
            setTimeout(() => {
                setPasswordSuccess(false);
            }, 3000);
        } catch (error) {
            setPasswordError(error.message || "Error resetting password");
        } finally {
            setIsResettingPassword(false);
        }
    };

    // Add this effect to handle 2FA settings after component mounts
    useEffect(() => {
        // Set the security question visibility based on 2FA setting
        if (userData.twoFactorAuth) {
            setShowSecurityQuestion(true);
            // Also set security question and answer from userData
            if (userData.securityQuestion) {
                setSelectedQuestion(userData.securityQuestion);
                setSecurityQuestion(userData.securityQuestion);
            }
        }
    }, [userData.twoFactorAuth, userData.securityQuestion]);

    // Add this state for account deletion modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    // Add this function to handle account deletion
    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteError("");
        setIsDeletingAccount(true);

        try {
            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
                setDeleteError("User email not found, please log in again");
                setIsDeletingAccount(false);
                return;
            }

            await deleteAccount(userEmail, deletePassword);
            // Redirect to home page after successful deletion
            navigate("/");
        } catch (error) {
            setDeleteError(error.message || "Error deleting account");
            setIsDeletingAccount(false);
        }
    };

    return (
        <div
            className={`min-h-screen transition-all duration-200 ${
                darkMode
                    ? "bg-[#121212] text-[#E4E6EB]"
                    : "bg-gray-50 text-gray-900"
            }`}
        >
            <div className="fixed top-0 left-0 right-0 z-10 transition-colors duration-300">
                <Navbar />
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
                <div
                    className={`rounded-lg p-6 mb-8 transition-colors duration-300 ${
                        darkMode
                            ? "bg-[#252525] text-[#E4E6EB] border border-[#393939] shadow-lg"
                            : "bg-white shadow-md"
                    }`}
                >
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-4xl text-white font-bold">
                                {getInitials(userData.name)}
                            </span>
                        </div>
                        <div>
                            <h1
                                className={`text-2xl font-bold ${
                                    darkMode
                                        ? "text-dark-text"
                                        : "text-gray-900"
                                }`}
                            >
                                {userData.name || "Your Name"}
                            </h1>
                            <p
                                className={
                                    darkMode ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Member since {userData.joinDate}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className={`rounded-lg overflow-hidden mb-8 transition-colors duration-300 ${
                        darkMode
                            ? "bg-[#252525] border border-[#393939] shadow-lg"
                            : "bg-white shadow-md"
                    }`}
                >
                    <div className="flex border-b border-gray-200 dark:border-dark-border">
                        <button
                            onClick={() => setActiveTab("personal")}
                            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
                                activeTab === "personal"
                                    ? darkMode
                                        ? "bg-[#0fa16d] text-white"
                                        : "bg-emerald-600 text-white"
                                    : darkMode
                                    ? "hover:bg-[#333333] text-[#E4E6EB] hover:text-white"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab("rentals")}
                            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
                                activeTab === "rentals"
                                    ? darkMode
                                        ? "bg-[#0fa16d] text-white"
                                        : "bg-emerald-600 text-white"
                                    : darkMode
                                    ? "hover:bg-[#333333] text-[#E4E6EB] hover:text-white"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            Rental History
                        </button>
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
                                activeTab === "preferences"
                                    ? darkMode
                                        ? "bg-[#0fa16d] text-white"
                                        : "bg-emerald-600 text-white"
                                    : darkMode
                                    ? "hover:bg-[#333333] text-[#E4E6EB] hover:text-white"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            Preferences
                        </button>
                        <button
                            onClick={() => setActiveTab("payment")}
                            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
                                activeTab === "payment"
                                    ? darkMode
                                        ? "bg-[#0fa16d] text-white"
                                        : "bg-emerald-600 text-white"
                                    : darkMode
                                    ? "hover:bg-[#333333] text-[#E4E6EB] hover:text-white"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            Payment Methods
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
                                activeTab === "settings"
                                    ? darkMode
                                        ? "bg-[#0fa16d] text-white"
                                        : "bg-emerald-600 text-white"
                                    : darkMode
                                    ? "hover:bg-[#333333] text-[#E4E6EB] hover:text-white"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            Settings
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === "personal" && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <FaUser className="text-emerald-600 text-xl" />
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Full Name
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedData.name}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full p-2 border rounded-md focus:ring-2 transition-colors duration-200 ${
                                                    darkMode
                                                        ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB] focus:ring-[#0fa16d] focus:border-[#0fa16d]"
                                                        : "bg-white focus:ring-emerald-500 focus:border-emerald-500"
                                                }`}
                                            />
                                        ) : (
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-dark-text"
                                                        : "text-gray-900"
                                                }
                                            >
                                                {userData.name || "Not set"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaEnvelope className="text-emerald-600 text-xl" />
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Email
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedData.email}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full p-2 border rounded-md focus:ring-2 transition-colors duration-200 ${
                                                    darkMode
                                                        ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB] focus:ring-[#0fa16d] focus:border-[#0fa16d]"
                                                        : "bg-white focus:ring-emerald-500 focus:border-emerald-500"
                                                }`}
                                            />
                                        ) : (
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-dark-text"
                                                        : "text-gray-900"
                                                }
                                            >
                                                {userData.email || "Not set"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaPhone className="text-emerald-600 text-xl" />
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Phone
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedData.phone}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full p-2 border rounded-md focus:ring-2 transition-colors duration-200 ${
                                                    darkMode
                                                        ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB] focus:ring-[#0fa16d] focus:border-[#0fa16d]"
                                                        : "bg-white focus:ring-emerald-500 focus:border-emerald-500"
                                                }`}
                                            />
                                        ) : (
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-dark-text"
                                                        : "text-gray-900"
                                                }
                                            >
                                                {userData.phone || "Not set"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaMapMarkerAlt className="text-emerald-600 text-xl" />
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Address
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedData.address}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full p-2 border rounded-md focus:ring-2 transition-colors duration-200 ${
                                                    darkMode
                                                        ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB] focus:ring-[#0fa16d] focus:border-[#0fa16d]"
                                                        : "bg-white focus:ring-emerald-500 focus:border-emerald-500"
                                                }`}
                                            />
                                        ) : (
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-dark-text"
                                                        : "text-gray-900"
                                                }
                                            >
                                                {userData.address || "Not set"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaIdCard className="text-emerald-600 text-xl" />
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            Driver's License
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedData.license}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "license",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full p-2 border rounded-md focus:ring-2 transition-colors duration-200 ${
                                                    darkMode
                                                        ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB] focus:ring-[#0fa16d] focus:border-[#0fa16d]"
                                                        : "bg-white focus:ring-emerald-500 focus:border-emerald-500"
                                                }`}
                                            />
                                        ) : (
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-dark-text"
                                                        : "text-gray-900"
                                                }
                                            >
                                                {userData.license || "Not set"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                <FaTimes />
                                                <span>Cancel</span>
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                            >
                                                <FaSave />
                                                <span>Save Changes</span>
                                            </button>
                                        </>
                                    ) : (
                                        <Button
                                            $buttonType="edit"
                                            onClick={handleEdit}
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "rentals" && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold">
                                        Total Rentals:{" "}
                                        {bookings.length > 0
                                            ? bookings.length
                                            : 0}
                                    </h3>
                                    {bookings.length > 0 && (
                                        <button
                                            onClick={() =>
                                                setShowAllRentals(
                                                    !showAllRentals
                                                )
                                            }
                                            className="text-emerald-600 hover:text-emerald-700"
                                        >
                                            {showAllRentals
                                                ? "Show Less"
                                                : "View All"}
                                        </button>
                                    )}
                                </div>
                                {bookings.length === 0 ? (
                                    <p
                                        className={`text-center py-4 ${
                                            darkMode
                                                ? "text-gray-300"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        No bookings found.
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                        {bookings
                                            .filter(
                                                (rental) => rental?.car?.name
                                            )
                                            .sort(
                                                (a, b) =>
                                                    new Date(b.startDate) -
                                                    new Date(a.startDate)
                                            )
                                            .slice(
                                                0,
                                                showAllRentals
                                                    ? bookings.length
                                                    : 3
                                            )
                                            .map((rental) => (
                                                <li
                                                    key={rental.id}
                                                    className={`p-4 border rounded-lg shadow-sm transition-colors duration-200 ${
                                                        darkMode
                                                            ? "bg-dark-card border-dark-border text-dark-text shadow-dark-sm"
                                                            : "bg-white border-gray-200"
                                                    }`}
                                                >
                                                    <h3 className="text-xl font-bold mb-2">
                                                        {rental.car.name}
                                                    </h3>
                                                    <p
                                                        className={`${
                                                            darkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span className="font-semibold">
                                                            Start Date:
                                                        </span>{" "}
                                                        {rental.startDate}
                                                    </p>
                                                    <p
                                                        className={`${
                                                            darkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span className="font-semibold">
                                                            End Date:
                                                        </span>{" "}
                                                        {rental.endDate}
                                                    </p>
                                                    <p
                                                        className={`${
                                                            darkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        <span className="font-semibold">
                                                            Total Price:
                                                        </span>{" "}
                                                        {formatCurrency(
                                                            rental.totalPrice
                                                        )}
                                                    </p>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {activeTab === "preferences" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Preferred Vehicles
                                    </h3>
                                    <div className="space-y-3">
                                        {preferredCars.length > 0 ? (
                                            preferredCars.map((car, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-3"
                                                >
                                                    <FaCar className="text-emerald-600" />
                                                    <span>{car}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p
                                                className={
                                                    darkMode
                                                        ? "text-gray-300"
                                                        : "text-gray-500"
                                                }
                                            >
                                                No bookings found.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Notification Preferences
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Email Notifications</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={
                                                        editedData.emailNotifications
                                                    }
                                                    onChange={(e) => {
                                                        handlePreferencesChange(
                                                            "emailNotifications",
                                                            e.target.checked
                                                        );
                                                        setPreferencesChanged(
                                                            true
                                                        );
                                                    }}
                                                />
                                                <div
                                                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 transition-colors duration-200 
                                                    ${
                                                        darkMode
                                                            ? "peer-focus:ring-[#0fa16d]/30 peer-checked:bg-[#0fa16d]"
                                                            : "peer-focus:ring-emerald-300 peer-checked:bg-emerald-600"
                                                    }
                                                    rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                                                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                                                ></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span>SMS Notifications</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={
                                                        editedData.smsNotifications
                                                    }
                                                    onChange={(e) => {
                                                        handlePreferencesChange(
                                                            "smsNotifications",
                                                            e.target.checked
                                                        );
                                                        setPreferencesChanged(
                                                            true
                                                        );
                                                    }}
                                                />
                                                <div
                                                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 transition-colors duration-200 
                                                    ${
                                                        darkMode
                                                            ? "peer-focus:ring-[#0fa16d]/30 peer-checked:bg-[#0fa16d]"
                                                            : "peer-focus:ring-emerald-300 peer-checked:bg-emerald-600"
                                                    }
                                                    rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                                                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                                                ></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {preferencesChanged && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handlePreferencesSave}
                                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                        >
                                            <FaSave />
                                            <span>Save Changes</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Saved Payment Methods
                                    </h3>
                                    <button
                                        onClick={() => setShowAddPayment(true)}
                                        className="text-emerald-600 hover:text-emerald-700"
                                    >
                                        Add New
                                    </button>
                                </div>

                                {showAddPayment && (
                                    <div className="border rounded-lg p-6 mb-6 bg-gray-50">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const userEmail =
                                                    localStorage.getItem(
                                                        "userEmail"
                                                    );
                                                if (!userEmail) return;

                                                const newPaymentMethod = {
                                                    id: uuidv4(),
                                                    type: "Credit Card",
                                                    lastFour:
                                                        newPayment.cardNumber.slice(
                                                            -4
                                                        ),
                                                    expiryDate:
                                                        newPayment.expiryDate,
                                                    cardholderName:
                                                        newPayment.cardholderName,
                                                    isDefault:
                                                        paymentMethods.length ===
                                                        0,
                                                };

                                                const updatedPaymentMethods = [
                                                    ...paymentMethods,
                                                    newPaymentMethod,
                                                ];

                                                setPaymentMethods(
                                                    updatedPaymentMethods
                                                );
                                                localStorage.setItem(
                                                    `paymentMethods_${userEmail}`,
                                                    JSON.stringify(
                                                        updatedPaymentMethods
                                                    )
                                                );

                                                setNewPayment({
                                                    cardholderName: "",
                                                    cardNumber: "",
                                                    expiryDate: "",
                                                    cvv: "",
                                                });
                                                setShowAddPayment(false);
                                                showNotification(
                                                    "Payment method added successfully!"
                                                );
                                            }}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newPayment.cardholderName
                                                    }
                                                    onChange={(e) =>
                                                        setNewPayment(
                                                            (prev) => ({
                                                                ...prev,
                                                                cardholderName:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newPayment.cardNumber
                                                    }
                                                    onChange={(e) =>
                                                        setNewPayment(
                                                            (prev) => ({
                                                                ...prev,
                                                                cardNumber:
                                                                    e.target.value
                                                                        .replace(
                                                                            /\D/g,
                                                                            ""
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            16
                                                                        ),
                                                            })
                                                        )
                                                    }
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            newPayment.expiryDate
                                                        }
                                                        onChange={(e) => {
                                                            let value =
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    ""
                                                                );
                                                            if (
                                                                value.length >=
                                                                2
                                                            ) {
                                                                value =
                                                                    value.slice(
                                                                        0,
                                                                        2
                                                                    ) +
                                                                    "/" +
                                                                    value.slice(
                                                                        2,
                                                                        4
                                                                    );
                                                            }
                                                            setNewPayment(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    expiryDate:
                                                                        value,
                                                                })
                                                            );
                                                        }}
                                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                        placeholder="MM/YY"
                                                        maxLength="5"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newPayment.cvv}
                                                        onChange={(e) =>
                                                            setNewPayment(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    cvv: e.target.value
                                                                        .replace(
                                                                            /\D/g,
                                                                            ""
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        ),
                                                                })
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                        placeholder="123"
                                                        maxLength="3"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowAddPayment(false)
                                                    }
                                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                                >
                                                    Add New
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className="rounded-lg p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <FaCreditCard className="text-emerald-600 text-2xl" />
                                                <div>
                                                    <p className="font-semibold">
                                                        {method.type} ending in{" "}
                                                        {method.lastFour}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Expires{" "}
                                                        {method.expiryDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {method.isDefault ? (
                                                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                                                        Default
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            const userEmail =
                                                                localStorage.getItem(
                                                                    "userEmail"
                                                                );
                                                            if (!userEmail)
                                                                return;

                                                            const updatedPaymentMethods =
                                                                paymentMethods.map(
                                                                    (m) => ({
                                                                        ...m,
                                                                        isDefault:
                                                                            m.id ===
                                                                            method.id,
                                                                    })
                                                                );

                                                            setPaymentMethods(
                                                                updatedPaymentMethods
                                                            );
                                                            localStorage.setItem(
                                                                `paymentMethods_${userEmail}`,
                                                                JSON.stringify(
                                                                    updatedPaymentMethods
                                                                )
                                                            );
                                                            showNotification(
                                                                "Default payment method updated!"
                                                            );
                                                        }}
                                                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                                                    >
                                                        Make Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const userEmail =
                                                            localStorage.getItem(
                                                                "userEmail"
                                                            );
                                                        if (!userEmail) return;

                                                        const updatedPaymentMethods =
                                                            paymentMethods.filter(
                                                                (m) =>
                                                                    m.id !==
                                                                    method.id
                                                            );

                                                        if (
                                                            method.isDefault &&
                                                            updatedPaymentMethods.length >
                                                                0
                                                        ) {
                                                            updatedPaymentMethods[0].isDefault = true;
                                                        }

                                                        setPaymentMethods(
                                                            updatedPaymentMethods
                                                        );
                                                        localStorage.setItem(
                                                            `paymentMethods_${userEmail}`,
                                                            JSON.stringify(
                                                                updatedPaymentMethods
                                                            )
                                                        );
                                                        showNotification(
                                                            "Payment method removed!"
                                                        );
                                                    }}
                                                    className="text-red-600 hover:text-red-700 transition-colors ml-4"
                                                    title="Remove"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div
                                className={`space-y-8 ${
                                    darkMode
                                        ? "text-dark-text"
                                        : "text-gray-700"
                                }`}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Dark Mode</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={darkMode}
                                                    onChange={(e) => {
                                                        setDarkMode(
                                                            e.target.checked
                                                        );
                                                        handleSettingsChange(
                                                            "darkMode",
                                                            e.target.checked
                                                        );
                                                    }}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span>Profile Visibility</span>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Allow others to see your
                                                    profile visibility status
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={
                                                        editedData.profileVisibility
                                                    }
                                                    onChange={(e) =>
                                                        handleSettingsChange(
                                                            "profileVisibility",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span>
                                                    Show Activity Status
                                                </span>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Allow others to see your
                                                    online status
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={
                                                        editedData.activityStatus
                                                    }
                                                    onChange={(e) =>
                                                        handleSettingsChange(
                                                            "activityStatus",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Currency
                                            </label>
                                            <select
                                                value={currency}
                                                onChange={(e) => {
                                                    setCurrency(e.target.value);
                                                    handleSettingsChange(
                                                        "currency",
                                                        e.target.value
                                                    );
                                                }}
                                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                    darkMode
                                                        ? "bg-[#252525] border-[#393939] text-[#E4E6EB]"
                                                        : "bg-white"
                                                }`}
                                            >
                                                <option value="usd">
                                                    USD ($)
                                                </option>
                                                <option value="eur">
                                                    EUR (€)
                                                </option>
                                                <option value="gbp">
                                                    GBP (£)
                                                </option>
                                                <option value="inr">
                                                    INR (₹)
                                                </option>
                                            </select>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-lg font-semibold mb-4">
                                                Security Settings
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span>
                                                        Two-Factor
                                                        Authentication
                                                    </span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={
                                                                editedData.twoFactorAuth
                                                            }
                                                            onChange={(e) => {
                                                                handleSettingsChange(
                                                                    "twoFactorAuth",
                                                                    e.target
                                                                        .checked
                                                                );
                                                                setShowSecurityQuestion(
                                                                    e.target
                                                                        .checked
                                                                );
                                                            }}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                                    </label>
                                                </div>

                                                {showSecurityQuestion && (
                                                    <div className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-[#252525] dark:border-[#393939]">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">
                                                                Select a
                                                                Security
                                                                Question
                                                            </label>
                                                            <select
                                                                value={
                                                                    selectedQuestion
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setSelectedQuestion(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setSecurityQuestion(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setSettingsChanged(
                                                                        true
                                                                    );
                                                                }}
                                                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                                    darkMode
                                                                        ? "bg-[#252525] border-[#393939] text-[#E4E6EB]"
                                                                        : "bg-white"
                                                                }`}
                                                            >
                                                                <option value="">
                                                                    Select a
                                                                    question
                                                                </option>
                                                                {securityQuestions.map(
                                                                    (
                                                                        question,
                                                                        index
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                question
                                                                            }
                                                                        >
                                                                            {
                                                                                question
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">
                                                                Your Answer
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    securityAnswer
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setSecurityAnswer(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    setSettingsChanged(
                                                                        true
                                                                    );
                                                                }}
                                                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                                    darkMode
                                                                        ? "bg-[#252525] border-[#393939] text-[#E4E6EB]"
                                                                        : "bg-white"
                                                                }`}
                                                                placeholder="Enter your answer"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password Reset Section */}
                                        <div className="mt-8">
                                            <h4 className="text-lg font-semibold mb-4">
                                                Change Password
                                            </h4>

                                            {passwordError && (
                                                <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                                                    {passwordError}
                                                </div>
                                            )}

                                            {passwordSuccess && (
                                                <div className="mb-4 p-3 rounded-lg bg-emerald-100 text-emerald-700">
                                                    Password updated
                                                    successfully!
                                                </div>
                                            )}

                                            <form
                                                onSubmit={handlePasswordReset}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={
                                                            passwordData.currentPassword
                                                        }
                                                        onChange={
                                                            handlePasswordChange
                                                        }
                                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                            darkMode
                                                                ? "bg-[#252525] border-[#393939] text-[#E4E6EB]"
                                                                : "bg-white border-gray-300"
                                                        }`}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={
                                                            passwordData.newPassword
                                                        }
                                                        onChange={
                                                            handlePasswordChange
                                                        }
                                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                            darkMode
                                                                ? "bg-[#252525] border-[#393939] text-[#E4E6EB]"
                                                                : "bg-white border-gray-300"
                                                        }`}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={
                                                            passwordData.confirmPassword
                                                        }
                                                        onChange={
                                                            handlePasswordChange
                                                        }
                                                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                            darkMode
                                                                ? "bg-[#252525] border-[#393939] text-[#E4E6EB]"
                                                                : "bg-white border-gray-300"
                                                        }`}
                                                        required
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={
                                                        isResettingPassword
                                                    }
                                                    className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-300 flex items-center ${
                                                        isResettingPassword
                                                            ? "opacity-70 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                >
                                                    {isResettingPassword ? (
                                                        <span>Updating...</span>
                                                    ) : (
                                                        <>
                                                            <FaLock
                                                                className="mr-2"
                                                                size={16}
                                                            />
                                                            <span>
                                                                Update Password
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {settingsChanged && (
                                        <div className="flex justify-end mt-6">
                                            <button
                                                onClick={handleSettingsSave}
                                                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                            >
                                                <FaSave />
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Account Deletion Section */}
                                <div className="mt-12 border-t pt-6">
                                    <h4 className="text-lg font-semibold mb-4 text-red-600">
                                        Account Deletion
                                    </h4>
                                    <p
                                        className={
                                            darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }
                                    >
                                        Once you delete your account, there is
                                        no going back. Please be certain.
                                    </p>

                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
                                    >
                                        <FaTrash className="mr-2" />
                                        Delete My Account
                                    </button>

                                    {/* Delete Account Confirmation Modal */}
                                    {showDeleteModal && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                            <div
                                                className={`bg-${
                                                    darkMode
                                                        ? "[#252525]"
                                                        : "white"
                                                } p-6 rounded-lg shadow-xl max-w-md w-full`}
                                            >
                                                <h3 className="text-xl font-bold mb-4 text-red-600">
                                                    Delete Account
                                                </h3>
                                                <p
                                                    className={`mb-6 ${
                                                        darkMode
                                                            ? "text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Are you sure you want to
                                                    delete your account? This
                                                    action cannot be undone.
                                                </p>

                                                {deleteError && (
                                                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                                                        {deleteError}
                                                    </div>
                                                )}

                                                <form
                                                    onSubmit={
                                                        handleDeleteAccount
                                                    }
                                                    className="space-y-4"
                                                >
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Enter your password
                                                            to confirm
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={
                                                                deletePassword
                                                            }
                                                            onChange={(e) =>
                                                                setDeletePassword(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full p-2 border rounded-md focus:ring-2 ${
                                                                darkMode
                                                                    ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB] focus:ring-red-500 focus:border-red-500"
                                                                    : "bg-white border-gray-300 focus:ring-red-500 focus:border-red-500"
                                                            }`}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex justify-end space-x-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowDeleteModal(
                                                                    false
                                                                );
                                                                setDeletePassword(
                                                                    ""
                                                                );
                                                                setDeleteError(
                                                                    ""
                                                                );
                                                            }}
                                                            className={`px-4 py-2 border ${
                                                                darkMode
                                                                    ? "border-[#393939] text-[#E4E6EB] hover:bg-[#333333]"
                                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                            } rounded-md transition-colors`}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                isDeletingAccount
                                                            }
                                                            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                                                                isDeletingAccount
                                                                    ? "opacity-70 cursor-not-allowed"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {isDeletingAccount
                                                                ? "Deleting..."
                                                                : "Delete My Account"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {notificationVisible && notification && (
                <div
                    className={`fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-[100] ${
                        notificationVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                    }`}
                >
                    {notification}
                </div>
            )}
            <ChatBot />
        </div>
    );
};

export default Profile;
