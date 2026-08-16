import {
    API
} from "./config.js";


async function request(
    url,
    options = {}
) {

    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () => controller.abort(),
            15000
        );


    try {

        const response =
            await fetch(
                url,
                {
                    ...options,

                    signal:
                        controller.signal,

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(options.headers || {})
                    }
                }
            );


        const text =
            await response.text();


        let data = {};


        try {

            data =
                text
                    ? JSON.parse(text)
                    : {};

        } catch {

            data = {
                message:
                    text ||
                    "Invalid server response"
            };

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                `Request failed (${response.status})`
            );

        }


        return data;

    } finally {

        clearTimeout(timeout);

    }
}


export const api = {

    health() {

        return request(
            API.health
        );

    },


    login(payload) {

        return request(
            API.login,
            {
                method: "POST",

                body:
                    JSON.stringify(
                        payload
                    )
            }
        );

    },


    register(payload) {

        return request(
            API.register,
            {
                method: "POST",

                body:
                    JSON.stringify(
                        payload
                    )
            }
        );

    }

};
