const STORAGE_KEY = "salonebiz_user";

let currentUser = null;

export function loadUser() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            currentUser = null;
            return null;
        }

        currentUser = JSON.parse(saved);

        return currentUser;

    } catch {

        localStorage.removeItem(STORAGE_KEY);

        currentUser = null;

        return null;
    }
}


export function setUser(user) {

    currentUser = user;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
    );
}


export function getUser() {

    return currentUser;
}


export function clearUser() {

    currentUser = null;

    localStorage.removeItem(
        STORAGE_KEY
    );
}


export function isLoggedIn() {

    return !!currentUser;
}
