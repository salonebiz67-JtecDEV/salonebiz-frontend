import {
    getUser,
    clearUser
} from "./auth.js";

import {
    getFeed,
    getMyProfile,
    likePost,
    favoritePost
} from "./api.js";


// =====================================================
// WORKSPACE
// =====================================================

export function renderWorkspace(app) {

    const user = getUser();

    if (!user) {
        return;
    }


    app.innerHTML = `

        <section class="workspace">

            <!-- =========================================
                 TOP NAVIGATION
            ========================================== -->

            <nav class="workspace-nav">

                <div class="auth-brand">

                    <span class="flag">
                        🇸🇱
                    </span>

                    <span>
                        SaloneBiz
                    </span>

                </div>


                <div class="workspace-actions">

                    <button
                        class="nav-btn"
                        id="profile-btn"
                        type="button"
                    >
                        👤
                    </button>


                    <button
                        class="logout"
                        id="logout"
                        type="button"
                    >
                        Log out
                    </button>

                </div>

            </nav>


            <!-- =========================================
                 APP HEADER
            ========================================== -->

            <div class="workspace-header">

                <div>

                    <div class="eyebrow">
                        SaloneBiz
                    </div>

                    <h1 class="workspace-title">

                        Welcome,
                        ${escapeHtml(user.name)}
                        👋

                    </h1>

                    <p class="workspace-subtitle">

                        Discover businesses,
                        connect with people,
                        and grow together.

                    </p>

                </div>

            </div>


            <!-- =========================================
                 QUICK ACTIONS
            ========================================== -->

            <div class="workspace-actions-grid">

                <button
                    class="workspace-action"
                    id="create-post-btn"
                    type="button"
                >

                    <span>
                        ➕
                    </span>

                    <strong>
                        Create Post
                    </strong>

                    <small>
                        Share your business
                    </small>

                </button>


                <button
                    class="workspace-action"
                    id="search-btn"
                    type="button"
                >

                    <span>
                        🔍
                    </span>

                    <strong>
                        Search
                    </strong>

                    <small>
                        Find people and businesses
                    </small>

                </button>


                <button
                    class="workspace-action"
                    id="friends-btn"
                    type="button"
                >

                    <span>
                        👥
                    </span>

                    <strong>
                        Friends
                    </strong>

                    <small>
                        Connect with people
                    </small>

                </button>


                <button
                    class="workspace-action"
                    id="settings-btn"
                    type="button"
                >

                    <span>
                        ⚙️
                    </span>

                    <strong>
                        Settings
                    </strong>

                    <small>
                        Manage your account
                    </small>

                </button>

            </div>


            <!-- =========================================
                 FEED
            ========================================== -->

            <div class="feed-section">

                <div class="section-header">

                    <div>

                        <div class="eyebrow">
                            Community
                        </div>

                        <h2>
                            Latest posts
                        </h2>

                    </div>


                    <button
                        id="refresh-feed"
                        class="secondary-btn"
                        type="button"
                    >
                        ↻ Refresh
                    </button>

                </div>


                <div
                    id="feed"
                    class="feed"
                >

                    <div class="feed-loading">
                        Loading posts...
                    </div>

                </div>

            </div>


            <!-- =========================================
                 BOTTOM NAVIGATION
            ========================================== -->

            <nav class="bottom-nav">

                <button
                    class="bottom-nav-btn active"
                    data-action="home"
                    type="button"
                >
                    <span>🏠</span>
                    <small>Home</small>
                </button>


                <button
                    class="bottom-nav-btn"
                    data-action="search"
                    type="button"
                >
                    <span>🔍</span>
                    <small>Search</small>
                </button>


                <button
                    class="bottom-nav-btn create"
                    data-action="create"
                    type="button"
                >
                    <span>＋</span>
                    <small>Post</small>
                </button>


                <button
                    class="bottom-nav-btn"
                    data-action="friends"
                    type="button"
                >
                    <span>👥</span>
                    <small>Friends</small>
                </button>


                <button
                    class="bottom-nav-btn"
                    data-action="profile"
                    type="button"
                >
                    <span>👤</span>
                    <small>Profile</small>
                </button>

            </nav>

        </section>

    `;


    // =================================================
    // EVENTS
    // =================================================

    document.querySelector(
        "#logout"
    ).onclick = () => {

        clearUser();

        window.dispatchEvent(
            new CustomEvent(
                "auth:logout"
            )
        );

    };


    document.querySelector(
        "#refresh-feed"
    ).onclick = () => {

        loadFeed();

    };


    document.querySelector(
        "#create-post-btn"
    ).onclick = () => {

        openCreatePost();

    };


    document.querySelector(
        "#search-btn"
    ).onclick = () => {

        openSearch();

    };


    document.querySelector(
        "#friends-btn"
    ).onclick = () => {

        openFriends();

    };


    document.querySelector(
        "#settings-btn"
    ).onclick = () => {

        openSettings();

    };


    document.querySelector(
        "#profile-btn"
    ).onclick = () => {

        openProfile();

    };


    document
        .querySelectorAll(
            ".bottom-nav-btn"
        )
        .forEach(button => {

            button.onclick = () => {

                const action =
                    button.dataset.action;

                handleNavigation(
                    action
                );

            };

        });


    // =================================================
    // INITIAL FEED
    // =================================================

    loadFeed();
}


