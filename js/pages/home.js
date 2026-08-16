const demoPosts = [

    {
        id: 1,

        business: "Freetown Fashion",

        location: "Freetown, Sierra Leone",

        avatar: "👗",

        image:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",

        description:
            "Fresh fashion arrivals available now. Visit our shop today.",

        likes: 128,

        comments: 24,

        liked: false,

        favorited: false
    },

    {
        id: 2,

        business: "Salone Food Hub",

        location: "Bo, Sierra Leone",

        avatar: "🍽️",

        image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",

        description:
            "Delicious local meals prepared fresh every day 🇸🇱.",

        likes: 84,

        comments: 13,

        liked: false,

        favorited: false
    }

];


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

                <div id="feed"></div>

            </main>

        </div>
    `;


    const feed =
        document.getElementById("feed");


    demoPosts.forEach(post => {

        feed.insertAdjacentHTML(
            "beforeend",

            createPost(post)
        );

    });


    attachPostEvents();
}


function createPost(post) {

    return `

        <article
            class="post"
            data-post-id="${post.id}"
        >

            <div class="post-header">

                <div class="business-avatar">
                    ${post.avatar}
                </div>

                <div class="business-info">

                    <div class="business-name">
                        ${post.business}
                    </div>

                    <div class="business-location">
                        ${post.location}
                    </div>

                </div>

                <button class="header-action">
                    ⋯
                </button>

            </div>


            <img
                class="post-image"
                src="${post.image}"
                alt="${post.business}"
                loading="lazy"
            >


            <div class="post-content">

                <div class="post-description">
                    ${post.description}
                </div>


                <div class="post-actions">

                    <button
                        class="post-action like-button
                        ${post.liked ? "liked" : ""}"
                    >
                        ❤️
                        <span class="like-count">
                            ${post.likes}
                        </span>
                    </button>


                    <button class="post-action">
                        💬
                        <span>
                            ${post.comments}
                        </span>
                    </button>


                    <button
                        class="post-action share-button"
                    >
                        ↗️
                    </button>


                    <button
                        class="post-action favorite-button
                        ${post.favorited ? "favorited" : ""}"
                    >
                        ⭐
                    </button>

                </div>

            </div>

        </article>

    `;
}


function attachPostEvents() {

    document
        .querySelectorAll(".like-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const count =
                        button.querySelector(
                            ".like-count"
                        );

                    const post =
                        button.closest(".post");

                    const id =
                        Number(
                            post.dataset.postId
                        );

                    const data =
                        demoPosts.find(
                            item => item.id === id
                        );

                    if (!data) return;

                    data.liked =
                        !data.liked;

                    data.likes +=
                        data.liked ? 1 : -1;

                    button.classList.toggle(
                        "liked",
                        data.liked
                    );

                    count.textContent =
                        data.likes;
                }
            );

        });


    document
        .querySelectorAll(".favorite-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const post =
                        button.closest(".post");

                    const id =
                        Number(
                            post.dataset.postId
                        );

                    const data =
                        demoPosts.find(
                            item => item.id === id
                        );

                    if (!data) return;

                    data.favorited =
                        !data.favorited;

                    button.classList.toggle(
                        "favorited",
                        data.favorited
                    );

                }
            );

        });


    document
        .querySelectorAll(".share-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const post =
                        button.closest(".post");

                    const business =
                        post.querySelector(
                            ".business-name"
                        ).textContent;

                    const shareData = {
                        title: business,
                        text:
                            `Check out ${business} on SaloneBiz`
                    };

                    if (
                        navigator.share
                    ) {

                        await navigator.share(
                            shareData
                        );

                    } else {

                        alert(
                            "Share link copied!"
                        );

                    }

                }
            );

        });
}
