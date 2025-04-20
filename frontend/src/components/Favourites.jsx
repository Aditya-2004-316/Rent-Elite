import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import { FaHeart } from "react-icons/fa";
import { vehicles } from "../data/vehicles";
import {
    FavouritesContext,
    FavouritesProvider,
} from "../context/FavouritesContext";
import CarDetailsModal from "./CarDetailsModal";
import ChatBot from "./ChatBot";
import { useSettings } from "../context/SettingsContext";
// import "../styles/modal.css"; // Import the modal styles

const Favourites = () => {
    const { favorites, setFavorites } = useContext(FavouritesContext);
    const { formatCurrency, darkMode } = useSettings();
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const favoriteCars = vehicles.filter((car) => favorites[car.id]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 3000);
    };

    const removeFavorite = (carId, carName) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = { ...prevFavorites };
            delete updatedFavorites[carId];
            showNotification(`${carName} removed from favourites`);
            return updatedFavorites;
        });
        setIsModalOpen(false);
    };

    const openModal = (car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                darkMode ? "bg-[#121212] text-[#E4E6EB]" : "bg-emerald-50"
            }`}
        >
            <div className="fixed top-0 left-0 right-0 z-10">
                <Navbar />
            </div>

            <div className="container mx-auto px-4 py-8 mt-24 flex-grow">
                <h2 className="text-4xl text-center font-bold mb-8">Favourites</h2>

                {favoriteCars.length === 0 ? (
                    <div className={`text-center py-12 ${
                        darkMode ? "text-[#B0B3B8]" : "text-gray-600"
                    }`}>
                        <p className="text-xl mb-4">You don't have any favourites yet.</p>
                        <p>When you add cars to your favourites, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteCars.map((car) => (
                            <div
                                key={car.id}
                                className={`rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 relative group cursor-pointer ${
                                    darkMode
                                        ? "bg-[#252525] text-[#E4E6EB] border border-[#393939] shadow-lg"
                                        : "bg-white shadow-md"
                                }`}
                                onClick={() => openModal(car)}
                            >
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-2">
                                        {car.name}
                                    </h3>
                                    <p
                                        className={`mb-2 transition-colors duration-200 ${
                                            darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {car.type}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p
                                            className={`font-bold text-lg ${
                                                darkMode
                                                    ? "text-[#0fa16d]"
                                                    : "text-[#0fa16d]"
                                            }`}
                                        >
                                            {formatCurrency(car.price)}/day
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFavorite(
                                                    car.id,
                                                    car.name
                                                );
                                            }}
                                            className={`py-1 px-3 rounded transition-colors duration-200 ${
                                                darkMode
                                                    ? "bg-red-600 hover:bg-red-700 text-dark-text"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                            }`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <CarDetailsModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                car={selectedCar}
                removeFavorite={removeFavorite}
            />
            
            {/* Footer is now in a div with mt-auto to push it to the bottom */}
            <div className="mt-auto">
                <Footer />
            </div>

            {/* Add the notification toast with higher z-index */}
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
            <ChatBot />
        </div>
    );
};

const FavouritesPage = () => (
    <FavouritesProvider>
        <Favourites />
    </FavouritesProvider>
);

export default FavouritesPage;