// =====================================================
// LOAD FEED
// =====================================================

async function loadFeed() {

    const feed =
        document.querySelector(
            "#feed"
        );

    if (!feed) {
        return;
    }


    feed.innerHTML = `
        <div class="feed-loading">
            Loading posts...
        </div>
    `;


    try {

        const result =
            await getFeed();


        const posts =
            result.posts || [];


        if (!posts.length) {

            feed.innerHTML = `

                <div class="empty-feed">

                    <div class="empty-icon">
                        📭
                    </div>

                    <h3>
                        No posts yet
                    </h3>

                    <p>
                        Be the first person
                        to share something.
                    </p>

                    <button
                        class="primary-btn"
                        id="empty-create-post"
                        type="button"
                    >
                        Create your first post
                    </button>

                </div>

            `;


            document.querySelector(
                "#empty-create-post"
            ).onclick = () => {

                openCreatePost();

            };


            return;
        }


        feed.innerHTML =
            posts.map(
                renderPost
            ).join("");


        setupPostInteractions();


    } catch (error) {

        console.error(
            "Feed error:",
            error
        );


        feed.innerHTML = `

            <div class="empty-feed">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load posts
                </h3>

                <p>
                    ${escapeHtml(
                        error.message ||
                        "Please try again."
                    )}
                </p>

                <button
                    class="secondary-btn"
                    id="retry-feed"
                    type="button"
                >
                    Try again
                </button>

            </div>

        `;


        document.querySelector(
            "#retry-feed"
        ).onclick = () => {

            loadFeed();

        };

    }
}


// =====================================================
// RENDER POST
// =====================================================

function renderPost(post) {

    const image =
        post.image_url ||
        "";


    return `

        <article
            class="post-card"
            data-post-id="${escapeHtml(post.id)}"
        >

            <div class="post-header">

                <div class="post-avatar">
                    ${escapeHtml(
                        (
                            post.user_name ||
                            "U"
                        ).charAt(0).toUpperCase()
                    )}
                </div>


                <div>

                    <strong>
                        ${escapeHtml(
                            post.user_name ||
                            "SaloneBiz User"
                        )}
                    </strong>

                    <small>
                        ${formatDate(
                            post.created_at
                        )}
                    </small>

                </div>

            </div>


            ${
                image
                    ? `
                    <div class="post-image-wrap">

                        <img
                            class="post-image"
                            src="${escapeHtml(image)}"
                            alt="Post image"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >

                    </div>
                    `
                    : ""
            }


            ${
                post.caption
                    ? `
                    <div class="post-content">

                        ${escapeHtml(
                            post.caption
                        )}

                    </div>
                    `
                    : ""
            }


            <div class="post-actions">

                <button
                    class="post-action"
                    data-action="like"
                    data-post-id="${escapeHtml(post.id)}"
                    type="button"
                >
                    ❤️
                    <span>Like</span>
                </button>


                <button
                    class="post-action"
                    data-action="favorite"
                    data-post-id="${escapeHtml(post.id)}"
                    type="button"
                >
                    ⭐
                    <span>Save</span>
                </button>


                <button
                    class="post-action"
                    data-action="comment"
                    data-post-id="${escapeHtml(post.id)}"
                    type="button"
                >
                    💬
                    <span>Comment</span>
                </button>

            </div>

        </article>

    `;
}


