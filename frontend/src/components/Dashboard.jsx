import React, { useState, useEffect, useContext } from "react";
import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import newCar from "../assets/newcar.png";
import carFleet from "../assets/carfleet.png";
import classic from "../assets/classic.png";
import Navbar from "./Navbar";
import FiltersSidebar from "./FiltersSidebar";
import CarImageModal from "./CarImageModal";
import { vehicles } from "../data/vehicles";
import BookingModal from "./BookingModal";
import { useBookings } from "../context/BookingContext";
import {
    FavouritesContext,
    FavouritesProvider,
} from "../context/FavouritesContext";
import { v4 as uuidv4 } from "uuid";
import Footer from "./Footer";
import { useSettings } from "../context/SettingsContext";
import ChatBot from "./ChatBot";
import { LazyLoadImage } from "react-lazy-load-image-component";
import More from "../assets/more.png";
import "react-lazy-load-image-component/src/effects/blur.css";

const companyNameMappings = {
    Mercedes: "Mercedes",
    "Mercedes-AMG": "Mercedes",
    "Mercedes-Maybach": "Mercedes",
    Aston: "Aston Martin",
    Mclaren: "McLaren",
};

const getCompanyName = (carName) => {
    const firstWord = carName.split(" ")[0];
    return companyNameMappings[firstWord] || firstWord;
};

const featuredVehicles = [
    "Bugatti Bolide",
    "Pagani Utopia",
    "Koenigsegg Gemera",
    "Ferrari SF90 Stradale",
    "Aston Martin Valkyrie",
    "Mercedes-AMG ONE",
    "Rolls-Royce Phantom",
    "Bentley Batur",
    "McLaren P1",
    "Lamborghini Sián",
    "Maserati GranTurismo Folgore",
    "Audi RS7 Sportback",
];

const newArrivals = [
    "Lamborghini Aventador SVJ",
    "BMW M8 Competition",
    "Pagani Imola",
    "Porsche Taycan Turbo S",
    "McLaren Artura",
    "Lotus Emira",
    "Bugatti Mistral",
    "Audi RS e-tron GT",
    "Rimac Concept Two",
    "Aston Martin Valhalla",
    "Rolls-Royce Spectre",
    "Lexus LFA Successor",
];

