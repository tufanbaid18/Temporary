import { useState, useRef } from "react";

import { Link } from "react-router";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router";
import { usePosts } from "../../hooks/posts/usePosts";
import { useLikePost } from "../../hooks/posts/useLikePost";
import { useBookmarkPost } from "../../hooks/posts/useBookmarkPost";
import { useCommentPost } from "../../hooks/posts/useCommentPost";
import { useCreatePost } from "../../hooks/posts/useCreatePost";
import { Editor } from "@tinymce/tinymce-react";
import { useUserProfile } from "../../hooks/profile/useUserProfile";
import { useResearchNews } from "../../hooks/news/useResearchNews";
import { useUpdatePost } from "../../hooks/posts/useUpdatePost";
import { useDeletePost } from "../../hooks/posts/useDeletePost";
import { useIncomingFollowRequests } from "../../hooks/follow/useIncomingFollowRequests";
import { useOutgoingFollowRequests } from "../../hooks/follow/useOutgoingFollowRequests";
import { useUserFollowers } from "../../hooks/follow/useUserFollowers";
import { useUserFollowing } from "../../hooks/follow/useUserFollowing";
import { useAcceptFollow } from "../../hooks/follow/useFollowActions";
import { useRejectFollow } from "../../hooks/follow/useFollowActions";
import { useUnfollow } from "../../hooks/follow/useFollowActions";
import { useRemoveFollower } from "../../hooks/follow/useFollowActions";
import { getOgiMeta } from "../../api/ogiApi";
import "./PostsPage.css";
import { useArticles } from "../../hooks/articles/useArticles";
import { useArticleRatings } from "../../hooks/ratings/useRatings";




