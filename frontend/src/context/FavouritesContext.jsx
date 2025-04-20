import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
    const { user } = useAuth();
    
    // Get the current user's email for user-specific storage
    const userEmail = user?.email || localStorage.getItem("userEmail");
    const storageKey = userEmail ? `favorites_${userEmail}` : "favorites";
    
    const [favorites, setFavorites] = useState(() => {
        // If no user is logged in, return empty object
        if (!userEmail) return {};
        
        // Special case for adityavishwakarma0316@gmail.com - migrate data if needed
        if (userEmail === "adityavishwakarma0316@gmail.com") {
            // Check if we need to migrate the data from the old storage key
            const oldFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
            const userFavorites = JSON.parse(localStorage.getItem(storageKey)) || {};
            
            // If there's data in the old storage but not in the user-specific one, migrate it
            if (Object.keys(oldFavorites).length > 0 && Object.keys(userFavorites).length === 0) {
                localStorage.setItem(storageKey, JSON.stringify(oldFavorites));
                console.log("Migrated favorites data for adityavishwakarma0316@gmail.com");
                return oldFavorites;
            }
        }
        
        // Retrieve user-specific favorites from local storage if available
        const savedFavorites = localStorage.getItem(storageKey);
        return savedFavorites ? JSON.parse(savedFavorites) : {};
    });

    useEffect(() => {
        // Save favorites to local storage whenever it changes, but only if user is logged in
        if (userEmail) {
            localStorage.setItem(storageKey, JSON.stringify(favorites));
        }
    }, [favorites, storageKey, userEmail]);

    return (
        <FavouritesContext.Provider value={{ favorites, setFavorites }}>
            {children}
        </FavouritesContext.Provider>
    );
};
