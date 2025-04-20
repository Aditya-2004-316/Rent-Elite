import React from "react";
import LandingNavbar from "./LandingNavbar";
import { useSettings } from "../context/SettingsContext";

// This wrapper ensures the landing navbar never uses dark mode
const LandingNavbarWrapper = () => {
    const settings = useSettings();

    // Create a modified settings object with darkMode always set to false
    const lightModeSettings = {
        ...settings,
        darkMode: false,
    };

    return (
        <SettingsOverride value={lightModeSettings}>
            <LandingNavbar />
        </SettingsOverride>
    );
};

// A component to override context values
const SettingsOverride = ({ value, children }) => {
    const SettingsContext = React.useMemo(() => {
        return React.createContext(value);
    }, [value]);

    return (
        <SettingsContext.Provider value={value}>
            {React.cloneElement(children, {
                useSettings: () => React.useContext(SettingsContext),
            })}
        </SettingsContext.Provider>
    );
};

export default LandingNavbarWrapper;
