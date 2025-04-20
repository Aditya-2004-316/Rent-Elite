import React from "react";
import Modal from "react-modal";
import {
    FaCar,
    FaTachometerAlt,
    FaCogs,
    FaGasPump,
    FaUsers,
    FaCalendarAlt,
    FaTimes,
    FaRegHeart,
    FaHeart,
} from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";

Modal.setAppElement("#root"); // Set the app element for accessibility

const CarDetailsModal = ({
    isOpen,
    onRequestClose,
    car,
    isFavorite,
    toggleFavorite,
    removeFavorite,
}) => {
    const { formatCurrency, darkMode } = useSettings();

    if (!isOpen || !car) return null;

    // We need to use custom styles to remove the white border
    const customStyles = {
        content: {
            backgroundColor: darkMode ? "#2a2a2a" : "white",
            border: darkMode ? "1px solid #2a2a2a" : "1px solid #ccc",
            padding: 0,
            borderRadius: "8px",
            overflow: "hidden",
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Car Details"
            style={customStyles}
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <div
                className={`flex h-full relative ${
                    darkMode ? "bg-[#2a2a2a]" : "bg-white"
                }`}
            >
                <button
                    onClick={onRequestClose}
                    className={`absolute top-2 right-2 z-10 ${
                        darkMode
                            ? "text-white hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                    } transition-colors`}
                >
                    <FaTimes className="text-2xl" />
                </button>
                <div className="w-8-10 p-4">
                    <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div
                    className={`w-2-10 p-4 mt-8 flex flex-col justify-between ${
                        darkMode ? "bg-[#2a2a2a]" : ""
                    }`}
                >
                    <div>
                        <h2
                            className={`text-2xl font-bold mb-8 ${
                                darkMode ? "text-white" : ""
                            }`}
                        >
                            {car.name}
                        </h2>
                        <p
                            className={`${
                                darkMode ? "text-white" : "text-gray-600"
                            } mb-4 flex items-center`}
                        >
                            <FaCar
                                className={`mr-2 ${
                                    darkMode ? "text-gray-300" : ""
                                }`}
                            />{" "}
                            Type: {car.type}
                        </p>
                        <p
                            className={`${
                                darkMode ? "text-white" : "text-gray-600"
                            } mb-4 flex items-center`}
                        >
                            <FaTachometerAlt
                                className={`mr-2 ${
                                    darkMode ? "text-gray-300" : ""
                                }`}
                            />{" "}
                            Top Speed: {car.specifications.topSpeed} mph
                        </p>
                        <p
                            className={`${
                                darkMode ? "text-white" : "text-gray-600"
                            } mb-4 flex items-center`}
                        >
                            <FaCogs
                                className={`mr-2 ${
                                    darkMode ? "text-gray-300" : ""
                                }`}
                            />{" "}
                            Transmission: {car.specifications.transmission}
                        </p>
                        <p
                            className={`${
                                darkMode ? "text-white" : "text-gray-600"
                            } mb-4 flex items-center`}
                        >
                            <FaGasPump
                                className={`mr-2 ${
                                    darkMode ? "text-gray-300" : ""
                                }`}
                            />{" "}
                            Fuel Type: {car.specifications.fuel}
                        </p>
                        <p
                            className={`${
                                darkMode ? "text-white" : "text-gray-600"
                            } mb-4 flex items-center`}
                        >
                            <FaUsers
                                className={`mr-2 ${
                                    darkMode ? "text-gray-300" : ""
                                }`}
                            />{" "}
                            Seats: {car.specifications.seats}
                        </p>
                        <p
                            className={`${
                                darkMode ? "text-white" : "text-gray-600"
                            } mb-4 flex items-center`}
                        >
                            <FaCalendarAlt
                                className={`mr-2 ${
                                    darkMode ? "text-gray-300" : ""
                                }`}
                            />{" "}
                            Year: {car.specifications.year}
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 mt-8 mb-6">
                            {formatCurrency(car.price)}/day
                        </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => removeFavorite(car.id)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                        >
                            Remove
                        </button>
                        <button
                            onClick={onRequestClose}
                            className={`${
                                darkMode
                                    ? "bg-[#444444] text-white hover:bg-[#555555]"
                                    : "bg-gray-500 text-white hover:bg-gray-600"
                            } py-2 px-4 rounded transition-colors`}
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CarDetailsModal;
