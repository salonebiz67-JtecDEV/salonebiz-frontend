import {
    login,
    register,
    checkAPI
} from "./api.js";

import {
    setUser
} from "./auth.js";

import {
    showToast,
    setLoading
} from "./ui.js";


export function renderAuth(app) {

    app.innerHTML = `

        <section class="auth-page">

            <div class="auth-grid">

                <!-- HERO -->

                <div class="hero reveal">

                    <div class="auth-brand">

                        <span class="flag">
                            🇸🇱
                        </span>

                        <span>
                            SaloneBiz
                        </span>

                        <span
                            id="api-status"
                            class="status"
                        >
                            <i class="status-dot"></i>
                            Checking API...
                        </span>

                    </div>


                    <div style="margin-top:55px">

                        <div class="eyebrow">
                            Welcome to SaloneBiz
                        </div>

                        <h1>

                            Your business.

                            <br>

                            <span class="gradient-text">
                                Your workspace.
                            </span>

                        </h1>

                        <p>

                            One private workspace
                            for your business tools,
                            profile and connected
                            services — built for
                            Sierra Leone.

                        </p>

                        <ul class="feature-list">

                            <li>
                                ✓ Secure authentication
                            </li>

                            <li>
                                ✓ Live API health check
                            </li>

                            <li>
                                ✓ Protected workspace
                            </li>

                        </ul>

                    </div>

                </div>


                <!-- AUTH CARD -->

                <div
                    class="auth-card reveal delay-2"
                >

                    <div class="auth-inner">

                        <div class="tabs">

                            <button
                                class="tab active"
                                data-mode="login"
                            >
                                Sign in
                            </button>

                            <button
                                class="tab"
                                data-mode="register"
                            >
                                Create account
                            </button>

                        </div>


                        <div id="form-container"></div>

                    </div>

                </div>

            </div>

        </section>

    `;


    checkHealth();

    setupMode("login");
}


/* =====================================================
   API HEALTH
===================================================== */

async function checkHealth() {

    const status =
        document.querySelector(
            "#api-status"
        );

    if (!status) {
        return;
    }


    try {

        const data =
            await checkAPI();


        if (
            data &&
            data.success &&
            data.status === "healthy"
        ) {

            status.innerHTML = `
                <i class="status-dot"></i>
                API online
            `;

            status.style.color =
                "#4ade80";

        } else {

            throw new Error(
                "API not healthy"
            );
        }

    } catch (error) {

        console.error(
            "API health check failed:",
            error
        );

        status.innerHTML = `
            <i class="status-dot"></i>
            API offline
        `;

        status.style.color =
            "#fb7185";
    }
}


/* =====================================================
   LOGIN / REGISTER MODE
===================================================== */

function setupMode(mode) {

    document
        .querySelectorAll(".tab")
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.mode === mode
            );


            tab.onclick = () => {

                setupMode(
                    tab.dataset.mode
                );

            };

        });


    const isRegister =
        mode === "register";


    const container =
        document.querySelector(
            "#form-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <h2 class="form-title">

            ${
                isRegister
                    ? "Create your account"
                    : "Welcome back"
            }

        </h2>


        <p class="form-subtitle">

            ${
                isRegister
                    ? "Create your private SaloneBiz workspace."
                    : "Sign in to unlock your private workspace."
            }

        </p>


        <form id="auth-form">

            ${
                isRegister
                    ? `

                <div class="form-group">

                    <label>
                        Full name
                    </label>

                    <input
                        class="form-input"
                        name="name"
                        autocomplete="name"
                        placeholder="John Fatoma"
                        required
                    >

                </div>


                <div class="form-group">

                    <label>
                        Phone
                    </label>

                    <input
                        class="form-input"
                        name="phone"
                        autocomplete="tel"
                        placeholder="+232 76 123456"
                        required
                    >

                </div>

                `
                    : ""
            }


            <div class="form-group">

                <label>
                    Email
                </label>

                <input
                    class="form-input"
                    name="email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Password
                </label>

                <div class="input-wrap">

                    <input
                        class="form-input"
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="${
                            isRegister
                                ? "new-password"
                                : "current-password"
                        }"
                        placeholder="Password"
                        minlength="6"
                        required
                    >


                    <button
                        type="button"
                        class="password-toggle"
                        id="toggle-password"
                    >
                        Show
                    </button>

                </div>

            </div>


            <button
                class="primary-btn"
                id="submit-btn"
                type="submit"
            >

                ${
                    isRegister
                        ? "Create account →"
                        : "Sign in →"
                }

            </button>


            <p class="small-note">

                Your password is sent
                only to your backend
                over HTTPS.

            </p>

        </form>

    `;


    /* =================================================
       PASSWORD VISIBILITY
    ================================================= */

    const passwordInput =
        document.querySelector(
            "#password"
        );

    const toggleButton =
        document.querySelector(
            "#toggle-password"
        );


    if (
        passwordInput &&
        toggleButton
    ) {

        toggleButton.onclick = () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                toggleButton.textContent =
                    "Hide";

            } else {

                passwordInput.type =
                    "password";

                toggleButton.textContent =
                    "Show";
            }

        };
    }


    /* =================================================
       FORM SUBMIT
    ================================================= */

    const form =
        document.querySelector(
            "#auth-form"
        );


    if (!form) {
        return;
    }


    form.onsubmit = async event => {

        event.preventDefault();


        const formData =
            new FormData(
                event.currentTarget
            );


        const button =
            document.querySelector(
                "#submit-btn"
            );


        const email =
            String(
                formData.get("email") || ""
            ).trim();


        const password =
            String(
                formData.get("password") || ""
            );


        if (!email || !password) {

            showToast(
                "Email and password are required",
                "error"
            );

            return;
        }


        setLoading(
            button,
            true,
            isRegister
                ? "Creating account..."
                : "Signing in..."
        );


        try {

            let data;


            /* =========================================
               LOGIN
            ========================================= */

            if (!isRegister) {

                data =
                    await login(
                        email,
                        password
                    );

            }


            /* =========================================
               REGISTER
            ========================================= */

            else {

                const name =
                    String(
                        formData.get("name") || ""
                    ).trim();


                const phone =
                    String(
                        formData.get("phone") || ""
                    ).trim();


                if (!name) {

                    throw new Error(
                        "Full name is required"
                    );
                }


                if (!phone) {

                    throw new Error(
                        "Phone number is required"
                    );
                }


                data =
                    await register(
                        name,
                        email,
                        password,
                        phone
                    );
            }


            /* =========================================
               CHECK RESPONSE
            ========================================= */

            if (
                !data ||
                !data.success
            ) {

                throw new Error(
                    data?.message ||
                    "Authentication failed"
                );
            }


            /*
             * Some backends return the token
             * separately from the user.
             *
             * Put the token inside the user
             * object so auth.js and api.js
             * can use the same session.
             */

            const user = {
                ...(data.user || {})
            };


            if (data.token) {

                user.token =
                    data.token;
            }


            if (
                !user.id
            ) {

                throw new Error(
                    "Authentication succeeded but no user was returned."
                );
            }


            setUser(user);


            showToast(
                isRegister
                    ? "Account created successfully 🎉"
                    : "Login successful 👋",
                "success"
            );


            window.dispatchEvent(
                new CustomEvent(
                    "auth:success"
                )
            );


        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );


            showToast(
                error.message ||
                "Authentication failed",
                "error"
            );


            setLoading(
                button,
                false
            );
        }
    };
}
