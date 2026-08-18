// =====================================================
// 🇸🇱 SALONEBIZ CREATE POST
// =====================================================

import {
    createPost
} from "../api.js";


// =====================================================
// SUPABASE STORAGE
// =====================================================

const SUPABASE_URL =
    "https://gkvdqxpvjtunwbogizvl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2MKnxDXNcq1NGlZ2E-iMzg_Bk8u8ORc";

const STORAGE_BUCKET =
    "posts";


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

                    <!-- IMAGE UPLOAD -->

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


                    <!-- BUSINESS NAME -->

                    <input
                        class="form-input"
                        id="businessName"
                        type="text"
                        maxlength="150"
                        placeholder="Business name"
                    >


                    <!-- LOCATION -->

                    <input
                        class="form-input"
                        id="location"
                        type="text"
                        maxlength="200"
                        placeholder="Location"
                    >


                    <!-- DESCRIPTION -->

                    <textarea
                        class="form-input"
                        id="description"
                        rows="4"
                        maxlength="2000"
                        placeholder="Tell people about your business..."
                    ></textarea>


                    <!-- STATUS -->

                    <p
                        id="publishStatus"
                        style="
                            text-align:center;
                            margin:12px 0;
                            min-height:20px;
                        "
                    ></p>


                    <!-- PUBLISH -->

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
        document.getElementById(
            "imageInput"
        );


    const area =
        document.getElementById(
            "uploadArea"
        );


    const button =
        document.getElementById(
            "publishButton"
        );


    const status =
        document.getElementById(
            "publishStatus"
        );


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


            // Check file type

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


            // 10 MB limit

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
    // PUBLISH POST
    // =================================================

    button.addEventListener(
        "click",
        async () => {

            const file =
                input.files?.[0];


            const business =
                document
                    .getElementById(
                        "businessName"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "description"
                    )
                    .value
                    .trim();


            const location =
                document
                    .getElementById(
                        "location"
                    )
                    .value
                    .trim();


            // =============================================
            // VALIDATION
            // =============================================

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

                document
                    .getElementById(
                        "businessName"
                    )
                    .focus();

                return;
            }


            if (!location) {

                alert(
                    "Enter your location."
                );

                document
                    .getElementById(
                        "location"
                    )
                    .focus();

                return;
            }


            if (!description) {

                alert(
                    "Tell people something about your business."
                );

                document
                    .getElementById(
                        "description"
                    )
                    .focus();

                return;
            }


            // =============================================
            // DISABLE BUTTON
            // =============================================

            button.disabled = true;

            button.textContent =
                "Uploading image...";


            status.textContent =
                "Uploading your image...";


            try {

                // =========================================
                // UPLOAD IMAGE
                // =========================================

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
                // SEND POST TO BACKEND
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


                // =========================================
                // VERIFY BACKEND RESPONSE
                // =========================================

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


                // =========================================
                // GO HOME
                // =========================================

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
                    "❌ Publish post error:",
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
// UPLOAD IMAGE TO SUPABASE STORAGE
// =====================================================

async function uploadImage(file) {

    if (!file) {

        throw new Error(
            "No image selected."
        );

    }


    // =============================================
    // CREATE UNIQUE FILE NAME
    // =============================================

    const extension =
        getFileExtension(
            file
        );


    const uniqueName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;


    const storagePath =
        `posts/${uniqueName}`;


    // =============================================
    // UPLOAD
    // =============================================

    const uploadUrl =
        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${storagePath}`;


    const response =
        await fetch(
            uploadUrl,
            {
                method: "POST",

                headers: {

                    "Authorization":
                        `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

                    "apikey":
                        SUPABASE_PUBLISHABLE_KEY,

                    "Content-Type":
                        file.type,

                    "x-upsert":
                        "false"

                },

                body:
                    file
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

        data = {};

    }


    if (!response.ok) {

        console.error(
            "❌ Supabase Storage error:",
            data
        );


        throw new Error(
            data?.message ||
            data?.error ||
            "Image upload failed."
        );

    }


    // =============================================
    // PUBLIC IMAGE URL
    // =============================================

    return (
        `${SUPABASE_URL}/storage/v1/object/public/` +
        `${STORAGE_BUCKET}/${storagePath}`
    );

}


// =====================================================
// FILE EXTENSION
// =====================================================

function getFileExtension(file) {

    const type =
        file.type;


    if (
        type ===
        "image/jpeg"
    ) {
        return "jpg";
    }


    if (
        type ===
        "image/png"
    ) {
        return "png";
    }


    if (
        type ===
        "image/webp"
    ) {
        return "webp";
    }


    return "jpg";

}
