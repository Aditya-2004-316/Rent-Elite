import React, { useState } from "react";
import { vehicles } from "../data/vehicles";
import {
    FaSearch,
    FaDollarSign,
    FaChevronDown,
    FaGasPump,
    FaCar,
    FaCogs,
    FaCarSide,
} from "react-icons/fa";
import Select from "react-select";
import filter from "../assets/filter.png";
import carCompany from "../assets/carcompany.png";
import price from "../assets/price.png";
import fuel from "../assets/fuel.png";
import transmission from "../assets/transmission.png";
import carType from "../assets/cartype.png";
import coin from "../assets/coin.png";
import astonLogo from "../assets/aston-martin-logo.png";
import audiLogo from "../assets/audi-logo.png";
import bentleyLogo from "../assets/bentley-logo.png";
import bmwLogo from "../assets/bmw-logo.png";
import bugattiLogo from "../assets/bugatti-logo.png";
import ferrariLogo from "../assets/ferrari-logo.png";
import koenigseggLogo from "../assets/koenigsegg-logo.png";
import lamborghiniLogo from "../assets/lamborghini-logo.png";
import lotusLogo from "../assets/lotus-logo.png";
import maseratiLogo from "../assets/maserati-logo.png";
import mercedesLogo from "../assets/mercedes-logo.png";
import lexusLogo from "../assets/lexus-logo.png";
import mclarenLogo from "../assets/mclaren-logo.png";
import paganiLogo from "../assets/pagani-logo.png";
import porscheLogo from "../assets/porsche-logo.png";
import rollsRoyceLogo from "../assets/rolls-royce-logo.png";
import rimacLogo from "../assets/rimac-logo.png";
import carRentalPriceRange from "../assets/car-rental-price-range.png";
import { useSettings } from "../context/SettingsContext";

const fuelTypes = ["Petrol", "Electric", "Hybrid"];
const transmissions = ["Automatic", "Manual"];

// Extract unique car types from vehicles data
const carTypes = [...new Set(vehicles.map((vehicle) => vehicle.type))];

// Extract unique companies and filter out any undefined values
const companies = [
    ...new Set(vehicles.map((vehicle) => vehicle.company).filter(Boolean)),
];

// Icons mapping for dropdown option visual enhancement
const getFuelIcon = (type) => {
    if (type === "Petrol") return "🛢️";
    if (type === "Electric") return "⚡";
    if (type === "Hybrid") return "♻️";
    return "";
};

const getTransmissionIcon = (type) => {
    if (type === "Automatic") return "🔄";
    if (type === "Manual") return "🔧";
    return "";
};

const getCarTypeIcon = (type) => {
    if (
        type === "Luxury Sports Car" ||
        type === "Luxury SUV" ||
        type === "Luxury Grand Tourer" ||
        type === "Ultra Luxury"
    )
        return "✨";
    if (type === "Sports Car" || type === "Sports Sedan") return "🏎️";
    if (type === "Ultra Luxury SUV" || type === "Electric SUV") return "🚙";
    if (type === "Supercar" || type === "Hypercar" || type === "Track Hypercar")
        return "🚗";
    if (
        type === "Electric Sports Car" ||
        type === "Electric Hypercar" ||
        type === "Electric Grand Tourer" ||
        type === "Electric Ultra Luxury"
    )
        return "⚡";
    if (
        type === "Hybrid Supercar" ||
        type === "Hybrid Hypercar" ||
        type === "Hybrid Megacar"
    )
        return "♻️";
    return "🚘";
};

