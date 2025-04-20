/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "dark-bg": "#121212", // Main background
                "dark-lighter": "#1E1E1E", // Slightly lighter background
                "dark-card": "#252525", // Card background
                "dark-input": "#2A2A2A", // Input field background
                "dark-text": "#E4E6EB", // Primary text
                "dark-muted": "#B0B3B8", // Secondary text
                "dark-accent": "#0fa16d", // Brand accent color
                "dark-accent2": "#10b981", // Secondary accent
                "dark-hover": "#333333", // Hover state
                "dark-border": "#393939", // Border color
                "dark-divider": "#323232", // Divider lines
                "dark-header": "#171717", // Header background
                "dark-gray-300": "#D1D5DB", // Lighter gray for better contrast
            },
            backgroundColor: {
                dark: "#1a1a1a",
                "dark-lighter": "#2d2d2d",
            },
            textColor: {
                dark: "#ffffff",
                "dark-lighter": "#e0e0e0",
            },
            boxShadow: {
                "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
                "dark-md":
                    "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
                "dark-lg":
                    "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
                "dark-inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.35)",
                "dark-outline": "0 0 0 3px rgba(15, 161, 109, 0.5)",
            },
            gradients: {
                "dark-gradient":
                    "linear-gradient(180deg, #1A1A1A 0%, #121212 100%)",
                "dark-card-gradient":
                    "linear-gradient(145deg, #252525 0%, #1E1E1E 100%)",
                "dark-accent-gradient":
                    "linear-gradient(135deg, #0fa16d 0%, #059669 100%)",
            },
            transitionDuration: {
                0: "0ms",
                150: "150ms", // Faster transitions
            },
        },
    },
    plugins: [],
};
