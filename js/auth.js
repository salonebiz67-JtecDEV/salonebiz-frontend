import {
    login
} from "./api.js";

import {
    setUser,
    clearUser,
    loadUser
} from "./state.js";

import {
    navigate
} from "./router.js";


export function initializeAuth() {

    const user =
        loadUser();

    if (user) {

        showApp();

    } else {

        showLogin();

    }
}


/* =====================================
   LOGIN SCREEN
===================================== */

function showLogin() {

    const app =
        document.getElementById(
            "app"
        );

    document
        .getElementById(
            "bottomNav"
        )
        .classList.add("hidden");


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
                            placeholder="Email"
                        >


                        <input
                            class="form-input"
                            id="loginPassword"
                            type="password"
                            placeholder="Password"
                        >


                        <button
                            class="primary-button"
                            id="loginButton"
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


    document
        .getElementById(
            "loginButton"
        )
        .addEventListener(
            "click",
            performLogin
        );
}


/* =====================================
   LOGIN
===================================== */

async function performLogin() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();

    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    const error =
        document
            .getElementById(
                "loginError"
            );

    const button =
        document
            .getElementById(
                "loginButton"
            );


    if (!email || !password) {

        error.textContent =
            "Enter your email and password.";

        return;
    }


    button.disabled = true;

    button.textContent =
        "Signing in...";


    try {

        const result =
            await login(
                email,
                password
            );


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        setUser(
            result.user
        );


        showApp();


    } catch (err) {

        error.textContent =
            err.message ||
            "Login failed.";

        button.disabled = false;

        button.textContent =
            "Sign in";

    }

}


/* =====================================
   SHOW APP
===================================== */

function showApp() {

    const nav =
        document.getElementById(
            "bottomNav"
        );

    nav.classList.remove(
        "hidden"
    );


    setupNavigation();

    navigate("home");

}


/* =====================================
   LOGOUT
===================================== */

export function logout() {

    clearUser();

    showLogin();

}


/* =====================================
   NAVIGATION
===================================== */

function setupNavigation() {

    document
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(button => {

            button.onclick = () => {

                navigate(
                    button.dataset.page
                );

            };

        });
}
