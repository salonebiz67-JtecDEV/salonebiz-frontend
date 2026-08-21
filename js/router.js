// =====================================================
// 🇸🇱 SALONEBIZ ROUTER
// js/router.js
// =====================================================

const routes = {
    home: () => import("./pages/home.js").then(m => m.renderHome),
    friends: () => import("./pages/friends.js").then(m => m.renderFriends),
    create: () => import("./pages/create.js").then(m => m.renderCreate),
    profile: () => import("./pages/profile.js").then(m => m.renderProfile),
    search: () => import("./pages/search.js").then(m => m.renderSearch),
    inbox: () => import("./pages/inbox.js").then(m => m.renderInbox),
    settings: () => import("./pages/settings.js").then(m => m.renderSettings)
};

export async function navigate(page = "home") {
    const app = document.getElementById("app");

    if (!app) {
        console.error("❌ Router: #app element not found.");
        return;
    }

    if (!routes[page]) {
        console.warn(`⚠️ Unknown page "${page}". Loading home.`);
        return navigate("home");
    }

    updateNavigation(page);

    app.innerHTML = `
        <div class="page">
            <main class="container">
                <div style="min-height:70vh;display:flex;align-items:center;justify-content:center;">
                    <div style="text-align:center;padding:30px;">
                        <div class="loader" style="margin:auto"></div>
                        <p class="text-muted" style="margin-top:15px">Loading SaloneBiz...</p>
                    </div>
                </div>
            </main>
        </div>
    `;

    try {
        console.log(`📄 Loading page: ${page}`);

        const renderer = await routes[page]();

        if (typeof renderer !== "function") {
            throw new Error(`Page "${page}" does not export the correct renderer.`);
        }

        await renderer(app);

        window.SaloneBizCurrentPage = page;

        const newHash = `#${page}`;
        if (window.location.hash !== newHash) {
            history.replaceState({ page }, "", newHash);
        }

        console.log(`✅ Page loaded: ${page}`);
    } catch (error) {
        console.error(`❌ Failed to load page "${page}"`, error);
        console.error("Full error:", error?.stack);
        showPageError(app, page, error);
    }
}

function showPageError(app, page, error) {
    const message = error?.message || "Unknown error";

    app.innerHTML = `
        <div class="page">
            <main class="container">
                <div class="create-box" style="margin-top:30px;text-align:center;">
                    <div style="font-size:52px;margin-bottom:15px;">⚠️</div>
                    <h2>Page failed to load</h2>
                    <p class="text-muted" style="margin-top:12px;word-break:break-word;">
                        ${escapeHtml(message)}
                    </p>
                    <p style="margin-top:12px;font-size:13px;opacity:.65;">
                        Page: ${escapeHtml(page)}
                    </p>
                    <button class="primary-button" id="routerRetry" type="button">Try Again</button>
                    <button class="secondary-button" id="routerHome" type="button" style="margin-top:10px">Go Home</button>
                </div>
            </main>
        </div>
    `;

    document.getElementById("routerRetry")?.addEventListener("click", () => navigate(page));
    document.getElementById("routerHome")?.addEventListener("click", () => navigate("home"));
}

function updateNavigation(currentPage) {
    document.querySelectorAll("[data-page]").forEach(button => {
        button.classList.toggle("active", button.dataset.page === currentPage);
    });
}

export function setupRouter() {
    window.addEventListener("hashchange", () => {
        const page = window.location.hash.replace("#", "").trim();
        if (page && routes[page]) navigate(page);
    });

    const initialPage = window.location.hash.replace("#", "").trim();

    if (initialPage && routes[initialPage]) {
        navigate(initialPage);
    } else {
        navigate("home");
    }
}

export function getCurrentPage() {
    return window.SaloneBizCurrentPage || "home";
}

export function getRoutes() {
    return Object.keys(routes);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
