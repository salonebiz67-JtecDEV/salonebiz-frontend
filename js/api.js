const API_BASE =
    "https://salonebiz-backend.onrender.com";


// =====================================================
// SESSION
// =====================================================

const SESSION_KEY = "salonebiz_user";


// =====================================================
// GET TOKEN
// =====================================================

function getToken() {

    try {

        const saved =
            localStorage.getItem(SESSION_KEY);

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
// CORE API REQUEST
// =====================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const token = getToken();

    const headers = {
        ...(options.headers || {})
    };


    // JSON body
    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {
        headers["Content-Type"] =
            "application/json";
    }


    // JWT
    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
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

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(result.user)
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
// POSTS
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

            body: JSON.stringify({
                caption:
                    post.caption || "",

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
// POST INTERACTIONS
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

    /*
       Backend uses one toggle endpoint.
       Calling it again removes the like.
    */

    return apiRequest(
        `/api/interactions/posts/${postId}/like`,
        {
            method: "POST"
        }
    );
}


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

    /*
       Backend uses one toggle endpoint.
       Calling it again removes the favorite.
    */

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

            body: JSON.stringify({
                text
            })
        }
    );
}


// =====================================================
// USERS / PROFILE
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
// FOLLOW / FRIENDS
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

            body: JSON.stringify({
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
// GENERIC HELPERS
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
// API BASE URL
// =====================================================

export {
    API_BASE
};
