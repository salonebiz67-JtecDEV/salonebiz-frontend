export async function renderInbox(app) {

    app.innerHTML = `

        <div class="page">

            <header class="app-header">

                <div class="header-inner">

                    <div class="brand">
                        💬 Inbox
                    </div>

                </div>

            </header>


            <main class="container">

                <h1 class="page-title">
                    Inbox
                </h1>

                <p class="page-subtitle">
                    Messages and activity will appear here.
                </p>


                <div class="business-card">

                    <div class="business-card-top">

                        <div class="business-card-avatar">
                            🔔
                        </div>

                        <div>

                            <strong>
                                Activity
                            </strong>

                            <p class="text-muted">
                                Your notifications will appear here.
                            </p>

                        </div>

                    </div>

                </div>


                <div class="business-card">

                    <div class="business-card-top">

                        <div class="business-card-avatar">
                            💬
                        </div>

                        <div>

                            <strong>
                                Messages
                            </strong>

                            <p class="text-muted">
                                Chat with customers and businesses.
                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    `;
}
