import DOMPurify from "dompurify";

export default function PostCard({ post, isPreview = false }) {
  return (
    <div className={`post-card shadow-sm p-3 mb-4 ${isPreview ? "preview" : ""}`}>

      {/* USER HEADER */}
      <div className="d-flex align-items-center mb-2">
        <img
          src={post.user.profile_image}
          className="post-avatar me-3"
          alt=""
        />
        <div>
          <div className="fw-semibold">
            {post.user.first_name} {post.user.last_name}
          </div>
          <div className="text-muted small">
            {isPreview ? "Preview" : new Date(post.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* TITLE */}
      {post.title && <h6 className="fw-bold mb-2">{post.title}</h6>}

      {/* CONTENT */}
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.content),
        }}
      />

      {/* MEDIA */}
      {post.media?.length > 0 && (
        <div className="post-media-grid mb-3">
          {post.media.map((m, i) => (
            <img
              key={i}
              src={m.file_url}
              className="post-media-img"
              alt=""
            />
          ))}
        </div>
      )}
    </div>
  );
}
