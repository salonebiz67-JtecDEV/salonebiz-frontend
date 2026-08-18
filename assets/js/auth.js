const USER_KEY = "salonebiz_user";


// =====================================================
// GET USER
// =====================================================

export function getUser() {

    try {

        const saved =
            localStorage.getItem(USER_KEY);

        if (!saved) {
            return null;
        }

        const user =
            JSON.parse(saved);

        if (
            !user ||
            typeof user !== "object"
        ) {
            return null;
        }

        return user;

    } catch (error) {

        console.error(
            "Unable to read user session:",
            error
        );

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

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );

    return user;
}


// =====================================================
// CLEAR USER
// =====================================================

export function clearUser() {

    localStorage.removeItem(
        USER_KEY
    );

    return true;
}


// =====================================================
// LOGIN STATUS
// =====================================================

export function isLoggedIn() {

    const user =
        getUser();

    return Boolean(
        user &&
        user.id
    );
}


// =====================================================
// GET TOKEN
// =====================================================

export function getToken() {

    const user =
        getUser();

    return user?.token || null;
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

    const updatedUser = {
        ...user,
        ...updates
    };

    setUser(
        updatedUser
    );

    return updatedUser;
}


// =====================================================
// LOGOUT
// =====================================================

export function logout() {

    clearUser();

    window.dispatchEvent(
        new CustomEvent(
            "auth:logout"
        )
    );
}
