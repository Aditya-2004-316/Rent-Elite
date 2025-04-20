import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaHeart,
    FaUser,
    FaCarAlt,
    FaHistory,
    FaUserCircle,
    FaSignOutAlt,
    FaCog,
    FaEye,
    FaCircle,
    FaBalanceScale,
    FaLock,
    FaUsers,
    FaUserFriends,
    FaGlobe,
    FaUserShield,
    FaUserLock,
    FaTimes,
    FaMoon,
    FaBell,
    FaBellSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, translate } = useSettings();
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [compareList, setCompareList] = useState([]);
    const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(() => {
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem(`userData_${userEmail}`);
        if (userData) {
            const parsed = JSON.parse(userData);
            return parsed.profileVisibility || "everyone";
        }
        return "everyone";
    });

    const visibilityDropdownRef = useRef(null);

    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [activityStatus, setActivityStatus] = useState(() => {
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem(`userData_${userEmail}`);
        if (userData) {
            const parsed = JSON.parse(userData);
            return parsed.activityStatus || "online";
        }
        return "online";
    });

    const activityDropdownRef = useRef(null);

    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            const savedUserData = localStorage.getItem(`userData_${userEmail}`);
            if (savedUserData) {
                setUserData(JSON.parse(savedUserData));
            }
        }
    }, []);

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsProfileOpen(false);
        }
        if (
            visibilityDropdownRef.current &&
            !visibilityDropdownRef.current.contains(event.target)
        ) {
            setIsVisibilityOpen(false);
        }
        if (
            activityDropdownRef.current &&
            !activityDropdownRef.current.contains(event.target)
        ) {
            setIsActivityOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navItems = [
        { path: "/dashboard", icon: FaCarAlt, label: "dashboard" },
        { path: "/my-bookings", icon: FaHistory, label: "myBookings" },
        { path: "/favourites", icon: FaHeart, label: "favourites" },
        {
            path: "/compare",
            icon: FaBalanceScale,
            label: "Compare",
            badge: compareList.length,
        },
    ];

    const updateProfileVisibility = (visibility) => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            const userData = localStorage.getItem(`userData_${userEmail}`);
            if (userData) {
                const parsed = JSON.parse(userData);
                const updated = { ...parsed, profileVisibility: visibility };
                localStorage.setItem(
                    `userData_${userEmail}`,
                    JSON.stringify(updated)
                );
            }
        }
        setProfileVisibility(visibility);
        setIsVisibilityOpen(false);
    };

    const getVisibilityIcon = () => {
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem(`userData_${userEmail}`);
        if (userData) {
            const parsed = JSON.parse(userData);
            if (!parsed.profileVisibility) {
                return null;
            }

            switch (profileVisibility) {
                case "contacts":
                    return (
                        <FaUserShield className="w-3 h-3 absolute -bottom-1 -right-1 text-emerald-500 bg-white rounded-full" />
                    );
                case "private":
                    return (
                        <FaUserLock className="w-3 h-3 absolute -bottom-1 -right-1 text-red-500 bg-white rounded-full" />
                    );
                case "everyone":
                    return (
                        <FaGlobe className="w-3 h-3 absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full" />
                    );
                default:
                    return null;
            }
        }
        return null;
    };

    const updateActivityStatus = (status) => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            const userData = localStorage.getItem(`userData_${userEmail}`);
            if (userData) {
                const parsed = JSON.parse(userData);
                const updated = { ...parsed, activityStatus: status };
                localStorage.setItem(
                    `userData_${userEmail}`,
                    JSON.stringify(updated)
                );
            }
        }
        setActivityStatus(status);
        setIsActivityOpen(false);
    };

    const getActivityIcon = () => {
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem(`userData_${userEmail}`);
        if (userData) {
            const parsed = JSON.parse(userData);
            if (!parsed.activityStatus) {
                return null;
            }

            switch (activityStatus) {
                case "online":
                    return (
                        <FaCircle className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-emerald-500 bg-white rounded-full" />
                    );
                case "busy":
                    return (
                        <FaCircle className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-yellow-500 bg-white rounded-full" />
                    );
                case "dnd":
                    return (
                        <FaCircle className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-red-500 bg-white rounded-full" />
                    );
                default:
                    return null;
            }
        }
        return null;
    };

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 3000);
    };

    const handleProfileVisibilityClick = () => {
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem(`userData_${userEmail}`);
        if (userData) {
            const parsed = JSON.parse(userData);
            if (!parsed.profileVisibility) {
                showNotification(
                    "Please enable Profile Visibility in Settings to use this feature"
                );
                return;
            }
            setIsVisibilityOpen(true);
        }
    };

    const handleActivityStatusClick = () => {
        const userEmail = localStorage.getItem("userEmail");
        const userData = localStorage.getItem(`userData_${userEmail}`);
        if (userData) {
            const parsed = JSON.parse(userData);
            if (!parsed.activityStatus) {
                showNotification(
                    "Please enable Activity Status in Settings to use this feature"
                );
                return;
            }
            setIsActivityOpen(true);
        }
    };

    const profileMenuItems = [
        {
            label: "View Profile",
            icon: FaUserCircle,
            path: "/profile?tab=personal",
        },
        {
            label: "Profile Visibility",
            icon: FaEye,
            onClick: handleProfileVisibilityClick,
        },
        {
            label: "Activity Status",
            icon: FaCircle,
            onClick: handleActivityStatusClick,
        },
        { label: "Settings", icon: FaCog, path: "/profile?tab=settings" },
        { label: "Logout", icon: FaSignOutAlt, onClick: handleLogout },
    ];

    const getInitials = () => {
        if (userData && userData.name) {
            const nameParts = userData.name.split(" ");
            if (nameParts.length >= 2) {
                return `${nameParts[0].charAt(0)}${nameParts[1].charAt(
                    0
                )}`.toUpperCase();
            }
            return userData.name.charAt(0).toUpperCase();
        }
        return "??";
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`shadow-xl transition-colors duration-300 ${
                darkMode
                    ? "bg-gradient-to-r from-emerald-950 to-emerald-900"
                    : "bg-gradient-to-r from-emerald-800 to-emerald-600"
            }`}
        >
            <div className="max-w-8xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex-shrink-0 flex items-center gap-3 group"
                    >
                        <img
                            src={logo}
                            alt="Rent Elite Logo"
                            className="h-16 w-16 ml-8 object-contain transition-transform group-hover:rotate-3"
                        />
                        <span className="text-2xl font-bold text-white tracking-wide">
                            Rent Elite
                        </span>
                    </motion.button>

                    {/* Navigation Items */}
                    <div className="flex items-center mr-8 space-x-6">
                        <ul className="flex items-center space-x-4">
                            {navItems.map((item) => (
                                <motion.li
                                    key={item.path}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                                            ${
                                                isActive(item.path)
                                                    ? darkMode
                                                        ? "bg-[#0fa16d] text-white shadow-lg"
                                                        : "bg-white text-emerald-700 shadow-lg"
                                                    : darkMode
                                                    ? "text-white hover:bg-[#333333]"
                                                    : "text-white hover:bg-emerald-700/50"
                                            }`}
                                    >
                                        <item.icon
                                            className={`w-5 h-5 transition-colors`}
                                        />
                                        <span className="font-medium">
                                            {translate(item.label)}
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Profile Button */}
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold
                                    ${
                                        darkMode
                                            ? "bg-transparent border-2 border-[#0fa16d] text-white hover:bg-[#0fa16d]/20"
                                            : "bg-transparent border-2 border-white text-white hover:bg-white/20"
                                    } 
                                    shadow-md transition-all duration-200`}
                            >
                                {getInitials()}
                                {getVisibilityIcon()}
                                {getActivityIcon()}
                            </motion.button>

                            {/* Main Profile Dropdown */}
                            {isProfileOpen && (
                                <div
                                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 z-50
                                    ${
                                        darkMode
                                            ? "bg-[#1a1a1a] border border-[#333333]"
                                            : "bg-white border border-gray-200"
                                    }`}
                                >
                                    {profileMenuItems.map((item, index) => (
                                        <React.Fragment key={item.label}>
                                            {item.path ? (
                                                <Link
                                                    to={item.path}
                                                    onClick={() =>
                                                        setIsProfileOpen(false)
                                                    }
                                                    className={`flex items-center px-4 py-2 text-sm ${
                                                        darkMode
                                                            ? "text-gray-200 hover:bg-[#333333]"
                                                            : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <item.icon className="w-4 h-4 mr-3" />
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        item.onClick();
                                                        if (
                                                            item.label !==
                                                                "Profile Visibility" &&
                                                            item.label !==
                                                                "Activity Status"
                                                        ) {
                                                            setIsProfileOpen(
                                                                false
                                                            );
                                                        }
                                                    }}
                                                    className={`w-full flex items-center px-4 py-2 text-sm ${
                                                        darkMode
                                                            ? "text-gray-200 hover:bg-[#333333]"
                                                            : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <item.icon className="w-4 h-4 mr-3" />
                                                    {item.label}
                                                </button>
                                            )}
                                            {index <
                                                profileMenuItems.length - 1 && (
                                                <div
                                                    className={`mx-3 my-1 border-t ${
                                                        darkMode
                                                            ? "border-[#333333]"
                                                            : "border-gray-200"
                                                    }`}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {/* Updated Visibility Dropdown with close button */}
                            {isVisibilityOpen && (
                                <div
                                    ref={visibilityDropdownRef}
                                    className={`absolute right-[280px] mt-2 w-64 rounded-lg shadow-lg py-1 z-50
                                    ${
                                        darkMode
                                            ? "bg-[#1a1a1a] border border-[#333333]"
                                            : "bg-white border border-gray-200"
                                    }`}
                                >
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <div>
                                            <h3
                                                className={`font-medium ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                Profile Visibility
                                            </h3>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    darkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                Choose who can see your profile
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setIsVisibilityOpen(false)
                                            }
                                            className={`p-1 rounded-full hover:bg-gray-100 
                                            ${
                                                darkMode
                                                    ? "hover:bg-[#333333] text-gray-400 hover:text-black"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="py-1">
                                        <button
                                            onClick={() =>
                                                updateProfileVisibility(
                                                    "everyone"
                                                )
                                            }
                                            className={`w-full flex items-center px-4 py-3 text-sm ${
                                                darkMode
                                                    ? "text-gray-200 hover:bg-[#333333]"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            } ${
                                                profileVisibility === "everyone"
                                                    ? darkMode
                                                        ? "bg-[#333333]"
                                                        : "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 rounded-full bg-blue-100">
                                                    <FaGlobe className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Everyone
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Anyone can view your
                                                        profile
                                                    </p>
                                                </div>
                                            </div>
                                            {profileVisibility ===
                                                "everyone" && (
                                                <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateProfileVisibility(
                                                    "contacts"
                                                )
                                            }
                                            className={`w-full flex items-center px-4 py-3 text-sm ${
                                                darkMode
                                                    ? "text-gray-200 hover:bg-[#333333]"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            } ${
                                                profileVisibility === "contacts"
                                                    ? darkMode
                                                        ? "bg-[#333333]"
                                                        : "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 rounded-full bg-emerald-100">
                                                    <FaUserShield className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Contacts Only
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Only your contacts can
                                                        view your profile
                                                    </p>
                                                </div>
                                            </div>
                                            {profileVisibility ===
                                                "contacts" && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateProfileVisibility(
                                                    "private"
                                                )
                                            }
                                            className={`w-full flex items-center px-4 py-3 text-sm ${
                                                darkMode
                                                    ? "text-gray-200 hover:bg-[#333333]"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            } ${
                                                profileVisibility === "private"
                                                    ? darkMode
                                                        ? "bg-[#333333]"
                                                        : "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 rounded-full bg-red-100">
                                                    <FaUserLock className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Private
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        No one can view your
                                                        profile
                                                    </p>
                                                </div>
                                            </div>
                                            {profileVisibility ===
                                                "private" && (
                                                <div className="w-2 h-2 rounded-full bg-red-600 mr-2" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* New Activity Status Dropdown */}
                            {isActivityOpen && (
                                <div
                                    ref={activityDropdownRef}
                                    className={`absolute right-[280px] mt-2 w-64 rounded-lg shadow-lg py-1 z-50
                                    ${
                                        darkMode
                                            ? "bg-[#1a1a1a] border border-[#333333]"
                                            : "bg-white border border-gray-200"
                                    }`}
                                >
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <div>
                                            <h3
                                                className={`font-medium ${
                                                    darkMode
                                                        ? "text-white"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                Activity Status
                                            </h3>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    darkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                Set your availability status
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setIsActivityOpen(false)
                                            }
                                            className={`p-1 rounded-full hover:bg-gray-100 
                                            ${
                                                darkMode
                                                    ? "hover:bg-[#333333] text-gray-400 hover:text-black"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="py-1">
                                        {/* Online Status */}
                                        <button
                                            onClick={() =>
                                                updateActivityStatus("online")
                                            }
                                            className={`w-full flex items-center px-4 py-3 text-sm ${
                                                darkMode
                                                    ? "text-gray-200 hover:bg-[#333333]"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            } ${
                                                activityStatus === "online"
                                                    ? darkMode
                                                        ? "bg-[#333333]"
                                                        : "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 rounded-full bg-emerald-100">
                                                    <FaCircle className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Online
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Available for rentals
                                                        and inquiries
                                                    </p>
                                                </div>
                                            </div>
                                            {activityStatus === "online" && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-600 mr-2" />
                                            )}
                                        </button>

                                        {/* Busy Status */}
                                        <button
                                            onClick={() =>
                                                updateActivityStatus("busy")
                                            }
                                            className={`w-full flex items-center px-4 py-3 text-sm ${
                                                darkMode
                                                    ? "text-gray-200 hover:bg-[#333333]"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            } ${
                                                activityStatus === "busy"
                                                    ? darkMode
                                                        ? "bg-[#333333]"
                                                        : "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 rounded-full bg-yellow-100">
                                                    <FaBell className="w-5 h-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Busy
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        May take longer to
                                                        respond
                                                    </p>
                                                </div>
                                            </div>
                                            {activityStatus === "busy" && (
                                                <div className="w-2 h-2 rounded-full bg-yellow-600 mr-2" />
                                            )}
                                        </button>

                                        {/* Do Not Disturb Status */}
                                        <button
                                            onClick={() =>
                                                updateActivityStatus("dnd")
                                            }
                                            className={`w-full flex items-center px-4 py-3 text-sm ${
                                                darkMode
                                                    ? "text-gray-200 hover:bg-[#333333]"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            } ${
                                                activityStatus === "dnd"
                                                    ? darkMode
                                                        ? "bg-[#333333]"
                                                        : "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="p-2 rounded-full bg-red-100">
                                                    <FaBellSlash className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Do Not Disturb
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Only urgent
                                                        notifications
                                                    </p>
                                                </div>
                                            </div>
                                            {activityStatus === "dnd" && (
                                                <div className="w-2 h-2 rounded-full bg-red-600 mr-2" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add notification toast with higher z-index */}
            {notificationVisible && notification && (
                <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-[9999]">
                    {notification}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