// Add this function to get company logos
const getCompanyLogo = (company) => {
    switch (company) {
        case "Ferrari":
            return (
                <img src={ferrariLogo} alt="Ferrari Logo" className="w-3 h-3" />
            );
        case "Lamborghini":
            return (
                <img
                    src={lamborghiniLogo}
                    alt="Lamborghini Logo"
                    className="w-3 h-3"
                />
            );
        case "Bugatti":
            return (
                <img src={bugattiLogo} alt="Bugatti Logo" className="w-4 h-4" />
            );
        case "Porsche":
            return (
                <img src={porscheLogo} alt="Porsche Logo" className="w-4 h-4" />
            );
        case "McLaren":
            return (
                <img src={mclarenLogo} alt="McLaren Logo" className="w-4 h-4" />
            );
        case "Koenigsegg":
            return (
                <img
                    src={koenigseggLogo}
                    alt="Koenigsegg Logo"
                    className="w-4 h-4"
                />
            );
        case "Rolls-Royce":
            return (
                <img
                    src={rollsRoyceLogo}
                    alt="Rolls-Royce Logo"
                    className="w-4 h-4"
                />
            );
        case "Bentley":
            return (
                <img src={bentleyLogo} alt="Bentley Logo" className="w-4 h-4" />
            );
        case "Mercedes":
            return (
                <img
                    src={mercedesLogo}
                    alt="Mercedes Logo"
                    className="w-4 h-4"
                />
            );
        case "Aston Martin":
            return (
                <img
                    src={astonLogo}
                    alt="Aston Martin Logo"
                    className="w-4 h-4"
                />
            );
        case "Maserati":
            return (
                <img
                    src={maseratiLogo}
                    alt="Maserati Logo"
                    className="w-4 h-4"
                />
            );
        case "Lexus":
            return <img src={lexusLogo} alt="Lexus Logo" className="w-4 h-4" />;
        case "BMW":
            return <img src={bmwLogo} alt="BMW Logo" className="w-4 h-4" />;
        case "Audi":
            return <img src={audiLogo} alt="Audi Logo" className="w-4 h-4" />;
        case "Pagani":
            return (
                <img src={paganiLogo} alt="Pagani Logo" className="w-4 h-4" />
            );
        case "Rimac":
            return <img src={rimacLogo} alt="Rimac Logo" className="w-4 h-4" />;
        case "Lotus":
            return <img src={lotusLogo} alt="Lotus Logo" className="w-4 h-4" />;
        default:
            return "🚗";
    }
};

