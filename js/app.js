import {
    initializeAuth
} from "./auth.js";

import {
    checkAPI
} from "./api.js";


async function startApp() {

    console.log(
        "🇸🇱 SaloneBiz starting..."
    );


    const health =
        await checkAPI();


    if (health.success) {

        console.log(
            "🟢 API online"
        );

    } else {

        console.warn(
            "🔴 API offline"
        );

    }


    initializeAuth();

}


startApp();
