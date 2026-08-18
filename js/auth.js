import {
    login as apiLogin,
    logout as apiLogout
} from "./api.js";

import {
    setUser,
    clearUser,
    loadUser
} from "./state.js";

import {
    navigate
} from "./router.js";


// =====================================================
// 🇸🇱 SALONEBIZ AUTHENTICATION
// =====================================================


// =====================================================
// INITIALIZE AUTH
// =====================================================

export function initializeAuth() {

    console.log("🔐 Initializing authentication...");

    try {

        const user = loadUser();

        if (user) {

            console.log("✅ Existing session found.");

            showApp();

        } else {

            console.log("ℹ️ No session found.");

            showLogin();

        }

    } catch (error) {

        console.error(
            "❌ Authentication initialization error:",
            error
        );

        showLogin();

    }

}


// =====================================================
// LOGIN SCREEN
// =====================================================

function showLogin() {

    const app =
        document.getElementById("app");


    if (!app) {

        console.error(
            "❌ #app element not found."
        );

        return;

    }


    const bottomNav =
        document.getElementById("bottomNav");


    if (bottomNav) {

        bottomNav.classList.add("hidden");

    }


    app.innerHTML = `

        <div class="page">

            <main class="container">

                <div style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                ">

                    <div
                        class="create-box"
                        style="width:100%;"
                    >

                        <div style="
                            text-align:center;
                            margin-bottom:30px;
                        ">

                            <div style="
                                font-size:50px;
                                margin-bottom:10px;
                            ">
                                🇸🇱
                            </div>

                            <h1>
                                SaloneBiz
                            </h1>

                            <p class="text-muted">
                                Your business.
                                Your workspace.
                            </p>

                        </div>


                        <input
                            class="form-input"
                            id="loginEmail"
                            type="email"
                            autocomplete="email"
                            placeholder="Email"
                        >


                        <input
                            class="form-input"
                            id="loginPassword"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Password"
                        >


                        <button
                            class="primary-button"
                            id="loginButton"
                            type="button"
                        >
                            Sign in
                        </button>


                        <p
                            id="loginError"
                            style="
                                color:#ff5577;
                                margin-top:15px;
                                text-align:center;
                                min-height:20px;
                            "
                        ></p>

                    </div>

                </div>

            </main>

        </div>

    `;


    const loginButton =
        document.getElementById("loginButton");


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            performLogin
        );

    }

}


// =====================================================
// LOGIN
// =====================================================

async function performLogin() {

    const emailInput =
        document.getElementById("loginEmail");


    const passwordInput =
        document.getElementById("loginPassword");


    const error =
        document.getElementById("loginError");


    const button =
        document.getElementById("loginButton");


    if (
        !emailInput ||
        !passwordInput ||
        !error ||
        !button
    ) {

        console.error(
            "❌ Login elements not found."
        );

        return;

    }


    const email =
        emailInput.value.trim();


    const password =
        passwordInput.value;


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!email) {

        error.textContent =
            "Enter your email.";

        emailInput.focus();

        return;

    }


    if (!password) {

        error.textContent =
            "Enter your password.";

        passwordInput.focus();

        return;

    }


    button.disabled = true;

    button.textContent =
        "Signing in...";

    error.textContent =
        "";


    // -------------------------------------------------
    // API LOGIN
    // -------------------------------------------------

    try {

        console.log(
            "🔄 Signing in..."
        );


        const result =
            await apiLogin(
                email,
                password
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result?.message ||
                "Login failed."
            );

        }


        if (!result.user) {

            throw new Error(
                "Login succeeded, but no user account was returned."
            );

        }


        // -------------------------------------------------
        // SAVE USER
        // -------------------------------------------------

        const user = {

            ...result.user,

            ...(result.token
                ? {
                    token: result.token
                }
                : {})

        };


        setUser(user);


        console.log(
            "✅ Login successful."
        );


        // -------------------------------------------------
        // OPEN APP
        // -------------------------------------------------

        showApp();


    } catch (err) {

        console.error(
            "❌ Login error:",
            err
        );


        const message =
            err?.message ||
            "Unable to sign in.";


        errorMessage(message);


        button.disabled = false;

        button.textContent =
            "Sign in";

    }

}


// =====================================================
// ERROR DISPLAY
// =====================================================

function errorMessage(message) {

    const error =
        document.getElementById(
            "loginError"
        );


    if (error) {

        error.textContent =
            message;

    }

}


// =====================================================
// SHOW APPLICATION
// =====================================================

async function showApp() {

    const nav =
        document.getElementById(
            "bottomNav"
        );


    if (nav) {

        nav.classList.remove(
            "hidden"
        );

    }


    setupNavigation();


    try {

        console.log(
            "🚀 Opening SaloneBiz home..."
        );


        await navigate("home");


        console.log(
            "✅ SaloneBiz home loaded."
        );


    } catch (error) {

        console.error(
            "❌ Failed to open home:",
            error
        );


        const app =
            document.getElementById("app");


        if (app) {

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

                            <div style="
                                font-size:50px;
                                margin-bottom:15px;
                            ">
                                ⚠️
                            </div>

                            <h2>
                                SaloneBiz couldn't open
                            </h2>

                            <p
                                class="text-muted"
                                style="margin-top:10px;"
                            >
                                ${escapeHtml(
                                    error?.message ||
                                    "The home page failed to load."
                                )}
                            </p>

                            <button
                                class="primary-button"
                                id="openHomeAgain"
                                type="button"
                            >
                                Open Home Again
                            </button>

                        </div>

                    </main>

                </div>

            `;


            document
                .getElementById("openHomeAgain")
                ?.addEventListener(
                    "click",
                    () => showApp()
                );

        }

    }

}


// =====================================================
// LOGOUT
// =====================================================

export function logout() {

    console.log(
        "👋 Logging out..."
    );


    try {

        apiLogout();

    } catch (error) {

        console.warn(
            "⚠️ API logout cleanup error:",
            error
        );

    }


    clearUser();


    const nav =
        document.getElementById(
            "bottomNav"
        );


    if (nav) {

        nav.classList.add(
            "hidden"
        );

    }


    showLogin();

}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            "[data-page]"
        );


    buttons.forEach(
        button => {

            button.onclick = async () => {

                const page =
                    button.dataset.page;


                if (!page) {
                    return;
                }


                try {

                    await navigate(page);

                } catch (error) {

                    console.error(
                        "❌ Navigation error:",
                        error
                    );

                }

            };

        }
    );

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
