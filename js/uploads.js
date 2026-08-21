// =====================================================
// 🇸🇱 SALONEBIZ IMAGE UPLOAD ROUTE
// src/routes/uploads.js
// =====================================================

const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET =
    process.env.SUPABASE_STORAGE_BUCKET || "posts";

router.post(
    "/image",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No image was uploaded."
                });
            }

            if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
                return res.status(500).json({
                    success: false,
                    message: "Supabase storage is not configured on the backend."
                });
            }

            const allowed = {
                "image/jpeg": "jpg",
                "image/png": "png",
                "image/webp": "webp"
            };

            const extension = allowed[req.file.mimetype];

            if (!extension) {
                return res.status(400).json({
                    success: false,
                    message: "Only JPG, PNG and WEBP images are allowed."
                });
            }

            const userId = req.user.id;
            const filename =
                `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

            const uploadUrl =
                `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filename}`;

            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    apikey: SUPABASE_SERVICE_ROLE_KEY,
                    "Content-Type": req.file.mimetype,
                    "x-upsert": "false"
                },
                body: req.file.buffer
            });

            const text = await response.text();

            if (!response.ok) {
                console.error("❌ Supabase storage error:", text);

                return res.status(502).json({
                    success: false,
                    message: "Supabase image upload failed."
                });
            }

            const imageUrl =
                `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;

            return res.status(201).json({
                success: true,
                image_url: imageUrl
            });

        } catch (error) {
            console.error("❌ Image upload error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to upload image."
            });
        }
    }
);

module.exports = router;
