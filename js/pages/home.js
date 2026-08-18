// =====================================================
// 🇸🇱 SALONEBIZ HOME PAGE
// =====================================================

import {
    getFeed,
    likePost,
    unlikePost,
    favoritePost,
    unfavoritePost,
    getInteractionStatus
} from "../api.js";

import {
    navigate
} from "../router.js";


// =====================================================
// HOME PAGE
// =====================================================

export async function renderHome(app) {

    if (!app) {
        console.error("❌ Home: app element not found.");
        return;
    }

    app.innerHTML = `

        <div class="page">

            <header class="app-header">

                <div class="header-inner">

                    <div class="brand">
                        <span class="brand-flag">🇸🇱</span>
                        SaloneBiz
                    </div>

                    <button
                        class="header-action"
                        id="searchButton"
                        type="button"
                        aria-label="Search"
                    >
                        🔎
                    </button>

                </div>

            </header>


            <main class="container">

                <h1 class="page-title">
                    For You
                </h1>

                <p class="page-subtitle">
                    Discover businesses around Sierra Leone.
                </p>


                <div id="feed">

                    <div
                        style="
                            display:flex;
                            justify-content:center;
                            padding:40px;
                        "
                    >

                        <div class="loader"></div>

                    </div>

                </div>

            </main>

        </div>
    `;


    const feed =
        document.getElementById("feed");


    if (!feed) {

        console.error(
            "❌ Home: #feed not found."
        );

        return;
    }


    // Search works directly through router
    setupSearch();


    try {

        console.log(
            "🇸🇱 Loading SaloneBiz feed..."
        );


        const result =
            await getFeed(1, 20);


        console.log(
            "🇸🇱 Feed response:",
            result
        );


        // =================================================
        // NORMALIZE POSTS RESPONSE
        // =================================================

        let posts = [];


        if (
            Array.isArray(
                result?.posts
            )
        ) {

            posts =
                result.posts;

        } else if (
            Array.isArray(
                result?.data?.posts
            )
        ) {

            posts =
                result.data.posts;

        } else if (
            Array.isArray(
                result?.data
            )
        ) {

            posts =
                result.data;

        } else if (
            Array.isArray(
                result?.feed
            )
        ) {

            posts =
                result.feed;

        } else if (
            Array.isArray(
                result
            )
        ) {

            posts =
                result;
        }


        console.log(
            "🇸🇱 Posts found:",
            posts.length
        );


        // =================================================
        // NO POSTS
        // =================================================

        if (
            posts.length === 0
        ) {

            feed.innerHTML = `

                <div
                    class="create-box"
                    style="
                        text-align:center;
                        margin-top:30px;
                    "
                >

                    <div
                        style="
                            font-size:45px;
                        "
                    >
                        🏪
                    </div>


                    <h2>
                        No posts yet
                    </h2>


                    <p class="text-muted">
                        Be the first business to
                        share something on SaloneBiz.
                    </p>


                    <button
                        class="primary-button"
                        id="createFirstPost"
                        type="button"
                        style="
                            margin-top:15px;
                        "
                    >
                        Create First Post
                    </button>

                </div>
            `;


            document
                .getElementById(
                    "createFirstPost"
                )
                ?.addEventListener(
                    "click",
                    () => navigate("create")
                );


            return;
        }


        // =================================================
        // RENDER POSTS SAFELY
        // =================================================

        feed.innerHTML =
            posts
                .filter(Boolean)
                .map(
                    post =>
                        createPost(
                            post || {}
                        )
                )
                .join("");


        // =================================================
        // LOAD LIKE/FAVORITE STATES
        // =================================================

        await loadInteractionStates(
            posts
        );


        // =================================================
        // BUTTON EVENTS
        // =================================================

        attachPostEvents();


    } catch (error) {

        console.error(
            "❌ Failed to load SaloneBiz feed:",
            error
        );


        feed.innerHTML = `

            <div
                class="create-box"
                style="
                    text-align:center;
                    margin-top:30px;
                "
            >

                <div
                    style="
                        font-size:45px;
                    "
                >
                    ⚠️
                </div>


                <h2>
                    Unable to load posts
                </h2>


                <p class="text-muted">
                    ${escapeHtml(
                        error?.message ||
                        "Something went wrong while loading the feed."
                    )}
                </p>


                <button
                    class="primary-button"
                    id="retryFeed"
                    type="button"
                >
                    Try Again
                </button>

            </div>
        `;


        document
            .getElementById(
                "retryFeed"
            )
            ?.addEventListener(
                "click",
                () => renderHome(app)
            );
    }
}


