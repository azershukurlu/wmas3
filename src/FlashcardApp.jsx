import React, { useRef, useState, useEffect } from "react";

import "./style/FlashcardApp.css";

const currentDate = new Date().toISOString().split("T")[0];
const updateMethod = async (
  id,
  question,
  answer,
  order,
  flashCards,
  setFlashCards
) => {
  try {
    const updatedCard = flashCards.map((card) => {
      if (card.id === id) {
        return {
          ...card,
          question,
          answer,
          order,
          modificationDate: currentDate,
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
        question,
        answer,
        order,
        modificationDate: currentDate,
      }),
    });

    const promiseOrder = updatedCard
      .filter((card) => card.id !== id)
      .map((card) => {
        return fetch(`http://localhost:3000/cardData/${card.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: card.order,
          }),
        });
      });

    await Promise.all(promiseOrder);

    setFlashCards(updatedCard);
  } catch (error) {
    console.error("Error occurred while updating the card:", error);
  }
};
const FlashcardApp = ({
  flashCard,
  onDelete,
  flashCards,
  setFlashCards,
  selectedCards,
  setSelectedCards,
  allowDrag,
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
    updateMethod(
      flashCard.id,
      editedQuestion,
      editedAnswer,
      flashCards.findIndex((card) => card.id === flashCard.id) + 1,
      flashCards,
      setFlashCards
    );
    if (selectedCards.includes(flashCard.id)) {
      updateSelectedCards(editedQuestion, editedAnswer);
    }
  };

  const updateSelectedCards = (question, answer) => {
    const updatedCards = flashCards.map((card) =>
      selectedCards.includes(card.id)
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
        setFlashCards(updatedCards);
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
        setFlashCards((prev) =>
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

  const checkboxHandler = (id) => {
    setSelectedCards((prev) =>
      prev.includes(id)
        ? prev.filter((selected) => selected !== id)
        : [...prev, id]
    );
  };

  function dragHandler(event, flashCard) {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: flashCard.id, order: flashCard.order })
    );
  }

  function dragHandlerEnd(event) {
    event.target.style.background = "white";
  }

  function dragHandlerOver(event) {
    event.preventDefault();
  }

  const dropHandler = (event, target) => {
    event.preventDefault();

    const draggedCard = JSON.parse(event.dataTransfer.getData("text/plain"));
    const draggedID = draggedCard.id;
    const draggedOrder = draggedCard.order;

    if (draggedID && target) {
      const draggedUpdated = {
        ...flashCards.find((card) => card.id === draggedID),
        order: target.order,
      };

      const targetUpdated = {
        ...flashCards.find((card) => card.id === target.id),
        order: draggedOrder,
      };

      const updatedCards = flashCards.map((card) => {
        if (card.id === target.id) {
          return draggedUpdated;
        }
        if (card.id === draggedID) {
          return targetUpdated;
        }
        return card;
      });

      const promiseOrder = updatedCards.map((card) =>
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

      Promise.all(promiseOrder)
        .then(() => {
          const uniqueCard = [
            ...new Map(updatedCards.map((card) => [card.id, card])).values(),
          ];
          setFlashCards(uniqueCard);
        })
        .catch((error) => {
          console.error("Error occurred while updating the order:", error);
        });
    } else {
      console.error(
        "The dragged card or target card is invalid:",
        draggedID,
        target
      );
    }
    event.target.style.background = "white";
  };

  const renderEditMode = () => (
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
      <button onClick={(event) => updateEvent(event)}>Update</button>
    </>
  );

  const renderViewMode = () => (
    <>
      {!flip && (
        <div className="check-box" onClick={(event) => event.stopPropagation()}>
          <input
            type="checkbox"
            checked={selectedCards.includes(flashCard.id)}
            onChange={() => {}}
            onClick={() => checkboxHandler(flashCard.id)}
          />
        </div>
      )}
      <div className="question" ref={questionElement}>
        {editedQuestion}
      </div>
      <div className="answer" ref={answerElement}>
        <div className={flip ? "rotated" : ""}></div>
        {editedAnswer}
        {flip && status !== "Learned" && (
          <button className="update-status" onClick={statusHandler}>
            Change Status
          </button>
        )}
      </div>
      {height === "auto" && (
        <div className="actions">
          <button onClick={deleteEvent}>Delete</button>
          <button onClick={editEvent}>Edit</button>
        </div>
      )}
      <div className={`status-location ${flip ? "rotated" : ""}`}>{status}</div>
    </>
  );

  return (
    <div
      key={flashCard.id}
      className={`card ${flip ? "flip" : ""} ${currMode ? "editing" : ""}`}
      style={{ height: height }}
      onClick={clickEvent}
      onMouseEnter={mouseEventEnter}
      onMouseLeave={mouseEventLeave}
      onDragStart={(event) => {
        dragHandler(event, flashCard);
      }}
      onDragLeave={(event) => {
        dragHandlerEnd(event);
      }}
      onDragEnd={(event) => {
        dragHandlerOver(event);
      }}
      onDragOver={(event) => {
        dragHandlerOver(event);
      }}
      onDrop={(event) => {
        dropHandler(event, flashCard);
      }}
      draggable={allowDrag}
    >
      {currMode ? renderEditMode() : renderViewMode()}
    </div>
  );
};

export { updateMethod };

export default FlashcardApp;
