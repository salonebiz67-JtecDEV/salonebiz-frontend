const API_BASE =
    "https://salonebiz-backend.onrender.com";


/* =====================================================
   CORE API REQUEST
===================================================== */

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


/* =====================================================
   SESSION STORAGE
===================================================== */

const SESSION_KEY = "salonebiz_user";


export function saveSession(user) {

    if (!user) return;

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );
}


export function getSession() {

    try {

        const saved =
            localStorage.getItem(SESSION_KEY);

        if (!saved) {
            return null;
        }

        return JSON.parse(saved);

    } catch {

        return null;
    }
}


export function isLoggedIn() {

    return getSession() !== null;
}


export function logout() {

    localStorage.removeItem(SESSION_KEY);
}


/* =====================================================
   API HEALTH
===================================================== */

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
            status: "offline",
            message: error.message
        };
    }
}


/* =====================================================
   LOGIN
===================================================== */

export async function login(
    email,
    password
) {

    const result =
        await apiRequest(
            "/api/auth/login",
            {
                method: "POST",

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

    /*
       Save ONLY the returned user information.

       Never save the user's password.
    */

    if (
        result.success &&
        result.user
    ) {

        saveSession(result.user);
    }

    return result;
}


/* =====================================================
   REGISTER
===================================================== */

export async function register(
    name,
    email,
    password,
    phone
) {

    const result =
        await apiRequest(
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

    return result;
}


/* =====================================================
   CURRENT USER
===================================================== */

export function getCurrentUser() {

    return getSession();
}


/* =====================================================
   GENERIC GET
===================================================== */

export async function apiGet(
    endpoint
) {

    return apiRequest(
        endpoint,
        {
            method: "GET"
        }
    );
}


/* =====================================================
   GENERIC POST
===================================================== */

export async function apiPost(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "POST",

            body: JSON.stringify(body)
        }
    );
}


/* =====================================================
   GENERIC PUT
===================================================== */

export async function apiPut(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "PUT",

            body: JSON.stringify(body)
        }
    );
}


/* =====================================================
   GENERIC DELETE
===================================================== */

export async function apiDelete(
    endpoint
) {

    return apiRequest(
        endpoint,
        {
            method: "DELETE"
        }
    );
}


/* =====================================================
   API BASE URL
===================================================== */

export {
    API_BASE
};
