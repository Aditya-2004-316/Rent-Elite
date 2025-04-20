import React, { useState, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import robotAssistant from "../assets/robot-assistant.png";
import robot from "../assets/robot.png";

const ChatBot = () => {
    const { translate, darkMode } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [hasGreeted, setHasGreeted] = useState(false);

    // Enhanced patterns with more natural responses and new features
    const patterns = [
        {
            matches: ["hello", "hi", "hey", "greetings"],
            response:
                "Hi there! 👋 I'm your Rent Elite virtual assistant. How can I make your car rental experience better today?",
        },
        {
            matches: ["bye", "goodbye", "see you"],
            response:
                "Thanks for chatting! If you need anything else, I'll be right here. Have a great day! 😊",
        },
        {
            matches: ["thank you", "thanks"],
            response:
                "You're welcome! 😊 Is there anything else you'd like to know about our services?",
        },

        // User requested specific questions
        {
            matches: [
                "how do i choose a car",
                "how to choose a car",
                "how do i choose a particular car",
                "how do i choose a particular car?",
                "select car",
                "picking a car",
            ],
            response:
                "To choose a particular car on Rent Elite:\n\n1. Browse our 'Premium Fleet' on the dashboard\n2. Use filters to narrow down options by brand, price, type, etc.\n3. Click on any car to view detailed specifications\n4. Check the car's star rating, price, and availability\n5. Click 'Book Now' once you've found your perfect match\n\nYou can also use the search bar at the top to find a specific model! 🚗",
        },
        {
            matches: [
                "how do the filters work",
                "explain filters",
                "using filters",
                "filter explanation",
                "help with filters",
            ],
            response:
                "Our car filters are designed to help you find the perfect vehicle:\n\n1. Company Filter: Select brands like Ferrari, Lamborghini, etc.\n2. Price Range: Adjust the slider to set your budget\n3. Fuel Type: Choose between Petrol, Electric, or Hybrid\n4. Transmission: Select Automatic or Manual\n5. Car Type: Filter by category (Sports Car, Supercar, etc.)\n\nAll filters can be used simultaneously and update instantly! Simply adjust any filter, and the car list will automatically refresh to show matching vehicles. 🔍",
        },
        {
            matches: [
                "how can i book a car",
                "how can i book a car?",
                "book a car",
                "how to book",
                "booking process",
                "rent car",
                "how do i book",
                "booking steps",
                "make reservation",
            ],
            response:
                "Booking a car with Rent Elite is simple:\n\n1. Find your desired car through search or filters\n2. Click 'Book Now' on the car details page\n3. Select your rental dates and time\n4. Review the details and total cost\n5. Confirm your personal information\n6. Choose payment method and complete payment\n7. Receive confirmation email with booking details\n\nYour booking will be visible in 'My Bookings' section of your profile! 🗓️",
        },
        {
            matches: [
                "how to contact rent elite",
                "how to contact rent elite?",
                "contact information",
                "how can i contact you",
                "contact details",
                "support contact",
                "contact support",
                "help",
                "customer service",
                "support number",
            ],
            response:
                "Contact Rent Elite through multiple channels:\n\n• Phone: +1-800-RENT-ELITE (Available 24/7)\n• Email: support@rentelite.com\n• Live Chat: Click the chat icon on our website (That's me! 👋)\n• Social Media: @RentElite on Twitter, Instagram and Facebook\n• Visit: Our physical locations in major cities (check the Locations page)\n\nOur customer service team is available 24/7 to assist you with any queries or concerns! 📞",
        },
        {
            matches: [
                "how can i access my booked cars",
                "how can i access my booked cars?",
                "view bookings",
                "see my reservations",
                "check my bookings",
                "my booked cars",
                "reservation history",
                "booking history",
            ],
            response:
                "To access your booked cars:\n\n1. Log in to your Rent Elite account\n2. Click on 'My Bookings' in the navigation menu\n3. View all your current and past bookings\n4. Click on any booking to see full details including:\n   • Car information\n   • Pickup and return dates\n   • Total cost\n   • Booking status\n\nYou can also manage or cancel bookings from this section (cancellation policy applies). 📋",
        },
        {
            matches: [
                "how can i access my favourited cars",
                "how can i access my favourited cars?",
                "saved cars",
                "favorite vehicles",
                "my favorites",
                "view favourites",
                "favourited cars",
                "liked cars",
            ],
            response:
                "To access your favorited cars:\n\n1. Log in to your Rent Elite account\n2. Click on 'Favorites' in the navigation menu\n3. View all cars you've saved by clicking the heart icon\n4. Click on any car to view details or proceed with booking\n\nFavoriting cars makes it easy to compare and come back to them later! To add a car to favorites, simply click the heart icon on any car card. ❤️",
        },

        // Additional basic questions (10-15 more)
        {
            matches: [
                "what is the minimum rental period",
                "what is the minimum rental period?",
                "minimum rental time",
                "shortest rental",
                "minimum booking period",
            ],
            response:
                "The minimum rental period at Rent Elite is 24 hours (1 day). All cars are rented on a daily basis, and partial days are charged as full days. For luxury and high-performance vehicles, we recommend at least a 2-day rental to fully enjoy the experience! ⏱️",
        },
        {
            matches: [
                "what happens if i damage the car",
                "what happens if i damage the car?",
                "car damage",
                "damage policy",
                "accident procedure",
                "car insurance",
            ],
            response:
                "If the car is damaged during your rental:\n\n1. Ensure everyone's safety first\n2. Document the damage with photos\n3. Report it immediately to our 24/7 support line\n4. Complete an incident report\n\nAll rentals include standard insurance, but you're responsible for the deductible (varies by car model). We offer premium insurance options to reduce or eliminate your liability. Details are provided during the booking process. 🛡️",
        },
        {
            matches: [
                "is there a security deposit",
                "is there a security deposit?",
                "deposit amount",
                "security deposit",
                "how much is the deposit",
            ],
            response:
                "Yes, Rent Elite requires a security deposit for all rentals. The amount varies based on the car category:\n\n• Standard Luxury: $1,000\n• Premium Luxury: $2,500\n• Supercars: $5,000\n• Hypercars: $10,000+\n\nThe deposit is held as a credit card authorization (not charged) and released within 3-5 business days after the car is returned in good condition. 💳",
        },
        {
            matches: [
                "how old do i need to be",
                "how old do i need to be?",
                "age requirement",
                "minimum age",
                "driver age",
                "age restriction",
            ],
            response:
                "Age requirements at Rent Elite:\n\n• Standard Luxury: Minimum 25 years old\n• Premium Luxury: Minimum 25 years old\n• Supercars: Minimum 30 years old\n• Hypercars: Minimum 30 years old + prior supercar experience\n\nAll drivers must have a valid driver's license held for at least 3 years and a clean driving record. Additional requirements may apply for certain vehicles. 🪪",
        },
        {
            matches: [
                "can i extend my rental",
                "extend booking",
                "rental extension",
                "keep the car longer",
                "prolong rental",
            ],
            response:
                "Yes, you can extend your rental if the car is available:\n\n1. Log in to your account and go to 'My Bookings'\n2. Select the active booking you wish to extend\n3. Click 'Request Extension'\n4. Select the new return date/time\n5. Confirm and pay for the additional days\n\nAlternatively, call our customer service at least 24 hours before your scheduled return. Extensions are subject to availability and may have adjusted rates. ⏳",
        },
        {
            matches: [
                "what if i return the car late",
                "late return",
                "delay return",
                "return car late",
                "late fee",
            ],
            response:
                "Late returns are charged as follows:\n\n• Up to 1 hour late: 25% of daily rate\n• 1-3 hours late: 50% of daily rate\n• 3+ hours late: Full additional day charge\n\nPlease contact us immediately if you expect to be late. No-show or excessive lateness without communication may result in additional fees and affect future rental eligibility. We recommend extending your booking if you need more time. ⏰",
        },
        {
            matches: [
                "do you deliver the car",
                "do you deliver the car?",
                "car delivery",
                "vehicle delivery",
                "deliver to location",
                "car pickup",
            ],
            response:
                "Yes! We offer convenient delivery and pickup services:\n\n• Airport delivery: Available at major airports ($50-150)\n• Hotel delivery: Available at partner hotels ($50-200)\n• Home/Office delivery: Available within service areas ($100-300)\n\nDelivery fees vary based on location and distance. You can select delivery options during the booking process. Our concierge will coordinate with you directly for handover. 🚚",
        },
        {
            matches: [
                "how do i compare cars",
                "how do i compare cars?",
                "compare vehicles",
                "car comparison",
                "vehicle comparison",
                "which car is better",
            ],
            response:
                "To compare cars on Rent Elite:\n\n1. Add cars to compare by clicking the 'Compare' button on car cards\n2. Go to the 'Compare' page via the navigation menu\n3. View side-by-side comparisons of:\n   • Performance specs\n   • Pricing\n   • Features\n   • Availability\n   • Customer ratings\n\nYou can compare up to 3 cars simultaneously. This makes it easy to find the perfect vehicle for your needs and preferences! 📊",
        },
        {
            matches: [
                "can i cancel my booking",
                "can i cancel my booking?",
                "booking cancellation",
                "cancel reservation",
                "refund policy",
                "cancel my car",
            ],
            response:
                "Yes, you can cancel bookings with our flexible cancellation policy:\n\n• 7+ days before pickup: 100% refund\n• 3-7 days before pickup: 75% refund\n• 24-72 hours before pickup: 50% refund\n• Less than 24 hours: No refund\n\nTo cancel, go to 'My Bookings', select the reservation, and click 'Cancel Booking'. Premium bookings and special events may have different cancellation terms that will be clearly outlined during booking. 📝",
        },
        {
            matches: [
                "how much fuel should be in the car",
                "how much fuel should be in the car?",
                "fuel policy",
                "gas tank",
                "refueling",
                "fuel requirement",
            ],
            response:
                "Our fuel policy is simple: return the car with the same fuel level as when you received it (typically full tank).\n\n• Cars are provided with a full tank\n• Return with full tank to avoid refueling charges\n• If returned with less fuel, you'll be charged for refueling plus a $50 service fee\n• Premium fuel is required for performance vehicles\n\nElectric vehicles should be returned with at least 50% battery charge. ⛽",
        },
        {
            matches: [
                "what if the car breaks down",
                "what if the car breaks down?",
                "car breakdown",
                "vehicle malfunction",
                "mechanical issue",
                "car not working",
            ],
            response:
                "In case of a breakdown:\n\n1. Pull over safely and ensure everyone's safety\n2. Call our 24/7 emergency hotline: +1-800-ELITE-SOS\n3. Our roadside assistance will be dispatched immediately\n\nAll rentals include complimentary roadside assistance. If the issue is mechanical and not driver-caused, we'll arrange a replacement vehicle (subject to availability) or provide a refund for unused rental days. Your safety is our priority! 🛠️",
        },
        {
            matches: [
                "do you have electric cars",
                "do you have electric cars?",
                "ev availability",
                "electric vehicle",
                "tesla rental",
                "electric sports car",
            ],
            response:
                "Yes! Our electric vehicle fleet includes:\n\n• Performance EVs: Tesla Model S Plaid, Porsche Taycan Turbo S\n• Luxury EVs: Audi e-tron GT, Mercedes EQS\n• Hypercars: Rimac Nevera, Lotus Evija\n\nAll electric rentals include:\n• Charging cable\n• Charging station locator\n• 50% minimum charge on pickup\n• Instructions for optimal use\n\nYou can filter for 'Electric' in our fuel type filters to see all available options! ⚡",
        },
        {
            matches: [
                "can i rent for someone else",
                "can i rent for someone else?",
                "booking for another person",
                "rent on behalf",
                "gift rental",
                "another driver",
            ],
            response:
                "Yes, you can book a rental for someone else, but with conditions:\n\n1. You must complete the booking and payment process\n2. The intended driver must meet our age and license requirements\n3. The driver must be present at pickup with their license and credit card\n4. An additional driver form must be completed\n\nWe also offer Gift Cards if you'd like to give someone the freedom to choose their own car and dates. There's a $50 additional driver fee for non-spouses. 🎁",
        },
        {
            matches: [
                "loyalty program",
                "rewards",
                "elite membership",
                "frequent renter",
                "discount program",
            ],
            response:
                "Rent Elite offers a premium loyalty program with three tiers:\n\n• Silver (3+ rentals/year): 5% discount, priority customer service\n• Gold (5+ rentals/year): 10% discount, free upgrades when available\n• Platinum (10+ rentals/year): 15% discount, free delivery, exclusive events\n\nYou're automatically enrolled after your first rental. Points are earned based on rental amount and can be redeemed for free rental days, upgrades, or exclusive experiences. 🏆",
        },
        {
            matches: [
                "mileage limit",
                "how many miles",
                "distance restriction",
                "kilometre allowance",
                "mileage policy",
            ],
            response:
                "Our standard mileage allowance:\n\n• Standard Luxury: 250 miles/day\n• Premium Luxury: 200 miles/day\n• Supercars: 150 miles/day\n• Hypercars: 100 miles/day\n\nAdditional miles can be purchased during booking at discounted rates or pay per extra mile upon return:\n• Standard/Premium: $0.75/mile\n• Supercars: $2.00/mile\n• Hypercars: $5.00/mile\n\nUnlimited mileage packages are available for select vehicles on rentals of 3+ days. 🛣️",
        },
        {
            matches: [
                "how do i update my profile",
                "how do i update my profile?",
                "edit account",
                "change personal information",
                "update contact details",
                "profile settings",
            ],
            response:
                "To update your profile information:\n\n1. Log in to your Rent Elite account\n2. Click on your profile icon in the top right\n3. Select 'Profile' from the dropdown menu\n4. In the Personal Info tab, click 'Edit Profile'\n5. Update your information as needed\n6. Click 'Save Changes' to confirm\n\nYou can update your name, contact information, address, driver's license, and notification preferences. Your email address cannot be changed without contacting support. 👤",
        },
        {
            matches: [
                "upload documents",
                "verify identity",
                "license verification",
                "submit documents",
                "identity check",
            ],
            response:
                "To upload or update your documents:\n\n1. Log in to your Rent Elite account\n2. Go to Profile > Documents\n3. Select the document type to upload\n4. Take a clear photo or upload existing file\n5. Submit for verification\n\nRequired documents include:\n• Driver's license (front and back)\n• Secondary ID (passport or ID card)\n• Proof of insurance (if using own insurance)\n\nDocument verification typically takes 2-24 hours. All documents must be valid and current. 📄",
        },
        {
            matches: [
                "how to pay",
                "how to pay?",
                "payment options",
                "payment methods",
                "accepted payment",
                "how do i pay",
            ],
            response:
                "Rent Elite accepts the following payment methods:\n\n• Credit Cards: Visa, Mastercard, American Express, Discover\n• Debit Cards: With Visa/Mastercard logo (additional security deposit may apply)\n• PayPal: For online bookings only\n• Apple Pay/Google Pay: On our mobile app\n• Bank Transfer: For bookings >$5,000 (requires advance processing)\n\nThe payment card must be in the renter's name and present at pickup. Corporate bookings may use company cards with authorization letter. 💳",
        },
        {
            matches: [
                "car not available",
                "unavailable vehicle",
                "car replacement",
                "substitute car",
                "alternative model",
            ],
            response:
                "If your booked car becomes unavailable due to mechanical issues or unforeseen circumstances:\n\n1. We'll notify you immediately via call and email\n2. We'll offer a comparable or higher-class replacement at no extra cost\n3. You'll have the option to choose an alternative vehicle\n4. If no suitable alternative is available, we'll provide a full refund\n\nWe take pride in our fleet maintenance, but in rare cases where this happens, we ensure minimal disruption to your plans. 🔄",
        },
        {
            matches: [
                "how to leave a review",
                "rate my experience",
                "review rental",
                "feedback",
                "rate the car",
            ],
            response:
                "To leave a review after your rental:\n\n1. Log in to your Rent Elite account\n2. Go to 'My Bookings'\n3. Find the completed rental\n4. Click 'Leave Review'\n5. Rate your experience (1-5 stars)\n6. Add comments about the car and service\n7. Upload photos (optional)\n\nYour feedback helps us improve and assists other customers in making informed decisions. Reviews appear on our website after moderation (typically 24-48 hours). ⭐",
        },

        // Original patterns continue below
        {
            matches: [
                "cancel booking",
                "cancellation",
                "cancel reservation",
                "how to cancel",
            ],
            response:
                "To cancel your booking:\n1. Go to 'My Bookings'\n2. Find your reservation\n3. Click 'Cancel Booking'\n\nNote: Free cancellation is available up to 48 hours before pickup.",
        },
        {
            matches: [
                "payment method",
                "payment options",
                "how to pay",
                "accepted payment",
            ],
            response:
                "We accept:\n- Credit/Debit Cards\n- PayPal\n- Net Banking\n- UPI (for Indian customers)\n\nAll payments are secured with end-to-end encryption.",
        },
        {
            matches: [
                "documents required",
                "what documents",
                "documents needed",
                "required documents",
            ],
            response:
                "Required documents:\n- Valid Driver's License\n- Government ID Proof\n- Credit Card\n- Insurance Information\n\nInternational customers also need:\n- Passport\n- International Driving Permit",
        },
        {
            matches: ["price", "cost", "rate", "charges"],
            response:
                "Our rental rates vary based on the car model and duration. Would you like me to:\n1. Show you our current offers?\n2. Explain our pricing structure?\n3. Help you find cars within your budget?\n\nJust let me know what works best for you! 🚗",
        },
        {
            matches: [
                "how are you",
                "how're you",
                "how you doing",
                "what's up",
                "whats up",
                "how do you do",
                "how is it going",
            ],
            response:
                "I'm doing great, thanks for asking! 😊 I'm here and ready to help you find the perfect car rental. How can I assist you today?",
        },
        {
            matches: [
                "who are you",
                "what are you",
                "what can you do",
                "your name",
                "tell me about yourself",
            ],
            response:
                "I'm the Rent Elite virtual assistant! 🤖 I can help you with:\n• Finding the perfect car\n• Booking process\n• Managing reservations\n• Answering questions about our services\n• And much more!\n\nWhat would you like help with?",
        },
        {
            matches: [
                "good morning",
                "morning",
                "good afternoon",
                "good evening",
            ],
            response:
                "Hello! 👋 It's great to see you! I hope you're having a wonderful day. How may I assist you with your car rental needs?",
        },
        {
            matches: [
                "are you human",
                "are you real",
                "are you a bot",
                "are you ai",
            ],
            response:
                "I'm an AI chatbot designed to help you with Rent Elite's services! 🤖 While I'm not human, I'm here to provide quick and helpful assistance with your car rental needs. What can I help you with today?",
        },
        {
            matches: ["how's the weather", "what's the weather", "weather"],
            response:
                "While I can't tell you about the weather, I can help you find the perfect car for any weather condition! 😊 Would you like to see our all-weather vehicles or perhaps our convertibles for sunny days?",
        },
        {
            matches: [
                "compare cars",
                "how to compare",
                "car comparison",
                "compare features",
            ],
            response:
                "To compare cars:\n1. Click on 'Compare' in the navigation bar\n2. Select up to 3 cars you want to compare\n3. View detailed comparison including:\n   • Price per day\n   • Engine specifications\n   • Top speed\n   • Transmission type\n   • Fuel type\n   • Seating capacity\n   • Points system (out of 5)\n\nThe comparison page will help you make an informed decision based on your preferences! 🚗",
        },
        {
            matches: ["dark mode", "light mode", "theme", "change theme"],
            response:
                "You can easily switch between Dark and Light modes:\n1. Click on your profile icon\n2. Go to Settings\n3. Toggle the Dark Mode switch\n\nDark mode provides better visibility in low-light conditions and reduces eye strain! 🌙",
        },
        {
            matches: [
                "two factor",
                "2fa",
                "authentication",
                "security",
                "secure account",
            ],
            response:
                "Two-Factor Authentication (2FA) adds extra security to your account:\n1. Go to Settings > Security\n2. Enable Two-Factor Authentication\n3. Set up your security question\n4. Verify your email\n\nWhen enabled, you'll need to answer your security question for sensitive actions! 🔒",
        },
        {
            matches: [
                "profile visibility",
                "hide profile",
                "show profile",
                "privacy",
            ],
            response:
                "Manage your profile visibility in Settings:\n1. Go to Settings > Privacy\n2. Choose who can see your:\n   • Profile information\n   • Booking history\n   • Activity status\n3. Save your preferences\n\nYou're in control of your privacy! 🛡️",
        },
        {
            matches: ["activity status", "online status", "last seen"],
            response:
                "Control your activity status:\n1. Go to Settings > Privacy\n2. Find 'Activity Status'\n3. Choose to show:\n   • When you're online\n   • Last seen time\n   • Hide completely\n\nManage who sees when you're active! 🟢",
        },
        {
            matches: ["change currency", "currency settings", "money"],
            response:
                "Change your preferred currency:\n1. Go to Settings > Currency\n2. Choose from available currencies:\n   • USD ($)\n   • EUR (€)\n   • GBP (£)\n   • INR (₹)\n\nAll prices will automatically convert to your selected currency! 💱",
        },
        {
            matches: ["points system", "car rating", "how points work"],
            response:
                "Our 5-point rating system considers:\n1. Price (lowest price gets 1 point)\n2. Top Speed (highest speed gets 1 point)\n3. Transmission (automatic gets 1 point)\n4. Fuel Type:\n   • Hybrid: 2 points\n   • Electric/Petrol: 1 point\n\nThis helps you compare cars objectively! ⭐",
        },
        // New feature patterns
        {
            matches: [
                "change password",
                "reset password",
                "update password",
                "forgot password",
                "password reset",
            ],
            response:
                "To change or reset your password:\n\n1. Go to Profile > Settings tab\n2. Scroll down to the 'Change Password' section\n3. Enter your current password\n4. Enter your new password and confirm it\n5. Click 'Update Password'\n\nYour password will be updated securely across all systems! 🔐",
        },
        {
            matches: [
                "filter cars",
                "search cars",
                "find car",
                "car filters",
                "search filters",
                "filter options",
            ],
            response:
                "You can filter cars using our advanced search options:\n\n1. Company: Select from luxury brands like Ferrari, Lamborghini, etc.\n2. Price Range: Set your budget with the slider\n3. Fuel Type: Choose between Petrol, Electric, or Hybrid\n4. Transmission: Select Automatic or Manual\n5. Car Type: Pick from categories like Supercar, Luxury SUV, etc.\n\nAll filters can be combined to find your perfect car! 🚗",
        },
        {
            matches: [
                "car types",
                "vehicle categories",
                "types of cars",
                "car categories",
            ],
            response:
                "We offer various car types:\n\n• Sports Car: High-performance vehicles\n• Luxury Sports Car: Premium sports cars\n• Supercar: Ultra-high performance vehicles\n• Hypercar: Highest tier performance cars\n• Luxury SUV: Premium utility vehicles\n• Electric Sports Car: High-performance electric vehicles\n• Hybrid Supercar: Performance cars with hybrid engines\n\nEach category has unique features and price points! 🏎️",
        },
        {
            matches: [
                "fuel types",
                "engine types",
                "petrol cars",
                "electric cars",
                "hybrid cars",
            ],
            response:
                "We offer vehicles with three fuel types:\n\n1. Petrol 🛢️: Traditional high-performance engines\n2. Electric ⚡: Zero-emission vehicles with instant torque\n3. Hybrid ♻️: Combines combustion engine with electric motors for efficiency\n\nYou can filter our fleet by fuel type in the search filters!",
        },
        {
            matches: ["transmission", "automatic", "manual", "gearbox"],
            response:
                "We offer two transmission types:\n\n1. Automatic 🔄: Easy to drive with no manual shifting\n2. Manual 🔧: Full control over gear selection for driving enthusiasts\n\nYou can select your preferred transmission type using our search filters!",
        },
        {
            matches: ["companies", "car brands", "manufacturers", "car makes"],
            response:
                "We offer vehicles from premium manufacturers including:\n\n• Ferrari\n• Lamborghini\n• Bugatti\n• Porsche\n• McLaren\n• Koenigsegg\n• Rolls-Royce\n• Bentley\n• Mercedes\n• Aston Martin\n• BMW\n• Audi\n• And more!\n\nYou can filter by company in our search filters! 🏁",
        },
    ];

    // Enhanced findBestMatch function with FAQ suggestion
    const findBestMatch = (input) => {
        const normalizedInput = input.toLowerCase();

        // Check for direct matches first
        for (const pattern of patterns) {
            if (
                pattern.matches.some((match) =>
                    normalizedInput.includes(match.toLowerCase())
                )
            ) {
                return pattern.response;
            }
        }

        // If no direct match, provide a helpful response with FAQ suggestion
        const noMatchResponse = [
            "I'm not quite sure about that one. 🤔 Let me help you find the right information:",
            "\n1. Check our FAQ page for detailed answers: [FAQ Link]",
            "\n2. Contact our support team 24/7",
            "\n3. Try rephrasing your question",
            "\nOr, you can ask me about:",
            "\n• Booking process and cancellations",
            "• Available cars and fleet details",
            "• Car comparison and ratings",
            "• Points system and how it works",
            "• Pricing and payment methods",
            "• Currency settings and conversions",
            "• Dark mode and theme settings",
            "• Two-factor authentication (2FA)",
            "• Profile visibility and privacy",
            "• Activity status settings",
            "• Required documents",
            "• Support and contact information",
            "• Password reset/change",
            "• Car filters and search options",
            "• Car types and categories",
            "• Fuel types and transmissions",
            "• Car manufacturers and brands",
            "• Age requirements and policies",
            "• Damage and insurance policies",
            "• Mileage limits and fees",
            "• Security deposits",
            "• Fuel policies",
            "• Breakdown assistance",
            "• Delivery and pickup options",
            "\nWhat would you like to know more about? 😊",
        ].join("\n");

        return noMatchResponse;
    };

    // Enhanced message handling with typing indicator
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        setMessages((prev) => [
            ...prev,
            { type: "user", content: inputMessage },
        ]);

        // Show typing indicator
        setIsTyping(true);

        // Get bot response
        const botResponse = findBestMatch(inputMessage);

        // Simulate natural typing delay (varying based on response length)
        const typingDelay = Math.min(1000 + botResponse.length * 10, 3000);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { type: "bot", content: botResponse },
            ]);
            setIsTyping(false);
        }, typingDelay);

        setInputMessage("");
    };

    useEffect(() => {
        // Only add the welcome message when the chat is opened and hasn't greeted yet
        if (isOpen && !hasGreeted) {
            setTimeout(() => {
                setMessages([
                    {
                        type: "bot",
                        content: "Hello! How can I assist you today?",
                    },
                ]);
                setHasGreeted(true);
            }, 500);
        }
    }, [isOpen, hasGreeted]);

    // Helper function to format message content with proper line breaks
    const formatMessage = (content) => {
        // Replace \n with proper line breaks for rendering
        return content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i < content.split("\n").length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 ${
                    isOpen ? "scale-0" : "scale-100"
                }`}
            >
                <img
                    src={robotAssistant}
                    alt="Robot Assistant Icon"
                    className="w-8 h-8"
                />
            </button>

            {/* Chat Window */}
            <div
                className={`absolute bottom-0 right-0 w-96 ${
                    darkMode ? "bg-[#121212]" : "bg-white"
                } rounded-lg shadow-xl transition-all duration-300 transform ${
                    isOpen ? "scale-100" : "scale-0"
                }`}
            >
                {/* Header */}
                <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={robot} alt="Robot Icon" className="w-6 h-6" />
                        <h3 className="font-semibold">Rent Elite Assistant</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Messages */}
                <div
                    className={`h-96 overflow-y-auto p-4 space-y-4 ${
                        darkMode ? "text-[#E4E6EB]" : ""
                    }`}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.type === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.type === "user"
                                        ? "bg-emerald-600 text-white rounded-br-none"
                                        : darkMode
                                        ? "bg-[#2A2A2A] text-[#E4E6EB] rounded-bl-none"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                            >
                                {formatMessage(message.content)}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div
                                className={`${
                                    darkMode
                                        ? "bg-[#2A2A2A] text-[#E4E6EB]"
                                        : "bg-gray-100 text-gray-800"
                                } p-3 rounded-lg rounded-bl-none`}
                            >
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.4s" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSendMessage}
                    className={`p-4 border-t ${
                        darkMode ? "border-[#393939]" : ""
                    }`}
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                                darkMode
                                    ? "bg-[#2A2A2A] border-[#393939] text-[#E4E6EB]"
                                    : "bg-white border-gray-300"
                            }`}
                        />
                        <button
                            type="submit"
                            className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
