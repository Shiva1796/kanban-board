import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../../firebase.config";
import { doc, writeBatch } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase.config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Initialize Kanban board for the new user
    await initializeKanbanBoard(userId);

    return userCredential;
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      if (userCredential && userCredential.user) {
        const userId = userCredential.user.uid;

        const isNewUser = userCredential.additionalUserInfo?.isNewUser || false;

        if (isNewUser) {
          await initializeKanbanBoard(userId);
        }

        return userCredential;
      } else {
        throw new Error("Failed to get user credentials from Google Sign-In.");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      throw err;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const initializeKanbanBoard = async (userId) => {
    try {
      const collections = ["backlog", "todo", "in-progress", "complete"];
      const batch = writeBatch(db);
      collections.forEach((collectionName) => {
        const docRef = doc(db, "users", userId, collectionName, "dummyDoc");
        batch.set(docRef, {});
      });
      await batch.commit();
    } catch (error) {
      console.error("Error initializing Kanban board: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signUp,
        loginWithGoogle,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