// =====================================================
// CREATE POST CARD
// =====================================================

function createPost(
    post = {}
) {

    const postId =
        post?.id ||
        post?.post_id ||
        "";


    const userName =
        post?.user_name ||
        post?.name ||
        post?.business_name ||
        "SaloneBiz User";


    const userEmail =
        post?.user_email ||
        post?.email ||
        "Sierra Leone";


    const caption =
        post?.caption ||
        post?.description ||
        "";


    const image =
        post?.image_url ||
        post?.imageUrl ||
        post?.image ||
        "";


    const initialLikes =
        Number(
            post?.likes ??
            post?.like_count ??
            0
        );


    const initialComments =
        Number(
            post?.comments ??
            post?.comment_count ??
            0
        );


    return `

        <article
            class="post"
            data-post-id="${escapeHtml(
                postId
            )}"
        >

            <div class="post-header">

                <div class="business-avatar">
                    👤
                </div>


                <div class="business-info">

                    <div class="business-name">
                        ${escapeHtml(
                            userName
                        )}
                    </div>


                    <div class="business-location">
                        ${escapeHtml(
                            userEmail
                        )}
                    </div>

                </div>


                <button
                    class="header-action"
                    type="button"
                    aria-label="Post options"
                >
                    ⋯
                </button>

            </div>


            ${
                image
                    ? `
                        <img
                            class="post-image"
                            src="${escapeHtml(
                                image
                            )}"
                            alt="${escapeHtml(
                                caption ||
                                "SaloneBiz post"
                            )}"
                            loading="lazy"
                            onerror="
                                this.style.display='none'
                            "
                        >
                    `
                    : ""
            }


            <div class="post-content">

                ${
                    caption
                        ? `
                            <div class="post-description">
                                ${escapeHtml(
                                    caption
                                )}
                            </div>
                        `
                        : ""
                }


                <div class="post-actions">

                    <button
                        class="post-action like-button"
                        type="button"
                        data-liked="false"
                    >
                        ❤️
                        <span class="like-count">
                            ${
                                Number.isFinite(
                                    initialLikes
                                )
                                    ? initialLikes
                                    : 0
                            }
                        </span>
                    </button>


                    <button
                        class="post-action comment-button"
                        type="button"
                    >
                        💬
                        <span>
                            ${
                                Number.isFinite(
                                    initialComments
                                )
                                    ? initialComments
                                    : 0
                            }
                        </span>
                    </button>


                    <button
                        class="post-action share-button"
                        type="button"
                    >
                        ↗️
                    </button>


                    <button
                        class="post-action favorite-button"
                        type="button"
                        data-favorited="false"
                    >
                        ⭐
                    </button>

                </div>

            </div>

        </article>
    `;
}


// =====================================================
// INTERACTION STATES
// =====================================================

async function loadInteractionStates(
    posts
) {

    if (!Array.isArray(posts)) {
        return;
    }


    await Promise.all(

        posts.map(
            async post => {

                const postId =
                    post?.id ||
                    post?.post_id;


                if (!postId) {
                    return;
                }


                try {

                    const result =
                        await getInteractionStatus(
                            postId
                        );


                    const article =
                        findPostElement(
                            postId
                        );


                    if (!article) {
                        return;
                    }


                    const likeButton =
                        article.querySelector(
                            ".like-button"
                        );


                    const favoriteButton =
                        article.querySelector(
                            ".favorite-button"
                        );


                    const likeCount =
                        article.querySelector(
                            ".like-count"
                        );


                    if (
                        !likeButton ||
                        !favoriteButton
                    ) {
                        return;
                    }


                    const liked =
                        Boolean(
                            result?.liked ??
                            result?.isLiked ??
                            result?.like ??
                            false
                        );


                    const favorited =
                        Boolean(
                            result?.favorited ??
                            result?.isFavorited ??
                            result?.favorite ??
                            false
                        );


                    const count =
                        Number(
                            result?.likes ??
                            result?.likeCount ??
                            result?.like_count ??
                            post?.likes ??
                            post?.like_count ??
                            0
                        );


                    likeButton.dataset.liked =
                        String(liked);


                    favoriteButton.dataset.favorited =
                        String(favorited);


                    likeButton.classList.toggle(
                        "liked",
                        liked
                    );


                    favoriteButton.classList.toggle(
                        "favorited",
                        favorited
                    );


                    if (likeCount) {

                        likeCount.textContent =
                            Number.isFinite(
                                count
                            )
                                ? count
                                : 0;
                    }


                } catch (error) {

                    // Interaction failure must NEVER
                    // destroy the home page.

                    console.warn(
                        `⚠️ Interaction state unavailable for ${postId}:`,
                        error
                    );

                }

            }
        )
    );
}


