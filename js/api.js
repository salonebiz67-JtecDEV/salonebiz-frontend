const API_BASE =
    "https://salonebiz-backend.onrender.com";


// =====================================================
// SESSION
// =====================================================

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


export function getCurrentUser() {

    return getSession();
}


// =====================================================
// CORE API REQUEST
// =====================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const headers = {
        ...(options.headers || {})
    };

    /*
       Only add JSON content type when
       sending a normal JSON body.
    */

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {
        headers["Content-Type"] =
            "application/json";
    }


    /*
       Add JWT automatically when logged in.
    */

    const user = getSession();

    if (user && user.token) {

        headers["Authorization"] =
            `Bearer ${user.token}`;
    }


    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,
            headers
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


// =====================================================
// API HEALTH
// =====================================================

export async function checkAPI() {

    try {

        return await apiRequest(
            "/api/health"
        );

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


// =====================================================
// AUTH
// =====================================================

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


    if (
        result.success &&
        result.user
    ) {

        /*
           Keep the token if the backend
           provides one.
        */

        saveSession(result.user);
    }


    return result;
}


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


// =====================================================
// GENERIC REQUESTS
// =====================================================

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


export async function apiPatch(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "PATCH",
            body: JSON.stringify(body)
        }
    );
}


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


// =====================================================
// POSTS
// =====================================================

export async function getFeed(
    page = 1,
    limit = 20
) {

    return apiGet(
        `/api/posts/feed?page=${page}&limit=${limit}`
    );
}


export async function getPost(
    postId
) {

    return apiGet(
        `/api/posts/${postId}`
    );
}


export async function createPost(
    image_url,
    caption = ""
) {

    return apiPost(
        "/api/posts",
        {
            image_url,
            caption
        }
    );
}


export async function deletePost(
    postId
) {

    return apiDelete(
        `/api/posts/${postId}`
    );
}


// =====================================================
// USERS / PROFILE / SEARCH
// =====================================================

export async function getMyProfile() {

    return apiGet(
        "/api/users/me"
    );
}


export async function getUserProfile(
    userId
) {

    return apiGet(
        `/api/users/${userId}`
    );
}


// =====================================================
// FRIENDS / FOLLOW
// =====================================================

export async function followUser(
    userId
) {

    return apiPost(
        `/api/friends/${userId}/follow`
    );
}


export async function unfollowUser(
    userId
) {

    return apiDelete(
        `/api/friends/${userId}/follow`
    );
}


// =====================================================
// POST INTERACTIONS
// =====================================================

export async function toggleLike(
    postId
) {

    return apiPost(
        `/api/interactions/posts/${postId}/like`
    );
}


export async function toggleFavorite(
    postId
) {

    return apiPost(
        `/api/interactions/posts/${postId}/favorite`
    );
}


export async function getInteractionStatus(
    postId
) {

    return apiGet(
        `/api/interactions/posts/${postId}`
    );
}


export async function addComment(
    postId,
    text
) {

    return apiPost(
        `/api/interactions/posts/${postId}/comments`,
        {
            text
        }
    );
}


export async function getComments(
    postId
) {

    return apiGet(
        `/api/interactions/posts/${postId}/comments`
    );
}


// =====================================================
// MESSAGES
// =====================================================

export async function sendMessage(
    receiver_id,
    content
) {

    return apiPost(
        "/api/messages",
        {
            receiver_id,
            content
        }
    );
}


export async function getMessages() {

    return apiGet(
        "/api/messages"
    );
}


export async function markMessageRead(
    messageId
) {

    return apiPatch(
        `/api/messages/${messageId}/read`
    );
}


// =====================================================
// API BASE URL
// =====================================================

export {
    API_BASE
};
