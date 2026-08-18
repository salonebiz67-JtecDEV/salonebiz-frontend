import { checkAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

    const app =
        document.getElementById("app");

    app.innerHTML = `
        <div style="
            min-height:100vh;
            background:#050816;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            font-family:Arial,sans-serif;
        ">

            <div>

                <div style="font-size:60px;">
                    🇸🇱
                </div>

                <h1>
                    SaloneBiz
                </h1>

                <p id="status">
                    Testing API module...
                </p>

            </div>

        </div>
    `;

    const status =
        document.getElementById("status");

    try {

        const result =
            await checkAPI();

        console.log(
            "API RESULT:",
            result
        );

        status.textContent =
            "✅ API module loaded successfully";

    } catch (error) {

        console.error(
            "API TEST ERROR:",
            error
        );

        status.textContent =
            "❌ API module failed: " +
            error.message;

    }

});
