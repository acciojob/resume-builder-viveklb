
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { persistResume } from "../store";
import "./../styles/App.css";

const sections = ["Profile", "Education", "Skills", "Projects", "Social Media"];

const field = (label, name, value, onChange, type = "text", placeholder = "") => (
  <label className="field" key={name}>
    <span>{label}</span>
    <input name={name} type={type} value={value} placeholder={placeholder} onChange={onChange} />
  </label>
);

const App = () => {
  const resume = useSelector((state) => state);
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const updateProfile = (event) => {
    dispatch({ type: "UPDATE_PROFILE", field: event.target.name, value: event.target.value });
  };

  const updateEntry = (section, index, event) => {
    dispatch({ type: "UPDATE_ENTRY", section, index, field: event.target.name, value: event.target.value });
  };

  const save = () => {
    const savedAt = new Date().toISOString();
    const savedResume = { ...resume, savedAt };
    persistResume(savedResume);
    dispatch({ type: "MARK_SAVED", savedAt });
    setNotice("Resume saved on this device");
  };

  const load = () => {
    try {
      const saved = window.localStorage.getItem("resume-builder-data");
      if (saved) {
        dispatch({ type: "LOAD_RESUME", resume: JSON.parse(saved) });
        setNotice("Saved resume loaded");
      } else {
        setNotice("No saved resume on this device yet");
      }
    } catch (error) {
      setNotice("The saved resume could not be loaded");
    }
  };

  const goForward = (shouldSave = false) => {
    if (shouldSave) save();
    if (step < sections.length - 1) {
      setStep(step + 1);
      setNotice("");
    } else {
      setShowPreview(true);
    }
  };

  const addEntry = (section, entry) => dispatch({ type: "ADD_ENTRY", section, entry });
  const deleteEntry = (section, index) => dispatch({ type: "DELETE_ENTRY", section, index });

  const renderProfile = () => (
    <div className="field-grid">
      {field("First name", "fname", resume.profile.fname, updateProfile, "text", "e.g. Alex")}
      {field("Last name", "lname", resume.profile.lname, updateProfile, "text", "e.g. Morgan")}
      {field("Phone number", "phone", resume.profile.phone, updateProfile, "tel", "+1 555 012 3456")}
      {field("Address", "address", resume.profile.address, updateProfile, "text", "City, Country")}
      <div className="field-grid__wide">
        {field("Profile photo URL", "url", resume.profile.url, updateProfile, "url", "https://example.com/photo.jpg")}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="entry-list">
      {resume.education.map((entry, index) => (
        <section className="entry" key={`education-${index}`}>
          <div className="entry__heading"><span>Qualification {String(index + 1).padStart(2, "0")}</span>
            <button className="text-button" id="delete" type="button" onClick={() => deleteEntry("education", index)} aria-label={`Delete qualification ${index + 1}`}>Remove</button>
          </div>
          <div className="field-grid">
            {field("Course or degree", "courseName", entry.courseName, (event) => updateEntry("education", index, event), "text", "Bachelor of Science")}
            {field("Completion year", "completionYear", entry.completionYear, (event) => updateEntry("education", index, event), "text", "2024")}
            {field("College or institution", "college", entry.college, (event) => updateEntry("education", index, event), "text", "University name")}
            {field("Grade or percentage", "percentage", entry.percentage, (event) => updateEntry("education", index, event), "text", "3.8 GPA / 92%")}
          </div>
        </section>
      ))}
      <button className="add-button" id="add_education" type="button" onClick={() => addEntry("education", { courseName: "", completionYear: "", college: "", percentage: "" })}><span>+</span> Add education</button>
    </div>
  );

  const renderSkills = () => (
    <div className="entry-list entry-list--compact">
      {resume.skills.map((entry, index) => (
        <div className="skill-row" key={`skill-${index}`}>
          {field(`Skill ${String(index + 1).padStart(2, "0")}`, "skill", entry.skill, (event) => updateEntry("skills", index, event), "text", "e.g. Product strategy")}
          <button className="icon-button" id="delete_skill" type="button" onClick={() => deleteEntry("skills", index)} aria-label={`Delete skill ${index + 1}`} title="Remove skill">×</button>
        </div>
      ))}
      <button className="add-button" id="add_skill" type="button" onClick={() => addEntry("skills", { skill: "" })}><span>+</span> Add a skill</button>
    </div>
  );

  const renderProjects = () => (
    <div className="entry-list">
      {resume.projects.map((entry, index) => (
        <section className="entry" key={`project-${index}`}>
          <div className="entry__heading"><span>Project {String(index + 1).padStart(2, "0")}</span>
            <button className="text-button" id="delete" type="button" onClick={() => deleteEntry("projects", index)} aria-label={`Delete project ${index + 1}`}>Remove</button>
          </div>
          <div className="field-grid">
            {field("Project name", "projectName", entry.projectName, (event) => updateEntry("projects", index, event), "text", "A project worth sharing")}
            {field("Technologies", "techStack", entry.techStack, (event) => updateEntry("projects", index, event), "text", "React, Node.js, PostgreSQL")}
            <label className="field field-grid__wide"><span>Description</span><textarea name="description" value={entry.description} placeholder="What did you build, and what changed because of it?" onChange={(event) => updateEntry("projects", index, event)} rows="3" /></label>
          </div>
        </section>
      ))}
      <button className="add-button" id="add_project" type="button" onClick={() => addEntry("projects", { projectName: "", techStack: "", description: "" })}><span>+</span> Add project</button>
    </div>
  );

  const renderSocial = () => (
    <div className="entry-list entry-list--compact">
      {resume.social.map((entry, index) => (
        <div className="social-row" key={`social-${index}`}>
          {field(`Social link ${String(index + 1).padStart(2, "0")}`, "Social", entry.value, (event) => updateEntry("social", index, { target: { name: "value", value: event.target.value } }), "url", "https://linkedin.com/in/yourname")}
          <button className="icon-button" id="delete" type="button" onClick={() => deleteEntry("social", index)} aria-label={`Delete social link ${index + 1}`} title="Remove link">×</button>
        </div>
      ))}
      <button className="add-button" id="add_social" type="button" onClick={() => addEntry("social", { value: "" })}><span>+</span> Add social link</button>
    </div>
  );

  const renderSection = () => {
    if (step === 0) return renderProfile();
    if (step === 1) return renderEducation();
    if (step === 2) return renderSkills();
    if (step === 3) return renderProjects();
    return renderSocial();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Northstar resume builder"><span className="brand__mark">N</span><span>northstar<span className="brand__dot">.</span></span></a>
        <div className="topbar__actions">
          <span className="save-state">{resume.savedAt ? "Saved" : "Draft"}</span>
          <button className="quiet-button" type="button" id="load_resume" onClick={load}>Load saved</button>
          <button className="save-button" type="button" id="save" onClick={save}>Save resume</button>
        </div>
      </header>

      <div className="workspace" id="top">
        <aside className="sidebar">
          <p className="eyebrow">RESUME WORKSPACE</p>
          <h1>Make your next move count.</h1>
          <p className="sidebar__copy">A clear story, built one detail at a time.</p>
          <nav className="step-nav" aria-label="Resume sections">
            {sections.map((section, index) => (
              <button className={`step-nav__item ${step === index ? "is-active" : ""} ${step > index ? "is-complete" : ""}`} key={section} type="button" onClick={() => { setStep(index); setShowPreview(false); }}>
                <span className="step-nav__number">{step > index ? "✓" : `0${index + 1}`}</span><span>{section}</span><span className="step-nav__arrow">›</span>
              </button>
            ))}
            <button className={`step-nav__item ${showPreview ? "is-active" : ""}`} type="button" onClick={() => setShowPreview(true)}><span className="step-nav__number">↗</span><span>Preview</span><span className="step-nav__arrow">›</span></button>
          </nav>
          <div className="sidebar__foot"><span className="status-dot" /> Saved resumes stay on this device</div>
        </aside>

        <section className="editor">
          <div className="editor__topline"><span>{showPreview ? "FINAL REVIEW" : `STEP 0${step + 1} / 05`}</span><span>EST. 3 MIN</span></div>
          {showPreview ? (
            <div className="preview-wrap">
              <div className="section-heading"><div><p className="eyebrow">YOUR DOCUMENT</p><h2>Resume preview</h2></div><button className="quiet-button" type="button" onClick={() => window.print()}>Print / Save PDF</button></div>
              <article className="resume-paper">
                {resume.profile.url && <img className="resume-photo" src={resume.profile.url} alt="Profile" onError={(event) => { event.currentTarget.hidden = true; }} />}
                <h2>{[resume.profile.fname, resume.profile.lname].filter(Boolean).join(" ") || "Your name"}</h2>
                <p className="resume-contact">{[resume.profile.phone, resume.profile.address].filter(Boolean).join(" · ")}</p>
                <ResumeGroup title="Education">{resume.education.filter((item) => Object.values(item).some(Boolean)).map((item, index) => <div className="resume-item" key={`resume-edu-${index}`}><strong>{item.courseName}</strong><span>{[item.college, item.completionYear, item.percentage].filter(Boolean).join(" · ")}</span></div>)}</ResumeGroup>
                <ResumeGroup title="Skills"><p>{resume.skills.map((item) => item.skill).filter(Boolean).join("  /  ") || "Add your skills to complete this section."}</p></ResumeGroup>
                <ResumeGroup title="Projects">{resume.projects.filter((item) => Object.values(item).some(Boolean)).map((item, index) => <div className="resume-item" key={`resume-project-${index}`}><strong>{item.projectName}</strong><span>{item.techStack}</span><p>{item.description}</p></div>)}</ResumeGroup>
                <ResumeGroup title="Find me online">{resume.social.map((item) => item.value).filter(Boolean).map((value) => <p className="resume-social" key={value}>{value}</p>)}</ResumeGroup>
              </article>
              <button className="save-button preview-save" type="button" onClick={save}>Save resume</button>
            </div>
          ) : (
            <>
              <div className="section-heading"><div><p className="eyebrow">BUILD YOUR STORY</p><h2>{sections[step]}</h2><p className="section-heading__copy">{step === 0 ? "Start with the details people use to reach you." : step === 1 ? "Add the education that shaped your path." : step === 2 ? "Choose the strengths you want to be known for." : step === 3 ? "Show what you made and how you made it." : "Add the places people can find your work."}</p></div><span className="heading-index">0{step + 1}</span></div>
              <div className="form-surface">{renderSection()}</div>
              {notice && <p className="notice" role="status">{notice}</p>}
              <div className="form-footer">
                <button className="back-button" id="back" type="button" onClick={() => { if (step > 0) setStep(step - 1); else setShowPreview(false); }} disabled={step === 0}>Back</button>
                <div className="form-footer__right"><span className="step-count">{String(step + 1).padStart(2, "0")} <i>/</i> 05</span><button className="continue-button" id={step === 0 ? "next" : "save_continue"} type="button" onClick={() => goForward(step > 0)}> {step === sections.length - 1 ? "Save & preview" : step === 0 ? "Next section" : "Save & continue"}<span aria-hidden="true">→</span></button></div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

const ResumeGroup = ({ title, children }) => (
  <section className="resume-group"><h3>{title}</h3><div>{children}</div></section>
);

export default App;
