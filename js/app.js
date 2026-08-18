// =====================================================
// 🇸🇱 SALONEBIZ MAIN APPLICATION
// js/app.js
// =====================================================

import {
    initializeAuth,
    logout
} from "./auth.js";

import {
    loadUser,
    getUser
} from "./state.js";

import {
    checkAPI
} from "./api.js";


// =====================================================
// APP STARTUP
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


// =====================================================
// INITIALIZE APPLICATION
// =====================================================

async function initializeApp() {

    console.log(
        "🇸🇱 Starting SaloneBiz..."
    );


    // -------------------------------------------------
    // Make sure required elements exist
    // -------------------------------------------------

    const app =
        document.getElementById("app");

    const bottomNav =
        document.getElementById("bottomNav");


    if (!app) {

        console.error(
            "❌ SaloneBiz: #app element not found."
        );

        return;
    }


    // -------------------------------------------------
    // Restore saved session
    // -------------------------------------------------

    loadUser();


    const user =
        getUser();


    if (user) {

        console.log(
            "👤 Existing SaloneBiz session found:",
            user.email || user.name
        );

    } else {

        console.log(
            "👤 No active SaloneBiz session."
        );

    }


    // -------------------------------------------------
    // Start authentication system
    // -------------------------------------------------

    try {

        initializeAuth();

    } catch (error) {

        console.error(
            "❌ Authentication initialization failed:",
            error
        );

        showFatalError(
            app,
            "Unable to start authentication."
        );

        return;
    }


    // -------------------------------------------------
    // Setup global navigation
    // -------------------------------------------------

    setupNavigation();


    // -------------------------------------------------
    // API health check
    // -------------------------------------------------

    checkBackend();


    // -------------------------------------------------
    // Global logout listener
    // -------------------------------------------------

    window.addEventListener(
        "salonebiz:logout",
        () => {

            console.log(
                "👋 SaloneBiz user logged out."
            );

            logout();

        }
    );


    // -------------------------------------------------
    // Application ready
    // -------------------------------------------------

    window.dispatchEvent(
        new CustomEvent(
            "salonebiz:ready"
        )
    );


    console.log(
        "✅ SaloneBiz application ready."
    );
}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            "#bottomNav [data-page]"
        );


    if (!buttons.length) {

        console.warn(
            "⚠️ No navigation buttons found."
        );

        return;
    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;


                    if (!page) {
                        return;
                    }


                    console.log(
                        "📄 Navigation:",
                        page
                    );

                }
            );

        }
    );

}


// =====================================================
// BACKEND HEALTH
// =====================================================

async function checkBackend() {

    try {

        const result =
            await checkAPI();


        if (
            result &&
            (
                result.success ||
                result.status === "healthy"
            )
        ) {

            console.log(
                "🟢 SaloneBiz backend online."
            );


            document.body.dataset.api =
                "online";

        } else {

            console.warn(
                "🟡 SaloneBiz backend responded but is not healthy."
            );


            document.body.dataset.api =
                "degraded";
        }


    } catch (error) {

        console.warn(
            "🔴 SaloneBiz backend unavailable:",
            error
        );


        document.body.dataset.api =
            "offline";

    }

}


// =====================================================
// FATAL ERROR SCREEN
// =====================================================

function showFatalError(
    app,
    message
) {

    app.innerHTML = `

        <div
            class="page"
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:24px;
            "
        >

            <div
                class="create-box"
                style="
                    width:100%;
                    max-width:500px;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:55px;
                        margin-bottom:15px;
                    "
                >
                    🇸🇱
                </div>


                <h1>
                    SaloneBiz
                </h1>


                <h2>
                    Something went wrong
                </h2>


                <p class="text-muted">
                    ${escapeHtml(message)}
                </p>


                <button
                    class="primary-button"
                    type="button"
                    onclick="location.reload()"
                >
                    Reload app
                </button>

            </div>

        </div>

    `;

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
