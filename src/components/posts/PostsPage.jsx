import { useState } from "react";
import "./PostsPage.css";
import { Link } from "react-router";
import { usePosts } from "../../hooks/posts/usePosts";
import { useLikePost } from "../../hooks/posts/useLikePost";
import { useBookmarkPost } from "../../hooks/posts/useBookmarkPost";
import { useCommentPost } from "../../hooks/posts/useCommentPost";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router";

export default function PostsPage() {
  const nav = useNavigate();
  const { data: posts = [], isLoading, isError } = usePosts();
  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const commentPost = useCommentPost();
  const [commentText, setCommentText] = useState({});


  if (isLoading) {
    return <div className="text-center py-5">Loading posts...</div>;
  }

  if (isError) {
    return <div className="text-danger text-center py-5">
      Failed to load posts
    </div>;
  }


  // LIKE HANDLER


  // COMMENT HANDLER
  const handleCommentChange = (postId, value) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    commentPost.mutate(
      { postId, c_content: text },
      {
        onSuccess: () => {
          setCommentText((prev) => ({
            ...prev,
            [postId]: "",
          }));
        },
      }
    );
  };


  // SEARCH + SORT
  const filtered = posts
    .filter((p) =>
      p.content?.toLowerCase().includes(search.toLowerCase()) ||
      p.title?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "likes"
        ? b.like_count - a.like_count
        : sort === "author"
          ? `${a.user.first_name} ${a.user.last_name}`.localeCompare(
            `${b.user.first_name} ${b.user.last_name}`
          )
          : new Date(b.created_at) - new Date(a.created_at)
    );


  return (
    <div className="posts-layout container-fluid py-4 fade-up">
      <div className="row">

        {/* -------------------------------
            LEFT SIDEBAR
        -------------------------------- */}
        <div className="col-12 col-md-3 mb-4 fade-item">


          <div className="p-2 border-bottom bg-light d-flex align-items-center">
            
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => nav("/user")}
            >
              <i className="ri-arrow-left-line me-2"></i>
              Go Back to My Neuron
            </button>
          </div>


          <div className="card shadow-sm border-0 p-3">
            <h5 className="fw-bold mb-3">Impulse Menu</h5>

            <div className="list-group small">
              <a className="list-group-item list-group-item-action">
                <i className="ri-rss-line me-2"></i> All Posts
              </a>
              <a className="list-group-item list-group-item-action">
                <i className="ri-flashlight-line me-2"></i> Trending
              </a>
              <a className="list-group-item list-group-item-action">
                <i className="ri-book-open-line me-2"></i> Research Updates
              </a>
              <a className="list-group-item list-group-item-action">
                <i className="ri-user-voice-line me-2"></i> Shared with me
              </a>
            </div>
          </div>

          {/* NEW IMPULSE BUTTON */}

          <Link to={`/post-new`}>
            <button className="btn btn-primary w-100 mt-3 py-2">
              <i className="ri-add-line me-1"></i> New Impulse
            </button>
          </Link>
        </div>

        {/* -------------------------------
            CENTER FEED
        -------------------------------- */}
        <div className="col-12 col-md-6">

          {/* SEARCH + SORT BAR */}
          <div className="d-flex align-items-center mb-4 fade-item">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search impulses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select w-auto"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="likes">Most Liked</option>
              <option value="author">By Author</option>
            </select>
          </div>

          {/* POSTS LIST */}
          {filtered.map((post) => (
            <div key={post.id} className="post-card shadow-sm p-3 mb-4 fade-item">

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
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* TITLE */}
              {post.title && <h6 className="fw-bold mb-2">{post.title}</h6>}

              {/* CONTENT */}
              {/* <div className="mb-3">{post.content}</div> */}

              {/* <div
                className="mb-3"
                dangerouslySetInnerHTML={{
                  __html: (post.content),
                }}
              /> */}

              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />

              {/* MEDIA */}
              {post.media.length > 0 && (
                <div className="post-media-grid mb-3">
                  {post.media.map((m) =>
                    m.is_video ? (
                      <video key={m.id} controls className="post-media-img">
                        <source src={m.file_url} />
                      </video>
                    ) : (
                      <img
                        key={m.id}
                        src={m.file_url}
                        className="post-media-img"
                        alt=""
                      />
                    )
                  )}
                </div>
              )}

              {/* COMMENT INPUT */}
              <div className="comment-box mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Write a comment..."
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    handleCommentChange(post.id, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommentSubmit(post.id);
                  }}
                />

                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleCommentSubmit(post.id)}
                  disabled={commentPost.isLoading}
                >
                  Post
                </button>
              </div>


              {/* FOOTER */}
              <div className="d-flex justify-content-between align-items-center">

                {/* LEFT */}
                <div className="d-flex align-items-center gap-2">

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => likePost.mutate(post.id)}
                    disabled={likePost.isLoading}
                  >
                    <i className="ri-heart-3-line me-1"></i>
                    {post.like_count}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => bookmarkPost.mutate(post.id)}
                  >
                    <i className="ri-bookmark-line"></i>
                  </button>

                </div>

                {/* RIGHT */}
                <div className="d-flex align-items-center gap-2">

                  <button className="btn btn-sm btn-light">
                    <i className="ri-chat-1-line"></i>
                    {post.comment_count}
                  </button>

                  <Link
                    to={`/posts/${post.id}`}
                    className="btn btn-sm btn-outline-dark"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>

                </div>
              </div>
            </div>
          ))}

        </div>

        {/* -------------------------------
            RIGHT SIDEBAR
        -------------------------------- */}
        <div className="col-12 col-md-3 fade-item">

          {/* TRENDING TAGS */}
          <div className="card shadow-sm border-0 p-3 mb-4">
            <h5 className="fw-bold mb-3">Trending Tags</h5>
            <div>
              <span className="badge bg-primary me-2 mb-2">#quantum</span>
              <span className="badge bg-success me-2 mb-2">#neuroscience</span>
              <span className="badge bg-danger me-2 mb-2">#machinelearning</span>
              <span className="badge bg-warning text-dark me-2 mb-2">#myneuron</span>
            </div>
          </div>

          {/* ONLINE USERS */}
          <div className="card shadow-sm border-0 p-3 mb-4 online-card">
            <h5 className="fw-bold mb-3">Online Users</h5>

            {[
              {
                name: "Dr. Maya Rangan",
                avatar: "https://i.pravatar.cc/50?img=40",
                status: "online",
              },
              {
                name: "Prof. Samuel Crane",
                avatar: "https://i.pravatar.cc/50?img=48",
                status: "busy",
              },
              {
                name: "Dr. Yan Lee",
                avatar: "https://i.pravatar.cc/50?img=51",
                status: "offline",
              },
            ].map((u, idx) => (
              <div key={idx} className="online-user-item d-flex align-items-center mb-3">
                <div className="position-relative">
                  <img src={u.avatar} className="online-avatar me-3" alt="" />
                  <span className={`status-dot ${u.status}`}></span>
                </div>
                <div className="small fw-semibold">{u.name}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}