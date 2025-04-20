import React, { useState, useEffect } from "react";
import {
    FaCar,
    FaTachometerAlt,
    FaCogs,
    FaGasPump,
    FaUsers,
    FaCalendarAlt,
} from "react-icons/fa";
import { useBookings } from "../context/BookingContext";
import { useSettings } from "../context/SettingsContext";

const BookingModal = ({
    car,
    isOpen,
    onClose,
    onConfirm,
    onCancelBooking,
    startDate,
    endDate,
    totalPrice,
    isBookingView,
}) => {
    const [localStartDate, setLocalStartDate] = useState(startDate || "");
    const [localEndDate, setLocalEndDate] = useState(endDate || "");
    const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(
        totalPrice || 0
    );
    const [scale, setScale] = useState(1);
    const { addBooking } = useBookings();
    const { formatCurrency, darkMode } = useSettings();

    // Add notification states
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    // Add notification handler
    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 3000);
    };

    useEffect(() => {
        setLocalStartDate(startDate || "");
        setLocalEndDate(endDate || "");
        setCalculatedTotalPrice(totalPrice || 0);
    }, [startDate, endDate, totalPrice]);

    useEffect(() => {
        setCalculatedTotalPrice(
            calculateTotalPrice(localStartDate, localEndDate, car.price)
        );
    }, [localStartDate, localEndDate, car.price]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const bookingDetails = {
            car,
            startDate: localStartDate,
            endDate: localEndDate,
            totalPrice: calculatedTotalPrice,
        };

        onConfirm(bookingDetails);
        showNotification(
            `Successfully booked ${car.name} from ${new Date(
                localStartDate
            ).toLocaleDateString()} to ${new Date(
                localEndDate
            ).toLocaleDateString()}`
        );
        onClose();
    };

    const handleCancelBooking = () => {
        onCancelBooking();
        showNotification(`Booking for ${car.name} has been cancelled`);
        onClose();
    };

    const handleZoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 2));
    };

    const handleZoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
    };

    const calculateTotalPrice = (start, end, pricePerDay) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
            return 0;
        }
        const timeDiff = endDate - startDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff * pricePerDay;
    };

    const carsNeedingContain = [
        "Bugatti Chiron",
        "Pagani Huayra",
        "Ferrari SF90 Stradale",
        "Maserati MC20",
        "Porsche Taycan Turbo S",
        "Lamborghini Sián",
        "Ferrari 812 Competizione",
        "Audi R8",
        "Aston Martin DBS",
        "Lexus LC 500",
        "BMW XM",
        "Pagani Imola",
        "Koenigsegg Gemera",
        "Rolls-Royce Spectre",
        "Bentley Batur",
    ];

    const imageObjectFit = carsNeedingContain.includes(car.name)
        ? "object-contain"
        : "object-cover";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className={`${
                    darkMode ? "bg-[#1a1a1a] text-[#e0e0e0]" : "bg-white"
                } rounded-lg w-[86%] h-[86vh] overflow-hidden flex relative transition-colors duration-300`}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center ${
                        darkMode
                            ? "bg-[#333333] text-[#e0e0e0]"
                            : "bg-white text-gray-700"
                    } rounded-full shadow-md hover:bg-gray-800 hover:text-white transition-colors z-50 text-3xl`}
                >
                    ×
                </button>

                {/* Left section - Car Image */}
                <div
                    className={`w-[70%] p-4 ${
                        darkMode ? "bg-[#252525]" : "bg-gray-100"
                    } flex items-center justify-center relative overflow-hidden transition-colors duration-300`}
                >
                    {/* Zoom controls */}
                    <div className="absolute top-6 left-6 flex space-x-2 z-10">
                        <button
                            onClick={handleZoomIn}
                            className={`${
                                darkMode
                                    ? "bg-[#333333] text-[#e0e0e0] hover:bg-[#444444]"
                                    : "bg-white hover:bg-gray-100"
                            } w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors`}
                        >
                            +
                        </button>
                        <button
                            onClick={handleZoomOut}
                            className={`${
                                darkMode
                                    ? "bg-[#333333] text-[#e0e0e0] hover:bg-[#444444]"
                                    : "bg-white hover:bg-gray-100"
                            } w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors`}
                        >
                            −
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <img
                            src={car.image}
                            alt={car.name}
                            className={`w-full h-full ${imageObjectFit} transition-transform duration-200`}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "100%",
                                height: "100%",
                                transform: `scale(${scale})`,
                            }}
                        />
                    </div>
                </div>

                {/* Right section - Car Information and Booking Details */}
                <div
                    className={`w-[30%] p-6 ${
                        darkMode ? "bg-[#2a2a2a]" : "bg-gray-50"
                    } overflow-y-auto transition-colors duration-300`}
                >
                    {/* Car Name */}
                    <h2 className="text-2xl font-bold mb-6">{car.name}</h2>

                    {/* Car Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <FaCar
                                className={
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                }
                            />
                            <span>{car.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaGasPump
                                className={
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                }
                            />
                            <span>{car.specifications.fuel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTachometerAlt
                                className={
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                }
                            />
                            <span>{car.specifications.topSpeed} mph</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers
                                className={
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                }
                            />
                            <span>{car.specifications.seats} seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCogs
                                className={
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                }
                            />
                            <span>{car.specifications.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt
                                className={
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                }
                            />
                            <span>{car.specifications.year}</span>
                        </div>
                    </div>

                    {/* Rental Duration */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold">Rental Duration</h3>
                        <div>
                            <label
                                className={`block ${
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                } mb-1`}
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={localStartDate}
                                onChange={(e) =>
                                    setLocalStartDate(e.target.value)
                                }
                                className={`w-full ${
                                    darkMode
                                        ? "bg-[#333333] border-[#444444] text-[#e0e0e0] calendar-white"
                                        : "bg-white border-gray-300"
                                } border rounded-md p-2`}
                                min={new Date().toISOString().split("T")[0]}
                                disabled={isBookingView}
                                style={darkMode ? { colorScheme: "dark" } : {}}
                            />
                        </div>
                        <div>
                            <label
                                className={`block ${
                                    darkMode
                                        ? "text-[#a0a0a0]"
                                        : "text-gray-600"
                                } mb-1`}
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                value={localEndDate}
                                onChange={(e) =>
                                    setLocalEndDate(e.target.value)
                                }
                                className={`w-full ${
                                    darkMode
                                        ? "bg-[#333333] border-[#444444] text-[#e0e0e0] calendar-white"
                                        : "bg-white border-gray-300"
                                } border rounded-md p-2`}
                                min={
                                    localStartDate
                                        ? new Date(
                                              new Date(
                                                  localStartDate
                                              ).getTime() + 86400000
                                          )
                                              .toISOString()
                                              .split("T")[0]
                                        : new Date().toISOString().split("T")[0]
                                }
                                disabled={isBookingView}
                                style={darkMode ? { colorScheme: "dark" } : {}}
                            />
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Total Price</h3>
                        <p className="text-2xl font-semibold text-emerald-600">
                            {formatCurrency(calculatedTotalPrice)}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col space-y-3">
                        {isBookingView ? (
                            <button
                                onClick={handleCancelBooking}
                                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Cancel Booking
                            </button>
                        ) : (
                            <button
                                onClick={handleConfirm}
                                className="bg-[#0fa16d] text-white px-6 py-2 rounded hover:bg-green-600 w-full"
                                disabled={!localStartDate || !localEndDate}
                            >
                                Confirm Booking
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`${
                                darkMode
                                    ? "bg-[#444444] text-[#e0e0e0] hover:bg-[#555555]"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                            } px-6 py-2 rounded w-full transition-colors`}
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Notification Toast */}
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
        </div>
    );
};

export default BookingModal;
