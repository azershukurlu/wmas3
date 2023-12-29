import React from "react";
import MyProjects from "./MyProjects";

function HomePage() {
  const featuredProjects = [
    {
      projectName: "Fetching Products from DummyJson API",
      projectDescription:
        "This project's aim is to fetch products from dummyjson API and display them dynamically. It offers features including sort, filter, search, etc.",
      projectLink: "https://github.com/azershukurlu/Web-Mobile-Assignment-2",
    },
    {
      projectName: "Online Portfolio",
      projectDescription: "This is my online portfolio project.",
      projectLink: "https://azershukurlu.github.io/portfolio/",
    },
    {
      projectName: "Digital Card",
      projectDescription:
        "A digital card of me, displaying my information and contact/media details.",
      projectLink: "https://azershukurlu.github.io/azer-new-digital-card/",
    },
  ];

  return (
    <div className="main-container">
      <h1>Greetings from My Digital Space!</h1>
      <p>
        I am a 4th year IT student; also I am vice-manager at Zagulba palace. In
        life my aim is to be worthy of my family, my country, and my
        surrounding.
      </p>
      <ul className="project-container">
        {featuredProjects.map((project, index) => (
          <MyProjects key={index} {...project} />
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
