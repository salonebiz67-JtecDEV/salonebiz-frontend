// =====================================================
// 🇸🇱 SALONEBIZ CREATE POST
// JWT AUTHENTICATION + SUPABASE STORAGE
// =====================================================

import { createPost } from "../api.js";

const SUPABASE_URL =
    "https://gkvdqxpvjtunwbogizvl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2MKnxDXNcq1NGlZ2E-iMzg_Bk8u8ORc";

const STORAGE_BUCKET = "posts";
const TOKEN_KEY = "salonebiz_token";

function getSaloneBizToken() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) return token;

    try {
        const saved = localStorage.getItem("salonebiz_user");
        const user = saved ? JSON.parse(saved) : null;
        return user?.token || null;
    } catch {
        return null;
    }
}

function getSupabaseClient() {
    if (window.supabaseClient) return window.supabaseClient;

    if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {
        return window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
    }

    throw new Error(
        "Supabase client is not loaded. Check your Supabase script in index.html."
    );
}

export async function renderCreate(app) {
    if (!app) {
        console.error("❌ Create: #app not found.");
        return;
    }

    app.innerHTML = `
        <div class="page">
            <header class="app-header">
                <div class="header-inner">
                    <div class="brand">🇸🇱 Create Post</div>
                </div>
            </header>

            <main class="container">
                <h1 class="page-title">Share your business</h1>

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
                            <div style="font-size:40px">📸</div>
                            <p>Tap to choose an image</p>
                            <small>JPG, PNG or WEBP</small>
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
                        style="text-align:center;margin:12px 0;min-height:20px;"
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

    const input = document.getElementById("imageInput");
    const area = document.getElementById("uploadArea");
    const button = document.getElementById("publishButton");
    const status = document.getElementById("publishStatus");

    input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;

        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowed.includes(file.type)) {
            input.value = "";
            alert("Please choose a JPG, PNG or WEBP image.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            input.value = "";
            alert("Image is too large. Maximum size is 10 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = event => {
            area.innerHTML = `
                <img
                    src="${escapeHtml(event.target?.result || "")}"
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
    });

    button.addEventListener("click", async () => {
        const file = input.files?.[0];

        const business =
            document.getElementById("businessName")?.value.trim() || "";

        const location =
            document.getElementById("location")?.value.trim() || "";

        const description =
            document.getElementById("description")?.value.trim() || "";

        if (!file) {
            alert("Please select an image.");
            return;
        }

        if (!business) {
            alert("Enter your business name.");
            return;
        }

        if (!location) {
            alert("Enter your location.");
            return;
        }

        if (!description) {
            alert("Tell people something about your business.");
            return;
        }

        // IMPORTANT:
        // This is the SAME JWT used by api.js.
        // We do NOT call supabase.auth.getSession().
        const token = getSaloneBizToken();

        if (!token) {
            alert("You are not logged in. Please log in again.");
            return;
        }

        button.disabled = true;
        button.textContent = "Uploading image...";
        status.textContent = "Uploading your image...";

        try {
            console.log("🇸🇱 SaloneBiz JWT found.");

            const imageUrl = await uploadImage(file);

            const caption =
                `${business}\n\n${location}\n\n${description}`;

            button.textContent = "Publishing...";
            status.textContent = "Saving your post...";

            // createPost() automatically sends:
            // Authorization: Bearer <SaloneBiz JWT>
            const result = await createPost({
                caption,
                image_url: imageUrl
            });

            if (!result?.success) {
                throw new Error(
                    result?.message || "Unable to create post."
                );
            }

            status.textContent =
                "✅ Post published successfully!";

            button.textContent = "Published ✓";

            setTimeout(() => {
                window.location.hash = "#home";
            }, 700);

        } catch (error) {
            console.error("❌ Publish error:", error);

            status.textContent =
                `❌ ${error?.message || "Unable to publish post."}`;

            button.disabled = false;
            button.textContent = "Publish Post";
        }
    });
}

async function uploadImage(file) {
    const supabase = getSupabaseClient();

    const extension = getFileExtension(file);

    const uniqueName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const storagePath = `posts/${uniqueName}`;

    const { error } =
        await supabase
            .storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, file, {
                cacheControl: "3600",
                contentType: file.type,
                upsert: false
            });

    if (error) {
        console.error("❌ Storage upload error:", error);

        throw new Error(
            error.message || "Image upload failed."
        );
    }

    const { data } =
        supabase
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(storagePath);

    if (!data?.publicUrl) {
        throw new Error(
            "Image uploaded but public URL could not be created."
        );
    }

    return data.publicUrl;
}

function getFileExtension(file) {
    if (file.type === "image/jpeg") return "jpg";
    if (file.type === "image/png") return "png";
    if (file.type === "image/webp") return "webp";
    return "jpg";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
