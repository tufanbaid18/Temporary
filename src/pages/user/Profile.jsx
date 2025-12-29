import { Link } from "react-router";
import { useRef } from "react";
import "../speaker/SpeakerProfile.css";
import { usePersonalDetail } from "../../hooks/profile/usePersonalDetail";
import { useProfessionalDetail } from "../../hooks/profile/useProfessionalDetail";
import { useEducationList } from "../../hooks/profile/useEducationList";
import { useUserProfile } from "../../hooks/profile/useUserProfile"; // fetch latest user
import { useUploadProfileImage } from "../../hooks/profile/useProfileImage";

export default function Profile() {
  const { data: user, isLoading: uLoading } = useUserProfile();
  const { data: personal, isLoading: pLoading } = usePersonalDetail();
  const { data: professional, isLoading: prLoading } = useProfessionalDetail();
  const { data: education, isLoading: eLoading } = useEducationList();

  const uploadImageMutation = useUploadProfileImage();
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const previewURL = URL.createObjectURL(file);
    const imgTag = document.querySelector(".profile-pic");
    if (imgTag) imgTag.src = previewURL;

    // Upload to backend
    const formData = new FormData();
    formData.append("profile_image", file);

    uploadImageMutation.mutate(formData, {
      onSuccess: (data) => {
        // Update image src after successful upload
        if (imgTag)
          imgTag.src = data.profile_image.startsWith("http")
            ? data.profile_image
            : `http://127.0.0.1:8000${data.profile_image}`;
      },
      onError: (err) => {
        console.error(err);
        alert("Failed to upload image");
      },
    });
  };

  const isLoading = uLoading || pLoading || prLoading || eLoading;

  if (isLoading)
    return (
      <div className="loader-wrapper">
        <div className="orbit-trail-true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="mt-3">Loading profile…</p>
      </div>
    );

  /* ================= PROFILE ================= */
  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => window.history.back()}>
        <i className="ri-arrow-left-line me-1"></i> Back
      </button>
      <div className="row g-4">

        {/* ================= LEFT ================= */}
        <div className="col-lg-8">

          {/* ===== PROFILE HEADER ===== */}
          <div className="card shadow-sm border-0 mb-4 fade-up">
            <div className="card-body p-4 d-flex gap-4">

              {/* PHOTO */}
              {/* PHOTO */}
              <div className="position-relative d-inline-block">
                <img
                  src={
                    user?.profile_image
                      ? user.profile_image.startsWith("http")
                        ? user.profile_image
                        : `http://127.0.0.1:8000${user.profile_image}`
                      : "images/Avatar 1.png"
                  }
                  alt="Profile"
                  className="profile-pic rounded-circle shadow"
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />

                {/* Pen icon */}
                <div
                  className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="ri-pencil-line"></i>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>



              <div className="flex-grow-1">

                {/* SOCIAL + LINKS */}
                <div className="d-flex justify-content-between mb-3">
                  <div className="d-flex gap-3 fs-4 text-secondary">
                    {personal?.research_links?.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noreferrer">
                        <i className="ri-links-line"></i>
                      </a>
                    ))}

                    {personal?.linkedin && (
                      <a href={personal.linkedin} target="_blank" rel="noreferrer">
                        <i className="ri-linkedin-box-fill"></i>
                      </a>
                    )}

                    {personal?.x_handle && (
                      <a href={`https://x.com/${personal.x_handle}`} target="_blank" rel="noreferrer">
                        <i className="ri-twitter-x-fill"></i>
                      </a>
                    )}
                  </div>


                  <Link to="/user/profile/edit" className="btn btn-dark rounded-pill">
                    Edit Profile
                  </Link>
                </div>

                {/* NAME */}
                <h3 className="mb-1">
                  {user.title && `${user.title}.`}{" "}
                  {user.first_name} {user.middle_name} {user.last_name}
                </h3>

                <h6 className="text-muted">
                  {professional?.current_role}
                  {professional?.current_organization && (
                    <> · {professional.current_organization}</>
                  )}
                </h6>

                {/* LOCATION */}
                {(personal?.city || personal?.country) && (
                  <div className="mt-3 text-secondary">
                    <i className="ri-map-pin-line me-1"></i>
                    {personal?.city}, {personal?.country}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== ABOUT ===== */}
          <div className="card shadow-sm border-0 fade-up mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">About</h5>
            </div>
            <div className="card-body">
              <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                {personal?.biosketch || "No bio added yet."}
              </p>
            </div>
          </div>

          {/* ===== CURRENT EXPERIENCE ===== */}
          {professional && (
            <div className="card shadow-sm border-0 fade-up mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Current Position</h5>
              </div>
              <div className="card-body small text-secondary">
                <p className="mb-1">
                  <strong>{professional.current_role}</strong>
                  {professional.current_organization && (
                    <> — {professional.current_organization}</>
                  )}
                </p>

                {(professional.current_department ||
                  professional.current_start_month ||
                  professional.current_start_year) && (
                    <p className="mb-1">
                      {professional.current_department && (
                        <span>{professional.current_department}</span>
                      )}
                      {(professional.current_start_month ||
                        professional.current_start_year) && (
                          <>
                            <br />
                            Since {professional.current_start_month}/
                            {professional.current_start_year}
                          </>
                        )}
                    </p>
                  )}

                {professional.current_description && (
                  <p className="mt-2">{professional.current_description}</p>
                )}
              </div>
            </div>
          )}


          {/* ===== EDUCATION ===== */}
          <div className="card shadow-sm border-0 fade-up mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Education</h5>
            </div>
            <div className="card-body">
              {education?.length ? (
                education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <h6 className="fw-bold mb-1">
                      {edu.degree} — {edu.course_name}
                    </h6>

                    <div className="text-muted small">
                      {edu.university || edu.institute} · {edu.country}
                    </div>

                    <div className="text-muted small">
                      {edu.start_year} – {edu.end_year}
                    </div>

                    {edu.research_topic && (
                      <div className="small mt-1">
                        <strong>Research:</strong> {edu.research_topic}
                      </div>
                    )}

                    {edu.research_description && (
                      <p className="small text-secondary mt-1">
                        {edu.research_description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted">No education added.</p>
              )}
            </div>
          </div>

          {/* ===== PAST EXPERIENCE ===== */}
          <div className="card shadow-sm border-0 fade-up">
            <div className="card-header bg-white">
              <h5 className="mb-0">Past Experience</h5>
            </div>
            <div className="card-body">
              {professional?.past_experiences?.length ? (
                professional.past_experiences.map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <h6 className="fw-semibold mb-0">
                      {exp.role} — {exp.organization}
                    </h6>
                    <div className="text-muted small">
                      {exp.start_month}/{exp.start_year} –{" "}
                      {exp.end_month}/{exp.end_year}
                    </div>
                    {exp.description && (
                      <p className="small text-secondary mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted">No past experience added.</p>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="col-lg-4">

          {/* ===== SKILLS ===== */}
          <div className="card shadow-sm border-0 fade-up mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Skills & Languages</h5>
            </div>
            <div className="card-body small text-secondary">
              {professional?.skill_set ? (
                <p className="mb-2">
                  <i className="ri-tools-line me-1"></i>
                  {professional.skill_set}
                </p>
              ) : (
                <p className="text-muted">No skills added.</p>
              )}

              {professional?.languages_spoken && (
                <p className="mb-0">
                  <i className="ri-translate-2 me-1"></i>
                  {professional.languages_spoken}
                </p>
              )}
            </div>
          </div>


          {/* ===== PUBLICATIONS ===== */}
          {/* <div className="card shadow-sm border-0 fade-up">
            <div className="card-header bg-white">
              <h5 className="mb-0">Publications</h5>
            </div>
            <div className="card-body small text-muted">
              <p>{personal?.articles_journals || "No journal articles listed."}</p>
              <p>{personal?.book_chapters || "No book chapters listed."}</p>
            </div>
          </div> */}

          <div className="card shadow-sm border-0 fade-up mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Contact & Work Info</h5>
            </div>
            <div className="card-body small text-secondary">

              {professional?.work_email && (
                <p>
                  <i className="ri-mail-line me-1"></i>
                  {professional.work_email}
                </p>
              )}

              {professional?.contact_number && (
                <p>
                  <i className="ri-phone-line me-1"></i>
                  {professional.contact_number}
                </p>
              )}

              {professional?.website && (
                <p>
                  <i className="ri-global-line me-1"></i>
                  <a href={professional.website} target="_blank" rel="noreferrer">
                    {professional.website}
                  </a>
                </p>
              )}

              {professional?.lab && (
                <p>
                  <i className="ri-flask-line me-1"></i>
                  {professional.lab}
                </p>
              )}

              {professional?.work_address && (
                <p className="mb-0">
                  <i className="ri-map-pin-line me-1"></i>
                  {professional.work_address}
                </p>
              )}

            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
