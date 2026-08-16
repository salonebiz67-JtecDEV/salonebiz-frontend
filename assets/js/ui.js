let toastTimer = null;


export function showToast(
    message,
    type = "success"
) {

    const toast =
        document.querySelector(
            "#toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.className =
        `toast show ${type}`;


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3200
        );

}


export function setLoading(
    button,
    loading,
    label = "Please wait..."
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.dataset.original =
            button.textContent;


        button.disabled =
            true;


        button.textContent =
            label;

    } else {

        button.disabled =
            false;


        button.textContent =
            button.dataset.original ||
            "Continue";

    }

}
