import { useNavigate, useParams } from "react-router";
import "./Inbox.css";
import { useEffect, useState } from "react";

import { useConversations } from "../../hooks/conversation/useConversations";
import { useChatHistory } from "../../hooks/messages/useChatHistory";
import { useSendMessage } from "../../hooks/messages/useSendMessage";
import { useMarkAsRead } from "../../hooks/messages/useMarkAsRead";
import { useUser } from "../../hooks/users/useUsers";

export default function Inbox() {
  const nav = useNavigate();
  const { userId } = useParams();
  const { data: fetchedUser } = useUser(userId);


  const { data: conversations = [], isLoading: convLoading } =
    useConversations();

  const [active, setActive] = useState(null);

  const { data: chat = [] } = useChatHistory(active?.user?.id);
  const sendMsg = useSendMessage();
  const markAsRead = useMarkAsRead();

  const [text, setText] = useState("");

  // -----------------------------------
  // SET ACTIVE CONVERSATION
  // -----------------------------------
useEffect(() => {
  if (!userId) {
    setActive(null);
    return;
  }

  const existing = conversations.find(
    (c) => c.user.id === Number(userId)
  );

  if (existing) {
    setActive(existing);

    if (existing.unread_count > 0) {
      markAsRead.mutate(existing.user.id);
    }
  } 
  else if (fetchedUser) {
    // ✅ VIRTUAL CONVERSATION
    setActive({
      user: fetchedUser,
      last_message: null,
      unread_count: 0,
      isVirtual: true,
    });
  }
}, [userId, conversations, fetchedUser]);
  

  // -----------------------------------
  // SEND MESSAGE
  // -----------------------------------
  const handleSend = () => {
    if (!text.trim() || !active) return;

    sendMsg.mutate(
      {
        receiver: active.user.id,
        content: text,
      },
      {
        onSuccess: () => setText(""),
      }
    );
  };

  if (convLoading) {
    return <div className="p-4">Loading conversations...</div>;
  }

  return (
    <div className="inbox-container d-flex">

      {/* LEFT Sidebar */}
      <div className="inbox-left border-end slide-left">

        <div className="p-2 border-bottom bg-light d-flex align-items-center">
          
          <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => nav("/user")}
          >
            <i className="ri-arrow-left-line me-2"></i>
            Go Back to My Neuron
          </button>
        </div>

        {/* Inbox Header */}
        <div className="p-3 border-bottom fw-bold">Inbox</div>

        {/* Conversation List */}
        <div className="conversation-list">
          {conversations.map((c) => (
            <div
              key={c.user.id}
              className={`conversation-item stagger-item d-flex align-items-center p-3 ${
                active?.user?.id === c.user.id ? "active" : ""
              }`}
              onClick={() => nav(`/inbox/${c.user.id}`)}
            >
              <img
                src={c.user.profile_image|| "https://i.pravatar.cc/100"}
                className="inbox-avatar"
                alt="avatar"
              />
              <div className="flex-grow-1 ">
                <div className="fw-semibold ps-2">
                  {c.user.first_name} {c.user.last_name}
                </div>
                <div className="text-muted small ps-2">
                  {c.last_message?.content || "Start a conversation"}
                </div>
              </div>

              {c.unread_count > 0 && (
                <span className="badge bg-primary">
                  {c.unread_count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT Chat Window */}
      <div className="inbox-right flex-grow-1 d-flex flex-column">
        {active ? (
          <>
            {/* Header */}
            <div className="p-3 border-bottom d-flex align-items-center gap-3">
              <img
                src={active.user.profile_image || "https://i.pravatar.cc/100"}
                className="inbox-avatar"
                alt="avatar"
              />
              <div>
                <h6 className="mb-0">
                  {active.user.first_name} {active.user.last_name}
                </h6>
              </div>
            </div>

            {/* Chat Body */}
            <div className="chat-body flex-grow-1 p-3">
              {chat.length > 0 ? (
                chat.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-bubble ${
                      m.sender === active.user.id ? "them" : "me"
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              ) : (
                <div className="text-muted small">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="chat-input-area border-top p-3 d-flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="form-control"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="btn btn-primary px-4"
                onClick={handleSend}
              >
                <i className="ri-send-plane-2-line"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-muted">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
