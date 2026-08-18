// =====================================================
// 🇸🇱 SALONEBIZ FRONTEND CONFIGURATION
// =====================================================

export const API_BASE_URL =
    "https://salonebiz-backend.onrender.com";


export const CONFIG = {

    // =================================================
    // APP
    // =================================================

    APP_NAME:
        "SaloneBiz",

    VERSION:
        "1.0.0",


    // =================================================
    // BACKEND
    // =================================================

    API_BASE_URL,


    // =================================================
    // API ENDPOINTS
    // =================================================

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


// =====================================================
// GLOBAL CONFIGURATION
// =====================================================

window.SALONEBIZ_CONFIG =
    CONFIG;


window.SALONEBIZ_API_BASE =
    API_BASE_URL;


// =====================================================
// DEBUG
// =====================================================

console.log(
    `🇸🇱 ${CONFIG.APP_NAME} v${CONFIG.VERSION}`
);

console.log(
    "🌐 API:",
    CONFIG.API_BASE_URL
);
