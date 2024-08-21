import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../../firebase.config";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const CardContext = createContext();

export const useCards = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "kanban-cards"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userCards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(userCards);
    });

    return () => unsubscribe();
  }, [user]);

  const saveCard = async (card) => {
    if (!user) return;
    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "kanban-cards"),
        card
      );
      setCards((prevCards) => [...prevCards, { ...card, id: docRef.id }]); // Use Firestore ID
    } catch (error) {
      console.error("Error saving card: ", error);
    }
  };

  const deleteCard = async (cardId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "kanban-cards", cardId));
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId)); // Update local state
    } catch (error) {
      console.error("Error deleting card: ", error);
    }
  };

  const updateCard = async (cardId, updatedData) => {
    if (!user) return;
    try {
      const cardRef = doc(db, "users", user.uid, "kanban-cards", cardId);
      console.log("Updating card:", cardRef, updatedData); // Log for debugging
      await updateDoc(cardRef, updatedData);
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, ...updatedData } : card
        )
      );
    } catch (error) {
      console.error("Error updating card: ", error);
    }
  };

  return (
    <CardContext.Provider value={{ cards, saveCard, deleteCard, updateCard }}>
      {children}
    </CardContext.Provider>
  );
};
