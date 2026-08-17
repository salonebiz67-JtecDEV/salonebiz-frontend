const API_BASE =
    "https://salonebiz-backend.onrender.com";

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {
            success: false,
            message: "Invalid server response"
        };
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            `Request failed: ${response.status}`
        );
    }

    return data;
}


/* =====================================
   HEALTH
===================================== */

export async function checkAPI() {

    try {

        const result =
            await apiRequest("/api/health");

        return result;

    } catch (error) {

        console.error(
            "API health error:",
            error
        );

        return {
            success: false,
            status: "offline"
        };
    }
}


/* =====================================
   LOGIN
===================================== */

export async function login(email, password) {

    return apiRequest(
        "/api/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                email,
                password
            })
        }
    );
}


/* =====================================
   REGISTER
===================================== */

export async function register(
    name,
    email,
    password,
    phone
) {

    return apiRequest(
        "/api/auth/register",
        {
            method: "POST",

            body: JSON.stringify({
                name,
                email,
                password,
                phone
            })
        }
    );
}
