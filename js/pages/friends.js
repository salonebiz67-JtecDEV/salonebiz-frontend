export async function renderFriends(app) {

    app.innerHTML = `

        <div class="page">

            <header class="app-header">

                <div class="header-inner">

                    <div class="brand">
                        👥 Friends
                    </div>

                </div>

            </header>


            <main class="container">

                <h1 class="page-title">
                    Discover
                </h1>

                <p class="page-subtitle">
                    Find businesses and people to follow.
                </p>


                <div class="business-card">

                    <div class="business-card-top">

                        <div class="business-card-avatar">
                            👕
                        </div>

                        <div>

                            <strong>
                                Salone Fashion
                            </strong>

                            <p class="text-muted">
                                Fashion • Freetown
                            </p>

                        </div>

                        <button class="follow-button">
                            Follow
                        </button>

                    </div>

                </div>


                <div class="business-card">

                    <div class="business-card-top">

                        <div class="business-card-avatar">
                            🍔
                        </div>

                        <div>

                            <strong>
                                Salone Eats
                            </strong>

                            <p class="text-muted">
                                Restaurant • Freetown
                            </p>

                        </div>

                        <button class="follow-button">
                            Follow
                        </button>

                    </div>

                </div>


                <div class="business-card">

                    <div class="business-card-top">

                        <div class="business-card-avatar">
                            💈
                        </div>

                        <div>

                            <strong>
                                Fresh Cut Salone
                            </strong>

                            <p class="text-muted">
                                Barber • Lumley
                            </p>

                        </div>

                        <button class="follow-button">
                            Follow
                        </button>

                    </div>

                </div>

            </main>

        </div>
    `;
}
