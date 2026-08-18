import {
    initializeAuth
} from "./auth.js";

import {
    loadUser
} from "./state.js";


document.addEventListener(
    "DOMContentLoaded",
    () => {

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
                        Testing authentication module...
                    </p>

                </div>

            </div>
        `;


        const status =
            document.getElementById(
                "status"
            );


        try {

            const user =
                loadUser();


            console.log(
                "Loaded user:",
                user
            );


            status.textContent =
                "✅ Auth modules loaded successfully";


        } catch (error) {

            console.error(
                "❌ Auth module error:",
                error
            );


            status.textContent =
                "❌ Auth error: " +
                error.message;

        }

    }
);
