import React, { useState, useEffect } from "react";
import FlashcardApp from "./FlashcardApp";
import { updateMethod } from "./FlashcardApp";
import NewCardComponent from "./NewCardComponent";
import "./style/DisplayCards.css";

const DisplayCards = ({ onDelete, setfcd: setFcd }) => {
  const [searchInfo, setSearchInfo] = useState("");
  const [flashCards, setFlashCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState([]);
  const [filterInfo, setFilterInfo] = useState("Full");
  const [sortInfo, setSortInfo] = useState("modificationDate");
  const [addCardVisibility, setAddCardVisibility] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];

  const sortedCards = flashCards
    .filter((card) => {
      const questionContext = String(card.question);
      const answerContext = String(card.answer);

      return (
        questionContext.toLowerCase().includes(searchInfo.toLowerCase()) ||
        answerContext.toLowerCase().includes(searchInfo.toLowerCase())
      );
    })
    .filter((card) => {
      const cardStatus = card.status ? card.status : "unknown";
      return (
        filterInfo === "Full" ||
        (cardStatus && cardStatus.toLowerCase() === filterInfo.toLowerCase())
      );
    })
    .sort((first, second) => {
      if (sortInfo === "id") {
        return first.id - second.id;
      } else if (sortInfo === "question") {
        return first.question.localeCompare(second.question);
      } else if (sortInfo === "answer") {
        return first.answer.localeCompare(second.answer);
      } else if (sortInfo === "modificationDate") {
        return (
          new Date(second.modificationDate) - new Date(first.modificationDate)
        );
      }
      return 0;
    });

  const createCardHandler = (createdCard) => {
    fetch("http://localhost:3000/cardData?_sort=id&_order=desc&_limit=1")
      .then((response) => response.json())
      .then(([lastCard]) => {
        const newId = lastCard ? lastCard.id + 1 : 1;
        fetch("http://localhost:3000/cardData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: createdCard.question,
            answer: createdCard.answer,
            status: "Want to Learn",
            modificationDate: currentDate,
            order: newId,
          }),
        })
          .then((response) => response.json())
          .then((cardCreated) => {
            setFlashCards([...flashCards, cardCreated]);
            setAddCardVisibility(false);
          })
          .catch((error) => {
            console.error("Error occurred while creating the card:", error);
          });
      })
      .catch((error) => {
        console.error("Error occurred while fetching the latest card:", error);
      });
  };

  const checkboxChangeHandler = (cardId) => {
    if (selectedCard.includes(cardId)) {
      setSelectedCard((prev) => prev.filter((id) => id !== cardId));
    } else {
      setSelectedCard((prev) => [...prev, cardId]);
    }
  };

  const shareHandler = () => {
    const cardDetails = selectedCard.map((cardId) => {
      const selectedCard = flashCards.find((card) => card.id === cardId);
      return {
        id: selectedCard.id,
        question: selectedCard.question,
        answer: selectedCard.answer,
        modificationDate: selectedCard.modificationDate,
        status: selectedCard.status,
        order: selectedCard.order,
      };
    });

    const emailBody = JSON.stringify(cardDetails, null, 2);
    const emailSubject = "Selected Flash Cards";

    window.location.href = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <div>
      <div className="display-cards">
        <input
          type="text"
          placeholder="Search cards"
          value={searchInfo}
          onChange={(event) => setSearchInfo(event.target.value)}
          className="search-filter-sort"
        />
        <select
          value={filterInfo}
          onChange={(event) => setFilterInfo(event.target.value)}
          className="select-box"
        >
          <option value="Full">Full</option>
          <option value="Want to Learn">Want to Learn</option>
          <option value="Noted">Noted</option>
          <option value="Learned">Learned</option>
        </select>
        <select
          value={sortInfo}
          onChange={(event) => setSortInfo(event.target.value)}
          className="select-box"
        >
          <option value="id">ID</option>
          <option value="question">Question</option>
          <option value="answer">Answer</option>
          <option value="modificationDate">Modification Date</option>
        </select>
        <button
          className={`btn create-card-btn ${
            selectedCard.length > 0 ? "selected-card" : ""
          }`}
          onClick={() => setAddCardVisibility(true)}
        >
          Create Card
        </button>
        <button
          className="btn share-card-btn"
          onClick={shareHandler}
          style={{
            visibility: selectedCard.length > 0 ? "visible" : "hidden",
          }}
        >
          Share Card
        </button>
      </div>
      {addCardVisibility && (
        <div className="create-card-form">
          <NewCardComponent
            onCreateCardAction={createCardHandler}
            onCancelAction={() => setAddCardVisibility(false)}
          />
        </div>
      )}
      <div className="display-cards">
        {sortedCards.map((card) => (
          <FlashcardApp
            key={card.id}
            flashCard={card}
            flashCards={flashCards}
            onDelete={onDelete}
            onUpdate={(id, question, answer, flashCards, order) =>
              updateMethod(id, question, answer, order, flashCards, setFcd)
            }
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            onCheckboxChange={checkboxChangeHandler}
            setFcd={setFcd}
            className="display-card"
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCards;
