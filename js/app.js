const API_BASE = "https://salonebiz-backend.onrender.com";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("salonebiz_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

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
            data.message || `Request failed: ${response.status}`
        );
    }

    return data;
}


/* ==========================================
   AUTH
========================================== */

export async function login(email, password) {
    return apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
}


export async function register(
    name,
    email,
    password,
    phone
) {
    return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password,
            phone
        })
    });
}


export async function checkAPI() {
    try {
        return await apiRequest("/api/health");
    } catch (error) {
        return {
            success: false,
            status: "offline",
            message: error.message
        };
    }
}


/* ==========================================
   POSTS
========================================== */

export async function getPosts() {
    return apiRequest("/api/posts");
}


export async function createPost(post) {
    return apiRequest("/api/posts", {
        method: "POST",
        body: JSON.stringify(post)
    });
}


export async function getPost(postId) {
    return apiRequest(`/api/posts/${postId}`);
}


export async function deletePost(postId) {
    return apiRequest(`/api/posts/${postId}`, {
        method: "DELETE"
    });
}


/* ==========================================
   LIKES
========================================== */

export async function likePost(postId) {
    return apiRequest(
        `/api/posts/${postId}/like`,
        {
            method: "POST"
        }
    );
}


export async function unlikePost(postId) {
    return apiRequest(
        `/api/posts/${postId}/like`,
        {
            method: "DELETE"
        }
    );
}


/* ==========================================
   FAVORITES
========================================== */

export async function favoritePost(postId) {
    return apiRequest(
        `/api/posts/${postId}/favorite`,
        {
            method: "POST"
        }
    );
}


export async function unfavoritePost(postId) {
    return apiRequest(
        `/api/posts/${postId}/favorite`,
        {
            method: "DELETE"
        }
    );
}


/* ==========================================
   FOLLOWING
========================================== */

export async function followUser(userId) {
    return apiRequest(
        `/api/friends/${userId}/follow`,
        {
            method: "POST"
        }
    );
}


export async function unfollowUser(userId) {
    return apiRequest(
        `/api/friends/${userId}/follow`,
        {
            method: "DELETE"
        }
    );
}


export async function getFollowers(userId) {
    return apiRequest(
        `/api/friends/${userId}/followers`
    );
}


export async function getFollowing(userId) {
    return apiRequest(
        `/api/friends/${userId}/following`
    );
}


/* ==========================================
   PROFILE
========================================== */

export async function getProfile(userId) {

    if (userId) {
        return apiRequest(
            `/api/profile/${userId}`
        );
    }

    return apiRequest("/api/profile/me");
}


export async function updateProfile(profile) {
    return apiRequest(
        "/api/profile/me",
        {
            method: "PUT",
            body: JSON.stringify(profile)
        }
    );
}


/* ==========================================
   SEARCH
========================================== */

export async function search(query) {

    const params =
        new URLSearchParams({
            q: query
        });

    return apiRequest(
        `/api/search?${params.toString()}`
    );
}


/* ==========================================
   COMMENTS
========================================== */

export async function getComments(postId) {
    return apiRequest(
        `/api/posts/${postId}/comments`
    );
}


export async function addComment(
    postId,
    text
) {
    return apiRequest(
        `/api/posts/${postId}/comments`,
        {
            method: "POST",
            body: JSON.stringify({
                text
            })
        }
    );
}


/* ==========================================
   GENERIC HELPERS
========================================== */

export async function apiGet(endpoint) {
    return apiRequest(endpoint);
}


export async function apiPost(
    endpoint,
    body = {}
) {
    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
    });
}


export async function apiPut(
    endpoint,
    body = {}
) {
    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}


export async function apiDelete(endpoint) {
    return apiRequest(endpoint, {
        method: "DELETE"
    });
}


export { API_BASE };
