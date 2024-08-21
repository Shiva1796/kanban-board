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

// Create a Context for the card data and functions
const CardContext = createContext();

// Custom hook to use the CardContext
export const useCards = () => useContext(CardContext);

// CardProvider component that wraps around the app's components to provide card data and methods
export const CardProvider = ({ children }) => {
  const { user } = useAuth(); // Access the authenticated user from AuthContext
  const [cards, setCards] = useState([]); // State to store the user's Kanban cards

  // useEffect hook to listen for changes in the user's cards in Firestore
  useEffect(() => {
    if (!user) return; // Exit if there is no authenticated user

    // Create a Firestore query to listen for changes in the user's Kanban cards collection
    const q = query(collection(db, "users", user.uid, "kanban-cards"));

    // Set up a real-time listener on the user's Kanban cards collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userCards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(userCards); // Update the local state with the fetched cards
    });

    // Cleanup the listener when the component unmounts or when the user changes
    return () => unsubscribe();
  }, [user]);

  // Function to save a new card to Firestore
  const saveCard = async (card) => {
    if (!user) return; // Exit if there is no authenticated user
    try {
      // Add a new document to the user's Kanban cards collection in Firestore
      const docRef = await addDoc(
        collection(db, "users", user.uid, "kanban-cards"),
        card
      );
      // Update the local state with the new card, using the Firestore document ID
      setCards((prevCards) => [...prevCards, { ...card, id: docRef.id }]);
    } catch (error) {
      console.error("Error saving card: ", error); // Log any errors that occur during the save operation
    }
  };

  // Function to delete a card from Firestore
  const deleteCard = async (cardId) => {
    if (!user) return; // Exit if there is no authenticated user
    try {
      // Delete the document with the specified ID from the user's Kanban cards collection in Firestore
      await deleteDoc(doc(db, "users", user.uid, "kanban-cards", cardId));
      // Update the local state to remove the deleted card
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error deleting card: ", error); // Log any errors that occur during the delete operation
    }
  };

  // Function to update an existing card in Firestore
  const updateCard = async (cardId, updatedData) => {
    if (!user) return; // Exit if there is no authenticated user
    try {
      const cardRef = doc(db, "users", user.uid, "kanban-cards", cardId);
      console.log("Updating card:", cardRef, updatedData); // Log the update operation for debugging
      await updateDoc(cardRef, updatedData); // Update the card document in Firestore with the new data
      // Update the local state with the updated card data
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, ...updatedData } : card
        )
      );
    } catch (error) {
      console.error("Error updating card: ", error); // Log any errors that occur during the update operation
    }
  };

  // Return the CardContext.Provider component with the cards data and CRUD functions passed in the value
  return (
    <CardContext.Provider value={{ cards, saveCard, deleteCard, updateCard }}>
      {children}
    </CardContext.Provider>
  );
};
