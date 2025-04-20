import React from "react";
import { vehicles } from "../data/vehicles";
import { useSettings } from "../context/SettingsContext";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";

const Fleet = () => {
    const { darkMode } = useSettings();

    return (
        <div
            className={`min-h-screen ${
                darkMode ? "bg-dark text-white" : "bg-white text-gray-900"
            }`}
        >
            <LandingNavbar />

            {/* Fleet Grid Section */}
            <div className="container mx-auto px-4 py-28">
                <h1 className="text-4xl font-bold text-center mb-12">
                    Our Luxury Fleet
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className={`rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
                                darkMode ? "bg-dark-lighter" : "bg-white"
                            }`}
                        >
                            <div className="relative h-48">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {vehicle.name}
                                </h3>
                                <p
                                    className={`${
                                        darkMode
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {vehicle.type}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default Fleet;
