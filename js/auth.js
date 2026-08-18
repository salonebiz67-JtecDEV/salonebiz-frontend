// =====================================================
// 🇸🇱 SALONEBIZ AUTHENTICATION
// =====================================================

import {
    login as apiLogin
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
// INITIALIZE AUTH
// =====================================================

export function initializeAuth() {

    const user =
        loadUser();


    if (user) {

        showApp();

    } else {

        showLogin();

    }

}


// =====================================================
// LOGIN SCREEN
// =====================================================

function showLogin() {

    const app =
        document.getElementById(
            "app"
        );


    if (!app) {
        console.error(
            "❌ #app element not found"
        );
        return;
    }


    const bottomNav =
        document.getElementById(
            "bottomNav"
        );


    if (bottomNav) {

        bottomNav.classList.add(
            "hidden"
        );

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

                        <div
                            style="
                                text-align:center;
                                margin-bottom:30px;
                            "
                        >

                            <div
                                style="
                                    font-size:50px;
                                "
                            >
                                🇸🇱
                            </div>

                            <h1>
                                SaloneBiz
                            </h1>

                            <p class="text-muted">
                                Your business. Your workspace.
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
                            "
                        ></p>

                    </div>

                </div>

            </main>

        </div>

    `;


    const loginButton =
        document.getElementById(
            "loginButton"
        );


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
        document.getElementById(
            "loginEmail"
        );


    const passwordInput =
        document.getElementById(
            "loginPassword"
        );


    const error =
        document.getElementById(
            "loginError"
        );


    const button =
        document.getElementById(
            "loginButton"
        );


    if (
        !emailInput ||
        !passwordInput ||
        !error ||
        !button
    ) {

        console.error(
            "❌ Login elements not found"
        );

        return;
    }


    const email =
        emailInput.value.trim();


    const password =
        passwordInput.value;


    // =================================================
    // VALIDATION
    // =================================================

    if (!email || !password) {

        error.textContent =
            "Enter your email and password.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "Signing in...";


    error.textContent =
        "";


    // =================================================
    // API LOGIN
    // =================================================

    try {

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


        // =================================================
        // USER CHECK
        // =================================================

        if (!result.user) {

            throw new Error(
                "Login succeeded but the server did not return a user."
            );

        }


        /*
         * api.js already stores the JWT.
         *
         * Here we also keep the complete session
         * inside state.js.
         */

        const user = {
            ...result.user
        };


        if (result.token) {

            user.token =
                result.token;

        }


        setUser(
            user
        );


        // =================================================
        // OPEN APP
        // =================================================

        showApp();


    } catch (err) {

        console.error(
            "❌ Login error:",
            err
        );


        error.textContent =
            err.message ||
            "Login failed.";


        button.disabled = false;

        button.textContent =
            "Sign in";

    }

}


// =====================================================
// SHOW APPLICATION
// =====================================================

function showApp() {

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

        navigate(
            "home"
        );

    } catch (error) {

        console.error(
            "❌ Navigation error:",
            error
        );

    }

}


// =====================================================
// LOGOUT
// =====================================================

export function logout() {

    clearUser();


    // Also remove JWT
    localStorage.removeItem(
        "salonebiz_token"
    );


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

            button.onclick = () => {

                const page =
                    button.dataset.page;


                if (!page) {
                    return;
                }


                try {

                    navigate(
                        page
                    );

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
