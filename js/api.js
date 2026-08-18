// =====================================================
// 🇸🇱 SALONEBIZ API CLIENT
// =====================================================

import {
    API_BASE_URL
} from "./config.js";


const API_BASE =
    API_BASE_URL;


const SESSION_KEY =
    "salonebiz_user";

const TOKEN_KEY =
    "salonebiz_token";


// =====================================================
// TOKEN MANAGEMENT
// =====================================================

function getToken() {

    // Preferred location
    const directToken =
        localStorage.getItem(TOKEN_KEY);

    if (directToken) {
        return directToken;
    }


    // Backward compatibility:
    // token may be stored inside the user object
    try {

        const saved =
            localStorage.getItem(
                SESSION_KEY
            );

        if (!saved) {
            return null;
        }

        const user =
            JSON.parse(saved);

        return user?.token || null;

    } catch {

        return null;
    }
}


// =====================================================
// CORE REQUEST
// =====================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () => controller.abort(),
            15000
        );


    try {

        const token =
            getToken();


        const headers = {
            ...(options.headers || {})
        };


        // Add JSON content type only
        // when body is not FormData
        if (
            options.body &&
            !(options.body instanceof FormData)
        ) {

            headers["Content-Type"] =
                "application/json";
        }


        // JWT authentication
        if (token) {

            headers.Authorization =
                `Bearer ${token}`;
        }


        const response =
            await fetch(
                `${API_BASE}${endpoint}`,
                {
                    ...options,

                    signal:
                        controller.signal,

                    headers
                }
            );


        const text =
            await response.text();


        let data;


        try {

            data =
                text
                    ? JSON.parse(text)
                    : {};

        } catch {

            data = {
                success: false,
                message:
                    text ||
                    "Invalid server response"
            };

        }


        // Authentication expired
        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                TOKEN_KEY
            );

            // Do not immediately redirect.
            // Let the current page handle the error.
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                `Request failed (${response.status})`
            );
        }


        return data;

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "Request timed out. Please check your connection."
            );
        }


        throw error;

    } finally {

        clearTimeout(timeout);

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

                body:
                    JSON.stringify({
                        email,
                        password
                    })
            }
        );


    /*
       IMPORTANT:
       Your backend must return the JWT
       as result.token for protected routes.
    */

    if (
        result.success &&
        result.token
    ) {

        localStorage.setItem(
            TOKEN_KEY,
            result.token
        );
    }


    /*
       Save user separately.
       Never save the password.
    */

    if (
        result.success &&
        result.user
    ) {

        const user = {
            ...result.user,

            ...(result.token
                ? {
                    token:
                        result.token
                }
                : {})
        };


        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(user)
        );
    }


    return result;

}


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

                body:
                    JSON.stringify({
                        name,
                        email,
                        password,
                        phone
                    })
            }
        );


    /*
       Some backends automatically log the
       user in after registration.
    */

    if (
        result.success &&
        result.token
    ) {

        localStorage.setItem(
            TOKEN_KEY,
            result.token
        );


        if (result.user) {

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify({
                    ...result.user,
                    token:
                        result.token
                })
            );
        }
    }


    return result;

}


// =====================================================
// LOGOUT
// =====================================================

export function logout() {

    localStorage.removeItem(
        TOKEN_KEY
    );

    localStorage.removeItem(
        SESSION_KEY
    );

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
            "❌ API health error:",
            error
        );


        return {
            success: false,
            status: "offline",
            message:
                error.message
        };
    }

}


// =====================================================
// POSTS / FEED
// =====================================================

export async function getPosts(
    page = 1,
    limit = 20
) {

    return apiRequest(
        `/api/posts/feed?page=${page}&limit=${limit}`
    );

}


export async function getFeed(
    page = 1,
    limit = 20
) {

    return getPosts(
        page,
        limit
    );

}


export async function createPost(
    post = {}
) {

    return apiRequest(
        "/api/posts",
        {
            method: "POST",

            body:
                JSON.stringify({
                    caption:
                        post.caption ||
                        "",

                    image_url:
                        post.image_url ||
                        post.imageUrl ||
                        ""
                })
        }
    );

}


