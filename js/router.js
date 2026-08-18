// =====================================================
// 🇸🇱 SALONEBIZ ROUTER
// js/router.js
// =====================================================

// =====================================================
// PAGE LOADERS
// =====================================================

const routes = {

    home: () =>
        import("./pages/home.js")
            .then(module => module.renderHome),

    friends: () =>
        import("./pages/friends.js")
            .then(module => module.renderFriends),

    create: () =>
        import("./pages/create.js")
            .then(module => module.renderCreate),

    profile: () =>
        import("./pages/profile.js")
            .then(module => module.renderProfile),

    search: () =>
        import("./pages/search.js")
            .then(module => module.renderSearch),

    inbox: () =>
        import("./pages/inbox.js")
            .then(module => module.renderInbox),

    settings: () =>
        import("./pages/settings.js")
            .then(module => module.renderSettings)

};


// =====================================================
// NAVIGATE
// =====================================================

export async function navigate(page = "home") {

    const app =
        document.getElementById("app");


    if (!app) {

        console.error(
            "❌ Router: #app element not found."
        );

        return;

    }


    const loader =
        routes[page];


    if (!loader) {

        console.warn(
            `⚠️ Unknown page "${page}". Loading home.`
        );

        return navigate("home");

    }


    updateNavigation(page);


    // =================================================
    // LOADING
    // =================================================

    app.innerHTML = `

        <div class="page">

            <main class="container">

                <div style="
                    min-height:70vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                ">

                    <div style="
                        text-align:center;
                        padding:30px;
                    ">

                        <div
                            class="loader"
                            style="
                                margin:auto;
                            "
                        ></div>

                        <p
                            class="text-muted"
                            style="
                                margin-top:15px;
                            "
                        >
                            Loading SaloneBiz...
                        </p>

                    </div>

                </div>

            </main>

        </div>

    `;


    try {

        console.log(
            `📄 Loading page: ${page}`
        );


        // Load the page module
        const renderer =
            await loader();


        // Make sure export exists
        if (
            typeof renderer !==
            "function"
        ) {

            throw new Error(
                `Page "${page}" does not export the required render function.`
            );

        }


        // Render page
        await renderer(app);


        console.log(
            `✅ Page loaded: ${page}`
        );


        window.SaloneBizCurrentPage =
            page;


        // =================================================
        // URL
        // =================================================

        try {

            const newUrl =
                `#${page}`;

            if (
                window.location.hash !==
                newUrl
            ) {

                history.replaceState(
                    { page },
                    "",
                    newUrl
                );

            }

        } catch (error) {

            console.warn(
                "⚠️ URL update failed:",
                error
            );

        }


    } catch (error) {

        console.error(
            `❌ Failed to load page "${page}":`,
            error
        );


        app.innerHTML = `

            <div class="page">

                <main class="container">

                    <div
                        class="create-box"
                        style="
                            margin:30px 16px;
                            text-align:center;
                        "
                    >

                        <div style="
                            font-size:50px;
                            margin-bottom:15px;
                        ">
                            ⚠️
                        </div>


                        <h2>
                            Page failed to load
                        </h2>


                        <p
                            class="text-muted"
                            style="
                                margin-top:12px;
                                line-height:1.6;
                            "
                        >
                            ${escapeHtml(
                                error?.message ||
                                "Unknown error"
                            )}
                        </p>


                        <button
                            class="primary-button"
                            id="routerRetry"
                            type="button"
                            style="
                                margin-top:20px;
                            "
                        >
                            Try Again
                        </button>


                        <button
                            id="routerHome"
                            type="button"
                            style="
                                margin-top:10px;
                                background:none;
                                border:none;
                                color:inherit;
                                text-decoration:underline;
                            "
                        >
                            Back to Home
                        </button>

                    </div>

                </main>

            </div>

        `;


        document
            .getElementById(
                "routerRetry"
            )
            ?.addEventListener(
                "click",
                () => navigate(page)
            );


        document
            .getElementById(
                "routerHome"
            )
            ?.addEventListener(
                "click",
                () => navigate("home")
            );

    }

}


// =====================================================
// NAVIGATION ACTIVE STATE
// =====================================================

function updateNavigation(
    currentPage
) {

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(button => {

            const page =
                button.dataset.page;


            button.classList.toggle(
                "active",
                page === currentPage
            );

        });

}


// =====================================================
// HASH ROUTING
// =====================================================

export function setupRouter() {

    window.addEventListener(
        "hashchange",
        () => {

            const page =
                window.location.hash
                    .replace("#", "")
                    .trim();


            if (
                page &&
                routes[page]
            ) {

                navigate(page);

            }

        }
    );


    const initialPage =
        window.location.hash
            .replace("#", "")
            .trim();


    if (
        initialPage &&
        routes[initialPage]
    ) {

        navigate(initialPage);

    } else {

        navigate("home");

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// CURRENT PAGE
// =====================================================

export function getCurrentPage() {

    return (
        window.SaloneBizCurrentPage ||
        "home"
    );

}


// =====================================================
// AVAILABLE ROUTES
// =====================================================

export function getRoutes() {

    return Object.keys(routes);

}
