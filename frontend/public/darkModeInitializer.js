// This script runs before React loads to prevent flashing
(function () {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
        const darkModeKey = `darkMode_${userEmail}`;
        const darkMode = localStorage.getItem(darkModeKey);

        if (darkMode === "true") {
            document.documentElement.classList.add("dark");
            document.body.style.backgroundColor = "#121212";
            document.body.style.color = "#E4E6EB";
        }
    }
})();