const Dashboard = () => {
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedBookingCar, setSelectedBookingCar] = useState(null);
    const [notification, setNotification] = useState("");
    const [notificationVisible, setNotificationVisible] = useState(false);
    const { bookings, addBooking } = useBookings();
    const { favorites, setFavorites } = useContext(FavouritesContext);
    const { translate, formatCurrency, darkMode } = useSettings();
    const [showAllFeatured, setShowAllFeatured] = useState(false);
    const [showAllNewArrivals, setShowAllNewArrivals] = useState(false);
    const [showAllClassic, setShowAllClassic] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector("footer");
            const sidebar = document.querySelector("#filters-sidebar");
            const footerRect = footer.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();

            if (footerRect.top <= window.innerHeight) {
                sidebar.style.position = "fixed";
                sidebar.style.top = "auto";
                sidebar.style.bottom = `${
                    window.innerHeight - footerRect.top
                }px`;
                sidebar.style.overflowY = "scroll";
            } else {
                sidebar.style.position = "fixed";
                sidebar.style.top = "6.5rem"; // Adjusted top margin to avoid hiding behind the navbar
                sidebar.style.bottom = "auto";
                sidebar.style.overflowY = "hidden";
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleFilterChange = (filters) => {
        let filtered = [...vehicles];

        // Company filter
        if (filters.company) {
            filtered = filtered.filter((vehicle) => {
                const companyName = getCompanyName(vehicle.name);
                return (
                    companyName.toLowerCase() === filters.company.toLowerCase()
                );
            });
        }

        // Search term filter
        if (filters.searchTerm) {
            filtered = filtered.filter((vehicle) => {
                const companyName = getCompanyName(vehicle.name);
                return companyName
                    .toLowerCase()
                    .includes(filters.searchTerm.toLowerCase());
            });
        }

        // Price filter (minimum price)
        if (filters.priceRange > 0) {
            filtered = filtered.filter(
                (vehicle) => vehicle.price >= parseInt(filters.priceRange)
            );
        }

        // Fuel type filter
        if (filters.fuelType) {
            filtered = filtered.filter(
                (vehicle) => vehicle.specifications.fuel === filters.fuelType
            );
        }

        // Transmission filter
        if (filters.transmission) {
            filtered = filtered.filter(
                (vehicle) =>
                    vehicle.specifications.transmission === filters.transmission
            );
        }

        // Car type filter
        if (filters.carType) {
            filtered = filtered.filter(
                (vehicle) => vehicle.type === filters.carType
            );
        }

        setFilteredVehicles(filtered);
    };

    const handleCarClick = (car) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleBooking = (car) => {
        setSelectedBookingCar(car);
        setIsBookingModalOpen(true);
    };

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 3000);
    };

    const handleBookingConfirm = (bookingDetails) => {
        const { startDate, endDate, totalPrice } = bookingDetails;
        const newBooking = {
            id: uuidv4(),
            car: selectedBookingCar,
            startDate,
            endDate,
            totalPrice,
        };
        addBooking(newBooking);
        setIsBookingModalOpen(false);
        setSelectedBookingCar(null);

        // Show success notification
        showNotification(
            `Successfully booked ${selectedBookingCar.name} from ${new Date(
                startDate
            ).toLocaleDateString()} to ${new Date(
                endDate
            ).toLocaleDateString()}`
        );
    };

    const handleBookingClose = () => {
        setIsBookingModalOpen(false);
        setSelectedBookingCar(null);
    };

    const toggleFavorite = (carId, carName) => {
        setFavorites((prevFavorites) => {
            const isFavorite = !prevFavorites[carId];
            setNotification(
                `${carName} ${
                    isFavorite ? "added to" : "removed from"
                } favourites`
            );
            setNotificationVisible(true);
            setTimeout(() => {
                setNotificationVisible(false);
            }, 3000);
            return {
                ...prevFavorites,
                [carId]: isFavorite,
            };
        });
    };

    const renderVehicles = (vehicles, label) => {
        return vehicles.map((car) => (
            <div
                key={car.id}
                className={`rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 relative group ${
                    darkMode
                        ? "bg-[#252525] text-[#E4E6EB] border border-[#393939] shadow-lg"
                        : "bg-white shadow-md"
                }`}
            >
                <LazyLoadImage
                    src={car.image}
                    alt={car.name}
                    effect="blur"
                    className="w-full h-48 object-cover"
                    threshold={300}
                    placeholderSrc="/placeholder-car.jpg"
                    onClick={() => handleCarClick(car)}
                    wrapperClassName="w-full h-48"
                    style={{ objectFit: "cover" }}
                />
                <div
                    className={`absolute top-2 right-2 text-white text-xs py-1 px-2 rounded hidden group-hover:block ${
                        label === "Featured"
                            ? "bg-yellow-500"
                            : label === "New"
                            ? "bg-orange-500"
                            : "bg-green-500"
                    }`}
                >
                    {label || "Classic"}
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{car.name}</h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(car.id, car.name);
                            }}
                        >
                            {favorites[car.id] ? (
                                <FaHeart className="text-2xl text-red-500" />
                            ) : (
                                <FaRegHeart className="text-2xl text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p
                        className={`text-gray-600 mb-2 transition-colors duration-200 ${
                            darkMode ? "text-[#B0B3B8]" : ""
                        }`}
                    >
                        {car.type}
                    </p>
                    <div className="flex items-center justify-between">
                        <p
                            className={`font-bold text-lg ${
                                darkMode ? "text-[#0fa16d]" : "text-[#0fa16d]"
                            }`}
                        >
                            {formatCurrency(car.price)}/day
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBooking(car);
                            }}
                            className={`py-1 px-3 rounded transition-colors duration-200 ${
                                darkMode
                                    ? "bg-[#0fa16d] hover:bg-[#10b981] text-[#E4E6EB]"
                                    : "bg-[#0fa16d] hover:bg-green-600 text-white"
                            }`}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    const featuredCars = filteredVehicles.filter((vehicle) =>
        featuredVehicles.includes(vehicle.name)
    );

    const newArrivalCars = filteredVehicles.filter((vehicle) =>
        newArrivals.includes(vehicle.name)
    );

    const otherOptions = filteredVehicles.filter(
        (vehicle) =>
            !featuredVehicles.includes(vehicle.name) &&
            !newArrivals.includes(vehicle.name)
    );

    const getVisibleSectionsCount = () => {
        let count = 0;
        if (featuredCars.length > 0) count++;
        if (newArrivalCars.length > 0) count++;
        if (otherOptions.length > 0) count++;
        return count;
    };

    const toggleSection = (section) => {
        if (section === "featured") {
            setShowAllFeatured(!showAllFeatured);
        } else if (section === "newArrivals") {
            setShowAllNewArrivals(!showAllNewArrivals);
        } else if (section === "classic") {
            setShowAllClassic(!showAllClassic);
        }
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
            <div className="flex mt-24">
                <div
                    id="filters-sidebar"
                    className="fixed top-26 left-0 h-[calc(100vh-105px)] w-76 mb-10 z-9 overflow-hidden custom-scrollbar"
                >
                    <FiltersSidebar
                        onFilterChange={handleFilterChange}
                        darkMode={darkMode}
                    />
                </div>
                <div
                    className={`flex-grow ml-80 p-4 ${
                        getVisibleSectionsCount() > 1 ? "" : "mb-[100vh]"
                    }`}
                >
                    {filteredVehicles.length === 0 ? (
                        <p className="text-gray-600 text-center">
                            No vehicles available.
                        </p>
                    ) : (
                        <>
                            {featuredCars.length > 0 && (
                                <>
                                    <div
                                        className={`flex justify-between items-center mb-6 p-2 rounded shadow transition-colors duration-300 
                                        ${
                                            darkMode
                                                ? "bg-yellow-900 text-white"
                                                : "bg-yellow-100 text-gray-900"
                                        }`}
                                    >
                                        <h2 className="text-3xl font-bold flex items-center">
                                            <img
                                                src={carFleet}
                                                alt="Car Fleet Icon"
                                                className="mr-4 w-10 h-10"
                                            />
                                            Premium Fleet
                                        </h2>
                                        {featuredCars.length > 9 && (
                                            <button
                                                onClick={() =>
                                                    toggleSection("featured")
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                                                ${
                                                    darkMode
                                                        ? "bg-yellow-800 hover:bg-yellow-700"
                                                        : "bg-yellow-200 hover:bg-yellow-300"
                                                } 
                                                transition-colors duration-200`}
                                            >
                                                {showAllFeatured
                                                    ? "Show Less"
                                                    : "More"}
                                                {/* <FaChevronDown
                                                    className={`transition-transform duration-300 
                                                    ${
                                                        showAllFeatured
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                /> */}
                                                <img
                                                    src={More}
                                                    alt="More Icon"
                                                    className="transition-transform duration-300 w-5 h-5"
                                                />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renderVehicles(
                                            featuredCars.slice(
                                                0,
                                                showAllFeatured
                                                    ? featuredCars.length
                                                    : 9
                                            ),
                                            "Featured"
                                        )}
                                    </div>
                                </>
                            )}
                            {newArrivalCars.length > 0 && (
                                <>
                                    <div
                                        className={`flex justify-between items-center ${
                                            featuredCars.length === 0
                                                ? "mb-6"
                                                : "mt-8 mb-6"
                                        } p-2 rounded shadow transition-colors duration-300 
                                    ${
                                        darkMode
                                            ? "bg-orange-900 text-white"
                                            : "bg-orange-100 text-gray-900"
                                    }`}
                                    >
                                        <h2 className="text-3xl font-bold flex items-center">
                                            <img
                                                src={newCar}
                                                alt="New Car Icon"
                                                className="mr-4 w-10 h-10"
                                            />
                                            Latest Additions
                                        </h2>
                                        {newArrivalCars.length > 9 && (
                                            <button
                                                onClick={() =>
                                                    toggleSection("newArrivals")
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                                                ${
                                                    darkMode
                                                        ? "bg-orange-800 hover:bg-orange-700"
                                                        : "bg-orange-200 hover:bg-orange-300"
                                                } 
                                                transition-colors duration-200`}
                                            >
                                                {showAllNewArrivals
                                                    ? "Show Less"
                                                    : "More"}
                                                {/* <FaChevronDown
                                                    className={`transition-transform duration-300 
                                                    ${
                                                        showAllNewArrivals
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                /> */}
                                                <img
                                                    src={More}
                                                    alt="More Icon"
                                                    className="transition-transform duration-300 w-5 h-5"
                                                />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renderVehicles(
                                            newArrivalCars.slice(
                                                0,
                                                showAllNewArrivals
                                                    ? newArrivalCars.length
                                                    : 9
                                            ),
                                            "New"
                                        )}
                                    </div>
                                </>
                            )}
                            {otherOptions.length > 0 && (
                                <>
                                    <div
                                        className={`flex justify-between items-center ${
                                            featuredCars.length === 0 &&
                                            newArrivalCars.length === 0
                                                ? "mb-6"
                                                : "mt-8 mb-6"
                                        } p-2 rounded shadow transition-colors duration-300 
                                    ${
                                        darkMode
                                            ? "bg-green-900 text-white"
                                            : "bg-green-100 text-gray-900"
                                    }`}
                                    >
                                        <h2 className="text-3xl font-bold flex items-center">
                                            <img
                                                src={classic}
                                                alt="Classic Icon"
                                                className="mr-4 w-8 h-8"
                                            />
                                            Classic Collection
                                        </h2>
                                        {otherOptions.length > 18 && (
                                            <button
                                                onClick={() =>
                                                    toggleSection("classic")
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                                                ${
                                                    darkMode
                                                        ? "bg-green-800 hover:bg-green-700"
                                                        : "bg-green-200 hover:bg-green-300"
                                                } 
                                                transition-colors duration-200`}
                                            >
                                                {showAllClassic
                                                    ? "Show Less"
                                                    : "More"}
                                                {/* <FaChevronDown
                                                    className={`transition-transform duration-300 
                                                    ${
                                                        showAllClassic
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                /> */}
                                                <img
                                                    src={More}
                                                    alt="More Icon"
                                                    className="transition-transform duration-300 w-5 h-5"
                                                />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renderVehicles(
                                            otherOptions.slice(
                                                0,
                                                showAllClassic
                                                    ? otherOptions.length
                                                    : 18
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            {selectedCar && (
                <CarImageModal
                    image={selectedCar.image}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
            {isBookingModalOpen && selectedBookingCar && (
                <BookingModal
                    car={selectedBookingCar}
                    isOpen={isBookingModalOpen}
                    onClose={handleBookingClose}
                    onConfirm={handleBookingConfirm}
                />
            )}
            {notificationVisible && notification && (
                <div
                    className={`fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-[60] flex items-center space-x-2 ${
                        notificationVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                    }`}
                >
                    <span className="text-xl">✓</span>
                    <span>{notification}</span>
                </div>
            )}
            <div className="mt-10">
                <Footer />
            </div>
            <ChatBot />
        </div>
    );
};

const DashboardPage = () => (
    <FavouritesProvider>
        <Dashboard />
    </FavouritesProvider>
);

export default DashboardPage;
