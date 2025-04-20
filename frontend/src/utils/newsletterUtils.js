import emailjs from "emailjs-com";

// EmailJS credentials
const SERVICE_ID = "service_4ffcb8j";
const USER_ID = "ZqfFDcSi_NjM6cL6K";

/**
 * Send a newsletter to a single subscriber
 * @param {string} recipientEmail - Subscriber's email
 * @param {string} subject - Newsletter subject
 * @param {string} content - Newsletter HTML content
 * @param {string} templateID - EmailJS template ID for newsletters
 * @returns {Promise} - EmailJS response
 */
export const sendNewsletterToSubscriber = async (
    recipientEmail,
    subject,
    content,
    templateID = "template_newsletter"
) => {
    const templateParams = {
        to_email: recipientEmail,
        subject: subject,
        content: content,
        from_email: "rentelitecarservice@gmail.com",
    };

    return emailjs.send(SERVICE_ID, templateID, templateParams, USER_ID);
};

/**
 * Send a newsletter to all subscribers stored in localStorage
 * @param {string} subject - Newsletter subject
 * @param {string} content - Newsletter HTML content
 * @param {string} templateID - EmailJS template ID
 * @returns {Object} - Results of the sending operation
 */
export const sendNewsletterToAllSubscribers = async (
    subject,
    content,
    templateID = "template_newsletter"
) => {
    // Get all subscribers from localStorage
    const subscribers = JSON.parse(
        localStorage.getItem("newsletter_subscribers") || "[]"
    );

    if (!subscribers.length) {
        return { success: false, message: "No subscribers found" };
    }

    const results = {
        total: subscribers.length,
        sent: 0,
        failed: 0,
        errors: [],
    };

    // Send to each subscriber
    for (const subscriber of subscribers) {
        try {
            await sendNewsletterToSubscriber(
                subscriber.email,
                subject,
                content,
                templateID
            );
            results.sent++;
        } catch (error) {
            results.failed++;
            results.errors.push({
                email: subscriber.email,
                error: error.message,
            });
        }
    }

    return {
        success: results.sent > 0,
        ...results,
    };
};

/**
 * Create a simple admin interface to send newsletters
 * This can be imported in an admin panel component
 */
export const NewsletterSender = ({ onSend }) => {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSend = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const sendResult = await sendNewsletterToAllSubscribers(
                subject,
                content
            );
            setResult(sendResult);
            if (onSend) onSend(sendResult);
        } catch (error) {
            setResult({ success: false, message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // ... render newsletter sender form
};
