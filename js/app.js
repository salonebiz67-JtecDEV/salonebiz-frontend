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
    // REQUIRED ELEMENTS
    // -------------------------------------------------

    const app =
        document.getElementById(
            "app"
        );


    const bottomNav =
        document.getElementById(
            "bottomNav"
        );


    if (!app) {

        console.error(
            "❌ SaloneBiz: #app element not found."
        );

        return;
    }


    // -------------------------------------------------
    // INITIAL NAVIGATION STATE
    // -------------------------------------------------

    if (bottomNav) {

        bottomNav.classList.add(
            "hidden"
        );

    }


    // -------------------------------------------------
    // LOAD SAVED USER
    // -------------------------------------------------

    const user =
        loadUser();


    if (user) {

        console.log(
            "👤 Saved user found:",
            user.name || user.email
        );

    } else {

        console.log(
            "👤 No saved user."
        );

    }


    // -------------------------------------------------
    // CHECK API
    // -------------------------------------------------

    try {

        const health =
            await checkAPI();


        if (
            health &&
            (
                health.success ||
                health.status === "healthy"
            )
        ) {

            console.log(
                "🟢 SaloneBiz API online."
            );

        } else {

            console.warn(
                "🟡 SaloneBiz API is unavailable."
            );

        }

    } catch (error) {

        console.warn(
            "🟡 API health check failed:",
            error
        );

    }


    // -------------------------------------------------
    // INITIALIZE AUTH
    // -------------------------------------------------

    try {

        initializeAuth();

    } catch (error) {

        console.error(
            "❌ Authentication initialization failed:",
            error
        );


        showStartupError(
            app,
            error
        );

    }


    // -------------------------------------------------
    // LOGOUT EVENT
    // -------------------------------------------------

    window.addEventListener(
        "salonebiz:logout",
        () => {

            logout();

        }
    );


    console.log(
        "✅ SaloneBiz startup complete."
    );

}


// =====================================================
// STARTUP ERROR SCREEN
// =====================================================

function showStartupError(
    app,
    error
) {

    const message =
        error?.message ||
        "Unknown application error.";


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
                        font-size:50px;
                        margin-bottom:15px;
                    "
                >
                    🇸🇱
                </div>


                <h1>
                    SaloneBiz
                </h1>


                <h2>
                    App couldn't start
                </h2>


                <p class="text-muted">
                    ${escapeHtml(message)}
                </p>


                <button
                    class="primary-button"
                    type="button"
                    id="reloadApp"
                >
                    Reload App
                </button>

            </div>

        </div>

    `;


    document
        .getElementById(
            "reloadApp"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.reload();

            }
        );

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
