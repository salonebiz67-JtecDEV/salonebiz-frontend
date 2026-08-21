// =====================================================
// 🇸🇱 SALONEBIZ CREATE POST
// Fixed: NO window.supabase / createClient dependency
// =====================================================

import { createPost, API_BASE } from "../api.js";

const SESSION_KEY = "salonebiz_user";
const TOKEN_KEY = "salonebiz_token";

export async function renderCreate(app) {
    if (!app) {
        throw new Error("Create: app element not found.");
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
                    <label class="upload-area" for="imageInput" id="uploadArea">
                        <div>
                            <div style="font-size:40px">📸</div>
                            <p>Tap to choose an image</p>
                            <small>JPG, PNG or WEBP</small>
                        </div>
                    </label>

                    <input id="imageInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden>

                    <input class="form-input"
                        id="businessName"
                        type="text"
                        maxlength="150"
                        placeholder="Business name">

                    <input class="form-input"
                        id="location"
                        type="text"
                        maxlength="200"
                        placeholder="Location">

                    <textarea class="form-input"
                        id="description"
                        rows="4"
                        maxlength="2000"
                        placeholder="Tell people about your business..."></textarea>

                    <p id="publishStatus"
                        style="text-align:center;margin:12px 0;min-height:20px;"></p>

                    <button class="primary-button"
                        id="publishButton"
                        type="button">
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

    input?.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;

        const allowed = ["image/jpeg", "image/png", "image/webp"];

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
                    style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;"
                >
            `;
        };

        reader.readAsDataURL(file);
    });

    button?.addEventListener("click", async () => {
        const file = input?.files?.[0];
        const business = document.getElementById("businessName")?.value.trim() || "";
        const location = document.getElementById("location")?.value.trim() || "";
        const description = document.getElementById("description")?.value.trim() || "";

        if (!file) return alert("Please select an image.");
        if (!business) return alert("Enter your business name.");
        if (!location) return alert("Enter your location.");
        if (!description) return alert("Tell people something about your business.");

        const token = getToken();

        if (!token) {
            alert("You are not logged in. Please log in again.");
            return;
        }

        button.disabled = true;
        status.textContent = "Uploading your image...";
        button.textContent = "Uploading...";

        try {
            const formData = new FormData();
            formData.append("image", file);

            const upload = await fetch(`${API_BASE}/api/uploads/image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const uploadText = await upload.text();
            let uploadResult = {};

            try {
                uploadResult = uploadText ? JSON.parse(uploadText) : {};
            } catch {
                uploadResult = {
                    success: false,
                    message: uploadText || "Invalid upload response."
                };
            }

            if (!upload.ok || !uploadResult.success) {
                throw new Error(
                    uploadResult.message ||
                    `Image upload failed (${upload.status}).`
                );
            }

            if (!uploadResult.image_url) {
                throw new Error("Upload succeeded but no image URL was returned.");
            }

            status.textContent = "Saving your post...";
            button.textContent = "Publishing...";

            const caption =
                `${business}\n\n${location}\n\n${description}`;

            const result = await createPost({
                caption,
                image_url: uploadResult.image_url
            });

            if (!result?.success) {
                throw new Error(
                    result?.message || "Unable to create post."
                );
            }

            status.textContent = "✅ Post published successfully!";
            button.textContent = "Published ✓";

            setTimeout(() => {
                window.location.hash = "#home";
                window.location.reload();
            }, 700);

        } catch (error) {
            console.error("❌ Publish error:", error);

            status.textContent = "";
            button.disabled = false;
            button.textContent = "Publish Post";

            alert(error?.message || "Unable to publish post.");
        }
    });
}

function getToken() {
    const direct = localStorage.getItem(TOKEN_KEY);

    if (direct) return direct;

    try {
        const saved = localStorage.getItem(SESSION_KEY);
        if (!saved) return null;

        return JSON.parse(saved)?.token || null;
    } catch {
        return null;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