export default function PostsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState("post"); // post | image | article
  const [form, setForm] = useState({
    title: "",
    content: "",
    files: [],
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    postId: null,
  });
  const [ogPreview, setOgPreview] = useState(null);
  const handleOgFromText = async (text) => {
    if (!/^https?:\/\//i.test(text)) return;

    try {
      const res = await getOgiMeta(text);
      setOgPreview(buildOgHtml(res));
    } catch (err) {
      console.error("OG fetch failed", err);
      setOgPreview(null);
    }
  };


  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const { data: incoming = [] } = useIncomingFollowRequests();
  const { data: outgoing = [] } = useOutgoingFollowRequests();

  const userId = profile?.id;

  const { data: followers = [] } = useUserFollowers(userId);
  const { data: following = [] } = useUserFollowing(userId);

  const acceptFollow = useAcceptFollow();
  const rejectFollow = useRejectFollow();
  const unfollow = useUnfollow();
  const removeFollower = useRemoveFollower();


  const [searchPeople, setSearchPeople] = useState("");
  const [showAllPeople, setShowAllPeople] = useState(false);
  const people = [
    "Rahul",
    "Aritra",
    "Arup",
    "Subhanjan",
    "Chandrima",
    "Suman",
    "Ananya",
    "Rohit",
    "Sneha",
  ];


  const confirmDeletePost = () => {
    deletePost.mutate(confirmDelete.postId, {
      onSuccess: () => {
        showAlert("Post deleted successfully", "success");
        setConfirmDelete({ show: false, postId: null });
      },
      onError: () => {
        showAlert("Failed to delete post", "danger");
        setConfirmDelete({ show: false, postId: null });
      },
    });
  };


  const handleDeletePost = (postId) => {
    setConfirmDelete({
      show: true,
      postId,
    });
  };



  const [editingPost, setEditingPost] = useState(null);
  const handleEditPost = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title || "",
      content: post.content || "",
      files: [], // do NOT preload files
    });
    setPostType("post");
    setShowModal(true);
  };


  const {
    data: news = [],
    isLoading: isNewsLoading,
  } = useResearchNews();


  const {
    data: posts = [],
    isLoading: isPostsLoading,
    isError,
  } = usePosts();





  const createPost = useCreatePost();
  const [showPreview, setShowPreview] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [commentText, setCommentText] = useState({});



  const fileRef = useRef(null);


  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const commentPost = useCommentPost();

  const [expandedComments, setExpandedComments] = useState({});
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };


  const truncateWords = (text, wordLimit = 30) => {
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };


  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // success | danger | warning | info
  });


  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });

    // auto-hide after 3 seconds (optional)
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };




  const [files, setFiles] = useState([]); // new state for images
  const MAX_IMAGES = 6;


  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);

    // Only images
    const imageFiles = selected.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length !== selected.length) {
      showAlert("Only images are allowed", "warning");
    }


    setForm(prev => {
      const combined = [...prev.files, ...imageFiles];

      if (combined.length > 6) {
        showAlert("Maximum 6 images allowed", "warning");
        return combined.slice(0, 6);
      }

      return combined;
    });
  };

  const buildOgHtml = (res) => {
    const og = res.og;

    return `
    <div class="og-card" contenteditable="false"
         style="
           border:1px solid #e5e7eb;
           border-radius:8px;
           overflow:hidden;
           margin:12px 0;
           font-family:Arial,sans-serif;
         ">
      ${og["og:image"] ? `
        <img src="${og["og:image"]}"
             alt="${og["og:title"]}"
             style="width:100%;max-height:300px;object-fit:cover;" />
      ` : ""}

      <div style="padding:12px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">
          ${og["og:site_name"] || ""}
        </div>

        <div style="font-size:16px;font-weight:600;margin-bottom:6px;">
          ${og["og:title"]}
        </div>

        <div style="font-size:14px;color:#374151;">
          ${og["og:description"] || ""}
        </div>

        <a href="${res.url}"
           target="_blank"
           style="display:inline-block;margin-top:8px;font-size:13px;color:#2563eb;">
          Read more →
        </a>
      </div>
    </div><p></p>
  `;
  };




  // const handleCreatePost = () => {
  //   if (!form.content?.trim() && form.files.length === 0) {
  //     showAlert("Post cannot be empty", "warning");
  //     return;
  //   }

  //   if (postType === "video") {
  //     const isValidUrl = /^https?:\/\/.+/i.test(form.content);
  //     if (!isValidUrl) {
  //       showAlert("Please enter a valid video URL", "warning");
  //       return;
  //     }
  //   }


  //   const payload = {
  //     postId: editingPost?.id,
  //     title: form.title?.trim() || "",
  //     content: form.content?.trim() || "",
  //     files: form.files,
  //   };

  //   const mutation = editingPost ? updatePost : createPost;

  //   mutation.mutate(payload, {
  //     onSuccess: () => {
  //       setShowModal(false);
  //       setEditingPost(null);
  //       setForm({ title: "", content: "", files: [] });

  //       showAlert(
  //         editingPost ? "Post updated successfully" : "Post created successfully",
  //         "success"
  //       );
  //     },
  //     onError: () => {
  //       showAlert(
  //         editingPost ? "Failed to update post" : "Failed to create post",
  //         "danger"
  //       );
  //     },
  //   });
  // };



  const handleCreatePost = () => {
    if (!form.content?.trim() && form.files.length === 0 && !ogPreview) {
      showAlert("Post cannot be empty", "warning");
      return;
    }

    let finalContent = form.content?.trim() || "";

    // ✅ append OG HTML
    if (ogPreview && !finalContent.includes("og-card")) {
      finalContent += ogPreview;
    }

    const payload = {
      postId: editingPost?.id,
      title: form.title?.trim() || "",
      content: finalContent,
      files: form.files,
    };

    const mutation = editingPost ? updatePost : createPost;

    mutation.mutate(payload, {
      onSuccess: () => {
        setShowModal(false);
        setEditingPost(null);
        setForm({ title: "", content: "", files: [] });
        setOgPreview(null);

        showAlert(
          editingPost ? "Post updated successfully" : "Post created successfully",
          "success"
        );
      },
    });
  };





  const closeModal = () => {
    setShowModal(false);
    setForm({
      title: "",
      content: "",
      files: [],
    });

  };



  const handleCommentSubmit = (postId) => {
    const text = commentText[postId];

    if (!text?.trim()) {
      showAlert("Comment cannot be empty", "warning");
      return;
    }

    commentPost.mutate(
      { postId, c_content: text },
      {
        onSuccess: () => {
          setCommentText((prev) => ({ ...prev, [postId]: "" }));
          showAlert("Comment added", "success");
        },
        onError: () => {
          showAlert("Failed to add comment", "danger");
        },
      }
    );
  };









  if (isError) {
    return (
      <div className="text-danger text-center py-5">
        Failed to load posts
      </div>
    );
  }





  return (
    <div className="container-fluid py-4" style={{ background: "#f3f2ef" }}>
      {confirmDelete.show && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Post</h5>
                <button
                  className="btn-close"
                  onClick={() => setConfirmDelete({ show: false, postId: null })}
                />
              </div>

              <div className="modal-body">
                Are you sure you want to delete this post?
                <br />
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete({ show: false, postId: null })}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmDeletePost}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="row g-4">

          {/* ================= LEFT SIDEBAR ================= */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card border-0 shadow-sm rounded-4 mb-3 profile-card">

              <div className="card-body text-center">

                {/* PROFILE IMAGE */}
                {profile?.profile_image ? (
                  <img
                    src={profile.profile_image}
                    className="rounded-circle mb-2"
                    width="80"
                    height="80"
                    style={{ objectFit: "cover" }}
                    alt="Profile"
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{ width: 80, height: 80, fontSize: 28 }}
                  >
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </div>
                )}

                {/* FULL NAME */}
                <h6 className="fw-semibold mb-1 fs-6">

                  {profileLoading
                    ? "Loading..."
                    : `${profile?.first_name || ""} ${profile?.middle_name || ""} ${profile?.last_name || ""}`}
                </h6>

                {/* PROFILE TITLE */}
                {profile?.profile_title && (
                  <small className="text-muted d-block mt-1">
                    {profile.profile_title}
                  </small>
                )}

                <hr className="my-2" />

                {/* CURRENT ROLE */}
                <div className="role-box mt-1">
                  {profile?.professional_detail?.current_role && (
                    <div className="fw-medium">
                      {profile.professional_detail.current_role}
                    </div>
                  )}
                  {profile?.professional_detail?.current_organization && (
                    <div className="small text-muted">
                      {profile.professional_detail.current_organization}
                    </div>
                  )}
                </div>


                {/* CTA */}
                <Link
                  to="/user/profile"
                  className="btn btn-outline-primary btn-sm w-100 mt-"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-title">My Activity</div>

              <div
                className="activity-item"
                data-bs-toggle="modal"
                data-bs-target="#followrequest"
              >
                <div className="activity-left">
                  <i className="ri-user-add-line"></i>
                  <span>Follow Requests</span>
                </div>
                <span className="activity-count">{incoming.length}</span>
              </div>

              <div
                className="activity-item"
                data-bs-toggle="modal"
                data-bs-target="#pendingrequest"
              >
                <div className="activity-left">
                  <i className="ri-time-line"></i>
                  <span>Pending Requests</span>
                </div>
                <span className="activity-count">{outgoing.length}</span>
              </div>

              <div
                className="activity-item"
                data-bs-toggle="modal"
                data-bs-target="#followingModal"
              >
                <div className="activity-left">
                  <i className="ri-user-follow-line"></i>
                  <span>Following</span>
                </div>
                <span className="activity-count">
                  {profile?.following_count || 0}
                </span>
              </div>

              <div
                className="activity-item"
                data-bs-toggle="modal"
                data-bs-target="#followersModal"
              >
                <div className="activity-left">
                  <i className="ri-group-line"></i>
                  <span>Followers</span>
                </div>
                <span className="activity-count">
                  {profile?.followers_count || 0}
                </span>
              </div>
            </div>

            <div
              className="modal fade"
              id="followersModal"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-4 bg-white">

                  {/* Header */}
                  <div className="modal-header border-bottom">
                    <h6 className="modal-title fw-semibold text-dark">
                      Followers
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    />
                  </div>

                  {/* Search */}
                  {/* <div className="px-3 pt-3">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Search"
                    />
                  </div> */}

                  {/* Body */}
                  <div className="modal-body pt-2 follow-list">
                    {followers.length === 0 && (
                      <div className="empty-state">
                        No followers yet
                      </div>
                    )}

                    {followers.map((user) => (
                      <div key={user.id} className="follow-item">
                        <div className="follow-left">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              className="follow-avatar"
                              alt="avatar"
                            />
                          ) : (
                            <div className="follow-avatar initials-avatar">
                              {(user.first_name?.[0] || "")}
                              {(user.last_name?.[0] || "").toUpperCase()}
                            </div>
                          )}

                          <div className="follow-meta">
                            <div className="follow-name">
                              {user.first_name} {user.last_name}
                            </div>
                            {user.profile_title && (
                              <div className="follow-subtitle">
                                {user.profile_title}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          className="btn btn-sm btn-remove"
                          disabled={removeFollower.isLoading}
                          onClick={() => removeFollower.mutate(user.id)}
                        >
                          {removeFollower.isLoading ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>

            {/* following model  */}
            <div
              className="modal fade"
              id="followingModal"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-4 bg-white">

                  {/* Header */}
                  <div className="modal-header border-bottom">
                    <h6 className="modal-title fw-semibold text-dark">
                      Following
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    />
                  </div>

                  {/* Search */}
                  {/* <div className="px-3 pt-3">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Search"
                    />
                  </div> */}

                  {/* Body */}
                  <div className="modal-body pt-2 follow-list">
                    {following.length === 0 && (
                      <div className="empty-state">
                        No following yet
                      </div>
                    )}

                    {following.map((user) => (
                      <div key={user.id} className="follow-item">
                        <div className="follow-left">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              className="follow-avatar"
                              alt="avatar"
                            />
                          ) : (
                            <div className="follow-avatar initials-avatar">
                              {(user.first_name?.[0] || "")}
                              {(user.last_name?.[0] || "").toUpperCase()}
                            </div>
                          )}

                          <div className="follow-name">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>

                        <button
                          className="btn btn-sm btn-remove"
                          disabled={unfollow.isLoading}
                          onClick={() => unfollow.mutate(user.id)}
                        >
                          {unfollow.isLoading ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>


            {/* accept or reject  */}


            <div
              className="modal fade"
              id="followrequest"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-4 bg-white">

                  {/* Header */}
                  <div className="modal-header border-bottom">
                    <h6 className="modal-title fw-semibold text-dark">
                      Follow Request
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    />
                  </div>



                  {/* Body */}
                  <div className="modal-body pt-2 follow-list">
                    {incoming.length === 0 && (
                      <div className="empty-state">
                        No Follow Requests
                      </div>
                    )}

                    {incoming.map((req) => (
                      <div key={req.id} className="follow-item">
                        <div className="follow-left">
                          {req.follower.profile_image ? (
                            <img
                              src={req.follower.profile_image}
                              className="follow-avatar"
                              alt="avatar"
                            />
                          ) : (
                            <div className="follow-avatar initials-avatar">
                              {(req.follower.first_name?.[0] || "")}
                              {(req.follower.last_name?.[0] || "").toUpperCase()}
                            </div>
                          )}

                          <div className="follow-name">
                            {req.follower.first_name} {req.follower.last_name}
                          </div>
                        </div>

                        <div className="follow-actions">
                          <button
                            className="btn btn-sm btn-accept"
                            onClick={() => acceptFollow.mutate(req.id)}
                            disabled={acceptFollow.isLoading}
                          >
                            {acceptFollow.isLoading ? "Accepting…" : "Accept"}
                          </button>

                          <button
                            className="btn btn-sm btn-reject"
                            onClick={() => rejectFollow.mutate(req.id)}
                            disabled={rejectFollow.isLoading}
                          >
                            {rejectFollow.isLoading ? "Rejecting…" : "Reject"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>


            {/* pending request  */}


            <div
              className="modal fade"
              id="pendingrequest"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-4 bg-white">

                  {/* Header */}
                  <div className="modal-header border-bottom">
                    <h6 className="modal-title fw-semibold text-dark">
                      Pending Request
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    />
                  </div>



                  {/* Body */}
                  <div className="modal-body pt-2 pending-list">
                    {outgoing.length === 0 && (
                      <div className="empty-state">
                        No Pending Requests
                      </div>
                    )}

                    {outgoing.map((req) => (
                      <div
                        key={req.id}
                        className="pending-item"
                      >
                        <div className="pending-left">
                          {req.following.profile_image ? (
                            <img
                              src={req.following.profile_image}
                              className="pending-avatar"
                              alt="avatar"
                            />
                          ) : (
                            <div className="pending-avatar initials-avatar">
                              {(req.following.first_name?.[0] || "")}
                              {(req.following.last_name?.[0] || "").toUpperCase()}
                            </div>
                          )}

                          <div className="pending-name">
                            {req.following.first_name} {req.following.last_name}
                          </div>
                        </div>

                        <span className="pending-status">Pending</span>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>


          </div>



          {/* ================= MAIN FEED ================= */}


          {/* CREATE POST (UI ONLY) */}
          <div className="col-lg-6">





            <div className="sticky-top" style={{ zIndex: 1050 }}>
              {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert" >
                  {alert.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAlert({ ...alert, show: false })}
                  />
                </div>
              )}
            </div>

            <div style={{ maxWidth: "720px" }} className="mx-auto">

              {/* CREATE POST */}
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                  <div className="d-flex gap-3 mb-3">
                    {profile?.profile_image ? (
                      <img
                        src={profile.profile_image}
                        className="rounded-circle"
                        width="48"
                        height="48"
                        style={{ objectFit: "cover" }}
                        alt="Profile"
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                        style={{ width: 48, height: 48, fontWeight: 600 }}
                      >
                        {profile?.first_name?.[0]}
                        {profile?.last_name?.[0]}
                      </div>
                    )}

                    <input
                      className="form-control rounded-pill"
                      placeholder="Start a post"
                      readOnly
                      onClick={() => {
                        setPostType("post");
                        setShowModal(true);
                      }}
                    />

                  </div>

                  <div className="d-flex justify-content-around px-4 mt-2">

                    {/* IMAGE */}
                    <button
                      className="btn btn-light rounded-circle icon-btn"
                      onClick={() => {
                        setPostType("image");
                        setShowModal(true);
                      }}
                    >
                      <i className="ri-image-line text-primary"></i>
                    </button>

                    {/* VIDEO */}
                    <button
                      className="btn btn-light rounded-circle icon-btn"
                      onClick={() => {
                        setPostType("video");
                        setShowModal(true);
                      }}
                    >
                      <i className="ri-video-line text-danger"></i>
                    </button>

                    {/* ARTICLE */}
                    <button
                      className="btn btn-light rounded-circle icon-btn"
                      onClick={() => {
                        setPostType("article");
                        setShowModal(true);
                      }}
                    >
                      <i className="ri-file-text-line text-warning"></i>
                    </button>

                  </div>

                </div>
              </div>

              {/* POSTS LOADING */}
              {
                isPostsLoading && (
                  <div className="text-center py-5">Loading posts...</div>
                )
              }

              {/* POSTS EMPTY */}
              {!isPostsLoading && posts.length === 0 && (
                <div className="text-center text-muted py-5">
                  No posts yet.
                </div>
              )}



              {/* POSTS */}
              {!isPostsLoading && posts.map((post) => (
                <div
                  key={post.id}
                  className="card border-0 shadow-sm rounded-4 mb-4"
                >
                  <div className="card-body">

                    {/* HEADER */}
                    <div className="d-flex gap-3 mb-2">
                      {post.user.profile_image_url ? (
                        <img
                          src={post.user.profile_image_url}
                          className="rounded-circle post-avatar"
                          width="48"
                          height="48"
                          alt="Profile"
                        />

                      ) : (
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{ width: 48, height: 48 }}
                        >
                          {post.user.first_name?.[0]}
                          {post.user.last_name?.[0]}
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-start w-100">
                        <div>
                          <div className="fw-semibold">
                            {post.user.first_name} {post.user.last_name}
                          </div>
                          <small className="text-muted">
                            {new Date(post.created_at).toLocaleString()}
                          </small>
                        </div>

                        {post.user.id === profile?.id && (
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-light"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ri-more-2-fill"></i>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleEditPost(post)}
                                >
                                  ✏️ Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  🗑 Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* TITLE */}
                    {post.title && (
                      <h6 className="mt-3">{post.title}</h6>
                    )}

                    {/* CONTENT */}
                    <div
                      className="text-secondary mt-2"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content || ""),
                      }}
                    />

                    {/* 🔗 LINK PREVIEW (YouTube)
                    {post.link_preview?.type === "youtube" && (
                      <a
                        href={post.link_preview.watch_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-preview-card mt-3 text-decoration-none"
                      >
                        <div className="youtube-thumb-wrapper">
                          <img
                            src={post.link_preview.thumbnail}
                            alt="YouTube preview"
                            className="youtube-thumb"
                          />
                          <div className="youtube-play-btn">▶</div>
                        </div>
                      </a>
                    )} */}

                    {/* MEDIA */}
                    {/* MEDIA GRID - LinkedIn style */}
                    {post.media?.length > 0 && (
                      <div
                        className={`post-media-grid images-${Math.min(
                          post.media.length,
                          4
                        )} mt-3`}
                      >
                        {post.media.slice(0, 4).map((m, idx) => (
                          <div
                            key={m.id}
                            className="media-wrapper"
                            onClick={() => {
                              setViewerImages(post.media.map(i => i.file_url));
                              setCurrentIndex(idx);
                              setViewerOpen(true);
                            }}
                          >
                            <img
                              src={m.file_url}
                              className="post-media-img"
                              alt=""
                            />

                            {idx === 3 && post.media.length > 4 && (
                              <div className="media-overlay">
                                +{post.media.length - 4}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}


                  </div>

                  {/* FOOTER */}
                  <div className="card-body pt-2">

                    <div className="small text-muted mb-2">
                      {post.like_count} likes · {post.comment_count} comments
                    </div>

                    {post.comments?.length > 0 && (
                      <div className="mt-3 comments-box">

                        {(expandedComments[post.id]
                          ? post.comments
                          : post.comments
                            .slice()
                            .reverse()
                            .slice(0, 2)
                        ).map((comment) => (
                          <div key={comment.id} className="d-flex gap-2 mb-2">

                            {/* Avatar */}
                            {comment.user.profile_image ? (
                              <img
                                src={comment.user.profile_image}
                                className="rounded-circle"
                                width="32"
                                height="32"
                                alt=""
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                style={{ width: 32, height: 32, fontSize: 12 }}
                              >
                                {comment.user.first_name?.[0]}
                              </div>
                            )}

                            {/* Comment bubble */}
                            <div className="comment-bubble">
                              <div className="fw-semibold small">
                                {comment.user.first_name} {comment.user.last_name}
                              </div>
                              <div className="small text-secondary">
                                {comment.c_content}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* SHOW MORE / LESS */}
                        {post.comments.length > 2 && (
                          <button
                            className="btn btn-link btn-sm p-0"
                            onClick={() => toggleComments(post.id)}
                          >
                            {expandedComments[post.id]
                              ? "Show less comments"
                              : `Show more comments (${post.comments.length - 2})`}
                          </button>
                        )}
                      </div>
                    )}

                    <div className="d-flex border-top pt-2">
                      <button
                        className={`btn btn-sm w-100 ${post.is_liked ? "btn-primary" : "btn-light"
                          }`}
                        onClick={() => likePost.mutate(post.id)}
                      >
                        <i
                          className={`me-1 ${post.is_liked ? "ri-thumb-up-fill" : "ri-thumb-up-line"
                            }`}
                        ></i>
                        {post.like_count}
                      </button>




                      <button
                        className="btn btn-light btn-sm w-100"
                        onClick={() =>
                          document
                            .getElementById(`comment-${post.id}`)
                            ?.focus()
                        }
                      >
                        <i className="ri-chat-1-line me-1"></i> Comment
                      </button>

                      {/* <button
                        className="btn btn-light btn-sm w-100"
                        onClick={() => bookmarkPost.mutate(post.id)}
                      >
                        <i className="ri-bookmark-line me-1"></i> Save
                      </button> */}

                      <Link
                        to={`/posts/${post.id}`}
                        className="btn btn-light btn-sm w-100"
                      >
                        <i className="ri-eye-line me-1"></i> View
                      </Link>
                    </div>
                    {/* COMMENTS LIST */}





                    {/* COMMENTS */}
                    <div className="mt-3">
                      <div className="d-flex gap-2">
                        <input
                          id={`comment-${post.id}`}
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Add a comment..."
                          value={commentText[post.id] || ""}
                          onChange={(e) =>
                            setCommentText((p) => ({
                              ...p,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleCommentSubmit(post.id)
                          }
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            handleCommentSubmit(post.id)
                          }
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>


          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card border-0 shadow-sm rounded-4 p-3 news-card">
              <h6 className="fw-semibold mb-3">Latest News</h6>

              {isNewsLoading && (
                <div className="small text-muted">Loading news...</div>
              )}

              {!isNewsLoading && news.length === 0 && (
                <div className="small text-muted">No news available.</div>
              )}

              <div className="news-list">
                {news.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-item-card text-decoration-none mb-3"
                  >
                    {/* Thumbnail on the left */}
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/100x70"}
                      alt={item.title}
                      className="news-thumb-img"
                    />

                    {/* Content on the right */}
                    <div className="news-content">
                      <div className="fw-semibold text-dark news-title">
                        {item.title}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="badge bg-light text-dark small">
                          {item.source || "Unknown"}
                        </span>
                        {item.published_at && (
                          <small className="text-muted">
                            {new Date(item.published_at).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {/* <div className="card border-0 shadow-sm rounded-4 p-3">
              <div className="card-body">
                <h6 className="fw-semibold mb-3">People You May Know</h6>

                
                <input
                  type="text"
                  className="form-control form-control-sm mb-3"
                  placeholder="Search people..."
                  value={searchPeople}
                  onChange={(e) => setSearchPeople(e.target.value)}
                />

                
                {people
                  .filter((name) =>
                    name.toLowerCase().includes(searchPeople.toLowerCase())
                  )
                  .slice(0, showAllPeople ? people.length : 5)
                  .map((name, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-center mb-3"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={`https://i.pravatar.cc/40?img=${idx + 30}`}
                          className="rounded-circle"
                          width="36"
                          height="36"
                          alt=""
                        />
                        <div>
                          <div className="fw-semibold small">{name}</div>
                          <div className="text-muted small">Research</div>
                        </div>
                      </div>

                      <button className="btn btn-sm btn-outline-secondary rounded-pill">
                        +
                      </button>
                    </div>
                  ))}

                
                {people.length > 5 && (
                  <div className="text-center mt-2">
                    <button
                      className="btn btn-link btn-sm text-decoration-none"
                      onClick={() => setShowAllPeople(!showAllPeople)}
                    >
                      {showAllPeople ? "Show less" : "See all"}
                    </button>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">

              {/* HEADER */}
              <div className="modal-header">
                {/* <h5 className="modal-title text-capitalize">
                  Create {postType === "post" ? "Post" : postType}
                </h5> */}

                <h5 className="modal-title">
                  {editingPost ? "Edit Post" : "Create Post"}
                </h5>

                <button
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>

              {/* BODY */}
              <div className="modal-body">

                {/* ARTICLE HEADING */}
                {(postType === "article") && (
                  <input
                    className="form-control mb-3"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                )}

                {/* ================= POST CONTENT INPUT ================= */}

                {/* ARTICLE → TinyMCE */}
                {postType === "article" && (
                  <Editor
                    apiKey="gzbaq6k6otgk5w4c2vhnm06gksbkpyt5ahllriq2s49rj3ty"
                    value={form.content}
                    onEditorChange={(newValue) => {
                      setForm({ ...form, content: newValue });
                    }}
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: `
        advlist autolink lists link image charmap preview
        anchor searchreplace visualblocks code fullscreen
        insertdatetime media table help wordcount
      `,
                      toolbar: `
        undo redo |
        formatselect |
        bold italic underline |
        alignleft aligncenter alignright |
        bullist numlist |
        link image media table |
        code preview fullscreen
      `,
                      setup: (editor) => {
                        editor.on("paste", async (e) => {
                          const clipboardData = e.clipboardData || window.clipboardData;
                          if (!clipboardData) return;

                          const pastedText = clipboardData.getData("text/plain");
                          if (!/^https?:\/\//i.test(pastedText)) return;

                          e.preventDefault();

                          try {
                            const res = await getOgiMeta(pastedText);
                            editor.insertContent(buildOgHtml(res));
                          } catch {
                            editor.insertContent(pastedText);
                          }
                        });
                      },
                    }}
                  />
                )}

                {/* POST / IMAGE → SIMPLE TEXTAREA */}
                {(postType === "post" || postType === "image") && (
                  <textarea
                    className="form-control mb-3"
                    rows={2}
                    placeholder="What do you want to talk about?"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    onPaste={async (e) => {
                      const text = e.clipboardData.getData("text/plain");
                      handleOgFromText(text);
                    }}
                  />

                )}


                {/* VIDEO URL INPUT */}
                {postType === "video" && (
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                    value={form.content}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, content: value });
                      handleOgFromText(value);
                    }}
                  />

                )}





                {/* IMAGE UPLOAD */}
                {(postType === "image" || postType === "post") && (
                  <>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => fileRef.current.click()}
                    >
                      <i className="ri-image-add-line me-1"></i>
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setForm(prev => {
                          const selected = Array.from(e.target.files);
                          const combined = [...prev.files, ...selected].slice(0, 6);
                          return { ...prev, files: combined };
                        })
                      }
                    />




                    {form.files.length > 0 && (
                      <div className={`post-media-grid images-${form.files.length}`}>
                        {form.files.map((file, idx) => (
                          <img
                            key={idx}
                            src={URL.createObjectURL(file)}
                            alt={`preview-${idx}`}
                            className="post-media-img"
                          />
                        ))}
                      </div>
                    )}

                  </>
                )}
                {ogPreview && (
                  <div
                    className="og-preview mt-3"
                    dangerouslySetInnerHTML={{ __html: ogPreview }}
                  />
                )}

              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                {/* <button
                  className="btn btn-light"
                  onClick={closeModal}

                >
                  Cancel
                </button> */}

                {/* <button
                  className="btn btn-outline-secondary"
                  disabled={!form.content}
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </button> */}


                <button
                  className="btn btn-primary"
                  disabled={
                    editingPost
                      ? updatePost.isLoading
                      : createPost.isLoading ||
                      (!form.content?.trim() && form.files.length === 0)
                  }

                  onClick={handleCreatePost}
                >
                  {editingPost
                    ? updatePost.isLoading
                      ? "Updating..."
                      : "Update"
                    : createPost.isLoading
                      ? "Posting..."
                      : "Post"}

                </button>

              </div>

            </div>
          </div>
        </div>
      )}


      {showPreview && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">

              {/* HEADER */}
              <div className="modal-header">
                <h5 className="modal-title">Post Preview</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPreview(false)}
                />
              </div>

              {/* BODY */}
              <div className="modal-body">
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-body">

                    {/* HEADER - User Avatar + Name */}
                    <div className="d-flex gap-3 mb-2">
                      {profile?.profile_image ? (
                        <img
                          src={profile.profile_image}
                          className="rounded-circle post-avatar"
                          width="48"
                          height="48"
                          alt="Profile"
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{ width: 48, height: 48, fontWeight: 600 }}
                        >
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </div>
                      )}

                      <div>
                        <div className="fw-semibold">
                          {profile?.first_name} {profile?.last_name}
                        </div>
                        <small className="text-muted">Now</small>
                      </div>
                    </div>

                    {/* TITLE */}
                    {postType === "article" && form.title && (
                      <h6 className="mt-2">{form.title}</h6>
                    )}

                    {/* CONTENT */}
                    <div
                      className="text-secondary mt-2 post-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(form.content),
                      }}
                    />

                    {/* MEDIA GRID */}
                    {form.files.length > 0 && (
                      <div
                        className={`post-media-grid images-${form.files.length} mt-3`}
                      >
                        {form.files.map((file, idx) => (
                          <div key={idx} className="media-wrapper">
                            <img
                              src={URL.createObjectURL(file)}
                              className="post-media-img"
                              alt={`preview-${idx}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* FOOTER - Optional actions like likes/comments */}
                  <div className="card-body pt-2">
                    <div className="small text-muted mb-2">
                      0 likes · 0 comments
                    </div>
                    <div className="d-flex border-top pt-2">
                      <button className="btn btn-sm w-100 btn-light">
                        <i className="ri-thumb-up-line me-1"></i> Like
                      </button>
                      <button className="btn btn-sm w-100 btn-light">
                        <i className="ri-chat-1-line me-1"></i> Comment
                      </button>
                      <button className="btn btn-sm w-100 btn-light">
                        <i className="ri-bookmark-line me-1"></i> Save
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowPreview(false)}
                >
                  Back
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowPreview(false);
                    handleCreatePost();
                  }}
                >
                  {editingPost ? "Update" : "Post"}

                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {viewerOpen && (
        <div className="image-viewer-backdrop">
          <button
            className="viewer-close"
            onClick={() => setViewerOpen(false)}
          >
            ✕
          </button>

          {currentIndex > 0 && (
            <button
              className="viewer-nav left"
              onClick={() => setCurrentIndex(i => i - 1)}
            >
              ‹
            </button>
          )}

          <img
            src={viewerImages[currentIndex]}
            className="viewer-image"
            alt=""
          />

          {currentIndex < viewerImages.length - 1 && (
            <button
              className="viewer-nav right"
              onClick={() => setCurrentIndex(i => i + 1)}
            >
              ›
            </button>
          )}
        </div>
      )}




    </div>
  );
}
