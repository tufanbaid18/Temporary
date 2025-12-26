import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import "./bookmark.css";

export default function Bookmark() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");

  const tabs = ["all", "speakers", "participants", "posts"];

  useEffect(() => {
    setItems([
      {
        id: 1,
        type: "speaker",
        name: "Dr. Sourav Guha",
        title: "Clinical Genomics Expert",
        avatar: "https://i.pravatar.cc/100?img=11",
        date: "2025-04-04",
      },
      {
        id: 2,
        type: "participant",
        name: "Dr. Krishnadev Uruganty",
        title: "AI in Biology",
        avatar: "https://i.pravatar.cc/100?img=15",
        date: "2025-04-05",
      },
      {
        id: 3,
        type: "post",
        authorName: "Dr. Amit Verma",
        authorImage: "https://i.pravatar.cc/100?img=22",
        postTitle: "Future of Genomics in India",
        content:
          "asfasdfffffffffffffffffffffffffffffffffffffffffffffff",
        date: "2025-04-06",
      },
    ]);
  }, []);

  const filtered = useMemo(() => {
    return items.filter(
      (item) => tab === "all" || item.type === tab.slice(0, -1)
    );
  }, [items, tab]);

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">Bookmarks</h3>

      {/* TABS */}
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

      {/* LIST */}
      <div className="list-group">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`list-group-item handshake-item d-flex align-items-center ${
              item.type === "post" ? "post-item" : ""
            }`}
          >
            {/* LEFT IMAGE */}
            {(item.type === "speaker" || item.type === "participant") && (
              <img
                src={item.avatar}
                className="avatar me-3"
                alt={item.name}
              />
            )}

            {item.type === "post" && (
              <img
                src={item.authorImage}
                className="avatar me-3"
                alt={item.authorName}
              />
            )}

            {/* CONTENT */}
            <div className="flex-grow-1">
              {item.type === "post" ? (
                <>
                  <div className="post-title">
                    {item.postTitle}
                  </div>

                  <div className="post-content">
                    {item.content}
                  </div>

                  <div className="post-footer d-flex align-items-center gap-2">
                    <img
                      src={item.authorImage}
                      alt={item.authorName}
                      className="post-author-img"
                    />
                    <span className="small text-muted">
                      by <strong>{item.authorName}</strong>
                    </span>
                    <span className="small text-muted ms-2">
                      • {item.date}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="fw-bold">{item.name}</div>
                  <div className="text-muted small">{item.title}</div>
                  <div className="text-muted small">
                    Bookmarked on: {item.date}
                  </div>
                </>
              )}
            </div>

            {/* BUTTON */}
            <button
              className="btn btn-sm btn-outline-dark rounded-pill ms-3 px-3"
              onClick={() => {
                if (item.type === "speaker")
                  navigate(`/speakers/${item.id}`);
                if (item.type === "participant")
                  navigate(`/participants/${item.id}`);
                if (item.type === "post")
                  navigate(`/posts/${item.id}`);
              }}
            >
              View Details
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
}