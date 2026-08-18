// =====================================================
// 🇸🇱 SALONEBIZ APPLICATION
// Main application controller
// =====================================================

import {
    initializeAuth
} from "./auth.js";

import {
    loadUser
} from "./state.js";

import {
    checkAPI
} from "./api.js";


// =====================================================
// APPLICATION STATE
// =====================================================

const app =
    document.getElementById("app");

const loader =
    document.getElementById("app-loader");

const bottomNav =
    document.getElementById("bottomNav");


// =====================================================
// START APPLICATION
// =====================================================

async function startApp() {

    console.log(
        "🇸🇱 Starting SaloneBiz..."
    );


    // -------------------------------------------------
    // Verify required HTML
    // -------------------------------------------------

    if (!app) {

        console.error(
            "❌ #app element was not found."
        );

        return;
    }


    // -------------------------------------------------
    // Show loading state
    // -------------------------------------------------

    showLoader();


    // -------------------------------------------------
    // Load saved session
    // -------------------------------------------------

    loadUser();


    // -------------------------------------------------
    // Check backend
    // -------------------------------------------------

    checkBackend();


    // -------------------------------------------------
    // Initialize authentication
    // -------------------------------------------------

    try {

        initializeAuth();

    } catch (error) {

        console.error(
            "❌ Authentication initialization failed:",
            error
        );


        showFatalError(
            "Unable to start SaloneBiz."
        );

    }


    // -------------------------------------------------
    // Hide loader
    // -------------------------------------------------

    hideLoader();

}


// =====================================================
// BACKEND HEALTH CHECK
// =====================================================

async function checkBackend() {

    try {

        const result =
            await checkAPI();


        if (
            result &&
            (
                result.status === "healthy" ||
                result.success === true
            )
        ) {

            console.log(
                "🟢 SaloneBiz API is online."
            );


            updateAPIStatus(
                true
            );


        } else {

            console.warn(
                "🟠 SaloneBiz API responded, but may not be healthy."
            );


            updateAPIStatus(
                false
            );

        }


    } catch (error) {

        console.warn(
            "🔴 SaloneBiz API unavailable:",
            error
        );


        updateAPIStatus(
            false
        );

    }

}


// =====================================================
// API STATUS UI
// =====================================================

function updateAPIStatus(
    online
) {

    const status =
        document.getElementById(
            "apiStatus"
        );


    if (!status) {
        return;
    }


    if (online) {

        status.textContent =
            "API Online";

        status.classList.remove(
            "offline"
        );

        status.classList.add(
            "online"
        );

    } else {

        status.textContent =
            "API Offline";

        status.classList.remove(
            "online"
        );

        status.classList.add(
            "offline"
        );

    }

}


// =====================================================
// LOADER
// =====================================================

function showLoader() {

    if (!loader) {
        return;
    }


    loader.classList.remove(
        "hidden"
    );

}


function hideLoader() {

    if (!loader) {
        return;
    }


    setTimeout(
        () => {

            loader.classList.add(
                "hidden"
            );

        },
        350
    );

}


// =====================================================
// FATAL ERROR
// =====================================================

function showFatalError(
    message
) {

    if (!app) {
        return;
    }


    app.innerHTML = `

        <div class="page">

            <main class="container">

                <div
                    class="create-box"
                    style="
                        text-align:center;
                        margin-top:80px;
                    "
                >

                    <div
                        style="
                            font-size:55px;
                            margin-bottom:15px;
                        "
                    >
                        ⚠️
                    </div>


                    <h2>
                        SaloneBiz couldn't start
                    </h2>


                    <p class="text-muted">
                        ${escapeHtml(message)}
                    </p>


                    <button
                        class="primary-button"
                        id="reloadApp"
                        type="button"
                    >
                        Reload
                    </button>

                </div>

            </main>

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


// =====================================================
// GLOBAL EVENTS
// =====================================================


// Login completed
window.addEventListener(
    "auth:success",
    () => {

        console.log(
            "✅ Authentication successful."
        );

    }
);


// Logout completed
window.addEventListener(
    "auth:logout",
    () => {

        console.log(
            "👋 User logged out."
        );

    }
);


// Network comes back
window.addEventListener(
    "online",
    () => {

        console.log(
            "🟢 Internet connection restored."
        );

        checkBackend();

    }
);


// Network goes offline
window.addEventListener(
    "offline",
    () => {

        console.warn(
            "🔴 Internet connection lost."
        );

        updateAPIStatus(
            false
        );

    }
);


// =====================================================
// START WHEN DOM IS READY
// =====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startApp
    );

} else {

    startApp();

}


// =====================================================
// DEBUG
// =====================================================

window.SaloneBizApp = {

    start:
        startApp,

    checkAPI:
        checkBackend

};
