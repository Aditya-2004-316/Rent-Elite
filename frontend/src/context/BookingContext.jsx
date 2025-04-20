import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const BookingContext = createContext();

export const useBookings = () => {
    return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    
    // Get the current user's email for user-specific storage
    const userEmail = user?.email || localStorage.getItem("userEmail");
    const storageKey = userEmail ? `bookings_${userEmail}` : "bookings";
    
    // Special case for adityavishwakarma0316@gmail.com - migrate data if needed
    useEffect(() => {
        if (userEmail === "adityavishwakarma0316@gmail.com") {
            // Check if we need to migrate the data from the old storage key
            const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];
            const userBookings = JSON.parse(localStorage.getItem(`bookings_${userEmail}`)) || [];
            
            // If there's data in the old storage but not in the user-specific one, migrate it
            if (oldBookings.length > 0 && userBookings.length === 0) {
                localStorage.setItem(`bookings_${userEmail}`, JSON.stringify(oldBookings));
                console.log("Migrated bookings data for adityavishwakarma0316@gmail.com");
            }
        }
    }, [userEmail]);

    // Load bookings based on the current user
    useEffect(() => {
        if (userEmail) {
            let savedBookings = JSON.parse(localStorage.getItem(storageKey)) || [];
            
            // Special handling for adityavishwakarma0316@gmail.com to clean up bookings
            if (userEmail === "adityavishwakarma0316@gmail.com") {
                // Filter out invalid bookings and deduplicate by car ID
                const validBookings = savedBookings.filter(booking => 
                    booking && booking.car && booking.car.id && booking.car.name
                );
                
                // Deduplicate bookings by car ID to ensure unique car bookings
                const uniqueBookings = [];
                const carIds = new Set();
                
                for (const booking of validBookings) {
                    if (!carIds.has(booking.car.id)) {
                        carIds.add(booking.car.id);
                        uniqueBookings.push(booking);
                    }
                }
                
                // Update localStorage if we found and removed invalid or duplicate bookings
                if (uniqueBookings.length !== savedBookings.length) {
                    localStorage.setItem(storageKey, JSON.stringify(uniqueBookings));
                    console.log(`Cleaned up bookings for adityavishwakarma0316@gmail.com: Removed ${savedBookings.length - uniqueBookings.length} invalid or duplicate bookings`);
                }
                
                savedBookings = uniqueBookings;
            }
            
            setBookings(savedBookings);
        } else {
            setBookings([]);
        }
    }, [userEmail, storageKey]);

    const addBooking = (booking) => {
        if (!userEmail) return; // Don't save if no user is logged in
        
        // Ensure the booking has valid car data
        if (!booking.car || !booking.car.id || !booking.car.name) {
            console.error("Cannot add booking with invalid car data:", booking);
            return;
        }
        
        const updatedBookings = [...bookings, booking];
        setBookings(updatedBookings);
        localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    };

    const cancelBooking = (id) => {
        if (!userEmail) return; // Don't save if no user is logged in
        
        const updatedBookings = bookings.filter((booking) => booking.id !== id);
        setBookings(updatedBookings);
        localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
    };

    return (
        <BookingContext.Provider
            value={{ bookings, addBooking, cancelBooking, setBookings }}
        >
            {children}
        </BookingContext.Provider>
    );
};
