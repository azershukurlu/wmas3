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
        alert("Message sent successfully!");
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
      <div className="form-header">
        <h2>Let's Connect</h2>
        <p>Feel free to drop me a message below.</p>
      </div>
      <form onSubmit={handleFormSubmit} className="custom-contact-form">
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={userMessage.subject}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userMessage.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Your Message:</label>
          <textarea
            id="content"
            name="content"
            value={userMessage.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-message-button">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactMe;
