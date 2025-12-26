// src/components/handshakes/HandshakesComponent.jsx
import { useState, useMemo, useEffect } from "react";
import "./HandshakesComponent.css";
import { useGetMyHandshakes } from "../../hooks/handshake/useGetMyHandshakes";
import { useNavigate } from "react-router";
import { useUpdateHandshakeStatus } from "../../hooks/handshake/useUpdateHandshake";
import AsyncButton from "../ui/AsyncButton";
import { useCreateHandshake } from "../../hooks/handshake/useCreateHandshake";
import { useCancelHandshake } from "../../hooks/handshake/useCancelHandshake";

export default function HandshakesComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setUser(stored);
  }, []);

  const { data: handshakes = [] } = useGetMyHandshakes();
  const createHook = useCreateHandshake();
  const { cancelMut, undoCreateMut } = useCancelHandshake();
  const { mutate: updateHandshakeStatus } = useUpdateHandshakeStatus();

  const [tab, setTab] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("gatc2025");
  const navigate = useNavigate();

  const events = [
    { id: "gatc2025", name: "GATC 2025" },
    { id: "gatc2024", name: "GATC 2024" },
    { id: "gatc2023", name: "GATC 2023" },
  ];

  const tabs = ["all", "pending", "accepted", "rejected"];

  const normalized = useMemo(() => {
    if (!handshakes) return [];

    return handshakes.map((h) => {
      // your backend provides sender_details / receiver_details
      const amSender = h.sender === user?.id || h.sender === user?.id; // safe check

      const senderInfo = h.sender_details || {};
      const receiverInfo = h.receiver_details || {};

      const name = amSender
        ? `${receiverInfo.name || ""}`.trim()
        : `${senderInfo.name || ""}`.trim();

      const avatar = amSender
        ? (receiverInfo.profile_image || receiverInfo.profile_image) // if your serializer builds absolute URI
        : (senderInfo.profile_image || senderInfo.profile_image);

      // map status legacy -> maintain 'rejected' label UI if backend returns 'declined'
      let status = h.status;
      if (status === "declined") status = "rejected";
      if (status === "cancelled") status = "cancelled";

      return {
        id: h.id,
        status,
        created_at: (h.created_at || "").split("T")[0] || "",
        receiver: {
          id: amSender ? h.receiver : h.sender,
          name: name || (amSender ? receiverInfo.name : senderInfo.name) || "Unknown",
          title: "",
          avatar: avatar || "https://i.pravatar.cc/100",
        },
        sender: {
          id: h.sender,
        },
        raw: h,
      };
    });
  }, [handshakes, user]);

  const filtered = tab === "all" ? normalized : normalized.filter((h) => h.status === tab);

  // Cancel flow with undo
  const handleCancel = async (handshake) => {
    // confirm then cancel
    if (!window.confirm("Cancel this handshake request? You can undo from the toast.")) return;

    cancelMut.mutate(handshake.id, {
      onSuccess: () => {
        // show a simple undo prompt (replace with toast in your app)
        const undo = window.confirm("Handshake canceled. Undo?");
        if (undo) {
          // recreate handshake with receiver id
          const receiverId = handshake.raw.receiver; // raw has original fields
          undoCreateMut.mutate({ receiver_id: receiverId });
        }
      },
      onError: (err) => alert("Failed to cancel: " + (err?.response?.data?.detail || err.message)),
    });
  };

  const handleAccept = (id) => {
    updateHandshakeStatus({ id, status: "accepted" });
  };
  const handleReject = (id) => {
    updateHandshakeStatus({ id, status: "declined" });
  };

  return (
    <>
      <div className="event-bar-fullwidth py-3 mb-4">
        <div className="container d-flex gap-2 flex-wrap">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`event-pill ${selectedEvent === ev.id ? "active" : ""}`}
              onClick={() => setSelectedEvent(ev.id)}
            >
              {ev.name}
            </div>
          ))}
        </div>
      </div>

      <div className="container py-4 handshakes-page">
        <div className="row">
          <div className="col-md-9 col-lg-9">
            <h3 className="mb-4 fw-bold">Handshakes</h3>

            <div className="handshake-tabs mb-4 d-flex gap-4">
              {tabs.map((t) => (
                <button
                  key={t}
                  className={`tab-btn ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="list-group">
              {filtered.map((h) => (
                <div key={h.id} className="list-group-item handshake-item d-flex align-items-center">
                  <img src={h.receiver.avatar} className="avatar me-3" alt={h.receiver.name} />

                  <div className="flex-grow-1">
                    <div className="fw-bold">{h.receiver.name}</div>
                    {h.receiver.title && <div className="text-muted small">{h.receiver.title}</div>}
                    <div className="text-muted small">Sent on: {h.created_at}</div>
                  </div>

                  <span className={`status-badge status-${h.status}`}>{h.status.toUpperCase()}</span>

                  <button
                    className="btn btn-sm btn-outline-dark rounded-pill ms-3 px-3 d-flex align-items-center gap-1"
                    onClick={() => {
                      if (user?.role === "speaker") {
                        navigate(`/participants/${h?.receiver?.id}`);
                      } else {
                        navigate(`/speakers/${h?.receiver?.id}`);
                      }
                    }}
                  >
                    <i className="ri-user-line"></i> View Profile
                  </button>

                  {user?.role === "user" && h.status === "pending" && (
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill ms-2 px-3 d-flex align-items-center gap-1"
                      onClick={() => handleCancel(h)}
                    >
                      <i className="ri-close-circle-line"></i> Cancel
                    </button>
                  )}

                  {user?.role === "speaker" && h.status === "pending" && (
                    <div className="d-flex align-items-center gap-2 ms-2">
                      <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => handleAccept(h.id)}>
                        <i className="ri-check-line"></i> Accept
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleReject(h.id)}>
                        <i className="ri-close-line"></i> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-5 text-muted">No {tab} handshakes found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
