import {
    apiGet,
    followUser,
    unfollowUser
} from "../api.js";

export async function renderFriends(app) {

    app.innerHTML = `
        <div class="page">

            <header class="app-header">
                <div class="header-inner">
                    <div class="brand">👥 Friends</div>
                </div>
            </header>

            <main class="container">

                <h1 class="page-title">Discover</h1>

                <p class="page-subtitle">
                    Find businesses and people to follow.
                </p>

                <div id="friendsList">
                    <div class="loader"></div>
                </div>

            </main>

        </div>
    `;

    const list = document.getElementById("friendsList");

    try {

        const result = await apiGet("/api/users");

        const users = result.users || [];

        if (!users.length) {

            list.innerHTML = `
                <div class="create-box" style="text-align:center;margin-top:30px;">
                    <div style="font-size:42px;">👥</div>
                    <h2>No users found</h2>
                    <p class="text-muted">
                        More businesses will appear here.
                    </p>
                </div>
            `;

            return;
        }

        list.innerHTML = users.map(user => `
            <div class="business-card" data-id="${user.id}">

                <div class="business-card-top">

                    <div class="business-card-avatar">
                        👤
                    </div>

                    <div>
                        <strong>${escape(user.name)}</strong>
                        <p class="text-muted">${escape(user.role || "Business")}</p>
                    </div>

                    <button class="follow-button" data-follow="false">
                        Follow
                    </button>

                </div>

            </div>
        `).join("");

        document.querySelectorAll(".follow-button").forEach(button => {

            button.onclick = async () => {

                const card = button.closest(".business-card");

                const userId = card.dataset.id;

                const following =
                    button.dataset.follow === "true";

                button.disabled = true;

                try {

                    if (following) {

                        await unfollowUser(userId);

                        button.textContent = "Follow";
                        button.dataset.follow = "false";

                    } else {

                        await followUser(userId);

                        button.textContent = "Following";
                        button.dataset.follow = "true";

                    }

                } catch (error) {

                    alert(error.message);

                }

                button.disabled = false;

            };

        });

    } catch (error) {

        list.innerHTML = `
            <div class="create-box" style="text-align:center;margin-top:30px;">
                <div style="font-size:42px;">⚠️</div>
                <h2>Unable to load users</h2>
                <p class="text-muted">${escape(error.message)}</p>
            </div>
        `;

    }

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
