import React, { useState, useEffect, useRef } from "react";

const currentDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const updateMethod = async (
  id,
  question,
  answer,
  order,
  flashcards,
  setFlashcards
) => {
  try {
    const updatedCard = flashcards.map((card) => {
      if (card.id === id) {
        return {
          ...card,
          question,
          answer,
          order,
        };
      }
      return card;
    });

    await fetch(`http://localhost:3000/cardData/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order,
      }),
    });

    const orderFixed = updatedCard
      .filter((card) => card.id !== id)
      .map((card) =>
        fetch(`http://localhost:3000/cardData/${card.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: card.order,
          }),
        })
      );

    await Promise.all(orderFixed);

    setFlashcards(updatedCard);
  } catch (error) {
    console.error("Encountered error while updating card:", error);
  }
};

export { updateMethod };

const FlashcardApp = ({
  flashCard,
  onDelete,
  onUpdate,
  flashcards,
  setFlashcards,
  selectedCard,
}) => {
  const questionElement = useRef();
  const answerElement = useRef();
  const [editedQuestion, setEditedQuestion] = useState(flashCard.question);
  const [editedAnswer, setEditedAnswer] = useState(flashCard.answer);
  const [status, setStatus] = useState(flashCard.status || "Want to Learn");
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState("initial");
  const [currMode, setCurrMode] = useState(false);

  const clickEvent = () => {
    if (!currMode) {
      setFlip(!flip);
    }
  };

  const mouseEventEnter = () => {
    setHeight("auto");
  };

  const mouseEventLeave = () => {
    setHeight("initial");
  };

  const deleteEvent = (event) => {
    event.stopPropagation();
    onDelete(flashCard.id);
  };

  const editEvent = (event) => {
    event.stopPropagation();
    setCurrMode(true);
  };

  const updateEvent = (event) => {
    event.stopPropagation();
    setCurrMode(false);
    setFlip(!flip);
    onUpdate(editedQuestion, editedAnswer);
    if (selectedCard.includes(flashCard.id)) {
      updateSelectedCard(editedQuestion, editedAnswer);
    }
  };

  const updateSelectedCard = (question, answer) => {
    const updatedCards = flashcards.map((card) =>
      selectedCard.includes(card.id)
        ? { ...card, question, answer, modificationDate: currentDate }
        : card
    );

    fetch("http://localhost:3000/cardData", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCards),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Updating selected cards failed...");
          throw new Error("Updating selected cards failed...");
        }
        return response.json();
      })
      .then((updatedCards) => {
        setFlashcards(updatedCards);
      })
      .catch((error) => {
        console.error("Error occurred while updating selected cards:", error);
      });
  };

  const statusHandler = (event) => {
    event.stopPropagation();
    const updatedStatus = status === "Want to Learn" ? "Noted" : "Learned";
    fetch(`http://localhost:3000/cardData/${flashCard.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: updatedStatus,
        modificationDate: currentDate,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error occurred while updating the status...");
          throw new Error("Error occurred while updating the status...");
        }
        return response.json();
      })
      .then((updatedCard) => {
        setFlashcards((prev) =>
          prev.map((prevCard) =>
            prevCard.id === updatedCard.id ? updatedCard : prevCard
          )
        );
        setStatus(updatedStatus);
      })
      .catch((error) => {
        console.error("Error occurred while updating the status:", error);
      });
  };

  useEffect(() => {
    setEditedQuestion(flashCard.question);
    setEditedAnswer(flashCard.answer);
  }, [flashCard]);

  function changeHandlerQuestion(event) {
    setEditedQuestion(event.target.value);
  }

  function changeHandlerAnswer(event) {
    setEditedAnswer(event.target.value);
  }

  return (
    <div
      key={flashCard.id}
      className={`card ${flip ? "flip" : ""} ${currMode ? "editing" : ""}`}
      style={{ height: height }}
      onClick={clickEvent}
      onMouseEnter={mouseEventEnter}
      onMouseLeave={mouseEventLeave}
    >
      {currMode ? (
        <>
          <input
            type="text"
            value={editedQuestion}
            onChange={changeHandlerQuestion}
            onClick={(event) => event.stopPropagation()}
          />
          <input
            type="text"
            value={editedAnswer}
            onChange={changeHandlerAnswer}
            onClick={(event) => event.stopPropagation()}
          />
          <button onClick={updateEvent}>Update</button>
        </>
      ) : (
        <>
          <div className="question" ref={questionElement}>
            {editedQuestion}
          </div>
          <div className="answer" ref={answerElement}>
            <div className={`answer ${flip ? "rotated" : ""}`}>
              {editedAnswer}
            </div>
            {flip && status !== "Learned" && (
              <button className="update-status" onClick={statusHandler}>
                Update Status
              </button>
            )}
          </div>
          {height === "auto" && (
            <div className="actions">
              <button onClick={deleteEvent}>Delete</button>
              <button onClick={editEvent}>Edit</button>
            </div>
          )}
          <div className={`status-location ${flip ? "rotated" : ""}`}>
            {status}
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardApp;