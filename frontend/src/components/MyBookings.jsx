import React, { useEffect, useState } from "react";
import { useBookings } from "../context/BookingContext";
import Navbar from "./Navbar";
import BookingModal from "./BookingModal";
import { vehicles } from "../data/vehicles";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import { useSettings } from "../context/SettingsContext";

const MyBookings = () => {
    const { bookings, cancelBooking, setBookings } = useBookings();
    const { darkMode, formatCurrency } = useSettings();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 3000);
    };

    useEffect(() => {
        // Update car images in local storage if they have changed
        const updatedBookings = bookings.map((booking) => {
            if (booking.car) {
                const updatedCar = vehicles.find(
                    (vehicle) => vehicle.id === booking.car.id
                );
                if (updatedCar && updatedCar.image !== booking.car.image) {
                    return {
                        ...booking,
                        car: { ...booking.car, image: updatedCar.image },
                    };
                }
            }
            return booking;
        });

        // Get the current user email
        const userEmail = localStorage.getItem("userEmail");
        // Create the user-specific storage key
        const storageKey = userEmail ? `bookings_${userEmail}` : "bookings";

        // Update local storage and state if there are any changes
        if (JSON.stringify(updatedBookings) !== JSON.stringify(bookings)) {
            setBookings(updatedBookings);
            localStorage.setItem(storageKey, JSON.stringify(updatedBookings));
        }
    }, [bookings, setBookings]);

    const handleCardClick = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleCancelBooking = (bookingId, carName) => {
        cancelBooking(bookingId);
        showNotification(
            `Booking for ${carName} has been cancelled successfully`
        );
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${
                darkMode ? "bg-[#121212] text-[#E4E6EB]" : "bg-emerald-50"
            }`}
        >
            <div className="fixed top-0 left-0 right-0 z-10">
                <Navbar />
            </div>
            <div className="container mx-auto px-4 py-8 mt-24 flex-grow">
                <h2 className="text-4xl text-center font-bold mb-8">My Bookings</h2>

                {bookings.length === 0 ? (
                    <div
                        className={`text-center py-12 ${
                            darkMode ? "text-[#B0B3B8]" : "text-gray-600"
                        }`}
                    >
                        <p className="text-xl mb-4">No bookings found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings
                            .filter((booking) => booking.car)
                            .map((booking) => (
                                <div
                                    key={booking.id}
                                    className={`rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                                        darkMode
                                            ? "bg-[#252525] text-[#E4E6EB] border border-[#393939] shadow-lg"
                                            : "bg-white shadow-md"
                                    }`}
                                    onClick={() => handleCardClick(booking)}
                                >
                                    <img
                                        src={booking.car.image}
                                        alt={booking.car.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold mb-2">
                                            {booking.car.name}
                                        </h3>
                                        <p
                                            className={`mb-2 transition-colors duration-200 ${
                                                darkMode
                                                    ? "text-[#B0B3B8]"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            Start Date:{" "}
                                            {new Date(
                                                booking.startDate
                                            ).toLocaleDateString()}
                                        </p>
                                        <p
                                            className={`mb-2 ${
                                                darkMode
                                                    ? "text-[#B0B3B8]"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            End Date:{" "}
                                            {new Date(
                                                booking.endDate
                                            ).toLocaleDateString()}
                                        </p>
                                        <p
                                            className={`font-semibold ${
                                                darkMode
                                                    ? "text-[#0fa16d]"
                                                    : "text-[#0fa16d]"
                                            }`}
                                        >
                                            Total Price:{" "}
                                            {formatCurrency(booking.totalPrice)}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelBooking(
                                                    booking.id,
                                                    booking.car.name
                                                );
                                            }}
                                            className={`mt-4 w-full px-4 py-2 rounded transition-colors duration-200 ${
                                                darkMode
                                                    ? "bg-red-600 hover:bg-red-700 text-[#E4E6EB]"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                            }`}
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {selectedBooking && (
                <BookingModal
                    car={selectedBooking.car}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCancelBooking={() => {
                        handleCancelBooking(
                            selectedBooking.id,
                            selectedBooking.car.name
                        );
                        closeModal();
                    }}
                    startDate={selectedBooking.startDate}
                    endDate={selectedBooking.endDate}
                    totalPrice={selectedBooking.totalPrice}
                    isBookingView={true}
                />
            )}

            {notificationVisible && notification && (
                <div
                    className={`fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-[100] flex items-center space-x-2 ${
                        notificationVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                    }`}
                >
                    <span className="text-xl">✓</span>
                    <span>{notification}</span>
                </div>
            )}

            <div className="mt-auto">
                <Footer />
            </div>
            <ChatBot />
        </div>
    );
};

export default MyBookings;
