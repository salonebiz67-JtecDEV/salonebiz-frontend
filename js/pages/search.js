window.SaloneBizPages =
    window.SaloneBizPages || {};

window.SaloneBizPages.search = {

    render() {

        return `

            <section class="page">

                <span class="eyebrow">
                    DISCOVER
                </span>

                <h1>Search</h1>

                <div class="search-box">

                    <span>🔍</span>

                    <input
                        id="searchInput"
                        type="search"
                        placeholder="Businesses, people, products..."
                    >

                </div>


                <div
                    id="searchResults"
                    class="empty-state small"
                >

                    <div>
                        🔎
                    </div>

                    <p>
                        Start searching SaloneBiz.
                    </p>

                </div>

            </section>

        `;
    },

    init() {

        const input =
            document.getElementById("searchInput");

        input.focus();

        input.addEventListener(
            "input",
            () => {

                const value =
                    input.value.trim();

                if (!value) {

                    document.getElementById(
                        "searchResults"
                    ).innerHTML = `
                        <div>🔎</div>
                        <p>
                            Start searching SaloneBiz.
                        </p>
                    `;

                    return;
                }

                document.getElementById(
                    "searchResults"
                ).innerHTML = `
                    <div>🔍</div>
                    <p>
                        Search API will be connected next.
                    </p>
                `;

            }
        );

    }
};
