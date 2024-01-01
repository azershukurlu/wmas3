import React from "react";
import "./style/MyProjects.css";

function MyProjects({ projectName, projectDescription, projectLink }) {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-name">{projectName}</h3>
      </div>
      <div className="project-details">
        <p className="project-description">{projectDescription}</p>
        <a
          className="project-link"
          href={projectLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
        </a>
      </div>
    </div>
  );
}

export default MyProjects;
