const STORAGE_KEY = "salonebiz_user";

let currentUser = null;


// =====================================================
// LOAD USER
// =====================================================

export function loadUser() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

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

            localStorage.removeItem(
                STORAGE_KEY
            );

            currentUser = null;

            return null;
        }


        currentUser = user;

        return currentUser;

    } catch (error) {

        console.error(
            "Failed to load SaloneBiz user:",
            error
        );

        localStorage.removeItem(
            STORAGE_KEY
        );

        currentUser = null;

        return null;
    }
}


// =====================================================
// SET USER
// =====================================================

export function setUser(user) {

    if (!user) {

        clearUser();

        return null;
    }


    currentUser = user;


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
    );


    return currentUser;
}


// =====================================================
// GET USER
// =====================================================

export function getUser() {

    return currentUser;
}


// =====================================================
// CLEAR USER / LOGOUT
// =====================================================

export function clearUser() {

    currentUser = null;

    localStorage.removeItem(
        STORAGE_KEY
    );
}


// =====================================================
// LOGIN STATUS
// =====================================================

export function isLoggedIn() {

    return !!currentUser;
}


// =====================================================
// UPDATE USER
// =====================================================

export function updateUser(
    updates = {}
) {

    if (!currentUser) {
        return null;
    }


    currentUser = {
        ...currentUser,
        ...updates
    };


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(currentUser)
    );


    return currentUser;
}


// =====================================================
// USER ID
// =====================================================

export function getUserId() {

    return currentUser?.id || null;
}


// =====================================================
// USER TOKEN
// =====================================================

export function getToken() {

    return currentUser?.token || null;
}


// =====================================================
// REFRESH STATE
// =====================================================

export function refreshState() {

    return loadUser();
}
