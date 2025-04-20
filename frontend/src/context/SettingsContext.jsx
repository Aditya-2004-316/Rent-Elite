import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useRef,
} from "react";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // Track initialization
    const isInitialized = useRef(false);

    // Get the current user email
    const [userEmail, setUserEmail] = useState(
        localStorage.getItem("userEmail")
    );

    // Define storage keys with user-specific prefixes
    const darkModeKey = userEmail ? `darkMode_${userEmail}` : "darkMode";
    const currencyKey = userEmail ? `currency_${userEmail}` : "currency";
    const languageKey = userEmail ? `language_${userEmail}` : "language";

    // Pre-load dark mode from localStorage early at component creation
    // This helps reduce flicker on login
    const getInitialDarkMode = () => {
        if (!userEmail) return false;

        try {
            const saved = localStorage.getItem(darkModeKey);
            return saved ? JSON.parse(saved) : false;
        } catch (e) {
            return false;
        }
    };

    // Initialize state with preloaded values
    const [darkMode, setDarkMode] = useState(getInitialDarkMode);
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem(currencyKey);
        return saved || "usd";
    });
    const [language, setLanguage] = useState("english");

    // Apply dark mode immediately on component mount
    useEffect(() => {
        // Only run this once at initial load
        if (!isInitialized.current) {
            const root = document.documentElement;
            const initialDarkMode = getInitialDarkMode();

            // Apply dark mode immediately if needed
            if (initialDarkMode) {
                root.classList.add("dark");
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#E4E6EB";
            } else {
                root.classList.remove("dark");
                document.body.style.backgroundColor = "";
                document.body.style.color = "";
            }

            isInitialized.current = true;
        }
    }, []);

    // Listen for changes to the userEmail in localStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "userEmail") {
                setUserEmail(e.newValue);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Also check for userEmail changes directly (for same-tab login/logout)
    useEffect(() => {
        const checkUserEmail = () => {
            const currentUserEmail = localStorage.getItem("userEmail");
            if (currentUserEmail !== userEmail) {
                setUserEmail(currentUserEmail);
            }
        };

        // Check every 500ms for changes (faster than before)
        const interval = setInterval(checkUserEmail, 500);
        return () => clearInterval(interval);
    }, [userEmail]);

    // Migrate existing data if needed
    useEffect(() => {
        if (userEmail) {
            // Check if user-specific data already exists
            const hasUserDarkMode = localStorage.getItem(
                `darkMode_${userEmail}`
            );
            const hasUserCurrency = localStorage.getItem(
                `currency_${userEmail}`
            );
            const hasUserLanguage = localStorage.getItem(
                `language_${userEmail}`
            );

            // If user-specific data doesn't exist, migrate from generic storage
            if (!hasUserDarkMode && localStorage.getItem("darkMode")) {
                localStorage.setItem(
                    `darkMode_${userEmail}`,
                    localStorage.getItem("darkMode")
                );
            }

            if (!hasUserCurrency && localStorage.getItem("currency")) {
                localStorage.setItem(
                    `currency_${userEmail}`,
                    localStorage.getItem("currency")
                );
            }

            if (!hasUserLanguage && localStorage.getItem("language")) {
                localStorage.setItem(
                    `language_${userEmail}`,
                    localStorage.getItem("language")
                );
            }
        }
    }, [userEmail]);

    // Update states when userEmail changes with minimal delay
    useEffect(() => {
        if (userEmail) {
            // User is logged in - load their preferences
            const savedDarkMode = localStorage.getItem(darkModeKey);
            // Use requestAnimationFrame for smoother transition
            requestAnimationFrame(() => {
                setDarkMode(savedDarkMode ? JSON.parse(savedDarkMode) : false);
            });
        } else {
            // User is logged out - always use light mode for landing pages
            setDarkMode(false);
        }

        // Update currency when userEmail changes, default to USD
        const savedCurrency = localStorage.getItem(currencyKey);
        setCurrency(savedCurrency || "usd");
    }, [darkModeKey, currencyKey, userEmail]);

    // Optimized dark mode effect with faster transitions
    useEffect(() => {
        const applyDarkMode = () => {
            const root = document.documentElement;
            if (darkMode) {
                root.classList.add("dark");
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#E4E6EB";
            } else {
                root.classList.remove("dark");
                document.body.style.backgroundColor = "";
                document.body.style.color = "";
            }
        };

        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(applyDarkMode);

        // Only save to localStorage if user is logged in
        if (userEmail) {
            localStorage.setItem(darkModeKey, JSON.stringify(darkMode));
        }
    }, [darkMode, darkModeKey, userEmail]);

    // Update currency to localStorage
    useEffect(() => {
        localStorage.setItem(currencyKey, currency);
    }, [currency, currencyKey]);

    // Update language to localStorage and HTML tag
    useEffect(() => {
        localStorage.setItem(languageKey, language);
        document.documentElement.lang = language;
    }, [language, languageKey]);

    // Update conversion rates (using approximate rates)
    const conversionRates = {
        usd: 1,
        eur: 0.85,
        gbp: 0.73,
        inr: 87.0, // Indian Rupee conversion rate
    };

    // Update currency symbols
    const symbols = {
        usd: "$",
        eur: "€",
        gbp: "£",
        inr: "₹",
    };

    // Update the formatCurrency function to handle Indian Rupees formatting
    const formatCurrency = (amount) => {
        const convertedAmount = amount * conversionRates[currency];

        if (currency === "inr") {
            // Indian number formatting (e.g., 1,00,000)
            return `₹${convertedAmount.toLocaleString("en-IN")}`;
        }

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
            currencyDisplay: "symbol",
        }).format(convertedAmount);
    };

    // Update the translations object
    const translations = {
        english: {
            // Profile Page Tabs
            personalInfo: "Personal Info",
            rentalHistory: "Rental History",
            preferences: "Preferences",
            paymentMethods: "Payment Methods",
            settings: "Settings",

            // Profile Page Content
            fullName: "Full Name",
            email: "Email",
            phone: "Phone",
            address: "Address",
            driversLicense: "Driver's License",
            joinDate: "Member since",
            editProfile: "Edit Profile",
            saveChanges: "Save Changes",
            cancel: "Cancel",

            // Rental History
            totalRentals: "Total Rentals",
            viewAll: "View All",
            showLess: "Show Less",
            startDate: "Start Date",
            endDate: "End Date",
            totalPrice: "Total Price",
            cancelBooking: "Cancel Booking",
            noBookings: "No bookings found",

            // Preferences
            preferredVehicles: "Preferred Vehicles",
            notificationPreferences: "Notification Preferences",
            emailNotifications: "Email Notifications",
            smsNotifications: "SMS Notifications",

            // Payment Methods
            savedPaymentMethods: "Saved Payment Methods",
            addNew: "Add New",
            cardholderName: "Cardholder Name",
            cardNumber: "Card Number",
            expiryDate: "Expiry Date",
            cvv: "CVV",

            // Settings
            darkMode: "Dark Mode",
            language: "Language",
            currency: "Currency",
            profileVisibility: "Profile Visibility",
            activityStatus: "Show Activity Status",

            // Navigation
            dashboard: "Dashboard",
            myBookings: "My Bookings",
            favourites: "Favourites",
            profile: "Profile",
            logout: "Logout",

            // Dashboard Sections
            premiumFleet: "Premium Fleet",
            latestAdditions: "Latest Additions",
            classicCollection: "Classic Collection",
            bookNow: "Book Now",
            noVehicles: "No vehicles available",

            // Footer
            contactUs: "Contact Us",
            support: "Support",
            privacyPolicy: "Privacy Policy",
            termsOfService: "Terms of Service",

            // Common
            save: "Save",
            remove: "Remove",
            default: "Default",
            makeDefault: "Make Default",
        },
    };

    // Function to get translation
    const translate = (key) => {
        return translations.english[key] || key;
    };

    // Enhanced logout function to properly handle dark mode
    const logout = () => {
        // Standard logout tasks
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");

        // Force light mode when logged out
        setDarkMode(false);
    };

    return (
        <SettingsContext.Provider
            value={{
                darkMode,
                setDarkMode,
                currency,
                setCurrency,
                language,
                setLanguage,
                formatCurrency,
                translate,
                logout,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
