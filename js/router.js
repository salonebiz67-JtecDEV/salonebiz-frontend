// =====================================================
// 🇸🇱 SALONEBIZ ROUTER TEST
// =====================================================

import {
    renderHome
} from "./pages/home.js";


const pages = {

    home: renderHome

};


export async function navigate(page) {

    const render =
        pages[page];


    if (!render) {

        console.error(
            "Unknown page:",
            page
        );

        return;
    }


    const app =
        document.getElementById(
            "app"
        );


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
                    Home module loaded successfully.
                </p>

            </div>

        </div>
    `;

}
