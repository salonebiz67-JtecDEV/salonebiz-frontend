import {
    api
} from "./api.js";

import {
    setUser
} from "./auth.js";

import {
    showToast,
    setLoading
} from "./ui.js";


export function renderAuth(
    app
) {

    app.innerHTML = `

        <section class="auth-page">

            <div class="auth-grid">


                <!-- =====================================
                     HERO
                ====================================== -->

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


                    <div
                        style="margin-top:55px"
                    >

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


                        <ul
                            class="feature-list"
                        >

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


                <!-- =====================================
                     AUTH CARD
                ====================================== -->

                <div
                    class="auth-card
                           reveal
                           delay-2"
                >

                    <div class="auth-inner">


                        <!-- Tabs -->

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


                        <div
                            id="form-container"
                        ></div>


                    </div>

                </div>


            </div>

        </section>

    `;


    checkHealth();

    setupMode(
        "login"
    );

}


/* =====================================================
   API HEALTH
===================================================== */

async function checkHealth() {

    const status =
        document.querySelector(
            "#api-status"
        );


    try {

        const data =
            await api.health();


        if (
            data.status ===
            "healthy"
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

    } catch {

        status.innerHTML = `
            <i class="status-dot"></i>
            API offline
        `;

        status.style.color =
            "#fb7185";

    }

}


/* =====================================================
   SWITCH LOGIN / REGISTER
===================================================== */

function setupMode(
    mode
) {

    document
        .querySelectorAll(
            ".tab"
        )
        .forEach(
            tab => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.mode ===
                    mode
                );


                tab.onclick = () => {

                    setupMode(
                        tab.dataset.mode
                    );

                };

            }
        );


    const isRegister =
        mode ===
        "register";


    document.querySelector(
        "#form-container"
    ).innerHTML = `

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

                <div
                    class="form-group"
                >

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


                <div
                    class="form-group"
                >

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


            <div
                class="form-group"
            >

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


            <div
                class="form-group"
            >

                <label>
                    Password
                </label>


                <div
                    class="input-wrap"
                >

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


            <p
                class="small-note"
            >

                Your password is sent
                only to your backend
                over HTTPS.

            </p>

        </form>

    `;


    /* Password visibility */

    document.querySelector(
        "#toggle-password"
    ).onclick = () => {

        const input =
            document.querySelector(
                "#password"
            );


        const button =
            document.querySelector(
                "#toggle-password"
            );


        if (
            input.type ===
            "password"
        ) {

            input.type =
                "text";

            button.textContent =
                "Hide";

        } else {

            input.type =
                "password";

            button.textContent =
                "Show";

        }

    };


    /* Submit */

    document.querySelector(
        "#auth-form"
    ).onsubmit = async (
        event
    ) => {

        event.preventDefault();


        const form =
            new FormData(
                event.currentTarget
            );


        const button =
            document.querySelector(
                "#submit-btn"
            );


        const payload = {

            email:
                String(
                    form.get("email") ||
                    ""
                ).trim(),

            password:
                String(
                    form.get("password") ||
                    ""
                )

        };


        if (isRegister) {

            payload.name =
                String(
                    form.get("name") ||
                    ""
                ).trim();


            payload.phone =
                String(
                    form.get("phone") ||
                    ""
                ).trim();

        }


        setLoading(
            button,
            true,
            isRegister
                ? "Creating account..."
                : "Signing in..."
        );


        try {

            const data =
                isRegister

                    ? await api.register(
                        payload
                    )

                    : await api.login(
                        payload
                    );


            if (
                !data.user
            ) {

                throw new Error(
                    "Authentication succeeded but no user was returned."
                );

            }


            setUser(
                data.user
            );


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


        } catch (
            error
        ) {

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