// =====================================================
// POST INTERACTIONS
// =====================================================

function setupPostInteractions() {

    document
        .querySelectorAll(
            ".post-action"
        )
        .forEach(button => {

            button.onclick =
                async () => {

                    const action =
                        button.dataset.action;

                    const postId =
                        button.dataset.postId;


                    if (
                        action === "like"
                    ) {

                        try {

                            const result =
                                await likePost(
                                    postId
                                );

                            button.classList.toggle(
                                "active",
                                result.liked
                            );

                        } catch (error) {

                            console.error(
                                "Like error:",
                                error
                            );

                        }

                    }


                    if (
                        action === "favorite"
                    ) {

                        try {

                            const result =
                                await favoritePost(
                                    postId
                                );

                            button.classList.toggle(
                                "active",
                                result.favorited
                            );

                        } catch (error) {

                            console.error(
                                "Favorite error:",
                                error
                            );

                        }

                    }


                    if (
                        action === "comment"
                    ) {

                        openComments(
                            postId
                        );

                    }

                };

        });
}


// =====================================================
// NAVIGATION
// =====================================================

function handleNavigation(
    action
) {

    switch (action) {

        case "home":

            loadFeed();

            break;


        case "search":

            openSearch();

            break;


        case "create":

            openCreatePost();

            break;


        case "friends":

            openFriends();

            break;


        case "profile":

            openProfile();

            break;

    }
}


// =====================================================
// CREATE POST
// =====================================================

function openCreatePost() {

    const caption =
        window.prompt(
            "Write your post caption:"
        );


    if (
        caption === null
    ) {
        return;
    }


    const imageUrl =
        window.prompt(
            "Paste your image URL:"
        );


    if (
        imageUrl === null ||
        !imageUrl.trim()
    ) {
        return;
    }


    /*
     * Importing createPost dynamically
     * prevents the entire workspace from
     * depending on it during initial render.
     */

    import("./api.js")
        .then(
            async ({
                createPost
            }) => {

                try {

                    await createPost({
                        caption,
                        image_url:
                            imageUrl.trim()
                    });


                    await loadFeed();


                } catch (error) {

                    alert(
                        error.message ||
                        "Unable to create post"
                    );

                }

            }
        );

}


// =====================================================
// SEARCH
// =====================================================

function openSearch() {

    const query =
        window.prompt(
            "Search for a user by ID:"
        );


    if (
        !query ||
        !query.trim()
    ) {
        return;
    }


    import("./api.js")
        .then(
            async ({
                getUserProfile
            }) => {

                try {

                    const result =
                        await getUserProfile(
                            query.trim()
                        );


                    alert(
                        `${result.user.name}\nRole: ${result.user.role}`
                    );


                } catch (error) {

                    alert(
                        error.message ||
                        "User not found"
                    );

                }

            }
        );

}


// =====================================================
// FRIENDS
// =====================================================

function openFriends() {

    alert(
        "Friends section is connected to the backend. We will build the full friends UI next."
    );

}


// =====================================================
// PROFILE
// =====================================================

async function openProfile() {

    try {

        const result =
            await getMyProfile();


        const profile =
            result.user;


        alert(
            `Profile\n\nName: ${profile.name}\nEmail: ${profile.email || "Not provided"}\nPhone: ${profile.phone || "Not provided"}`
        );


    } catch (error) {

        alert(
            error.message ||
            "Unable to load profile"
        );

    }

}


// =====================================================
// SETTINGS
// =====================================================

function openSettings() {

    alert(
        "Settings section is ready for the next UI update."
    );

}

// =====================================================
// COMMENTS
// =====================================================

function openComments(
    postId
) {

    const text =
        window.prompt(
            "Write a comment:"
        );


    if (
        !text ||
        !text.trim()
    ) {
        return;
    }


    import("./api.js")
        .then(
            async ({
                addComment
            }) => {

                try {

                    await addComment(
                        postId,
                        text.trim()
                    );


                    alert(
                        "Comment added successfully."
                    );


                } catch (error) {

                    alert(
                        error.message ||
                        "Unable to add comment"
                    );

                }

            }
        );

}


// =====================================================
// DATE
// =====================================================

function formatDate(
    value
) {

    if (!value) {
        return "";
    }


    try {

        return new Date(
            value
        ).toLocaleString();

    } catch {

        return "";
    }
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]
    );

}
