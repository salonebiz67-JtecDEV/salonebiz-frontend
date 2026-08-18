document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("app");

    if (!app) {
        document.body.innerHTML = "<h1>#app not found</h1>";
        return;
    }

    app.innerHTML = `
        <div style="
            min-height:100vh;
            background:#050816;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            padding:30px;
            font-family:Arial,sans-serif;
        ">

            <div>

                <div style="
                    font-size:60px;
                    margin-bottom:20px;
                ">
                    🇸🇱
                </div>

                <h1>
                    SaloneBiz
                </h1>

                <p style="
                    opacity:.7;
                    margin-bottom:25px;
                ">
                    Frontend is loading correctly.
                </p>

                <button
                    onclick="location.reload()"
                    style="
                        border:0;
                        padding:14px 25px;
                        border-radius:14px;
                        background:#fff;
                        color:#000;
                        font-weight:bold;
                    "
                >
                    Reload
                </button>

            </div>

        </div>
    `;

    console.log("🇸🇱 SaloneBiz basic loader works.");

});
