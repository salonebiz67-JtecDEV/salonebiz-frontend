import {
    getUser,
    clearUser
} from "./auth.js";


export function renderWorkspace(
    app
) {

    const user =
        getUser();


    if (!user) {
        return;
    }


    app.innerHTML = `

        <section
            class="workspace"
        >


            <!-- Navigation -->

            <nav
                class="workspace-nav reveal"
            >

                <div
                    class="auth-brand"
                >

                    <span
                        class="flag"
                    >
                        🇸🇱
                    </span>

                    <span>
                        SaloneBiz
                    </span>

                </div>


                <button
                    class="logout"
                    id="logout"
                >
                    Log out
                </button>

            </nav>


            <!-- Welcome -->

            <div
                class="reveal
                       delay-1"
            >

                <div
                    class="eyebrow"
                    style="margin-top:50px"
                >
                    Private workspace
                </div>


                <h1
                    class="workspace-title"
                >
                    Welcome,
                    ${escapeHtml(user.name)}
                    👋
                </h1>


                <p
                    class="workspace-subtitle"
                >

                    Your account is
                    authenticated and
                    your private workspace
                    is unlocked.

                </p>

            </div>


            <!-- Workspace cards -->

            <div
                class="cards"
            >


                <article
                    class="workspace-card
                           reveal
                           delay-1"
                >

                    <div
                        class="card-icon"
                    >
                        👤
                    </div>


                    <h2>
                        Profile
                    </h2>


                    <p>

                        Authenticated account.

                        <br>

                        ${escapeHtml(
                            user.email || ""
                        )}

                    </p>

                </article>


                <article
                    class="workspace-card
                           reveal
                           delay-2"
                >

                    <div
                        class="card-icon"
                    >
                        🏪
                    </div>


                    <h2>
                        Business
                    </h2>


                    <p>

                        Private business
                        workspace unlocked.

                    </p>

                </article>


                <article
                    class="workspace-card
                           reveal
                           delay-3"
                >

                    <div
                        class="card-icon"
                    >
                        ⚡
                    </div>


                    <h2>
                        API
                    </h2>


                    <p>

                        Connected and ready
                        for the next features.

                    </p>

                </article>


            </div>


        </section>

    `;


    document.querySelector(
        "#logout"
    ).onclick = () => {

        clearUser();


        window.dispatchEvent(
            new CustomEvent(
                "auth:logout"
            )
        );

    };

}


/* Prevent user data from becoming HTML */

function escapeHtml(
    value
) {

    return String(
        value
    ).replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]
    );

}
