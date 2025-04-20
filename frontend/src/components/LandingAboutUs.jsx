import React from "react";
import { useSettings } from "../context/SettingsContext";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import { motion } from "framer-motion";
import useScrollToTop from "../hooks/useScrollToTop";

const LandingAboutUs = () => {
    useScrollToTop();
    // Import settings but ignore darkMode, always use light mode
    const { darkMode: _ } = useSettings();
    // Force light mode for landing pages
    const darkMode = false;

    return (
        <div className={`min-h-screen bg-white text-gray-900`}>
            <LandingNavbar />

            <div className="container mx-auto px-4 py-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl font-bold text-center mb-12">
                        About Rent Elite
                    </h1>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Our Story
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Founded with a passion for luxury automobiles,
                                Rent Elite has established itself as the premier
                                destination for high-end car rentals. Our
                                journey began with a simple vision: to make
                                extraordinary driving experiences accessible to
                                those who appreciate automotive excellence.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Our Mission
                            </h2>
                            <p className="text-gray-600 mb-4">
                                At Rent Elite, we strive to deliver unparalleled
                                luxury car rental experiences, combining
                                exceptional vehicles with outstanding service.
                                We believe that every journey should be
                                extraordinary, and we're committed to making
                                that belief a reality for our clients.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                Why Choose Us
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: "Premium Fleet",
                                        description:
                                            "Curated selection of the world's finest vehicles",
                                    },
                                    {
                                        title: "Expert Service",
                                        description:
                                            "Dedicated team of automotive enthusiasts",
                                    },
                                    {
                                        title: "Flexible Solutions",
                                        description:
                                            "Customized rental plans to suit your needs",
                                    },
                                    {
                                        title: "24/7 Support",
                                        description:
                                            "Round-the-clock assistance for peace of mind",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-6 rounded-lg bg-gray-50"
                                    >
                                        <h3 className="text-xl font-semibold mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>

            <LandingFooter />
        </div>
    );
};

export default LandingAboutUs;
