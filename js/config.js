// ============================================
// 🇸🇱 SALONEBIZ FRONTEND CONFIGURATION
// ============================================

const API_BASE_URL =
    "https://salonebiz-backend.onrender.com";


const CONFIG = {

    // Backend
    API_BASE_URL,

    // App
    APP_NAME: "SaloneBiz",
    VERSION: "1.0.0",

    // API endpoints
    API: {

        health:
            `${API_BASE_URL}/api/health`,

        login:
            `${API_BASE_URL}/api/auth/login`,

        register:
            `${API_BASE_URL}/api/auth/register`,

        posts:
            `${API_BASE_URL}/api/posts`,

        feed:
            `${API_BASE_URL}/api/posts/feed`,

        users:
            `${API_BASE_URL}/api/users`,

        friends:
            `${API_BASE_URL}/api/friends`,

        interactions:
            `${API_BASE_URL}/api/interactions`,

        messages:
            `${API_BASE_URL}/api/messages`
    }

};


// Make configuration available globally
window.SALONEBIZ_CONFIG = CONFIG;


// Also expose the API base URL directly
window.SALONEBIZ_API_BASE =
    API_BASE_URL;


// Debug information
console.log(
    `🇸🇱 ${CONFIG.APP_NAME} v${CONFIG.VERSION}`
);

console.log(
    "🌐 API:",
    CONFIG.API_BASE_URL
);
