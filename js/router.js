// =====================================================
// 🇸🇱 SALONEBIZ ROUTER
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
    renderInbox
} from "./pages/inbox.js";

import {
    renderProfile
} from "./pages/profile.js";


// =====================================================
// PAGES
// =====================================================

const pages = {

    home:
        renderHome,

    friends:
        renderFriends,

    create:
        renderCreate,

    inbox:
        renderInbox,

    profile:
        renderProfile

};


// =====================================================
// NAVIGATE
// =====================================================

export async function navigate(
    page = "home"
) {

    const render =
        pages[page];


    // -------------------------------------------------
    // CHECK PAGE
    // -------------------------------------------------

    if (
        typeof render !== "function"
    ) {

        console.error(
            `❌ Unknown page: ${page}`
        );

        return;

    }


    // -------------------------------------------------
    // GET APP
    // -------------------------------------------------

    const app =
        document.getElementById(
            "app"
        );


    if (!app) {

        console.error(
            "❌ #app element was not found."
        );

        return;

    }


    // -------------------------------------------------
    // UPDATE NAVIGATION
    // -------------------------------------------------

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === page
                );

            }
        );


    // -------------------------------------------------
    // LOADING SCREEN
    // -------------------------------------------------

    app.innerHTML = `

        <div class="page">

            <div class="container">

                <div
                    class="loader"
                    aria-label="Loading"
                ></div>

            </div>

        </div>

    `;


    // -------------------------------------------------
    // RENDER PAGE
    // -------------------------------------------------

    try {

        await render(
            app
        );


    } catch (error) {

        console.error(
            `❌ Error rendering "${page}":`,
            error
        );


        const message =
            error?.message ||
            "Unable to load this page.";


        app.innerHTML = `

            <div class="page">

                <div class="container">

                    <div
                        class="create-box"
                    >

                        <h2>
                            Something went wrong
                        </h2>

                        <p class="text-muted">
                            ${escapeHtml(message)}
                        </p>

                        <button
                            class="primary-button"
                            id="retryPage"
                            type="button"
                        >
                            Try again
                        </button>

                    </div>

                </div>

            </div>

        `;


        const retry =
            document.getElementById(
                "retryPage"
            );


        if (retry) {

            retry.onclick = () => {

                navigate(
                    page
                );

            };

        }

    }

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(
    value
) {

    return String(
        value
    ).replace(
        /[&<>"']/g,
        character => ({

            "&":
                "&amp;",

            "<":
                "&lt;",

            ">":
                "&gt;",

            '"':
                "&quot;",

            "'":
                "&#039;"

        })[character]
    );

}


// =====================================================
// GET AVAILABLE PAGES
// =====================================================

export function getPages() {

    return Object.keys(
        pages
    );

}