const FiltersSidebar = ({ onFilterChange, darkMode }) => {
    const { formatCurrency } = useSettings();
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedFuelType, setSelectedFuelType] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [selectedCarType, setSelectedCarType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState(0);

    // Filter companies based on the search term
    const searchFilteredCompanies = companies.filter(
        (company) =>
            company && company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create company options for react-select
    const companyOptions = [
        { value: "", label: "All", logo: null },
        ...searchFilteredCompanies.map((company) => ({
            value: company,
            label: company,
            logo: company,
        })),
    ];

    // Create fuel type options for react-select
    const fuelTypeOptions = [
        { value: "", label: "All" },
        ...fuelTypes.map((type) => ({
            value: type,
            label: `${getFuelIcon(type)} ${type}`,
        })),
    ];

    // Create transmission options for react-select
    const transmissionOptions = [
        { value: "", label: "All" },
        ...transmissions.map((type) => ({
            value: type,
            label: `${getTransmissionIcon(type)} ${type}`,
        })),
    ];

    // Create car type options for react-select
    const carTypeOptions = [
        { value: "", label: "All" },
        ...carTypes.map((type) => ({
            value: type,
            label: `${getCarTypeIcon(type)} ${type}`,
        })),
    ];

    // Custom styles for react-select
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: darkMode ? "#2A2A2A" : "white",
            borderColor: state.isFocused
                ? "#10b981"
                : darkMode
                ? "#393939"
                : "#e5e7eb",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(16, 185, 129, 0.25)"
                : "none",
            "&:hover": {
                borderColor: "#10b981",
            },
            borderRadius: "0.5rem",
            minHeight: "42px",
            height: "42px",
            padding: "0",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: darkMode ? "#2A2A2A" : "white",
            zIndex: 9999,
            border: darkMode ? "1px solid #393939" : "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor:
                state.isFocused || state.isSelected
                    ? "#10b981"
                    : darkMode
                    ? "#2A2A2A"
                    : "white",
            color:
                state.isFocused || state.isSelected
                    ? "white"
                    : darkMode
                    ? "#E4E6EB"
                    : "inherit",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#10b981",
                color: "white",
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: darkMode ? "#E4E6EB" : "inherit",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginLeft: "4px",
        }),
        dropdownIndicator: () => ({
            display: "none", // Hide the default dropdown indicator
        }),
        indicatorSeparator: () => ({
            display: "none", // Hide the indicator separator
        }),
        clearIndicator: () => ({
            display: "none", // Hide the clear button
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "2px 8px",
            height: "42px",
            overflow: "visible",
        }),
        input: (provided) => ({
            ...provided,
            margin: "0",
            padding: "0",
        }),
    };

    // Custom dropdown indicator
    const DropdownIndicator = () => {
        return (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-500">
                <FaChevronDown />
            </div>
        );
    };

    // Custom option component that shows the logo for company
    const CompanyOption = ({ innerProps, data, isSelected }) => (
        <div
            {...innerProps}
            className={`flex items-center gap-2 p-2 cursor-pointer ${
                isSelected ? "bg-emerald-500 text-white" : ""
            } hover:bg-emerald-500 hover:text-white`}
        >
            {data.logo ? getCompanyLogo(data.logo) : null}
            <span>{data.label}</span>
        </div>
    );

    // Custom single value component for company
    const CompanySingleValue = ({ innerProps, data }) => (
        <div {...innerProps} className="flex items-center gap-2">
            {data.logo ? getCompanyLogo(data.logo) : null}
            <span>{data.label}</span>
        </div>
    );

    const handleCompanyChange = (selectedOption) => {
        const company = selectedOption ? selectedOption.value : "";
        setSelectedCompany(company);
        onFilterChange({
            company,
            fuelType: selectedFuelType,
            transmission: selectedTransmission,
            carType: selectedCarType,
            searchTerm,
            priceRange,
        });
    };

    const handleFuelTypeChange = (selectedOption) => {
        const fuelType = selectedOption ? selectedOption.value : "";
        setSelectedFuelType(fuelType);
        onFilterChange({
            company: selectedCompany,
            fuelType,
            transmission: selectedTransmission,
            carType: selectedCarType,
            searchTerm,
            priceRange,
        });
    };

    const handleTransmissionChange = (selectedOption) => {
        const transmission = selectedOption ? selectedOption.value : "";
        setSelectedTransmission(transmission);
        onFilterChange({
            company: selectedCompany,
            fuelType: selectedFuelType,
            transmission,
            carType: selectedCarType,
            searchTerm,
            priceRange,
        });
    };

    const handleCarTypeChange = (selectedOption) => {
        const carType = selectedOption ? selectedOption.value : "";
        setSelectedCarType(carType);
        onFilterChange({
            company: selectedCompany,
            fuelType: selectedFuelType,
            transmission: selectedTransmission,
            carType,
            searchTerm,
            priceRange,
        });
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onFilterChange({
            company: selectedCompany,
            fuelType: selectedFuelType,
            transmission: selectedTransmission,
            carType: selectedCarType,
            searchTerm: term,
            priceRange,
        });
    };

    const handlePriceChange = (e) => {
        const price = e.target.value;
        setPriceRange(price);
        onFilterChange({
            company: selectedCompany,
            fuelType: selectedFuelType,
            transmission: selectedTransmission,
            carType: selectedCarType,
            searchTerm,
            priceRange: price,
        });
    };

    // Custom styles applied to all dropdowns
    const customSelectClassName = `appearance-none border ${
        darkMode
            ? "border-[#393939] bg-[#2A2A2A] text-[#E4E6EB]"
            : "border-gray-300 bg-white"
    } rounded-lg w-full shadow-sm transition-all duration-200 
    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
    hover:border-emerald-300 cursor-pointer`;

    // Custom styling for dropdown options
    const dropdownStyles = `
        /* Custom styling for dropdown options */
        select option {
            padding: 10px;
            font-size: 14px;
            ${
                darkMode
                    ? "background-color: #2A2A2A; color: #E4E6EB;"
                    : "background-color: white;"
            }
        }
        
        select option:hover, select option:focus {
            background-color: #10b981 !important;
            color: white !important;
        }
        
        /* Styling for select element on focus */
        select:focus {
            border-color: #10b981;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
        }
        
        /* Custom scrollbar for dropdowns */
        select {
            scrollbar-width: thin;
            scrollbar-color: #10b981 ${darkMode ? "#2A2A2A" : "#f3f4f6"};
        }
        
        select::-webkit-scrollbar {
            width: 8px;
        }
        
        select::-webkit-scrollbar-track {
            background: ${darkMode ? "#2A2A2A" : "#f3f4f6"};
            border-radius: 10px;
        }
        
        select::-webkit-scrollbar-thumb {
            background-color: #10b981;
            border-radius: 10px;
        }
    `;

    return (
        <div
            className={`${
                darkMode ? "bg-[#121212] text-[#E4E6EB]" : "bg-white"
            } shadow-md rounded-lg p-4 w-80`}
        >
            {/* // <div */}
            {/* //     className={`${ */}
            {/* //         darkMode ? "bg-[#121212] text-[#E4E6EB]" : "transparent" */}
            {/* //     } rounded-lg p-4 w-80`} */}
            {/* > */}
            {/* Heading with Filter Icon */}
            <div className="flex items-center space-x-2 mb-4">
                <img src={filter} alt="Filter" className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Filters</h2>
            </div>

            {/* Search Input with Icon */}
            <div className="mb-4 relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by company..."
                    className={`border ${
                        darkMode
                            ? "border-[#393939] bg-[#2A2A2A] text-[#E4E6EB]"
                            : "border-gray-300 bg-white"
                    } rounded-lg w-full p-2 pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none`}
                />
                <FaSearch className="absolute right-3 top-2.5 text-gray-500 cursor-pointer" />
            </div>

            {/* Car Company with Icon - Using React-Select */}
            <div className="mb-4">
                <label className="block text-lg font-medium mb-2 flex items-center space-x-2">
                    <img
                        src={carCompany}
                        alt="Car Company"
                        className="w-6 h-6"
                    />
                    <span>Car Company</span>
                </label>
                <div className="relative">
                    <Select
                        options={companyOptions}
                        styles={selectStyles}
                        onChange={handleCompanyChange}
                        placeholder="All"
                        isSearchable={false}
                        components={{
                            Option: CompanyOption,
                            SingleValue: CompanySingleValue,
                            IndicatorSeparator: null,
                            ClearIndicator: null,
                            DropdownIndicator: null,
                        }}
                        value={
                            companyOptions.find(
                                (option) => option.value === selectedCompany
                            ) || companyOptions[0]
                        }
                        className={`${customSelectClassName} react-select-container`}
                        classNamePrefix="react-select"
                    />
                    <DropdownIndicator />
                </div>
            </div>

            {/* Price Range with Icon */}
            <div className="mb-4 relative">
                <label className="block text-lg font-medium mb-2 flex items-center space-x-2">
                    <img src={price} alt="Price" className="w-6 h-6" />
                    <span>Price Range</span>
                </label>
                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="600"
                        value={priceRange}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-[#ccf2e3] rounded-lg appearance-none cursor-pointer"
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10"
                        style={{ left: `${(priceRange / 600) * 100}%` }}
                    >
                        <FaDollarSign className="text-emerald-600" />
                        <img
                            src={coin}
                            alt="Coin"
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: "50%", top: "50%" }}
                        />
                    </div>
                </div>
                <span className="text-sm mt-2 block font-medium">
                    Current Price: {formatCurrency(priceRange)}
                </span>
            </div>

            {/* Fuel Type with Icon - Using React-Select */}
            <div className="mb-4">
                <label className="block text-lg font-medium mb-2 flex items-center space-x-2">
                    <img src={fuel} alt="Fuel" className="w-6 h-6" />
                    <span>Fuel Type</span>
                </label>
                <div className="relative">
                    <Select
                        options={fuelTypeOptions}
                        styles={selectStyles}
                        onChange={handleFuelTypeChange}
                        placeholder="All"
                        isSearchable={false}
                        components={{
                            IndicatorSeparator: null,
                            ClearIndicator: null,
                            DropdownIndicator: null,
                        }}
                        value={
                            fuelTypeOptions.find(
                                (option) => option.value === selectedFuelType
                            ) || fuelTypeOptions[0]
                        }
                        className={`${customSelectClassName} react-select-container`}
                        classNamePrefix="react-select"
                    />
                    <DropdownIndicator />
                </div>
            </div>

            {/* Transmission with Icon - Using React-Select */}
            <div className="mb-4">
                <label className="block text-lg font-medium mb-2 flex items-center space-x-2">
                    <img
                        src={transmission}
                        alt="Transmission"
                        className="w-6 h-6"
                    />
                    <span>Transmission</span>
                </label>
                <div className="relative">
                    <Select
                        options={transmissionOptions}
                        styles={selectStyles}
                        onChange={handleTransmissionChange}
                        placeholder="All"
                        isSearchable={false}
                        components={{
                            IndicatorSeparator: null,
                            ClearIndicator: null,
                            DropdownIndicator: null,
                        }}
                        menuPlacement="top"
                        value={
                            transmissionOptions.find(
                                (option) =>
                                    option.value === selectedTransmission
                            ) || transmissionOptions[0]
                        }
                        className={`${customSelectClassName} react-select-container`}
                        classNamePrefix="react-select"
                    />
                    <DropdownIndicator />
                </div>
            </div>

            {/* Car Type with Icon - Using React-Select */}
            <div className="mb-4">
                <label className="block text-lg font-medium mb-2 flex items-center space-x-2">
                    <img src={carType} alt="Car Type" className="w-6 h-6" />
                    <span>Car Type</span>
                </label>
                <div className="relative">
                    <Select
                        options={carTypeOptions}
                        styles={selectStyles}
                        onChange={handleCarTypeChange}
                        placeholder="All"
                        isSearchable={false}
                        components={{
                            IndicatorSeparator: null,
                            ClearIndicator: null,
                            DropdownIndicator: null,
                        }}
                        menuPlacement="top"
                        value={
                            carTypeOptions.find(
                                (option) => option.value === selectedCarType
                            ) || carTypeOptions[0]
                        }
                        className={`${customSelectClassName} react-select-container`}
                        classNamePrefix="react-select"
                    />
                    <DropdownIndicator />
                </div>
            </div>

            {/* Custom CSS */}
            <style>
                {`
                        input[type="range"] {
                            -webkit-appearance: none;
                            appearance: none;
                        }
                        input[type="range"]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 24px;
                            height: 24px;
                            background: transparent;
                            cursor: pointer;
                            margin-top: -8px;
                            position: relative;
                            z-index: 1;
                        }
                        input[type="range"]::-moz-range-thumb {
                            width: 24px;
                            height: 24px;
                            background: transparent;
                            cursor: pointer;
                            border: none;
                            position: relative;
                            z-index: 1;
                        }
                        input[type="range"]::-webkit-slider-runnable-track {
                            height: 8px;
                            background: #ccf2e3;
                            border-radius: 4px;
                        }
                        input[type="range"]::-moz-range-track {
                            height: 8px;
                            background: #ccf2e3;
                            border-radius: 4px;
                        }
                    
                    /* Additional react-select styles */
                    .react-select-container .react-select__control {
                        height: 42px;
                        min-height: 42px;
                    }
                    
                    .react-select-container .react-select__value-container {
                        padding: 0 8px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                    }
                    
                    .react-select-container .react-select__single-value {
                        margin: 0;
                    }
                    
                    .react-select-container .react-select__menu {
                        margin-top: 4px;
                    }
                    
                    .react-select-container .react-select__option {
                        transition: all 0.2s;
                    }
                    
                    .react-select-container .react-select__option:hover {
                        background-color: #10b981;
                        color: white;
                    }
                    ${dropdownStyles}
                    `}
            </style>
        </div>
    );
};

export default FiltersSidebar;
