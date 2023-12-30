import React, { useState, useEffect } from "react";
import FlashcardApp from "./FlashcardApp";
import { updateMethod } from "./FlashcardApp";
import "./style/DisplayCards.css";

const DisplayCards = ({ flashCards, onDelete, setFcd }) => {
  const [searchInfo, setSearchInfo] = useState("");
  const [filterInfo, setFilterInfo] = useState("Full");
  const [sortInfo, setSortInfo] = useState("modificationDate");

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
      </div>

      <div className="display-cards">
        {sortedCards.map((card) => (
          <FlashcardApp
            key={card.id}
            flashCard={card}
            flashcards={flashCards}
            onDelete={onDelete}
            onUpdate={(question, answer) =>
              updateMethod(
                card.id,
                question,
                answer,
                card.order,
                flashCards,
                setFcd
              )
            }
            setFcd={setFcd}
            className="display-card"
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCards;
