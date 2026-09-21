import { apiPost } from "./api.js";
import { CONFIG } from "./config.js";
import { setUser, clearUser, loadUser } from "./state.js";
import { navigate } from "./router.js";

// =====================================================
// 🇸🇱 SALONEBIZ AUTHENTICATION (temporary version)
//
// Entry options for now:
//   1. Continue with Google
//   2. Continue as Guest
//
// Email/password login and create-account are removed
// until the full login system is built before deploy.
// =====================================================

// =====================================================
// INITIALIZE AUTH
// =====================================================

export function initializeAuth() {
    try {
        const user = loadUser();

        if (user) {
            showApp();
        } else {
            showWelcome();
        }
    } catch (error) {
        console.error("❌ Authentication initialization error:", error);
        showWelcome();
    }
}

// =====================================================
// WELCOME SCREEN (Google + Guest)
// =====================================================

function showWelcome() {
    const app = document.getElementById("app");
    if (!app) return;

    document.getElementById("bottomNav")?.classList.add("hidden");

    app.innerHTML = `
        <div class="page">
            <main class="container">
                <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
                    <div class="create-box" style="width:100%;">

                        <div style="text-align:center;margin-bottom:30px;">
                            <div style="font-size:50px;margin-bottom:10px;">🇸🇱</div>
                            <h1>SaloneBiz</h1>
                            <p class="text-muted">Your business. Your workspace.</p>
                        </div>

                        <div id="googleButton" style="display:flex;justify-content:center;min-height:44px;"></div>

                        <p class="text-muted" style="text-align:center;margin:14px 0;">or</p>

                        <button class="secondary-button" id="guestButton" type="button">
                            Continue as Guest
                        </button>

                        <p id="loginError" style="color:#ff5577;margin-top:15px;text-align:center;min-height:20px;"></p>

                    </div>
                </div>
            </main>
        </div>
    `;

    document.getElementById("guestButton")?.addEventListener("click", continueAsGuest);

    setupGoogleButton();
}

function showError(message) {
    const el = document.getElementById("loginError");
    if (el) el.textContent = message;
}

// =====================================================
// GUEST
// =====================================================

function continueAsGuest() {
    // No token: guests can browse, but cannot post.
    setUser({
        id: "guest",
        name: "Guest",
        email: "",
        isGuest: true
    });

    showApp();
}

// =====================================================
// GOOGLE LOGIN
// =====================================================

function loadGoogleScript() {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Could not load Google sign-in."));
        document.head.appendChild(script);
    });
}

async function setupGoogleButton() {
    const container = document.getElementById("googleButton");
    if (!container) return;

    const clientId = CONFIG.GOOGLE_CLIENT_ID;

    if (!clientId || clientId.startsWith("PASTE_")) {
        showError("Google login isn't set up yet. You can continue as Guest.");
        return;
    }

    try {
        await loadGoogleScript();

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredential
        });

        window.google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: 280
        });
    } catch (error) {
        console.error("❌ Google setup error:", error);
        showError("Google login is unavailable right now. You can continue as Guest.");
    }
}

async function handleGoogleCredential(response) {
    showError("");

    try {
        if (!response?.credential) {
            throw new Error("Google did not return a login.");
        }

        // Backend verifies the Google token and returns:
        // { success: true, token: "<JWT>", user: {...} }
        const result = await apiPost("/api/auth/google", {
            credential: response.credential
        });

        if (!result?.success || !result.user) {
            throw new Error(result?.message || "Google login failed.");
        }

        setUser({
            ...result.user,
            ...(result.token ? { token: result.token } : {})
        });

        showApp();
    } catch (error) {
        console.error("❌ Google login error:", error);
        showError(error?.message || "Google login failed.");
    }
}

// =====================================================
// SHOW APPLICATION
// =====================================================

async function showApp() {
    document.getElementById("bottomNav")?.classList.remove("hidden");

    setupNavigation();

    try {
        await navigate("home");
    } catch (error) {
        console.error("❌ Failed to open home:", error);

        const app = document.getElementById("app");

        if (app) {
            app.innerHTML = `
                <div class="page">
                    <main class="container">
                        <div class="create-box" style="margin-top:30px;text-align:center;">
                            <div style="font-size:50px;margin-bottom:15px;">⚠️</div>
                            <h2>SaloneBiz couldn't open</h2>
                            <p class="text-muted" style="margin-top:10px;">
                                ${escapeHtml(error?.message || "The home page failed to load.")}
                            </p>
                            <button class="primary-button" id="openHomeAgain" type="button">
                                Open Home Again
                            </button>
                        </div>
                    </main>
                </div>
            `;

            document.getElementById("openHomeAgain")?.addEventListener("click", () => showApp());
        }
    }
}

// =====================================================
// LOGOUT (also used to leave guest mode)
// =====================================================

export function logout() {
    clearUser();

    document.getElementById("bottomNav")?.classList.add("hidden");

    history.replaceState(null, "", window.location.pathname);

    showWelcome();
}

window.SaloneBizAuth = { logout };

// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {
    document.querySelectorAll("[data-page]").forEach(button => {
        button.onclick = async () => {
            const page = button.dataset.page;
            if (!page) return;

            try {
                await navigate(page);
            } catch (error) {
                console.error("❌ Navigation error:", error);
            }
        };
    });
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
