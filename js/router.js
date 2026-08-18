// =====================================================
// 🇸🇱 SALONEBIZ ROUTER
// js/router.js
// =====================================================

// =====================================================
// PAGE IMPORTS
// =====================================================

import {
    renderHome
} from "./pages/home.js";

import {
    renderFriends
} from "./pages/friends.js";

import {
    renderCreate
} from "./pages/create.js";

import {
    renderProfile
} from "./pages/profile.js";

import {
    renderSearch
} from "./pages/search.js";

import {
    renderInbox
} from "./pages/inbox.js";

import {
    renderSettings
} from "./pages/settings.js";


// =====================================================
// ROUTE TABLE
// =====================================================

const routes = {

    home: renderHome,

    friends: renderFriends,

    create: renderCreate,

    profile: renderProfile,

    search: renderSearch,

    inbox: renderInbox,

    settings: renderSettings

};


// =====================================================
// NAVIGATE
// =====================================================

export async function navigate(
    page = "home"
) {

    const app =
        document.getElementById("app");


    // -------------------------------------------------
    // APP CONTAINER CHECK
    // -------------------------------------------------

    if (!app) {

        console.error(
            "❌ Router: #app element not found."
        );

        return;

    }


    // -------------------------------------------------
    // FIND PAGE
    // -------------------------------------------------

    const renderer =
        routes[page];


    // -------------------------------------------------
    // UNKNOWN PAGE
    // -------------------------------------------------

    if (!renderer) {

        console.warn(
            `⚠️ Unknown page "${page}". Loading home.`
        );

        return navigate("home");

    }


    // -------------------------------------------------
    // UPDATE NAVIGATION
    // -------------------------------------------------

    updateNavigation(page);


    // -------------------------------------------------
    // LOADING SCREEN
    // -------------------------------------------------

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


    // -------------------------------------------------
    // RENDER PAGE
    // -------------------------------------------------

    try {

        console.log(
            `📄 Loading page: ${page}`
        );


        await renderer(app);


        console.log(
            `✅ Page loaded: ${page}`
        );


        // -------------------------------------------------
        // SAVE CURRENT PAGE
        // -------------------------------------------------

        window.SaloneBizCurrentPage =
            page;


        // -------------------------------------------------
        // UPDATE URL
        // -------------------------------------------------

        try {

            const newUrl =
                `#${page}`;

            if (
                window.location.hash !==
                newUrl
            ) {

                history.replaceState(
                    {
                        page
                    },
                    "",
                    newUrl
                );

            }

        } catch (error) {

            console.warn(
                "⚠️ Could not update URL:",
                error
            );

        }


    } catch (error) {

        console.error(
            `❌ Failed to render "${page}":`,
            error
        );


        app.innerHTML = `

            <div class="page">

                <main class="container">

                    <div
                        class="create-box"
                        style="
                            margin-top:30px;
                            text-align:center;
                        "
                    >

                        <div
                            style="
                                font-size:50px;
                                margin-bottom:15px;
                            "
                        >
                            ⚠️
                        </div>


                        <h2>
                            Something went wrong
                        </h2>


                        <p
                            class="text-muted"
                            style="
                                margin-top:10px;
                            "
                        >
                            ${escapeHtml(
                                error?.message ||
                                "Unable to load this page."
                            )}
                        </p>


                        <button
                            class="primary-button"
                            id="routerRetry"
                            type="button"
                        >
                            Try again
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
// HASH NAVIGATION
// =====================================================

export function setupRouter() {

    window.addEventListener(
        "hashchange",
        () => {

            const page =
                window.location.hash
                    .replace(
                        "#",
                        ""
                    )
                    .trim();


            if (
                page &&
                routes[page]
            ) {

                navigate(page);

            }

        }
    );


    // -------------------------------------------------
    // INITIAL PAGE
    // -------------------------------------------------

    const initialPage =
        window.location.hash
            .replace(
                "#",
                ""
            )
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

function escapeHtml(
    value
) {

    return String(value ?? "")
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

    return Object.keys(
        routes
    );

}
