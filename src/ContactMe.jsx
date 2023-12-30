import React, { useState } from "react";
import "./style/ContactMe.css";

const ContactMe = () => {
  const [userMessage, setUserMessage] = useState({
    subject: "",
    email: "",
    content: "",
  });

  const handleInputChange = (e) => {
    setUserMessage({ ...userMessage, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { subject, email, content } = userMessage;

    if (!subject || !email || !content) {
      alert("Please fill out all the required fields before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMessage),
      });

      if (response.ok) {
        alert("Message is sent!");
      } else {
        alert("Error occurred while submitting the message. Please try again!");
        console.error("An error occurred while submitting the message.");
      }
    } catch (error) {
      alert("Error occurred while submitting the message. Please try again!");
      console.error("Error:", error);
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Me</h2>
      <form onSubmit={handleFormSubmit} className="custom-contact-form">
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={userMessage.subject}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userMessage.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            name="content"
            value={userMessage.content}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit" className="submit-message-button">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactMe;
