// =====================================================
// 🇸🇱 SALONEBIZ CREATE POST
// FIXED SUPABASE AUTHENTICATED IMAGE UPLOAD
// =====================================================

import {
    createPost
} from "../api.js";


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://gkvdqxpvjtunwbogizvl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2MKnxDXNcq1NGlZ2E-iMzg_Bk8u8ORc";

const STORAGE_BUCKET =
    "posts";


// =====================================================
// SUPABASE CLIENT
// =====================================================

const supabase =
    window.supabaseClient ||
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// =====================================================
// RENDER CREATE PAGE
// =====================================================

export async function renderCreate(app) {

    app.innerHTML = `

        <div class="page">

            <header class="app-header">

                <div class="header-inner">

                    <div class="brand">
                        🇸🇱 Create Post
                    </div>

                </div>

            </header>

            <main class="container">

                <h1 class="page-title">
                    Share your business
                </h1>

                <p class="page-subtitle">
                    Upload a photo and tell people about your business.
                </p>

                <section class="create-box">

                    <label
                        class="upload-area"
                        for="imageInput"
                        id="uploadArea"
                    >

                        <div id="uploadText">

                            <div style="font-size:40px">
                                📸
                            </div>

                            <p>
                                Tap to choose an image
                            </p>

                            <small>
                                JPG, PNG or WEBP
                            </small>

                        </div>

                    </label>

                    <input
                        id="imageInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                    >

                    <input
                        class="form-input"
                        id="businessName"
                        type="text"
                        maxlength="150"
                        placeholder="Business name"
                    >

                    <input
                        class="form-input"
                        id="location"
                        type="text"
                        maxlength="200"
                        placeholder="Location"
                    >

                    <textarea
                        class="form-input"
                        id="description"
                        rows="4"
                        maxlength="2000"
                        placeholder="Tell people about your business..."
                    ></textarea>

                    <p
                        id="publishStatus"
                        style="
                            text-align:center;
                            margin:12px 0;
                            min-height:20px;
                        "
                    ></p>

                    <button
                        class="primary-button"
                        id="publishButton"
                        type="button"
                    >
                        Publish Post
                    </button>

                </section>

            </main>

        </div>
    `;


    const input =
        document.getElementById("imageInput");

    const area =
        document.getElementById("uploadArea");

    const button =
        document.getElementById("publishButton");

    const status =
        document.getElementById("publishStatus");


    // =================================================
    // IMAGE PREVIEW
    // =================================================

    input.addEventListener(
        "change",
        () => {

            const file =
                input.files?.[0];

            if (!file) {
                return;
            }

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                input.value = "";

                alert(
                    "Please choose a JPG, PNG or WEBP image."
                );

                return;
            }

            const maxSize =
                10 * 1024 * 1024;

            if (
                file.size > maxSize
            ) {

                input.value = "";

                alert(
                    "Image is too large. Maximum size is 10 MB."
                );

                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                event => {

                    area.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Selected image"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                border-radius:inherit;
                                display:block;
                            "
                        >

                    `;
                };

            reader.readAsDataURL(file);

        }
    );


    // =================================================
    // PUBLISH
    // =================================================

    button.addEventListener(
        "click",
        async () => {

            const file =
                input.files?.[0];

            const business =
                document
                    .getElementById("businessName")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();

            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            if (!file) {

                alert(
                    "Please select an image."
                );

                return;
            }


            if (!business) {

                alert(
                    "Enter your business name."
                );

                return;
            }


            if (!location) {

                alert(
                    "Enter your location."
                );

                return;
            }


            if (!description) {

                alert(
                    "Tell people something about your business."
                );

                return;
            }


            button.disabled = true;

            button.textContent =
                "Checking account...";

            status.textContent =
                "Checking your SaloneBiz account...";


            try {

                // =========================================
                // CHECK AUTH SESSION
                // =========================================

                const {
                    data: sessionData,
                    error: sessionError
                } =
                    await supabase.auth.getSession();


                if (sessionError) {

                    throw sessionError;

                }


                const session =
                    sessionData?.session;


                if (!session?.access_token) {

                    throw new Error(
                        "You are not logged in. Please log in again."
                    );

                }


                console.log(
                    "✅ Authenticated user:",
                    session.user.id
                );


                // =========================================
                // UPLOAD IMAGE
                // =========================================

                button.textContent =
                    "Uploading image...";

                status.textContent =
                    "Uploading your image...";


                const imageUrl =
                    await uploadImage(
                        file
                    );


                // =========================================
                // CREATE CAPTION
                // =========================================

                const caption =
                    `${business}\n\n${location}\n\n${description}`;


                // =========================================
                // CREATE POST
                // =========================================

                button.textContent =
                    "Publishing...";

                status.textContent =
                    "Saving your post...";


                const result =
                    await createPost({

                        caption,

                        image_url:
                            imageUrl

                    });


                if (
                    !result ||
                    !result.success
                ) {

                    throw new Error(
                        result?.message ||
                        "Unable to create post."
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                status.textContent =
                    "✅ Post published successfully!";

                button.textContent =
                    "Published ✓";


                setTimeout(
                    () => {

                        window.location.hash =
                            "#home";

                        window.location.reload();

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "❌ Publish error:",
                    error
                );


                status.textContent =
                    "";


                button.disabled =
                    false;

                button.textContent =
                    "Publish Post";


                alert(
                    error?.message ||
                    "Unable to publish post."
                );

            }

        }
    );

}


// =====================================================
// UPLOAD IMAGE
// =====================================================

async function uploadImage(file) {

    if (!file) {

        throw new Error(
            "No image selected."
        );

    }


    // =============================================
    // CURRENT AUTH SESSION
    // =============================================

    const {
        data,
        error: sessionError
    } =
        await supabase.auth.getSession();


    if (sessionError) {

        throw sessionError;

    }


    const session =
        data?.session;


    if (!session?.access_token) {

        throw new Error(
            "Your login session has expired. Please log in again."
        );

    }


    // =============================================
    // FILE NAME
    // =============================================

    const extension =
        getFileExtension(file);


    const uniqueName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;


    const storagePath =
        `posts/${uniqueName}`;


    // =============================================
    // UPLOAD THROUGH SUPABASE SDK
    // =============================================

    const {
        error
    } =
        await supabase
            .storage
            .from(STORAGE_BUCKET)
            .upload(
                storagePath,
                file,
                {
                    cacheControl: "3600",
                    contentType: file.type,
                    upsert: false
                }
            );


    if (error) {

        console.error(
            "❌ Storage upload error:",
            error
        );

        throw new Error(
            error.message ||
            "Image upload failed."
        );

    }


    // =============================================
    // PUBLIC URL
    // =============================================

    const {
        data: publicData
    } =
        supabase
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(
                storagePath
            );


    if (
        !publicData?.publicUrl
    ) {

        throw new Error(
            "Image uploaded but public URL could not be created."
        );

    }


    return publicData.publicUrl;

}


// =====================================================
// FILE EXTENSION
// =====================================================

function getFileExtension(file) {

    if (
        file.type ===
        "image/jpeg"
    ) {
        return "jpg";
    }

    if (
        file.type ===
        "image/png"
    ) {
        return "png";
    }

    if (
        file.type ===
        "image/webp"
    ) {
        return "webp";
    }

    return "jpg";

}
