// ======================================================
// SALONEBIZ FRONTEND CONFIGURATION
// ======================================================

// Replace this with your REAL Render backend URL.
//
// Example:
//
// export const API_BASE_URL =
//     "https://salonebiz-backend.onrender.com";

export const API_BASE_URL =
    "https://salonebiz-backend.onrender.com";


export const API = {

    health:
        `${API_BASE_URL}/api/health`,

    login:
        `${API_BASE_URL}/api/auth/login`,

    register:
        `${API_BASE_URL}/api/auth/register`

};
