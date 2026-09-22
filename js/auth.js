import { navigate } from "./router.js";

// =====================================================
// 🇸🇱 SALONEBIZ AUTHENTICATION (temporarily disabled)
//
// Login and create-account are removed while the app is
// being built. The app opens straight to Home.
// Add the real login back before deploying.
// =====================================================

export function initializeAuth() {
    showApp();
}

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
                            <h2>Kivo couldn't open</h2>
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

// Kept so other files that import logout don't break.
export function logout() {
    showApp();
}

window.SaloneBizAuth = { logout };

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
