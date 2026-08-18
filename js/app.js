import { navigate } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {

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

                <p>
                    Router module loaded successfully.
                </p>

            </div>

        </div>
    `;

    console.log(
        "Router:",
        navigate
    );

});
