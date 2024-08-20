import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";

const CardContext = createContext();

export const useCards = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);

  //This useEffect hook fetches the cards from the Firestore database and sets them in the state when the component mounts.
  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, "kanban"));
      const cardData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCards(cardData);
    };
    fetchCards();
  }, []);
  //The saveCard function saves a new card to the Firestore database and updates the state with the new card.
  const saveCard = async (card) => {
    await setDoc(doc(db, "kanban", card.id), card);
    setCards((prevCards) => [...prevCards, card]);
  };
  //The updateCard function updates an existing card in the Firestore database and updates the state with the updated card.
  const updateCard = async (updatedCard) => {
    await setDoc(doc(db, "kanban", updatedCard.id), updatedCard);
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };
  //The deleteCard function deletes a card from the Firestore database and updates the state by removing the card from the list of cards.
  const deleteCard = async (cardId) => {
    await deleteDoc(doc(db, "kanban", cardId));
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  return (
    <CardContext.Provider
      value={{ cards, setCards, saveCard, updateCard, deleteCard }}
    >
      {children}
    </CardContext.Provider>
  );
};
