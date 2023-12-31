import React, { useState, useEffect, useRef, useCallback } from "react";
import FlashcardApp from "./FlashcardApp";
import { updateMethod } from "./FlashcardApp";
import NewCardComponent from "./NewCardComponent";

import "./style/DisplayCards.css";

const SearchFilterSort = ({
  searchInfo,
  setSearchInfo,
  filterInfo,
  setFilterInfo,
  sortInfo,
  setSortInfo,
  selectedCard,
  setAddCardVisibility,
  shareHandler,
}) => {
  return (
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
  );
};

const CreateCardForm = ({
  addCardVisibility,
  setAddCardVisibility,
  createCardHandler,
}) => {
  return (
    addCardVisibility && (
      <div className="create-card-form">
        <NewCardComponent
          onCreateCardAction={createCardHandler}
          onCancelAction={() => setAddCardVisibility(false)}
        />
      </div>
    )
  );
};

const DisplayCardList = ({
  sortedCards,
  onDelete,
  setFcd,
  selectedCard,
  checkboxChangeHandler,
  setSelectedCard,
}) => {
  return (
    <div className="display-cards">
      {sortedCards.map((card) => (
        <DisplayCard
          key={card.id}
          flashCard={card}
          onDelete={onDelete}
          onUpdate={(id, question, answer, flashCards, order) =>
            updateMethod(id, question, answer, order, flashCards, setFcd)
          }
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          onCheckboxChange={checkboxChangeHandler}
          setFcd={setFcd}
        />
      ))}
    </div>
  );
};

const DisplayCard = ({
  flashCard,
  onDelete,
  onUpdate,
  selectedCard,
  setSelectedCard,
  onCheckboxChange,
  setFcd,
  flashCards,
}) => {
  return (
    <FlashcardApp
      key={flashCard.id}
      flashCard={flashCard}
      flashCards={flashCards}
      onDelete={onDelete}
      onUpdate={(id, question, answer, flashCards, order) =>
        updateMethod(id, question, answer, order, flashCards, setFcd)
      }
      selectedCard={selectedCard}
      setSelectedCard={setSelectedCard}
      onCheckboxChange={onCheckboxChange}
      setFcd={setFcd}
      className="display-card"
    />
  );
};

const LoadingText = ({ loading, fetchMore }) => {
  return (
    <h1 className="loading-text">
      {loading && !fetchMore && <p>Loading...</p>}
    </h1>
  );
};

const DisplayCards = ({ onDelete, setfcd: setFcd }) => {
  const [searchInfo, setSearchInfo] = useState("");
  const [flashCards, setFlashCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState([]);
  const [filterInfo, setFilterInfo] = useState("Full");
  const [sortInfo, setSortInfo] = useState("modificationDate");
  const [addCardVisibility, setAddCardVisibility] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const pageElement = useRef(1);
  const [fetchMore, setFetchMore] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/cardData?_sort=order&_order=asc&_page=1&_limit=15`
      );
      const currentData = await response.json();
      const lastDataFetch = await fetch(
        `http://localhost:3000/cardData?_page=1&_limit=1&_sort=modificationDate&_order=desc`
      );
      const lastData = await lastDataFetch.json();
      const mergedCards =
        lastData.length > 0
          ? [
              ...currentData,
              ...lastData.filter(
                (card) =>
                  !currentData.some((cardExist) => cardExist.id === card.id)
              ),
            ]
          : currentData;
      setFlashCards(mergedCards);
    } catch (error) {
      console.error("Error occurred while fetching the cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollEventHandler = () => {
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
      const nextPage = pageElement.current + 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(
        `http://localhost:3000/cardData?_page=${nextPage}&_limit=15`
      );
      const data = await response.json();
      const updatedData = data.map((card, id) => ({
        ...card,
        order: flashCards.length + id + 1,
      }));

      setFlashCards((prevCards) => [...prevCards, ...updatedData]);
      pageElement.current = nextPage;
    } catch (error) {
      console.error("Error occurred while fetching more flash cards:", error);
    } finally {
      setLoading(false);
    }
  }, [flashCards]);

  useEffect(() => {
    window.addEventListener("scroll", scrollEventHandler);
    return () => {
      window.removeEventListener("scroll", scrollEventHandler);
    };
  }, [scrollEventHandler]);

  return (
    <div>
      <SearchFilterSort
        searchInfo={searchInfo}
        setSearchInfo={setSearchInfo}
        filterInfo={filterInfo}
        setFilterInfo={setFilterInfo}
        sortInfo={sortInfo}
        setSortInfo={setSortInfo}
        selectedCard={selectedCard}
        setAddCardVisibility={setAddCardVisibility}
        shareHandler={shareHandler}
      />
      <CreateCardForm
        addCardVisibility={addCardVisibility}
        setAddCardVisibility={setAddCardVisibility}
        createCardHandler={createCardHandler}
      />
      <DisplayCardList
        sortedCards={sortedCards}
        onDelete={onDelete}
        setFcd={setFcd}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        checkboxChangeHandler={checkboxChangeHandler}
      />
      <LoadingText loading={loading} fetchMore={fetchMore} />
    </div>
  );
};

export default DisplayCards;
