// =====================================================
// 🇸🇱 SALONEBIZ AUTHENTICATION
// =====================================================

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
        document.getElementById("app");


    if (!app) {

        console.error(
            "❌ #app element not found"
        );

        return;
    }


    const bottomNav =
        document.getElementById("bottomNav");


    if (bottomNav) {

        bottomNav.classList.add(
            "hidden"
        );

    }


    app.innerHTML = `

        <div class="page">

            <main class="container">

                <div
                    style="
                        min-height:100vh;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >

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
                                style="font-size:50px;"
                            >
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


    // =================================================
    // LOGIN REQUEST
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
        // VERIFY USER
        // =================================================

        if (!result.user) {

            throw new Error(
                "Login succeeded, but the server did not return your account."
            );

        }


        // =================================================
        // SAVE SESSION
        // =================================================

        const user = {

            ...result.user,

            ...(result.token
                ? {
                    token:
                        result.token
                }
                : {})

        };


        setUser(user);


        // =================================================
        // OPEN APPLICATION
        // =================================================

        showApp();


    } catch (error) {

        console.error(
            "❌ Login error:",
            error
        );


        errorMessage(
            error.message ||
            "Unable to sign in."
        );


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


    navigate(
        "home"
    );

}


// =====================================================
// LOGOUT
// =====================================================

export function logout() {

    // Clear API token
    apiLogout();


    // Clear frontend state
    clearUser();


    // Hide navigation
    const nav =
        document.getElementById(
            "bottomNav"
        );


    if (nav) {

        nav.classList.add(
            "hidden"
        );

    }


    // Return to login
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


                navigate(page);

            };

        }
    );

}
