window.SaloneBizPages =
    window.SaloneBizPages || {};

window.SaloneBizPages.settings = {

    render() {

        return `

            <section class="page">

                <span class="eyebrow">
                    ACCOUNT
                </span>

                <h1>Settings</h1>


                <div class="settings-list">

                    <button>
                        👤
                        <span>
                            <strong>
                                Edit profile
                            </strong>
                            <small>
                                Name, picture and bio
                            </small>
                        </span>
                        →
                    </button>


                    <button>
                        🔒
                        <span>
                            <strong>
                                Privacy
                            </strong>
                            <small>
                                Control your account privacy
                            </small>
                        </span>
                        →
                    </button>


                    <button>
                        🔔
                        <span>
                            <strong>
                                Notifications
                            </strong>
                            <small>
                                Likes, follows and messages
                            </small>
                        </span>
                        →
                    </button>


                    <button>
                        🌙
                        <span>
                            <strong>
                                Appearance
                            </strong>
                            <small>
                                Theme and display
                            </small>
                        </span>
                        →
                    </button>


                    <button>
                        🔐
                        <span>
                            <strong>
                                Security
                            </strong>
                            <small>
                                Password and sessions
                            </small>
                        </span>
                        →
                    </button>


                    <button
                        id="settingsLogout"
                        class="danger-button"
                    >
                        🚪
                        <span>
                            <strong>
                                Log out
                            </strong>
                            <small>
                                Sign out of this device
                            </small>
                        </span>
                    </button>

                </div>

            </section>

        `;
    },

    init() {

        document
            .getElementById("settingsLogout")
            .addEventListener(
                "click",
                () => {
                    window.SaloneBizAuth.logout();
                }
            );

    }
};
