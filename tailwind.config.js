module.exports = {
    // ... other config
    theme: {
        extend: {
            colors: {
                mint: {
                    50: "#f8fdfb",
                    100: "#f0fbf7", // This is the mint color we're using
                    200: "#ccf2e3",
                    300: "#99e6cb",
                    400: "#4dcca3",
                    500: "#19b37b",
                    600: "#0fa16d",
                    700: "#0d855a",
                    800: "#0b6a48",
                    900: "#09573b",
                },
                pear: "#e8f3d6", // A soft pear green color
                parakeet: "#d4f2e7", // A soft parakeet green color
                "bright-green": "#3FFF00", // Bright green color
                pearl: "#F8FCF8", // Pearl white color
            },
            spacing: {
                84: "21rem", // To account for sidebar width (80) + margin
            },
        },
    },
};
