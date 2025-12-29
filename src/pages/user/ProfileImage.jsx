import React, { useState } from "react";
import { useUploadProfileImage } from "../../hooks/profile/useProfileImage";

export default function ProfileImage({ src, className = "", size = 150 }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

    const uploadProfileImageMutation = useUploadProfileImage();
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Instant preview
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);

        // Upload to backend
        const formData = new FormData();
        formData.append("profile_image", file);

        uploadProfileImageMutation.mutate(formData, {
            onError: (err) => {
                console.error(err);
                alert("Failed to upload image");
            },
        });
    };

    return (
        <div className="position-relative d-inline-block">
            <img
                src={preview || (src?.startsWith("http") ? src : `http://127.0.0.1:8000${src}`) || "images/Avatar 1.png"}
                alt="Profile"
                className={`rounded-circle shadow ${className}`}
                style={{ width: size, height: size, objectFit: "cover" }}
            />

            {/* Pen icon */}
            <label
                htmlFor="profile-upload"
                className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2"
                style={{ cursor: "pointer" }}
            >
                <i className="ri-pencil-line"></i>
            </label>

            <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
}
