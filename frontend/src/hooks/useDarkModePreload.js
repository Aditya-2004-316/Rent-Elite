import { useEffect } from "react";

// This hook preloads dark mode settings at the component level
// for faster loading when navigating between pages
export default function useDarkModePreload() {
    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            const darkModeKey = `darkMode_${userEmail}`;
            const darkMode = localStorage.getItem(darkModeKey);

            if (darkMode === "true") {
                // Pre-apply dark mode before component fully renders
                document.documentElement.classList.add("dark");
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#E4E6EB";
            }
        }
    }, []);
}
