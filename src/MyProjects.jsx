import React from "react";

function MyProjects({ projectName, projectDescription, projectLink }) {
  const clickEventHandler = () => {
    window.open(projectLink, "_blank");
  };

  return (
    <li className="projects-container" onClick={clickEventHandler}>
      <b className="list-projects">{projectName}:</b> {projectDescription}
    </li>
  );
}

export default MyProjects;
