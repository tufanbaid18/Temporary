import { useState, useEffect } from "react";
import "./ProfileEdit.css";
import {
  useUserProfile,
  useUpdateUserProfile,
} from "../../hooks/profile/useUserProfile";

import {
  usePersonalDetail,
  useUpdatePersonalDetail,
} from "../../hooks/profile/usePersonalDetail";

import {
  useProfessionalDetail,
  useUpdateProfessionalDetail,
} from "../../hooks/profile/useProfessionalDetail";

import {
  useEducationList,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
} from "../../hooks/profile/useEducationList";

import {
  usePastExperienceList,
  useAddPastExperience,
  useUpdatePastExperience,
  useDeletePastExperience,
} from "../../hooks/profile/usePastExperience";





export default function EditProfile() {

  const [activeTab, setActiveTab] = useState("basic");

  // --------------------- FETCH DATA ---------------------
  const { data: userData, isLoading: loadingUser } = useUserProfile();
  const { data: personalData } = usePersonalDetail();
  const { data: professionalData } = useProfessionalDetail();
  const { data: educationData } = useEducationList();
  const { data: pastData } = usePastExperienceList();


  const updateUser = useUpdateUserProfile();
  const updatePersonal = useUpdatePersonalDetail();
  const updateProfessional = useUpdateProfessionalDetail();
  const addEducationMutation = useAddEducation();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();
  const addPastMutation = useAddPastExperience();
  const updatePastMutation = useUpdatePastExperience();
  const deletePastMutation = useDeletePastExperience();




  // --------------------- STATE ---------------------
  const [basic, setBasic] = useState({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    profile_title: "",
  });

  const [personal, setPersonal] = useState({
    city: "",
    country: "",
    gender: "",
    dob: "",
    biosketch: "",
    linkedin: "",
    x_handle: "",
    articles_journals: "",
    book_chapters: "",
    research_links: [],
  });

  const [educationList, setEducationList] = useState([]);
  const [professional, setProfessional] = useState({
    current_role: "",
    current_organization: "",
    current_department: "",
    current_start_month: "",
    current_start_year: "",
    current_description: "",
    work_email: "",
    contact_number: "",
    website: "",
    lab: "",
    work_address: "",
    skill_set: "",
    languages_spoken: "",
  });


  const [pastList, setPastList] = useState([]);



  // --------------------- LOAD DATA INTO STATE ---------------------
useEffect(() => {
  if (userData) {
    setBasic({
      title: userData.title || "",
      first_name: userData.first_name || "",
      middle_name: userData.middle_name || "",
      last_name: userData.last_name || "",
      profile_title: userData.profile_title || "",
    });
  }

  if (personalData) {
    setPersonal({
      city: personalData.city || "",
      country: personalData.country || "",
      gender: personalData.gender || "",
      dob: personalData.dob || "",
      biosketch: personalData.biosketch || "",
      linkedin: personalData.linkedin || "",
      x_handle: personalData.x_handle || "",
      articles_journals: personalData.articles_journals || "",
      book_chapters: personalData.book_chapters || "",
      research_links: personalData.research_links || [],
    });
  }

  if (professionalData) {
    setProfessional({
      current_role: professionalData.current_role || "",
      current_organization: professionalData.current_organization || "",
      current_department: professionalData.current_department || "",
      current_start_month: professionalData.current_start_month || "",
      current_start_year: professionalData.current_start_year || "",
      current_description: professionalData.current_description || "",
      work_email: professionalData.work_email || "",
      contact_number: professionalData.contact_number || "",
      website: professionalData.website || "",
      lab: professionalData.lab || "",
      work_address: professionalData.work_address || "",
      skill_set: professionalData.skill_set || "",
      languages_spoken: professionalData.languages_spoken || "",
    });
  }

  if (educationData) {
    setEducationList(educationData);
  }
}, [userData, personalData, professionalData, educationData]);

useEffect(() => {
  if (pastData) {
    setPastList(pastData);
  }
}, [pastData]);


  // --------------------- HANDLERS ---------------------
  const handleBasicChange = (field, value) => setBasic({ ...basic, [field]: value });
  const handlePersonalChange = (field, value) => setPersonal({ ...personal, [field]: value });
  const handleProfessionalChange = (field, value) =>
    setProfessional({ ...professional, [field]: value });

  const handleEducationChange = (index, field, value) => {
    const newList = [...educationList];
    newList[index][field] = value;
    setEducationList(newList);
  };

  const handlePastChange = (index, field, value) => {
    const newList = [...pastList];
    newList[index][field] = value;
    setPastList(newList);
  };

  const addEducationField = () => {
    setEducationList([
      ...educationList,
      { degree: "", course_name: "", specialization: "", university: "", institute: "", place: "", country: "", start_year: "", end_year: "" },
    ]);
  };

  const removeEducationField = (index) => {
    const toDelete = educationList[index];
    if (toDelete.id) deleteEducationMutation.mutate(toDelete.id);
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const addPastField = () => {
    setPastList([
      ...pastList,
      {
        id: undefined, // ⬅️ force no id
        role: "",
        organization: "",
        department: "",
        start_month: "",
        start_year: "",
        end_month: "",
        end_year: "",
        description: "",
      },
    ]);
  };


  const removePastField = (index) => {
    const toDelete = pastList[index];
    if (toDelete.id) deletePastMutation.mutate(toDelete.id);
    setPastList(pastList.filter((_, i) => i !== index));
  };

  const cleanPayload = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );



  // --------------------- SAVE ---------------------
  const saveBasic = async () => {
    try {
      await updateUser.mutateAsync(basic);
      await updatePersonal.mutateAsync({
        biosketch: personal.biosketch,
        linkedin: personal.linkedin,
        x_handle: personal.x_handle,
        gender: personal.gender,
        dob: personal.dob,
      });
      alert("Basic details saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save basic details");
    }
  };

  const saveEducation = async () => {
    try {
      for (const edu of educationList) {
        if (edu.id) {
          await updateEducationMutation.mutateAsync({ id: edu.id, data: edu });
        } else {
          await addEducationMutation.mutateAsync(edu);
        }
      }
      alert("Education saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save education");
    }
  };

  // const saveWork = async () => {
  //   try {
  //     // save current job
  //     await updateProfessional.mutateAsync(professional);

  //     // sync past experiences
  //     for (const exp of pastList) {
  //       if (exp.id) {
  //         await updatePastMutation.mutateAsync({
  //           id: exp.id,
  //           data: exp,
  //         });
  //       } else {
  //         await addPastMutation.mutateAsync(exp);
  //       }
  //     }

  //     alert("Work experience saved");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to save work experience");
  //   }
  // };

const saveWork = async () => {
  try {
    // Save ONLY current professional info
    await updateProfessional.mutateAsync({
      current_role: professional.current_role,
      current_organization: professional.current_organization,
      current_department: professional.current_department,
      current_start_month: professional.current_start_month,
      current_start_year: professional.current_start_year,
      current_description: professional.current_description,
    });

    // Save past experiences separately
    for (const exp of pastList) {
      if (exp.id) {
        await updatePastMutation.mutateAsync({
          id: exp.id,
          data: exp,
        });
      } else {
        await addPastMutation.mutateAsync(exp);
      }
    }

    alert("Work experience saved");
  } catch (err) {
    console.error(err);
    alert("Failed to save work experience");
  }
};





  const saveContact = async () => {
    try {
      await updateProfessional.mutateAsync({
        work_email: professional.work_email,
        contact_number: professional.contact_number,
        website: professional.website,
        lab: professional.lab,
        work_address: professional.work_address,
        skill_set: professional.skill_set,
        languages_spoken: professional.languages_spoken,
      });
      alert("Contact details saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save contact details");
    }
  };


  if (loadingUser) return <div>Loading...</div>;

  // --------------------- RENDER ---------------------
  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => window.history.back()}>
        <i className="ri-arrow-left-line me-1"></i> Back
      </button>
      <h2 className="mb-4">Edit Profile</h2>
      <div className="profile-edit-wrapper">
        {/* TAB HEADERS */}
        <ul className="nav nav-tabs mb-3 modern-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
              onClick={() => setActiveTab("basic")}
            >
              Basic Information
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "education" ? "active" : ""}`}
              onClick={() => setActiveTab("education")}
            >
              Education
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "work" ? "active" : ""}`}
              onClick={() => setActiveTab("work")}
            >
              Work Experience
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Details
            </button>
          </li>
        </ul>

        <div className="card p-4 shadow-sm border-0">
          {/* ---------------- BASIC TAB ---------------- */}
          {activeTab === "basic" && (
            <div className="tab-content-section">
              <div className="form-section">
                <h6 className="section-title">Personal Details</h6>
                <div className="row g-4 align-items-end">
                  <div className="col-md-2">
                    <label className="form-label">Title</label>
                    <select
                      className="form-select"
                      value={basic.title}
                      onChange={(e) => handleBasicChange("title", e.target.value)}
                    >
                      <option>Dr.</option>
                      <option>Prof.</option>
                      <option>Mr.</option>
                      <option>Ms.</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      value={basic.first_name}
                      onChange={(e) => handleBasicChange("first_name", e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Middle Name</label>
                    <input
                      className="form-control"
                      value={basic.middle_name}
                      onChange={(e) => handleBasicChange("middle_name", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      value={basic.last_name}
                      onChange={(e) => handleBasicChange("last_name", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Profile Title</label>
                    <input
                      className="form-control"
                      value={basic.profile_title}
                      onChange={(e) => handleBasicChange("profile_title", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Biosketch / Summary</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={personal.biosketch}
                      onChange={(e) => handlePersonalChange("biosketch", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">LinkedIn</label>
                    <input
                      className="form-control"
                      value={personal.linkedin}
                      onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">X Handle</label>
                    <input
                      className="form-control"
                      value={personal.x_handle}
                      onChange={(e) => handlePersonalChange("x_handle", e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={personal.gender}
                      onChange={(e) => handlePersonalChange("gender", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={personal.dob || ""}
                      onChange={(e) => handlePersonalChange("dob", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-end">
                <button className="btn btn-primary" onClick={saveBasic}>
                  Save Basic Details
                </button>
              </div>

            </div>
          )}

          {/* ---------------- EDUCATION TAB ---------------- */}
          {activeTab === "education" && (
            <div className="tab-content-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Education</h5>
                <button className="btn btn-outline-success btn-sm" type="button" onClick={addEducationField}>
                  + Add Education
                </button>
              </div>
              {educationList.map((edu, index) => (
                <div key={index} className="border rounded-3 p-3 mb-3 bg-light-subtle">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Education {index + 1}</span>
                    <button className="btn btn-link text-danger p-0" type="button" onClick={() => removeEducationField(index)}>
                      Remove
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label>Degree</label>
                      <input
                        className="form-control"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Course Name</label>
                      <input
                        className="form-control"
                        value={edu.course_name}
                        onChange={(e) => handleEducationChange(index, "course_name", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Specialization</label>
                      <input
                        className="form-control"
                        value={edu.specialization || ""}
                        onChange={(e) => handleEducationChange(index, "specialization", e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Institute</label>
                      <input
                        className="form-control"
                        value={edu.institute || ""}
                        onChange={(e) => handleEducationChange(index, "institute", e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>University</label>
                      <input
                        className="form-control"
                        value={edu.university || ""}
                        onChange={(e) => handleEducationChange(index, "university", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Place</label>
                      <input
                        className="form-control"
                        value={edu.place || ""}
                        onChange={(e) => handleEducationChange(index, "place", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Country</label>
                      <input
                        className="form-control"
                        value={edu.country || ""}
                        onChange={(e) => handleEducationChange(index, "country", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Start Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={edu.start_year || ""}
                        onChange={(e) => handleEducationChange(index, "start_year", e.target.value)}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>End Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={edu.end_year || ""}
                        onChange={(e) => handleEducationChange(index, "end_year", e.target.value)}
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-end">
                <button className="btn btn-primary" onClick={saveEducation}>
                  Save Education
                </button>
              </div>

            </div>
          )}

          {/* ---------------- WORK TAB ---------------- */}
          {activeTab === "work" && (
            <div className="tab-content-section">
              {/* ===== CURRENT EXPERIENCE ===== */}
              <div className="border rounded-3 p-3 mb-3 bg-light-subtle">
                <h5>Current Experience</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Role / Position</label>
                    <input
                      type="text"
                      className="form-control"
                      value={professional.current_role}
                      onChange={(e) => handleProfessionalChange("current_role", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      value={professional.current_organization}
                      onChange={(e) => handleProfessionalChange("current_organization", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={professional.current_department}
                      onChange={(e) => handleProfessionalChange("current_department", e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Start Month</label>
                    <input
                      type="number"
                      className="form-control"
                      value={professional.current_start_month || ""}
                      onChange={(e) => handleProfessionalChange("current_start_month", e.target.value)}
                      placeholder="Between 1-12"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Start Year</label>
                    <input
                      type="number"
                      className="form-control"
                      value={professional.current_start_year || ""}
                      onChange={(e) => handleProfessionalChange("current_start_year", e.target.value)}
                      placeholder="YYYY"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={professional.current_description}
                      onChange={(e) => handleProfessionalChange("current_description", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ===== PAST EXPERIENCES ===== */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Past Experiences</h5>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm rounded-pill"
                  onClick={addPastField}
                >
                  + Add Experience
                </button>
              </div>

              {pastList.map((work, index) => (
                <div key={index} className="border rounded-3 p-3 mb-3 bg-light-subtle work-block">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted">Experience {index + 1}</span>
                    {pastList.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 small"
                        onClick={() => removePastField(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-control"
                        value={work.role}
                        onChange={(e) => handlePastChange(index, "role", e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Organization</label>
                      <input
                        type="text"
                        className="form-control"
                        value={work.organization}
                        onChange={(e) => handlePastChange(index, "organization", e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        value={work.department}
                        onChange={(e) => handlePastChange(index, "department", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Start Month</label>
                      <input
                        type="number"
                        className="form-control"
                        value={work.start_month}
                        onChange={(e) => handlePastChange(index, "start_month", e.target.value)}
                        placeholder="Between 1-12"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Start Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={work.start_year}
                        onChange={(e) => handlePastChange(index, "start_year", e.target.value)}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">End Month</label>
                      <input
                        type="number"
                        className="form-control"
                        value={work.end_month}
                        onChange={(e) => handlePastChange(index, "end_month", e.target.value)}
                        placeholder="Between 1-12"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">End Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={work.end_year}
                        onChange={(e) => handlePastChange(index, "end_year", e.target.value)}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={work.description}
                        onChange={(e) => handlePastChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 text-end">
                <button className="btn btn-primary" onClick={saveWork}>
                  Save Work Experience
                </button>
              </div>



            </div>
          )}


          {/* ---------------- CONTACT TAB ---------------- */}
          {activeTab === "contact" && (
            <div className="tab-content-section">
              <div className="row g-4">
                <div className="col-md-6">
                  <label>Work Email</label>
                  <input
                    className="form-control"
                    value={professional.work_email || ""}
                    onChange={(e) => handleProfessionalChange("work_email", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Contact Number</label>
                  <input
                    className="form-control"
                    value={professional.contact_number || ""}
                    onChange={(e) => handleProfessionalChange("contact_number", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Website</label>
                  <input
                    className="form-control"
                    value={professional.website || ""}
                    onChange={(e) => handleProfessionalChange("website", e.target.value)}
                    placeholder="include https://"
                  />
                </div>
                <div className="col-md-6">
                  <label>Lab / Department</label>
                  <input
                    className="form-control"
                    value={professional.lab || ""}
                    onChange={(e) => handleProfessionalChange("lab", e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>Work Address</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={professional.work_address || ""}
                    onChange={(e) => handleProfessionalChange("work_address", e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label>Skills</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={professional.skill_set || ""}
                    onChange={(e) =>
                      handleProfessionalChange("skill_set", e.target.value)
                    }
                    placeholder="e.g. React, Django, Machine Learning"
                  />
                </div>

                <div className="col-12 mt-2">
                  <label>Languages Spoken</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={professional.languages_spoken || ""}
                    onChange={(e) =>
                      handleProfessionalChange("languages_spoken", e.target.value)
                    }
                    placeholder="e.g. English, Hindi, French"
                  />
                </div>

              </div>
              <div className="mt-4 text-end">
                <button className="btn btn-primary" onClick={saveContact}>
                  Save Contact
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
