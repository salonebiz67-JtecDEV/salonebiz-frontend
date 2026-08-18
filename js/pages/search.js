import { apiGet } from "../api.js";

export async function renderSearch(app) {

    app.innerHTML = `
        <div class="page">

            <header class="app-header">
                <div class="header-inner">
                    <div class="brand">🔍 Search</div>
                </div>
            </header>

            <main class="container">

                <div class="search-box">

                    <span>🔍</span>

                    <input
                        id="searchInput"
                        type="search"
                        placeholder="Businesses, people..."
                    >

                </div>

                <div id="searchResults" class="empty-state small">

                    <div>🔎</div>

                    <p>Start searching SaloneBiz.</p>

                </div>

            </main>

        </div>
    `;

    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    input.focus();

    input.addEventListener("input", async () => {

        const query = input.value.trim();

        if (!query) {

            results.innerHTML = `
                <div>🔎</div>
                <p>Start searching SaloneBiz.</p>
            `;

            return;
        }

        results.innerHTML = `<div class="loader"></div>`;

        try {

            const data = await apiGet(
                `/api/users?q=${encodeURIComponent(query)}`
            );

            const users = data.users || [];

            if (!users.length) {

                results.innerHTML = `
                    <div>😕</div>
                    <p>No results found.</p>
                `;

                return;
            }

            results.innerHTML = users.map(user => `
                <div class="business-card">

                    <div class="business-card-top">

                        <div class="business-card-avatar">
                            👤
                        </div>

                        <div>
                            <strong>${escape(user.name)}</strong>
                            <p class="text-muted">${escape(user.role || "Business")}</p>
                        </div>

                    </div>

                </div>
            `).join("");

        } catch {

            results.innerHTML = `
                <div>⚠️</div>
                <p>Search unavailable.</p>
            `;

        }

    });

}

function escape(text) {

    return String(text ?? "").replace(/[&<>"']/g, c => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"
    })[c]);

}
