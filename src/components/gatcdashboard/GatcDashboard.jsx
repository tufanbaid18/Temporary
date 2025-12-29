import { Link } from "react-router";
import "./GatcDashboard.css";

export default function GatcDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="userdash-wrapper">

      {/* GATC PROGRAM BANNER */}
      <div className="gatc-banner-section">
        {/* Banner Image */}
        <div className="gatc-banner-image">
          {/* You can replace with actual image */}
        </div>

        {/* User Profile Card */}
        <div className="container">
          <div className="user-profile-card">
            <div className="profile-header">
              {user.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${user.profile_image}`}
                  alt="Profile"
                  className="user-photo"
                />
              ) : (
                <div
                  className="user-photo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#70a83e",
                    color: "#fff",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    fontSize: "30px",
                  }}
                >
                  {`${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`}
                </div>
              )}

              <div className="user-basic-info">
                <h2 className="user-name">{user.first_name} {user.last_name}</h2>
                <p className="user-category">{user.profile_title || "Researcher • Speaker"}</p>
              </div>
            </div>

            {/* User Information */}
            <div className="user-info-section">
              <div className="info-row">


                <div className="info-item">
                  
                  <i className="ri-map-pin-line info-icon"></i>
                  <div>
                    <div className="info-label">Venue Details</div>
                    <div className="info-value">Main Auditorium, Hall A</div>
                  </div>
                </div>

                {/* <div className="info-item">
                  <i className="ri-hospital-line info-icon"></i>
                  <div>
                    <div className="info-label">Hospital/Others</div>
                    <div className="info-value">{user.hospital || "AIIMS New Delhi"}</div>
                  </div>
                </div> */}
              </div>

              <div className="info-row">
                <div className="info-item">
                  <i className="ri-building-line info-icon"></i>
                  <div>
                    <div className="info-label">Institute/Organization</div>
                    <div className="info-value">{user.organization || "IISc Bangalore"}</div>
                  </div>
                </div>

                {/* <div className="info-item">
                  <i className="ri-user-star-line info-icon"></i>
                  <div>
                    <div className="info-label">Key Advisors</div>
                    <div className="info-value">8 Available</div>
                  </div>
                </div> */}

                {/* <div className="info-item">
                  <i className="ri-user-follow-line info-icon"></i>
                  <div>
                    <div className="info-label">Following</div>
                    <div className="info-value">24 Speakers</div>
                  </div>
                </div> */}

                {/* <div className="info-item">
                  <i className="ri-hand-heart-line info-icon"></i>
                  <div>
                    <div className="info-label">My Handshakes</div>
                    <div className="info-value">12 Connections</div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Brief Agenda */}
            <div className="agenda-section">
              <div className="agenda-header">
                <i className="ri-calendar-check-line"></i>
                <h5>Brief Agenda</h5>
              </div>

              <div className="agenda-items">
                <div className="agenda-item">
                  <div className="agenda-time">09:00 AM</div>
                  <div className="agenda-details">
                    <div className="agenda-title">Registration & Networking</div>
                    <div className="agenda-location">Main Lobby</div>
                  </div>
                </div>

                <div className="agenda-item">
                  <div className="agenda-time">10:30 AM</div>
                  <div className="agenda-details">
                    <div className="agenda-title">Keynote: AI in Drug Discovery</div>
                    <div className="agenda-location">Hall A - Dr. Maya Rangan</div>
                  </div>
                </div>

                <div className="agenda-item">
                  <div className="agenda-time">02:00 PM</div>
                  <div className="agenda-details">
                    <div className="agenda-title">Panel Discussion on CRISPR</div>
                    <div className="agenda-location">Hall B - Multiple Speakers</div>
                  </div>
                </div>
              </div>

              {/* <Link to="/agenda" className="view-full-agenda-btn">
                <span>View Full Agenda</span>
                <i className="ri-arrow-right-line"></i>
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="container py-4">
        <div className="row">

          <div className="col-lg-8 col-xl-9">

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="stat-box">
                  <div>
                    <div className="h4 mb-0 fw-bold">3</div>
                    <div className="text-muted small">Upcoming Sessions</div>
                  </div>
                  <i className="ri-calendar-event-line stat-icon"></i>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-box">
                  <div>
                    <div className="h4 mb-0 fw-bold">12</div>
                    <div className="text-muted small">Saved Papers</div>
                  </div>
                  <i className="ri-file-list-3-line stat-icon"></i>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-box">
                  <div>
                    <div className="h4 mb-0 fw-bold">4</div>
                    <div className="text-muted small">Handshake Requests</div>
                  </div>
                  <i className="ri-hand-heart-line stat-icon"></i>
                </div>
              </div>
            </div>


          </div>


          <div className="col-lg-4 col-xl-3">

          </div>
        </div>
      </div> */}
    </div>
  );
}