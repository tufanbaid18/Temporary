import { useState } from "react";
import { useCreatePost } from "../../hooks/posts/useCreatePost";
import "./NewPostPage.css"
import { Editor } from "@tinymce/tinymce-react";
import PostCard from "./PostCard";


export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const MAX_IMAGES = 5;
  const [showPreview, setShowPreview] = useState(false);



  const createPost = useCreatePost();

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);

    // allow only images
    const imageFiles = selected.filter(file =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== selected.length) {
      alert("Only image files are allowed. Videos are not supported.");
    }

    setFiles((prev) => {
      const combined = [...prev, ...imageFiles];

      if (combined.length > MAX_IMAGES) {
        alert(`You can upload maximum ${MAX_IMAGES} images.`);
        return combined.slice(0, MAX_IMAGES);
      }

      return combined;
    });
  };


  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!text && files.length === 0) return;

    createPost.mutate(
      { title, content: text, files },
      {
        onSuccess: () => {
          setText("");
          setFiles([]);
          setTitle("");
        },
      }
    );
  };

  const isImage = (file) => file.type.startsWith("image/");

  const user = JSON.parse(localStorage.getItem("user"));

  const previewPost = {
    id: "preview",
    title,
    content: text,
    created_at: new Date(),
    user,
    media: files.map((file) => ({
      file_url: URL.createObjectURL(file),
    })),
  };


  return (
    <div className="container py-4 new-post-page fade-in">

      {/* BACK BUTTON */}
      <button className="btn btn-outline-secondary mb-3" onClick={() => window.history.back()}>
        <i className="ri-arrow-left-line me-1"></i> Back
      </button>

      <h4 className="fw-bold mb-4">Create New Post</h4>

      <div className="card shadow-sm">
        <div className="card-body">

          {/* TITLE */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Post title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* TEXTAREA */}
          <Editor
            apiKey="gzbaq6k6otgk5w4c2vhnm06gksbkpyt5ahllriq2s49rj3ty"
            value={text}
            onEditorChange={(newValue) => {
              setText(newValue);
              console.log("Editor content:", newValue);
            }}
            init={{
              height: 300,
              menubar: false,
            }}
          />
          {/* <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Share something with your network..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          /> */}
          {/* FILE INPUT */}
          <div className="mb-3">
            <label className="btn btn-outline-primary px-4">
              Add Images / Files
              <input
                type="file"
                multiple
                accept="image/*"   // ⬅ blocks video selection at browser level
                className="d-none"
                onChange={handleFileSelect}
              />

            </label>
          </div>

          {/* PREVIEW */}
          {files.length > 0 && (
            <div className="file-preview-grid">
              {files.map((file, index) => (
                <div className="file-item shadow-sm" key={index}>
                  {isImage(file) ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="file-thumb"
                    />
                  ) : (
                    <div className="file-generic d-flex flex-column justify-content-center align-items-center">
                      <i className="ri-file-3-line fs-2 text-secondary"></i>
                      <span className="small text-muted">{file.name}</span>
                    </div>
                  )}
                  <button
                    className="btn-close remove-btn"
                    onClick={() => removeFile(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* POST BUTTON */}
          <div className="text-end mt-4">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setShowPreview(true)}
              disabled={!text && files.length === 0}
            >
              Preview
            </button>

            <button
              className="btn btn-primary px-4"
              disabled={createPost.isLoading || (!text && files.length === 0)}
              onClick={handleSubmit}
            >
              {createPost.isLoading ? "Posting..." : "Post"}
            </button>
          </div>

        </div>
      </div>
      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-modal">
            <button
              className="btn-close float-end"
              onClick={() => setShowPreview(false)}
            />
            <PostCard post={previewPost} isPreview />
          </div>
        </div>
      )}

    </div>
  );
}
