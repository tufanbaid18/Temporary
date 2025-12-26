import { useState } from "react";
import { useParams } from "react-router";
import { usePost } from "../../hooks/posts/usePost";
import { useLikePost } from "../../hooks/posts/useLikePost";
import { useBookmarkPost } from "../../hooks/posts/useBookmarkPost";
import { useCommentPost } from "../../hooks/posts/useCommentPost";
import { useSharePost } from "../../hooks/posts/useSharePost";
import SharePostModal from "./SharePostModal";
import DOMPurify from "dompurify";


import "./PostDetail.css";




export default function PostDetail() {
  const { id } = useParams(); // get post id from URL

  const { data: post, isLoading, isError } = usePost(id);
  const [preview, setPreview] = useState(null);
  const sharePost = useSharePost();
  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const commentPost = useCommentPost();

  const [commentText, setCommentText] = useState("");

  const [showShare, setShowShare] = useState(false);

  const handleLike = () => {
    likePost.mutate(post.id);
  };

  const handleBookmark = () => {
    bookmarkPost.mutate(post.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    commentPost.mutate({ postId: post.id, c_content: commentText });
    setCommentText("");
  };

  const handleShare = (receiverId) => {
    sharePost.mutate({
      postId: post.id,
      receiver: receiverId,
    });
  };

  if (isLoading) return <div className="text-center py-5">Loading post...</div>;
  if (isError || !post) return <div className="text-danger text-center py-5">Failed to load post</div>;


  return (
    <div className="postdetail-page container-fluid">
      <div className="row">

        {/* MAIN CONTENT */}
        <div className="col-lg-8 p-4">

          {/* BACK BUTTON */}
          <button className="btn btn-outline-secondary mb-3" onClick={() => window.history.back()}>
            <i className="ri-arrow-left-line me-1"></i> Back
          </button>

          {/* AUTHOR */}
          <div className="d-flex align-items-center mb-3">
            <img
              src={post.user?.profile_image || "/avatar.png"}
              className="pd-avatar me-3"
              alt=""
            />

            <div>
              <div className="fw-semibold">{post.user.first_name} {post.user.last_name}</div>
              <div className="text-muted small">{new Date(post.created_at).toLocaleString()}</div>
            </div>
          </div>

          {/* TITLE */}
          {post.title && <h3 className="fw-bold mb-1">{post.title}</h3>}

          {/* TEXT */}
          <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />

          {/* MEDIA */}
          {/* MEDIA GRID */}
          {post.media?.length > 0 && (
            <div className="pd-media-grid mb-4">
              {post.media.map((m) => (
                <div
                  key={m.id}
                  className="pd-media-item"
                  onClick={() => setPreview(m)}
                >
                  {m.is_video ? (
                    <video muted>
                      <source src={m.file_url} />
                    </video>
                  ) : (
                    <img src={m.file_url} alt="" />
                  )}
                </div>
              ))}
            </div>
          )}




          {/* ACTION BUTTONS */}
          <div className="d-flex align-items-center gap-3 mt-4">

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleLike}
              disabled={likePost.isLoading}
            >
              <i className="ri-thumb-up-line me-1"></i>
              {post.like_count}
            </button>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleBookmark}
              disabled={bookmarkPost.isLoading}
            >
              <i className="ri-bookmark-line"></i>
            </button>

            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => setShowShare(true)}
            >
              <i className="ri-share-forward-line me-1"></i>
              Share
            </button>

            {showShare && (
              <SharePostModal
                postId={post.id}   // ✅ MUST exist
                onClose={() => setShowShare(false)}
              />
            )}



          </div>

        </div>

        {/* COMMENTS PANEL */}
        <div className="col-lg-4 border-start p-0 comments-pane">

          <div className="comments-header p-3 border-bottom fw-semibold">
            Comments ({post.comment_count})
          </div>

          <div className="comments-list p-3">
            {post.comments.map((c) => (
              <div key={c.id} className="comment-item d-flex align-items-start mb-3">
                <img
                  src={c.user?.profile_image || "/avatar.png"}
                  className="comment-avatar me-3"
                  alt=""
                />
                <div>
                  <div className="fw-semibold small">{c.user.first_name} {c.user.last_name}</div>
                  <div className="text-muted small mb-1">{new Date(c.created_at).toLocaleString()}</div>
                  <div>{c.c_content}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="add-comment p-3 border-top">
            <textarea
              className="form-control mb-2"
              placeholder="Add a comment..."
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button className="btn btn-primary w-100" onClick={handleComment} disabled={commentPost.isLoading}>
              Comment
            </button>
          </div>

        </div>

      </div>
      {preview && (
        <div className="media-preview-overlay" onClick={() => setPreview(null)}>
          <div className="media-preview-content" onClick={(e) => e.stopPropagation()}>
            {preview.is_video ? (
              <video controls autoPlay>
                <source src={preview.file_url} />
              </video>
            ) : (
              <img src={preview.file_url} alt="" />
            )}
            <button className="btn btn-light close-btn" onClick={() => setPreview(null)}>
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
