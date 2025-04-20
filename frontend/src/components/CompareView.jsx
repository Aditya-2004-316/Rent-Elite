import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react"; // Added useRef
import Navbar from "./Navbar";
import {
    FaCarAlt,
    FaGasPump,
    FaCogs,
    FaUsers,
    FaTachometerAlt,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaTimes,
    FaStar,
    FaThumbsUp,
} from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import { vehicles } from "../data/vehicles";
import ChatBot from "./ChatBot";
import Footer from "./Footer";

const CompareView = () => {
    const { darkMode, formatCurrency } = useSettings();
    const [selectedCars, setSelectedCars] = useState([null, null, null]);
    const [availableCars, setAvailableCars] = useState([]);
    const [originalOrder, setOriginalOrder] = useState([]);
    const [draggedCar, setDraggedCar] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // Ref to store the current scroll handler function to ensure removal works correctly
    const scrollHandlerRef = useRef(null);

    // Initialize available cars and store original order when component mounts
    useEffect(() => {
        const initialVehicles = vehicles.filter(Boolean);
        setAvailableCars([...initialVehicles]);
        setOriginalOrder([...initialVehicles]);

        // Reset selected cars and comparison view on mount/refresh
        setSelectedCars([null, null, null]);
        setShowComparison(false);

        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []); // Empty dependency array means this runs once on mount

    // Helper function to insert car at its original position
    const insertAtOriginalPosition = useCallback(
        (carToInsert, currentCars) => {
            if (!carToInsert || !carToInsert.id) return currentCars;
            const validCurrentCars = currentCars.filter((car) => car && car.id);
            const originalIndex = originalOrder.findIndex(
                (car) => car && car.id === carToInsert.id
            );
            if (originalIndex === -1) {
                return [...validCurrentCars, carToInsert];
            }
            let insertIndex = validCurrentCars.findIndex((currentCar) => {
                const currentCarOriginalIndex = originalOrder.findIndex(
                    (origCar) => origCar && origCar.id === currentCar.id
                );
                if (currentCarOriginalIndex === -1) return false;
                return currentCarOriginalIndex > originalIndex;
            });
            const newCars = [...validCurrentCars];
            if (insertIndex === -1) {
                newCars.push(carToInsert);
            } else {
                newCars.splice(insertIndex, 0, carToInsert);
            }
            return newCars;
        },
        [originalOrder]
    );

    // Define the auto-scroll logic (only upwards)
    const handleAutoScroll = useCallback(
        (e) => {
            const scrollThreshold = 150;
            const { clientY } = e;
            const scrollSpeed = 15;

            if (clientY < scrollThreshold) {
                requestAnimationFrame(() => {
                    window.scrollBy({
                        top: -scrollSpeed,
                        behavior: "auto",
                    });
                });
            }
        },
        [] // No dependencies needed
    );

    // Function to clean up scroll listener and reset drag state
    const cleanupDrag = useCallback(() => {
        if (scrollHandlerRef.current) {
            document.removeEventListener("dragover", scrollHandlerRef.current);
            scrollHandlerRef.current = null; // Clear the ref
        }
        setIsDragging(false);
        setDraggedCar(null);
    }, []); // No dependencies needed here

    const handleDragStart = useCallback(
        (car, e) => {
            if (!car) return;

            e.dataTransfer.setData("text/plain", car.id);
            setDraggedCar(car);
            setIsDragging(true);

            // Add scroll handler
            const scrollHandler = (moveEvent) => handleAutoScroll(moveEvent);
            document.addEventListener("dragover", scrollHandler);

            // Cleanup function
            const cleanup = () => {
                document.removeEventListener("dragover", scrollHandler);
                setIsDragging(false);
                setDraggedCar(null);
            };

            // Add cleanup listeners
            document.addEventListener("dragend", cleanup, { once: true });
            document.addEventListener("dragcancel", cleanup, { once: true });
        },
        [handleAutoScroll]
    );

    const handleDragOver = useCallback((e) => {
        e.preventDefault(); // Necessary to allow dropping
    }, []);

    const handleDragLeave = useCallback((e) => {
        // Optional: remove visual feedback if added on dragover
    }, []);

    const handleDrop = useCallback(
        (slotIndex, e) => {
            e.preventDefault();
            // Drag state cleanup is handled by the 'dragend' listener added in handleDragStart
            if (!draggedCar) return;

            const droppedCarId = draggedCar.id;
            const carBeingDropped = originalOrder.find(
                (c) => c && c.id === droppedCarId
            );

            if (!carBeingDropped) return;

            setSelectedCars((prevSelected) => {
                const newSelected = [...prevSelected];
                const carCurrentlyInSlot = newSelected[slotIndex];
                const existingSlotIndex = newSelected.findIndex(
                    (c) => c && c.id === droppedCarId
                );

                if (
                    existingSlotIndex !== -1 &&
                    existingSlotIndex !== slotIndex
                ) {
                    newSelected[existingSlotIndex] = null;
                }
                newSelected[slotIndex] = carBeingDropped;

                setAvailableCars((prevAvailable) => {
                    let updatedAvailable = prevAvailable.filter(
                        (car) => car && car.id !== droppedCarId
                    );
                    if (
                        carCurrentlyInSlot &&
                        carCurrentlyInSlot.id !== droppedCarId
                    ) {
                        const isAlreadyAvailable = updatedAvailable.some(
                            (c) => c && c.id === carCurrentlyInSlot.id
                        );
                        if (!isAlreadyAvailable) {
                            updatedAvailable = insertAtOriginalPosition(
                                carCurrentlyInSlot,
                                updatedAvailable
                            );
                        }
                    }
                    return updatedAvailable;
                });
                return newSelected;
            });
            // No need to setDraggedCar(null) here, dragend handles it.
        },
        [draggedCar, insertAtOriginalPosition, originalOrder]
    );

    const handleRemoveCar = useCallback(
        (index) => {
            setSelectedCars((prevSelected) => {
                const newSelected = [...prevSelected];
                const carToRemove = newSelected[index];

                if (carToRemove) {
                    setAvailableCars((prevAvailable) => {
                        const validAvailable = prevAvailable.filter(
                            (car) => car !== null
                        );
                        const isAlreadyInList = validAvailable.some(
                            (car) => car.id === carToRemove.id
                        );
                        if (!isAlreadyInList) {
                            return insertAtOriginalPosition(
                                carToRemove,
                                validAvailable
                            );
                        }
                        return validAvailable;
                    });
                }
                newSelected[index] = null;
                // Check if comparison should be hidden *after* state update completes
                if (newSelected.filter(Boolean).length < 2) {
                    setShowComparison(false);
                }
                return newSelected;
            });
        },
        [insertAtOriginalPosition] // Removed selectedCars dependency to avoid potential issues
    );

    const handleCompare = () => {
        const selectedCount = selectedCars.filter((car) => car !== null).length;
        if (selectedCount >= 2) {
            setShowComparison(true);
            const comparisonTable = document.getElementById("comparison-table");
            if (comparisonTable) {
                comparisonTable.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        } else {
            alert("Please select at least 2 cars to compare.");
        }
    };

    // --- Comparison Slot Component ---
    const ComparisonSlot = ({ car, index }) => (
        <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(index, e)}
            onDragLeave={handleDragLeave}
            className={
                `h-full min-h-[330px] rounded-lg p-3 transition-all duration-300 relative group ${
                    darkMode
                        ? "bg-[#2a2a2a] border-2 border-dashed border-[#404040] hover:border-[#555]"
                        : "bg-white border-2 border-dashed border-[#e5e7eb] hover:border-[#ccc]"
                } ${isDragging ? "border-emerald-500" : ""}` // Highlight all slots when dragging
            }
        >
            {!car ? (
                <div className="h-full flex flex-col items-center justify-center text-center pointer-events-none">
                    <FaCarAlt className="text-4xl mb-2 text-gray-400" />
                    <p
                        className={`text-sm ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                    >
                        Drag & Drop a Car Here
                    </p>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => handleRemoveCar(index)}
                        aria-label={`Remove ${car.name}`}
                        className={`absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white
                                    hover:bg-red-600 transition-all duration-200 z-20
                                    opacity-0 group-hover:opacity-100 focus:opacity-100`}
                    >
                        <FaTimes size={14} />
                    </button>
                    <div className="h-full flex flex-col pointer-events-none">
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <div className="space-y-1 flex-grow">
                            <h3
                                className={`text-lg font-bold truncate ${
                                    darkMode ? "text-white" : "text-gray-900"
                                }`}
                                title={car.name}
                            >
                                {car.name}
                            </h3>
                            <div className="space-y-1">
                                <p
                                    className={`text-sm ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {car.type}
                                </p>
                                <p
                                    className={`text-base font-semibold ${
                                        darkMode
                                            ? "text-[#0fa16d]"
                                            : "text-emerald-600"
                                    }`}
                                >
                                    {formatCurrency(car.price)}/day
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    // --- Calculation Logic (Memoized) ---
    const calculatePoints = (car, allSelectedValidCars) => {
        // (Same logic as before)
        if (!car) return 0;
        let points = 0;
        const validCars = allSelectedValidCars;
        if (validCars.length < 1) return 0;

        const prices = validCars
            .map((c) => c.price)
            .filter((p) => typeof p === "number");
        if (prices.length > 0) {
            const lowestPrice = Math.min(...prices);
            if (car.price === lowestPrice) points += 1;
        }

        const speeds = validCars
            .map((c) => c.specifications?.topSpeed)
            .filter((s) => typeof s === "number");
        if (speeds.length > 0) {
            const highestSpeed = Math.max(...speeds);
            if (car.specifications?.topSpeed === highestSpeed) points += 1;
        }

        if (car.specifications?.transmission?.toLowerCase() === "automatic")
            points += 1;

        const fuelType = car.specifications?.fuel?.toLowerCase();
        if (fuelType === "hybrid") points += 2;
        else if (fuelType === "electric" || fuelType === "petrol") points += 1;

        return points;
    };

    const carPoints = useMemo(() => {
        const validCars = selectedCars.filter(Boolean);
        if (validCars.length < 2) return {};
        const pointsMap = {};
        validCars.forEach((car) => {
            pointsMap[car.id] = calculatePoints(car, validCars);
        });
        return pointsMap;
    }, [selectedCars]);

    const suggestedChoice = useMemo(() => {
        const validCars = selectedCars.filter(Boolean);
        if (validCars.length < 2) return null;
        const carScores = validCars
            .map((car) => ({
                name: car.name,
                points: carPoints[car.id] ?? 0,
            }))
            .sort((a, b) => b.points - a.points);

        if (carScores.length === 0 || carScores[0].points === undefined)
            return null; // Add check for undefined points

        const topScore = carScores[0].points;
        const topCars = carScores.filter((car) => car.points === topScore);

        if (topCars.length === carScores.length && topScore >= 0) {
            // Check score >= 0
            return {
                type: "tie-all",
                points: topScore,
                names: topCars.map((c) => c.name),
            };
        }
        if (topCars.length > 1) {
            return {
                type: "tie-top",
                points: topScore,
                names: topCars.map((c) => c.name),
            };
        }
        if (topCars.length === 1) {
            return { type: "winner", points: topScore, name: topCars[0].name };
        }
        return null;
    }, [selectedCars, carPoints]);

    // --- Render Functions ---
    const renderSuggestedChoice = () => {
        if (!suggestedChoice) return null;
        // (Same logic as before)
        switch (suggestedChoice.type) {
            case "tie-all":
                return (
                    <div
                        className={`text-base md:text-lg ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        All cars have {suggestedChoice.points} points. Please
                        choose based on your preference.
                    </div>
                );
            case "tie-top":
                return (
                    <div
                        className={`text-base md:text-lg ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        <span className="font-semibold">
                            {suggestedChoice.names.join(" or ")}
                        </span>{" "}
                        ({suggestedChoice.points} points) - Please choose
                        according to your requirements.
                    </div>
                );
            case "winner":
                return (
                    <div
                        className={`text-base md:text-lg font-semibold ${
                            darkMode ? "text-emerald-400" : "text-emerald-600"
                        }`}
                    >
                        <FaThumbsUp className="inline mr-2 mb-1" />
                        {suggestedChoice.name} ({suggestedChoice.points} points)
                    </div>
                );
            default:
                return null;
        }
    };

    const ComparisonRow = ({
        label,
        icon: Icon,
        dataKey,
        unit = "",
        formatFn,
    }) => {
        // (Same logic as before)
        const getKey = (car) => {
            if (!car) return null;
            let value = car;
            const keys = dataKey.split(".");
            for (const key of keys) {
                if (value && typeof value === "object" && key in value) {
                    value = value[key];
                } else {
                    return "-";
                }
            }
            // Handle cases where value might be null/undefined after traversal
            if (value === null || value === undefined) return "-";

            const formattedValue = formatFn ? formatFn(value) : value;
            return `${formattedValue}${unit ? ` ${unit}` : ""}`;
        };

        // Determine the number of columns needed based on selected cars
        const numSelected = selectedCars.filter(Boolean).length;
        const totalCols = 3; // Max slots

        return (
            <tr
                className={
                    darkMode
                        ? "border-b border-[#404040]"
                        : "border-b border-gray-200"
                }
            >
                <td
                    className={`p-3 md:p-4 text-sm md:text-base font-medium whitespace-nowrap sticky left-0 bg-inherit ${
                        darkMode
                            ? "text-gray-300 bg-[#2a2a2a]"
                            : "text-gray-600 bg-white"
                    } z-10`}
                >
                    {" "}
                    {/* Added z-index */}
                    {Icon && <Icon className="inline mr-2 mb-1 text-lg" />}
                    {label}
                </td>
                {selectedCars.map((car, index) => (
                    <td
                        key={
                            car
                                ? `data-${dataKey}-${car.id}`
                                : `empty-slot-${dataKey}-${index}`
                        }
                        className={`text-center p-3 md:p-4 text-sm md:text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                        {car ? getKey(car) : "-"}
                    </td>
                ))}
                {/* Add placeholder cells if fewer than 3 cars are selected */}
                {Array(totalCols - numSelected)
                    .fill(null)
                    .map((_, i) => (
                        <td
                            key={`placeholder-${dataKey}-${i}`}
                            className="p-3 md:p-4 text-center text-gray-400"
                        >
                            -
                        </td>
                    ))}
            </tr>
        );
    };

    // --- Main Return JSX ---
    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                darkMode ? "bg-[#1a1a1a]" : "bg-[#f0fbf7]"
            }`}
        >
            <div className="fixed top-0 left-0 right-0 z-30">
                <Navbar />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 md:mt-24">
                <h1
                    className={`text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center ${
                        darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                    Compare Cars
                </h1>

                {/* Comparison Slots */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <ComparisonSlot car={selectedCars[0]} index={0} />
                    <ComparisonSlot car={selectedCars[1]} index={1} />
                    <ComparisonSlot car={selectedCars[2]} index={2} />
                </div>

                {/* Compare Button */}
                <div className="flex justify-center mb-10 md:mb-12">
                    <button
                        onClick={handleCompare}
                        disabled={selectedCars.filter(Boolean).length < 2}
                        className={`px-6 md:px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 ${
                            darkMode
                                ? "bg-[#0fa16d] hover:bg-[#0d8a5c] focus:ring-[#0fa16d] disabled:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
                        }`}
                    >
                        Compare Vehicles
                    </button>
                </div>

                {/* Detailed Comparison Section */}
                {showComparison &&
                    selectedCars.filter((car) => car !== null).length >= 2 && (
                        <div
                            id="comparison-table"
                            className={`mb-12 ${
                                darkMode
                                    ? "bg-[#2a2a2a] border border-[#404040]"
                                    : "bg-white border border-[#e5e7eb]"
                            } rounded-lg p-4 md:p-6 shadow-md`}
                        >
                            <h2
                                className={`text-2xl font-semibold mb-4 ${
                                    darkMode ? "text-white" : "text-gray-800"
                                }`}
                            >
                                Comparison Details
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px]">
                                    {" "}
                                    {/* Increased min-width slightly */}
                                    <thead>
                                        <tr
                                            className={
                                                darkMode
                                                    ? "border-b border-[#505050]"
                                                    : "border-b border-gray-300"
                                            }
                                        >
                                            <th
                                                className={`text-left p-3 md:p-4 font-semibold sticky left-0 bg-inherit ${
                                                    darkMode
                                                        ? "text-gray-300 bg-[#2a2a2a]"
                                                        : "text-gray-600 bg-white"
                                                } z-10`} // Added z-index
                                            >
                                                Feature
                                            </th>
                                            {selectedCars.map((car, index) =>
                                                car ? (
                                                    <th
                                                        key={`header-${car.id}`}
                                                        className={`text-center p-3 md:p-4 ${
                                                            darkMode
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        } text-base md:text-lg font-bold whitespace-nowrap`} // Added whitespace-nowrap
                                                    >
                                                        {car.name}
                                                    </th>
                                                ) : (
                                                    // Render placeholder header if slot is empty but comparison is shown
                                                    <th
                                                        key={`empty-header-${index}`}
                                                        className="p-3 md:p-4 text-center text-gray-400"
                                                    >
                                                        -
                                                    </th>
                                                )
                                            )}
                                            {/* Add placeholder headers if fewer than 3 cars selected */}
                                            {Array(3 - selectedCars.length)
                                                .fill(null)
                                                .map((_, i) => (
                                                    <th
                                                        key={`placeholder-header-${i}`}
                                                        className="p-3 md:p-4 text-center text-gray-400"
                                                    >
                                                        -
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ComparisonRow
                                            label="Company"
                                            dataKey="company"
                                            icon={FaCarAlt}
                                        />
                                        <ComparisonRow
                                            label="Type"
                                            dataKey="type"
                                            icon={FaCarAlt}
                                        />
                                        <ComparisonRow
                                            label="Engine"
                                            dataKey="specifications.engine"
                                            icon={FaCogs}
                                        />
                                        <ComparisonRow
                                            label="Price/day"
                                            dataKey="price"
                                            formatFn={formatCurrency}
                                            icon={FaMoneyBillWave}
                                        />
                                        <ComparisonRow
                                            label="Top Speed"
                                            dataKey="specifications.topSpeed"
                                            unit="km/h"
                                            icon={FaTachometerAlt}
                                        />
                                        <ComparisonRow
                                            label="Year"
                                            dataKey="specifications.year"
                                            icon={FaCalendarAlt}
                                        />
                                        <ComparisonRow
                                            label="Transmission"
                                            dataKey="specifications.transmission"
                                            icon={FaCogs}
                                        />
                                        <ComparisonRow
                                            label="Fuel Type"
                                            dataKey="specifications.fuel"
                                            icon={FaGasPump}
                                        />
                                        <ComparisonRow
                                            label="Seats"
                                            dataKey="specifications.seats"
                                            icon={FaUsers}
                                        />

                                        {/* Points System Row */}
                                        <tr
                                            className={
                                                darkMode
                                                    ? "border-b border-[#404040]"
                                                    : "border-b border-gray-200"
                                            }
                                        >
                                            <td
                                                className={`p-3 md:p-4 text-sm md:text-base font-medium whitespace-nowrap sticky left-0 bg-inherit ${
                                                    darkMode
                                                        ? "text-gray-300 bg-[#2a2a2a]"
                                                        : "text-gray-600 bg-white"
                                                } z-10`}
                                            >
                                                <FaStar className="inline mr-2 mb-1 text-lg text-yellow-400" />
                                                Overall Rating
                                            </td>
                                            {selectedCars.map((car, index) => (
                                                <td
                                                    key={
                                                        car
                                                            ? `points-${car.id}`
                                                            : `empty-points-${index}`
                                                    }
                                                    className={`text-center p-3 md:p-4`}
                                                >
                                                    {car ? (
                                                        <div
                                                            className={`text-lg md:text-xl font-bold ${
                                                                darkMode
                                                                    ? "text-emerald-400"
                                                                    : "text-emerald-600"
                                                            }`}
                                                        >
                                                            {carPoints[
                                                                car.id
                                                            ] ?? 0}{" "}
                                                            / 5
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            ))}
                                            {/* Add placeholder cells if fewer than 3 cars selected */}
                                            {Array(3 - selectedCars.length)
                                                .fill(null)
                                                .map((_, i) => (
                                                    <td
                                                        key={`placeholder-points-${i}`}
                                                        className="p-3 md:p-4 text-center text-gray-400"
                                                    >
                                                        -
                                                    </td>
                                                ))}
                                        </tr>

                                        {/* Suggested Choice Row */}
                                        <tr
                                            className={
                                                darkMode
                                                    ? "border-b border-[#404040]"
                                                    : "border-b border-gray-200"
                                            }
                                        >
                                            <td
                                                className={`p-3 md:p-4 text-sm md:text-base font-medium whitespace-nowrap sticky left-0 bg-inherit ${
                                                    darkMode
                                                        ? "text-gray-300 bg-[#2a2a2a]"
                                                        : "text-gray-600 bg-white"
                                                } z-10`}
                                            >
                                                <FaThumbsUp className="inline mr-2 mb-1 text-lg" />
                                                Suggested Choice
                                            </td>
                                            <td
                                                // Span across the number of actual car columns + placeholders
                                                colSpan={3}
                                                className={`text-center p-3 md:p-4`}
                                            >
                                                {renderSuggestedChoice()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                {/* Available Cars Grid */}
                <div className="mt-10 md:mt-12">
                    <h2
                        className={`text-2xl md:text-3xl text-center font-bold mb-6 ${
                            darkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                        Available Cars
                    </h2>
                    {availableCars.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {availableCars.map(
                                (car) =>
                                    car && (
                                        <div
                                            key={car.id}
                                            draggable
                                            onDragStart={(e) =>
                                                handleDragStart(car, e)
                                            }
                                            className={`rounded-lg overflow-hidden shadow-md cursor-move transition-all duration-200 hover:shadow-lg active:scale-95 active:cursor-grabbing ${
                                                darkMode
                                                    ? "bg-[#2a2a2a] border border-[#404040] hover:border-[#555]"
                                                    : "bg-white border border-[#e5e7eb] hover:border-[#ccc]"
                                            }`}
                                            aria-label={`Draggable car: ${car.name}`}
                                        >
                                            <div
                                                className="relative h-40"
                                                draggable="false"
                                            >
                                                <img
                                                    src={car.image}
                                                    alt={car.name}
                                                    className="w-full h-full object-cover"
                                                    draggable="false"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3
                                                    className={`text-base md:text-lg font-semibold mb-1 truncate ${
                                                        darkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                    title={car.name}
                                                >
                                                    {car.name}
                                                </h3>
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        darkMode
                                                            ? "text-[#0fa16d]"
                                                            : "text-emerald-600"
                                                    }`}
                                                >
                                                    {formatCurrency(car.price)}
                                                    /day
                                                </p>
                                            </div>
                                        </div>
                                    )
                            )}
                        </div>
                    ) : (
                        <p
                            className={`text-center py-8 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            All cars have been selected for comparison.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
            <ChatBot />
        </div>
    );
};

export default CompareView;
