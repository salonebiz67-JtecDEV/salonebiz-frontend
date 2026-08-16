import {
    isLoggedIn
} from "./auth.js";


import {
    renderAuth
} from "./auth-page.js";


import {
    renderWorkspace
} from "./workspace.js";


const app =
    document.querySelector(
        "#app"
    );


const loader =
    document.querySelector(
        "#app-loader"
    );


function renderApp() {

    if (
        isLoggedIn()
    ) {

        renderWorkspace(
            app
        );

    } else {

        renderAuth(
            app
        );

    }

}


/* Login succeeded */

window.addEventListener(
    "auth:success",
    () => {

        renderApp();

    }
);


/* Logout */

window.addEventListener(
    "auth:logout",
    () => {

        renderApp();

    }
);


/* Initial render */

renderApp();


/* Hide loader */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                loader.classList.add(
                    "hidden"
                );

            },
            450
        );

    }
);
