import { renderHome } from "./pages/home.js";
import { renderFriends } from "./pages/friends.js";
import { renderCreate } from "./pages/create.js";
import { renderInbox } from "./pages/inbox.js";
import { renderProfile } from "./pages/profile.js";

const pages = {

    home: renderHome,

    friends: renderFriends,

    create: renderCreate,

    inbox: renderInbox,

    profile: renderProfile

};


export async function navigate(page) {

    const render = pages[page];

    if (!render) {
        console.error(
            `Unknown page: ${page}`
        );

        return;
    }

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });

    const app =
        document.getElementById("app");

    app.innerHTML = `
        <div class="page">
            <div class="container">
                <div class="loader"></div>
            </div>
        </div>
    `;

    try {

        await render(app);

    } catch (error) {

        console.error(error);

        app.innerHTML = `
            <div class="page">
                <div class="container">

                    <h2>
                        Something went wrong
                    </h2>

                    <p class="text-muted">
                        ${error.message}
                    </p>

                </div>
            </div>
        `;
    }
}
