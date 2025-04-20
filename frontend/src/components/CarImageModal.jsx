import React, { useState } from "react";

const CarImageModal = ({ image, isOpen, onClose }) => {
    const [scale, setScale] = useState(1);

    if (!isOpen) return null;

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale((prev) => Math.min(prev + 0.2, 2.5)); // Max zoom 2.5x
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]"
            onClick={onClose}
        >
            {/* Zoom controls */}
            <button
                onClick={handleZoomIn}
                className="absolute bottom-8 right-20 bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-white/20 transition-colors z-10"
            >
                +
            </button>
            <button
                onClick={handleZoomOut}
                className="absolute bottom-8 right-36 bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-white/20 transition-colors z-10"
            >
                −
            </button>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-xl p-2 hover:text-gray-300 z-10"
            >
                ✕
            </button>

            {/* Image container with fixed dimensions */}
            <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
                <div className="w-[800px] h-[500px] relative flex items-center justify-center">
                    <img
                        src={image}
                        alt="Vehicle"
                        className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300"
                        style={{
                            transform: `scale(${scale})`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        </div>
    );
};

export default CarImageModal;
