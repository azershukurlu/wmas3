import React, { useState } from "react";

const NewCardComponent = ({ onCreateCardAction, onCancelAction }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const createCardHandler = () => {
    if (!question || !answer) {
      alert("Enter the question and answer details.");
      return;
    }

    onCreateCardAction({ question, answer });
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="create-card-interface">
      <h3>Create Card</h3>
      <label>
        Question:
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </label>
      <label>
        Answer:
        <input
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
        />
      </label>
      <div className="interface-btn">
        <button onClick={createCardHandler}>Save Card</button>
        <button onClick={onCancelAction}>Cancel</button>
      </div>
    </div>
  );
};

export default NewCardComponent;
