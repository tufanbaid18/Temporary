import React from "react";
import { useNavigate } from "react-router";
import "./SpeakersList.css";
import { useSpeakers } from "../../hooks/speakers/useSpeakers";



export default function SpeakersList() {
  const nav = useNavigate();

  const { data: speakers, error, isLoading } = useSpeakers();

  if (isLoading)
    return (
      <div className="loading-screen d-flex flex-column justify-content-center align-items-center">
        <div className="spinner"></div>
        <p className="mt-3 text-muted fs-5">Loading speakers...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-screen d-flex flex-column justify-content-center align-items-center">
        <i className="ri-error-warning-line error-icon"></i>
        <p className="text-danger fs-5 mt-2">Error loading speakers.</p>
        <small className="text-muted">Please try again later.</small>
      </div>
    );

  return (
    <div className="container py-3">
      <div className="row g-4">

        {speakers.map((s, i) => (
          <div
            className="col-12 col-sm-6 col-md-2 fade-item"
            style={{ animationDelay: `${i * 0.05}s` }}
            key={s.id}
          >
            <div
              className="text-center p-2"
              style={{ cursor: "pointer" }}
              onClick={() => nav(`/speakers/${s.id}`)}
            >
              <img
                src={s.profile_image || "https://i.pravatar.cc/100"}
                alt={s.name}
                className="speaker-img"
                onError={(e) => {
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = "https://i.pravatar.cc/100";
                }}
              />

              <h5 className="mt-3 mb-1">{s.first_name} {s.last_name}</h5>
              <p className="text-muted small">{s.role}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}