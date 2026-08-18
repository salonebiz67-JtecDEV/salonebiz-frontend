import {
    getFeed,
    likePost,
    unlikePost,
    favoritePost,
    unfavoritePost,
    getInteractionStatus
} from "../api.js";


// =====================================================
// HOME PAGE
// =====================================================

export async function renderHome(app) {

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

                    <div class="container">
                        <div class="loader"></div>
                    </div>

                </div>

            </main>

        </div>
    `;


    const feed =
        document.getElementById("feed");


    try {

        const result =
            await getFeed(1, 20);


        const posts =
            Array.isArray(result.posts)
                ? result.posts
                : [];


        if (posts.length === 0) {

            feed.innerHTML = `

                <div class="create-box"
                     style="
                        text-align:center;
                        margin-top:30px;
                     ">

                    <div style="font-size:45px;">
                        🏪
                    </div>

                    <h2>
                        No posts yet
                    </h2>

                    <p class="text-muted">
                        Be the first business to
                        share something on SaloneBiz.
                    </p>

                </div>

            `;

            return;
        }


        feed.innerHTML =
            posts
                .map(post => createPost(post))
                .join("");


        await loadInteractionStates(posts);

        attachPostEvents();


    } catch (error) {

        console.error(
            "❌ Failed to load feed:",
            error
        );


        feed.innerHTML = `

            <div class="create-box"
                 style="
                    text-align:center;
                    margin-top:30px;
                 ">

                <div style="font-size:45px;">
                    ⚠️
                </div>

                <h2>
                    Unable to load posts
                </h2>

                <p class="text-muted">
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong."
                    )}
                </p>

                <button
                    class="primary-button"
                    id="retryFeed"
                    type="button"
                >
                    Try again
                </button>

            </div>

        `;


        document
            .getElementById("retryFeed")
            ?.addEventListener(
                "click",
                () => renderHome(app)
            );

    }

}


// =====================================================
// CREATE POST HTML
// =====================================================

function createPost(post) {

    const userName =
        post.user_name ||
        "SaloneBiz User";


    const caption =
        post.caption ||
        "";


    const image =
        post.image_url ||
        "";


    return `

        <article
            class="post"
            data-post-id="${escapeHtml(post.id)}"
        >

            <div class="post-header">

                <div class="business-avatar">
                    👤
                </div>


                <div class="business-info">

                    <div class="business-name">
                        ${escapeHtml(userName)}
                    </div>


                    <div class="business-location">
                        ${escapeHtml(
                            post.user_email ||
                            "Sierra Leone"
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
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(
                                caption ||
                                "SaloneBiz post"
                            )}"
                            loading="lazy"
                        >
                    `
                    : ""
            }


            <div class="post-content">


                ${
                    caption
                        ? `
                            <div class="post-description">
                                ${escapeHtml(caption)}
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
                            0
                        </span>
                    </button>


                    <button
                        class="post-action comment-button"
                        type="button"
                    >
                        💬
                        <span>
                            Comments
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
// LOAD LIKE / FAVORITE STATE
// =====================================================

async function loadInteractionStates(posts) {

    await Promise.all(

        posts.map(
            async post => {

                try {

                    const result =
                        await getInteractionStatus(
                            post.id
                        );


                    const article =
                        document.querySelector(
                            `.post[data-post-id="${post.id}"]`
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


                    const liked =
                        Boolean(
                            result.liked ??
                            result.isLiked ??
                            result.like
                        );


                    const favorited =
                        Boolean(
                            result.favorited ??
                            result.isFavorited ??
                            result.favorite
                        );


                    const count =
                        Number(
                            result.likes ??
                            result.likeCount ??
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


                    likeCount.textContent =
                        Number.isFinite(count)
                            ? count
                            : 0;

                } catch (error) {

                    console.warn(
                        "Interaction state unavailable:",
                        error
                    );

                }

            }
        )

    );

}


// =====================================================
// POST EVENTS
// =====================================================

function attachPostEvents() {


    // -------------------------------------------------
    // LIKE
    // -------------------------------------------------

    document
        .querySelectorAll(".like-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const article =
                        button.closest(".post");


                    const postId =
                        article?.dataset.postId;


                    if (!postId) {
                        return;
                    }


                    const liked =
                        button.dataset.liked === "true";


                    const count =
                        article.querySelector(
                            ".like-count"
                        );


                    const oldCount =
                        Number(
                            count.textContent
                        ) || 0;


                    button.disabled = true;


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
                            String(newLiked);


                        button.classList.toggle(
                            "liked",
                            newLiked
                        );


                        count.textContent =
                            Math.max(
                                0,
                                oldCount +
                                (newLiked ? 1 : -1)
                            );


                    } catch (error) {

                        console.error(
                            "Like error:",
                            error
                        );

                        alert(
                            error.message ||
                            "Unable to update like."
                        );

                    } finally {

                        button.disabled =
                            false;

                    }

                }
            );

        });


    // -------------------------------------------------
    // FAVORITE
    // -------------------------------------------------

    document
        .querySelectorAll(".favorite-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const article =
                        button.closest(".post");


                    const postId =
                        article?.dataset.postId;


                    if (!postId) {
                        return;
                    }


                    const favorited =
                        button.dataset.favorited ===
                        "true";


                    button.disabled = true;


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
                            String(newState);


                        button.classList.toggle(
                            "favorited",
                            newState
                        );


                    } catch (error) {

                        console.error(
                            "Favorite error:",
                            error
                        );

                        alert(
                            error.message ||
                            "Unable to update favorite."
                        );

                    } finally {

                        button.disabled =
                            false;

                    }

                }
            );

        });


    // -------------------------------------------------
    // SHARE
    // -------------------------------------------------

    document
        .querySelectorAll(".share-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const article =
                        button.closest(".post");


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

                        } else {

                            await navigator.clipboard.writeText(
                                window.location.href
                            );


                            alert(
                                "SaloneBiz link copied!"
                            );

                        }

                    } catch (error) {

                        if (
                            error.name !==
                            "AbortError"
                        ) {

                            console.error(
                                "Share error:",
                                error
                            );

                        }

                    }

                }
            );

        });


    // -------------------------------------------------
    // COMMENTS
    // -------------------------------------------------

    document
        .querySelectorAll(".comment-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const article =
                        button.closest(".post");


                    const postId =
                        article?.dataset.postId;


                    if (!postId) {
                        return;
                    }


                    alert(
                        "Comments are coming next."
                    );

                }
            );

        });


    // -------------------------------------------------
    // SEARCH
    // -------------------------------------------------

    document
        .getElementById("searchButton")
        ?.addEventListener(
            "click",
            () => {

                alert(
                    "Search is coming next."
                );

            }
        );

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

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
