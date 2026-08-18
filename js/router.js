// =====================================================
// 🇸🇱 SALONEBIZ ROUTER
// js/router.js
// =====================================================

import {
    renderHome
} from "./pages/home.js";

import {
    renderFriends
} from "./pages/friends.js";


// =====================================================
// ROUTE TABLE
// =====================================================

const routes = {

    home: renderHome,

    friends: renderFriends

};


// =====================================================
// NAVIGATE
// =====================================================

export async function navigate(
    page = "home"
) {

    const app =
        document.getElementById("app");


    if (!app) {

        console.error(
            "❌ Router: #app element not found."
        );

        return;

    }


    const renderer =
        routes[page];


    // -------------------------------------------------
    // Unknown page
    // -------------------------------------------------

    if (!renderer) {

        console.warn(
            `⚠️ Unknown page "${page}". Loading home.`
        );

        return navigate("home");

    }


    // -------------------------------------------------
    // Update navigation
    // -------------------------------------------------

    updateNavigation(page);


    // -------------------------------------------------
    // Loading state
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

                        <div class="loader"
                             style="
                                margin:auto;
                             ">
                        </div>

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


        // -------------------------------------------------
        // Render page
        // -------------------------------------------------

        await renderer(app);


        console.log(
            `✅ Page loaded: ${page}`
        );


        // -------------------------------------------------
        // Store current page
        // -------------------------------------------------

        window.SaloneBizCurrentPage =
            page;


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
            .getElementById("routerRetry")
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
