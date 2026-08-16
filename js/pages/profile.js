import { getUser } from "../state.js";

export async function renderProfile(app) {

    const user =
        getUser();


    if (!user) {

        app.innerHTML = `

            <div class="page">

                <div class="container">

                    <h2>
                        Please sign in.
                    </h2>

                </div>

            </div>

        `;

        return;
    }


    app.innerHTML = `

        <div class="page">

            <header class="app-header">

                <div class="header-inner">

                    <div class="brand">
                        👤 Profile
                    </div>

                    <button
                        class="header-action"
                        id="settingsButton"
                    >
                        ⚙️
                    </button>

                </div>

            </header>


            <div class="profile-cover"></div>


            <main class="profile-main">

                <div class="profile-avatar">
                    👤
                </div>


                <h1 class="profile-name">
                    ${escapeHTML(user.name)}
                </h1>


                <p class="profile-email">
                    ${escapeHTML(user.email)}
                </p>


                <div class="profile-stats">

                    <div class="stat">

                        <strong>
                            0
                        </strong>

                        <span>
                            Posts
                        </span>

                    </div>


                    <div class="stat">

                        <strong>
                            0
                        </strong>

                        <span>
                            Followers
                        </span>

                    </div>


                    <div class="stat">

                        <strong>
                            0
                        </strong>

                        <span>
                            Following
                        </span>

                    </div>

                </div>


                <div class="business-card">

                    <h2>
                        🏪 My Business
                    </h2>

                    <p class="text-muted">
                        Your business profile will be built here.
                    </p>

                </div>


                <div class="business-card">

                    <h2>
                        ⭐ Favorites
                    </h2>

                    <p class="text-muted">
                        Posts you save will appear here.
                    </p>

                </div>

            </main>

        </div>
    `;
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
