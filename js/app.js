// =====================================================
// 🇸🇱 SALONEBIZ MAIN APPLICATION
// =====================================================

import {
    initializeAuth
} from "./auth.js";


// =====================================================
// START APPLICATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log("🇸🇱 SaloneBiz starting...");

        const app =
            document.getElementById("app");

        if (!app) {
            console.error("❌ #app not found");
            return;
        }

        console.log("✅ Frontend loaded correctly");

        try {

            initializeAuth();

            console.log(
                "✅ Authentication module initialized"
            );

        } catch (error) {

            console.error(
                "❌ Application startup failed:",
                error
            );

            app.innerHTML = `
                <div style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:25px;
                    text-align:center;
                    color:white;
                    font-family:system-ui;
                ">

                    <div>

                        <div style="
                            font-size:55px;
                            margin-bottom:15px;
                        ">
                            ⚠️
                        </div>

                        <h2>
                            SaloneBiz could not start
                        </h2>

                        <p style="
                            color:#9299aa;
                            margin-top:10px;
                        ">
                            ${error?.message || "Unknown error"}
                        </p>

                    </div>

                </div>
            `;

        }

    }
);