// =====================================================
// FIND POST ELEMENT
// =====================================================

function findPostElement(
    postId
) {

    const posts =
        document.querySelectorAll(
            ".post[data-post-id]"
        );


    for (
        const article of posts
    ) {

        if (
            article.dataset.postId ===
            String(postId)
        ) {

            return article;
        }
    }


    return null;
}


// =====================================================
// POST EVENTS
// =====================================================

function attachPostEvents() {


    // =================================================
    // LIKE
    // =================================================

    document
        .querySelectorAll(
            ".like-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const article =
                            button.closest(
                                ".post"
                            );


                        const postId =
                            article?.dataset?.postId;


                        if (!postId) {
                            return;
                        }


                        const liked =
                            button.dataset.liked ===
                            "true";


                        const count =
                            article.querySelector(
                                ".like-count"
                            );


                        const oldCount =
                            Number(
                                count?.textContent
                            ) || 0;


                        button.disabled =
                            true;


                        try {

                            if (liked) {

                                await unlikePost(
                                    postId
                                );

                            } else {

                                await likePost(
                                    postId
                                );
                            }


                            const newLiked =
                                !liked;


                            button.dataset.liked =
                                String(
                                    newLiked
                                );


                            button.classList.toggle(
                                "liked",
                                newLiked
                            );


                            if (count) {

                                count.textContent =
                                    Math.max(
                                        0,
                                        oldCount +
                                        (
                                            newLiked
                                                ? 1
                                                : -1
                                        )
                                    );
                            }


                        } catch (error) {

                            console.error(
                                "❌ Like error:",
                                error
                            );


                            alert(
                                error?.message ||
                                "Unable to update like."
                            );


                        } finally {

                            button.disabled =
                                false;
                        }
                    }
                );
            }
        );


        // =================================================
    // FAVORITE
    // =================================================

    document
        .querySelectorAll(
            ".favorite-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const article =
                            button.closest(
                                ".post"
                            );


                        const postId =
                            article?.dataset?.postId;


                        if (!postId) {
                            return;
                        }


                        const favorited =
                            button.dataset.favorited ===
                            "true";


                        button.disabled =
                            true;


                        try {

                            if (favorited) {

                                await unfavoritePost(
                                    postId
                                );

                            } else {

                                await favoritePost(
                                    postId
                                );
                            }


                            const newState =
                                !favorited;


                            button.dataset.favorited =
                                String(
                                    newState
                                );


                            button.classList.toggle(
                                "favorited",
                                newState
                            );


                        } catch (error) {

                            console.error(
                                "❌ Favorite error:",
                                error
                            );


                            alert(
                                error?.message ||
                                "Unable to update favorite."
                            );


                        } finally {

                            button.disabled =
                                false;
                        }
                    }
                );
            }
        );


    // =================================================
    // SHARE
    // =================================================

    document
        .querySelectorAll(
            ".share-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const article =
                            button.closest(
                                ".post"
                            );


                        const business =
                            article
                                ?.querySelector(
                                    ".business-name"
                                )
                                ?.textContent
                                ?.trim() ||
                            "SaloneBiz";


                        const shareData = {

                            title:
                                business,

                            text:
                                `Check out ${business} on SaloneBiz`,

                            url:
                                window.location.href
                        };


                        try {

                            if (
                                navigator.share
                            ) {

                                await navigator.share(
                                    shareData
                                );

                            } else if (
                                navigator.clipboard
                            ) {

                                await navigator.clipboard.writeText(
                                    window.location.href
                                );


                                alert(
                                    "SaloneBiz link copied!"
                                );

                            } else {

                                alert(
                                    "Sharing is not supported on this device."
                                );
                            }


                        } catch (error) {

                            if (
                                error?.name !==
                                "AbortError"
                            ) {

                                console.error(
                                    "❌ Share error:",
                                    error
                                );
                            }
                        }
                    }
                );
            }
        );


    // =================================================
    // COMMENTS
    // =================================================

    document
        .querySelectorAll(
            ".comment-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        alert(
                            "Comments page will be connected next."
                        );
                    }
                );
            }
        );
}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const button =
        document.getElementById(
            "searchButton"
        );


    if (!button) {
        return;
    }


    button.onclick = () => {

        navigate("search");

    };
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
