import "./SharePostModal.css";
import { useConversations } from "../../hooks/conversation/useConversations";
import { useSharePost } from "../../hooks/posts/useSharePost";

export default function SharePostModal({ postId, onClose }) {
  const { data: conversations = [], isLoading } = useConversations();
  const sharePost = useSharePost();

  const handleSend = (userId) => {
    sharePost.mutate(
      { postId, receiver: userId },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="share-overlay">
      <div className="share-modal">

        {/* HEADER */}
        <div className="share-header">
          <h6 className="fw-bold mb-0">Share Post</h6>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* BODY */}
        <div className="share-body">
          {isLoading && <div className="text-center py-3">Loading...</div>}

          {!isLoading && conversations.length === 0 && (
            <div className="text-muted text-center py-4">
              No conversations found
            </div>
          )}

          {conversations.map((conv) => (
            <div
              key={conv.user_id}
              className="share-user"
              onClick={() => handleSend(conv.user_id)}
            >
              <img
                src={conv.profile_image || "/avatar.png"}
                alt=""
                className="share-avatar"
              />

              <div className="share-user-info">
                <div className="fw-semibold">
                  {conv.first_name} {conv.last_name}
                </div>

                <div className="text-muted small text-truncate">
                  {conv.last_message}
                </div>
              </div>

              <button className="btn btn-sm btn-outline-primary">
                Send
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
