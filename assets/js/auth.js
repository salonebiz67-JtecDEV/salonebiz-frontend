const USER_KEY =
    "salonebiz_user";


export function getUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                USER_KEY
            )
        );

    } catch {

        return null;

    }

}


export function setUser(user) {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );

}


export function clearUser() {

    localStorage.removeItem(
        USER_KEY
    );

}


export function isLoggedIn() {

    return Boolean(
        getUser()
    );

}
