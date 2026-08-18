// =====================================================
// 🇸🇱 SALONEBIZ GLOBAL STATE
// =====================================================

const STORAGE_KEY =
    "salonebiz_user";

const TOKEN_KEY =
    "salonebiz_token";


let currentUser = null;


// =====================================================
// LOAD USER
// =====================================================

export function loadUser() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            currentUser = null;

            return null;

        }


        const user =
            JSON.parse(saved);


        if (
            !user ||
            typeof user !== "object"
        ) {

            clearUser();

            return null;

        }


        /*
         * Keep the JWT synchronized.
         *
         * New system:
         * salonebiz_token
         *
         * Older system:
         * user.token
         */

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );


        if (
            token &&
            !user.token
        ) {

            user.token =
                token;

        }


        if (
            user.token &&
            !token
        ) {

            localStorage.setItem(
                TOKEN_KEY,
                user.token
            );

        }


        currentUser =
            user;


        return currentUser;

    } catch (error) {

        console.error(
            "❌ Failed to load SaloneBiz user:",
            error
        );


        clearUser();


        return null;

    }

}


// =====================================================
// SET USER
// =====================================================

export function setUser(
    user
) {

    if (
        !user ||
        typeof user !== "object"
    ) {

        clearUser();

        return null;

    }


    currentUser =
        {
            ...user
        };


    /*
     * Save JWT separately when available.
     */

    if (
        currentUser.token
    ) {

        localStorage.setItem(
            TOKEN_KEY,
            currentUser.token
        );

    }


    /*
     * Store user session.
     */

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            currentUser
        )
    );


    return currentUser;

}


// =====================================================
// GET USER
// =====================================================

export function getUser() {

    /*
     * If state has not been initialized yet,
     * try loading it from localStorage.
     */

    if (!currentUser) {

        loadUser();

    }


    return currentUser;

}


// =====================================================
// CLEAR USER / LOGOUT
// =====================================================

export function clearUser() {

    currentUser =
        null;


    localStorage.removeItem(
        STORAGE_KEY
    );


    localStorage.removeItem(
        TOKEN_KEY
    );

}


// =====================================================
// LOGIN STATUS
// =====================================================

export function isLoggedIn() {

    const user =
        getUser();


    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    return Boolean(
        user &&
        token
    );

}


// =====================================================
// UPDATE USER
// =====================================================

export function updateUser(
    updates = {}
) {

    const user =
        getUser();


    if (!user) {

        return null;

    }


    currentUser = {
        ...user,
        ...updates
    };


    /*
     * Keep token synchronized.
     */

    if (
        currentUser.token
    ) {

        localStorage.setItem(
            TOKEN_KEY,
            currentUser.token
        );

    }


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            currentUser
        )
    );


    return currentUser;

}


// =====================================================
// USER ID
// =====================================================

export function getUserId() {

    const user =
        getUser();


    return user?.id || null;

}


// =====================================================
// USER TOKEN
// =====================================================

export function getToken() {

    const directToken =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (directToken) {

        return directToken;

    }


    const user =
        getUser();


    return user?.token || null;

}


// =====================================================
// REFRESH STATE
// =====================================================

export function refreshState() {

    return loadUser();

}
