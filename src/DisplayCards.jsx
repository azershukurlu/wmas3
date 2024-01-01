import React, { useState, useEffect, useRef, useCallback } from "react";
import FlashcardApp from "./FlashcardApp";
import NewCardComponent from "./NewCardComponent";
import { updateMethod } from "./FlashcardApp";
import "./style/DisplayCards.css";

const DisplayCards = ({ onDelete, setFlashCards: setFlashCards }) => {
  const [flashCards, setLocalFlashCards] = useState([]);
  const [createCardVisibility, setCreateCardVisibility] = useState(false);
  const [searchInfo, setSearchInfo] = useState("");
  const [setFilterInfo, setsetFilterInfo] = useState("Full");
  const [sortInfo, setSortInfo] = useState("modificationDate");
  const [selectedCards, setSelectedCards] = useState([]);
  const [fetchMore, setFetchMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const pageRef = useRef(1);

  useEffect(() => {
    fetchFlashCards();
  }, []);

  const fetchFlashCards = async () => {
    setLoading(true);
    try {
      const existingData = await fetchCards(
        "_sort=order&_order=asc&_page=1&_limit=12"
      );
      const lastAddedData = await fetchCards(
        "_page=1&_limit=1&_sort=modificationDate&_order=desc"
      );

      const mergedFlashCards = mergeFlashCards(existingData, lastAddedData);
      setLocalFlashCards(mergedFlashCards);
    } catch (error) {
      console.error("Error fetching flash cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async (queryParams) => {
    const response = await fetch(
      `http://localhost:3000/cardData?${queryParams}`
    );
    return response.json();
  };

  const mergeFlashCards = (existingData, lastAddedData) => {
    return lastAddedData.length > 0
      ? [
          ...existingData,
          ...lastAddedData.filter(
            (card) =>
              !existingData.some((existingCard) => existingCard.id === card.id)
          ),
        ]
      : existingData;
  };

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= scrollHeight - 50 && !loading) {
      fetchMoreCards();
    }
  };

  const fetchMoreCards = useCallback(async () => {
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      await new Promise((resolve) => setTimeout(resolve, 675));
      const data = await fetchCards(`_page=${nextPage}&_limit=12`);
      const updatedData = data.map((card, idx) => ({
        ...card,
        order: flashCards.length + idx + 1,
      }));

      setLocalFlashCards((prevFlashCards) => [
        ...prevFlashCards,
        ...updatedData,
      ]);
      pageRef.current = nextPage;
    } catch (error) {
      console.error("Error occurred while fetching more flash cards:", error);
    } finally {
      setLoading(false);
    }
  }, [flashCards]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const createCardHandler = (createdCard) => {
    fetch("http://localhost:3000/cardData?_sort=id&_order=desc&_limit=1")
      .then((response) => response.json())
      .then(([recent]) => {
        const nextId = recent ? recent.id + 1 : 1;
        fetch("http://localhost:3000/cardData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: createdCard.question,
            answer: createdCard.answer,
            status: "Want to Learn",
            modificationDate: today,
            order: nextId,
          }),
        })
          .then((res) => res.json())
          .then((createdCard) => {
            setLocalFlashCards([...flashCards, createdCard]);
            setCreateCardVisibility(false);
          })
          .catch((error) => {
            console.error("Error adding card:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching latest card:", error);
      });
  };

  const handleCheckboxChange = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards((prevSelectedCards) =>
        prevSelectedCards.filter((id) => id !== cardId)
      );
    } else {
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, cardId]);
    }
  };

  const handleShareCard = () => {
    const selectedCardDetails = selectedCards.map((cardId) => {
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

    const emailBody = JSON.stringify(selectedCardDetails, null, 2);
    const emailSubject = "Flash Cards Selection";

    window.location.href = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
  };

  const renderAddCardForm = () => {
    return (
      <div className="create-card-form">
        <NewCardComponent
          onCreateCardAction={createCardHandler}
          onCancelAction={() => setCreateCardVisibility(false)}
        />
      </div>
    );
  };

  const renderFlashcards = () => {
    return (
      <div className="display-cards">
        {sortedCards.map((flashCard) => (
          <FlashcardApp
            key={flashCard.id}
            flashCard={flashCard}
            flashCards={flashCards}
            onDelete={onDelete}
            onUpdate={(id, question, answer, flashCards, order) =>
              updateMethod(
                id,
                question,
                answer,
                order,
                flashCards,
                setFlashCards
              )
            }
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            onCheckboxChange={handleCheckboxChange}
            setFlashCards={setFlashCards}
            className="display-card"
          />
        ))}
      </div>
    );
  };

  const sortedCards = flashCards
    .filter((card) => {
      const questionText = String(card.question);
      const answerText = String(card.answer);

      return (
        questionText.toLowerCase().includes(searchInfo.toLowerCase()) ||
        answerText.toLowerCase().includes(searchInfo.toLowerCase())
      );
    })
    .filter((card) => {
      const cardStatus = card.status ? card.status : "unknown";
      return (
        setFilterInfo === "Full" ||
        (cardStatus && cardStatus.toLowerCase() === setFilterInfo.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortInfo === "id") {
        return a.id - b.id;
      } else if (sortInfo === "question") {
        return a.question.localeCompare(b.question);
      } else if (sortInfo === "answer") {
        return a.answer.localeCompare(b.answer);
      } else if (sortInfo === "Modification Date") {
        return new Date(b.modificationDate) - new Date(a.modificationDate);
      }
      return 0;
    });

  return (
    <div>
      <div className="display-cards">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchInfo}
          onChange={(e) => setSearchInfo(e.target.value)}
          className="search-filter-sort"
        />
        <select
          value={setFilterInfo}
          onChange={(e) => setsetFilterInfo(e.target.value)}
          className="select-box"
        >
          <option value="Full">Full</option>
          <option value="Want to Learn">Want to Learn</option>
          <option value="Noted">Noted</option>
          <option value="Learned">Learned</option>
        </select>
        <select
          value={sortInfo}
          onChange={(e) => setSortInfo(e.target.value)}
          className="select-box"
        >
          <option value="id">ID</option>
          <option value="question">Question</option>
          <option value="answer">Answer</option>
          <option value="modificationDate">Modification Date</option>
        </select>
        <button
          className={`btn create-card-btn ${
            selectedCards.length > 0 ? "selected-card" : ""
          }`}
          onClick={() => setCreateCardVisibility(true)}
        >
          Create Card
        </button>

        <button
          className="btn share-card-btn"
          onClick={handleShareCard}
          style={{
            visibility: selectedCards.length > 0 ? "visible" : "hidden",
          }}
        >
          Share Card
        </button>
      </div>

      {createCardVisibility && renderAddCardForm()}

      {renderFlashcards(fetchFlashCards)}

      <h1 className="loading-text">
        {loading && !fetchMore && <div>Loading...</div>}
      </h1>
    </div>
  );
};

export default DisplayCards;