export async function getPost(
    postId
) {

    return apiRequest(
        `/api/posts/${postId}`
    );

}


export async function deletePost(
    postId
) {

    return apiRequest(
        `/api/posts/${postId}`,
        {
            method: "DELETE"
        }
    );

}


// =====================================================
// LIKES
// =====================================================

export async function likePost(
    postId
) {

    return apiRequest(
        `/api/interactions/posts/${postId}/like`,
        {
            method: "POST"
        }
    );

}


export async function unlikePost(
    postId
) {

    // Backend uses the same endpoint
    // as a like/unlike toggle.

    return apiRequest(
        `/api/interactions/posts/${postId}/like`,
        {
            method: "POST"
        }
    );

}


// =====================================================
// FAVORITES
// =====================================================

export async function favoritePost(
    postId
) {

    return apiRequest(
        `/api/interactions/posts/${postId}/favorite`,
        {
            method: "POST"
        }
    );

}


export async function unfavoritePost(
    postId
) {

    // Backend uses the same endpoint
    // as a favorite/unfavorite toggle.

    return apiRequest(
        `/api/interactions/posts/${postId}/favorite`,
        {
            method: "POST"
        }
    );

}


export async function getInteractionStatus(
    postId
) {

    return apiRequest(
        `/api/interactions/posts/${postId}`
    );

}


// =====================================================
// COMMENTS
// =====================================================

export async function getComments(
    postId
) {

    return apiRequest(
        `/api/interactions/posts/${postId}/comments`
    );

}


export async function addComment(
    postId,
    text
) {

    return apiRequest(
        `/api/interactions/posts/${postId}/comments`,
        {
            method: "POST",

            body:
                JSON.stringify({
                    text
                })
        }
    );

}


// =====================================================
// USERS / PROFILES
// =====================================================

export async function getProfile(
    userId = null
) {

    if (userId) {

        return apiRequest(
            `/api/users/${userId}`
        );

    }


    return apiRequest(
        "/api/users/me"
    );

}


export async function getMyProfile() {

    return apiRequest(
        "/api/users/me"
    );

}


export async function getUserProfile(
    userId
) {

    return apiRequest(
        `/api/users/${userId}`
    );

}


// =====================================================
// FRIENDS / FOLLOW
// =====================================================

export async function followUser(
    userId
) {

    return apiRequest(
        `/api/friends/${userId}/follow`,
        {
            method: "POST"
        }
    );

}


export async function unfollowUser(
    userId
) {

    return apiRequest(
        `/api/friends/${userId}/follow`,
        {
            method: "DELETE"
        }
    );

}


export async function getFollowers(
    userId
) {

    return apiRequest(
        `/api/friends/${userId}/followers`
    );

}


export async function getFollowing(
    userId
) {

    return apiRequest(
        `/api/friends/${userId}/following`
    );

}


// =====================================================
// MESSAGES
// =====================================================

export async function sendMessage(
    receiver_id,
    content
) {

    return apiRequest(
        "/api/messages",
        {
            method: "POST",

            body:
                JSON.stringify({
                    receiver_id,
                    content
                })
        }
    );

}


export async function getMessages() {

    return apiRequest(
        "/api/messages"
    );

}


// =====================================================
// GENERIC GET
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


// =====================================================
// GENERIC POST
// =====================================================

export async function apiPost(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "POST",

            body:
                JSON.stringify(body)
        }
    );

}


// =====================================================
// GENERIC PUT
// =====================================================

export async function apiPut(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "PUT",

            body:
                JSON.stringify(body)
        }
    );

}


// =====================================================
// GENERIC PATCH
// =====================================================

export async function apiPatch(
    endpoint,
    body = {}
) {

    return apiRequest(
        endpoint,
        {
            method: "PATCH",

            body:
                JSON.stringify(body)
        }
    );

}


// =====================================================
// GENERIC DELETE
// =====================================================

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
// EXPORT API BASE
// =====================================================

export {
    API_BASE
};
