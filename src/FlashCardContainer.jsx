import React, { useState, useEffect } from "react";

const FlashCardContainer = () => {
  const [flashCards, setFlashCards] = useState([]);

  const deleteHandler = (id) => {
    const updatedCards = flashCards.filter((card) => card.id !== id);
    setFlashCards(updatedCards);

    fetch(`http://localhost:3000/cardData/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error occurred while deleting the card...");
        }
      })
      .catch((error) => {
        console.error("Error occurred while deleting the card:", error);
      });
  };

  function fetchCards() {
    fetch(`${process.env.PUBLIC_URL}/database/server.json`)
      .then((response) => response.json())
      .then((data) => {
        const flashCardsData = data.cardData || [];
        const updatedCards = flashCardsData.map((card) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          status: card.status || "Want to Learn",
          modificationDate: card.modificationDate || "unknown",
          order: card.order,
        }));
        setFlashCards(updatedCards);
      })
      .catch((error) => {
        console.error("Error occurred while fetching the cards:", error);
      });
  }

  useEffect(() => {
    fetchCards();
  }, []);

  return <div className="container"></div>;
};

export default FlashCardContainer;