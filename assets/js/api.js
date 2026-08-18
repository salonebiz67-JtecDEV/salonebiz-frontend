const API_BASE = "https://salonebiz-backend.onrender.com";

/* =====================================================
CORE REQUEST
===================================================== */

async function request(endpoint, options = {}) {

const controller = new AbortController();

const timeout = setTimeout(
    () => controller.abort(),
    15000
);

try {

    const token =
        localStorage.getItem("salonebiz_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,
            signal: controller.signal,
            headers
        }
    );

    const text =
        await response.text();

    let data = {};

    try {
        data = text
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

    if (!response.ok) {

        throw new Error(
            data.message ||
            `Request failed (${response.status})`
        );
    }

    return data;

} catch (error) {

    if (error.name === "AbortError") {
        throw new Error(
            "Server request timed out"
        );
    }

    throw error;

} finally {

    clearTimeout(timeout);

}

}

/* =====================================================
API
===================================================== */

export const api = {

/* =========================
   HEALTH
========================= */

health() {
    return request("/api/health");
},


/* =========================
   AUTH
========================= */

login(payload) {

    return request(
        "/api/auth/login",
        {
            method: "POST",
            body: JSON.stringify(payload)
        }
    );

},


register(payload) {

    return request(
        "/api/auth/register",
        {
            method: "POST",
            body: JSON.stringify(payload)
        }
    );

},


/* =========================
   PROFILE
========================= */

getMyProfile() {

    return request(
        "/api/users/me"
    );

},


getUserProfile(userId) {

    return request(
        `/api/users/${userId}`
    );

},


/* =========================
   POSTS
========================= */

getFeed(page = 1, limit = 10) {

    return request(
        `/api/posts/feed?page=${page}&limit=${limit}`
    );

},


getPost(postId) {

    return request(
        `/api/posts/${postId}`
    );

},


createPost(post) {

    return request(
        "/api/posts",
        {
            method: "POST",
            body: JSON.stringify(post)
        }
    );

},


deletePost(postId) {

    return request(
        `/api/posts/${postId}`,
        {
            method: "DELETE"
        }
    );

},


/* =========================
   LIKES
========================= */

likePost(postId) {

    return request(
        `/api/interactions/posts/${postId}/like`,
        {
            method: "POST"
        }
    );

},


/* =========================
   FAVORITES
========================= */

favoritePost(postId) {

    return request(
        `/api/interactions/posts/${postId}/favorite`,
        {
            method: "POST"
        }
    );

},


/* =========================
   COMMENTS
========================= */

getComments(postId) {

    return request(
        `/api/interactions/posts/${postId}/comments`
    );

},


addComment(postId, text) {

    return request(
        `/api/interactions/posts/${postId}/comments`,
        {
            method: "POST",
            body: JSON.stringify({
                text
            })
        }
    );

},


/* =========================
   INTERACTION STATUS
========================= */

getInteractionStatus(postId) {

    return request(
        `/api/interactions/posts/${postId}`
    );

},


/* =========================
   FRIENDS
========================= */

followUser(userId) {

    return request(
        `/api/friends/${userId}/follow`,
        {
            method: "POST"
        }
    );

},


unfollowUser(userId) {

    return request(
        `/api/friends/${userId}/follow`,
        {
            method: "DELETE"
        }
    );

},


getFollowers(userId) {

    return request(
        `/api/friends/${userId}/followers`
    );

},


getFollowing(userId) {

    return request(
        `/api/friends/${userId}/following`
    );

},


/* =========================
   MESSAGES
========================= */

sendMessage(receiver_id, content) {

    return request(
        "/api/messages",
        {
            method: "POST",
            body: JSON.stringify({
                receiver_id,
                content
            })
        }
    );

},


getMessages() {

    return request(
        "/api/messages"
    );

}

};

/* =====================================================
EXPORT BASE URL
===================================================== */

export {
API_BASE
};
