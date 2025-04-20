import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant", // Use 'smooth' if you want smooth scrolling
        });
    }, [pathname]);
};

export default useScrollToTop;
