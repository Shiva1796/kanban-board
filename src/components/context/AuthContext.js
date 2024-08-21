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

// Create a Context for the authentication state and functions
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps around the app's components to provide authentication state and methods
export const AuthProvider = ({ children }) => {
  // State to store the current authenticated user
  const [user, setUser] = useState(null);

  // State to manage the loading state while checking the auth status
  const [loading, setLoading] = useState(true);

  // useEffect hook to listen for changes in the authentication state
  useEffect(() => {
    // Subscribe to the Firebase auth state and update the user state when it changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once the auth state is checked
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Function to handle login with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Function to handle user registration (sign up) with email and password
  const signUp = async (email, password) => {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Initialize the Kanban board structure in Firestore for the new user
    await initializeKanbanBoard(userId);

    return userCredential;
  };

  // Function to handle Google Sign-In using Firebase authentication
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Initialize Google Auth provider
      const userCredential = await signInWithPopup(auth, provider); // Trigger Google Sign-In popup

      if (userCredential && userCredential.user) {
        const userId = userCredential.user.uid;

        // Check if the user is signing in for the first time
        const isNewUser = userCredential.additionalUserInfo?.isNewUser || false;

        // If the user is new, initialize their Kanban board in Firestore
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

  // Function to handle user logout
  const logout = () => {
    return signOut(auth);
  };

  // Function to initialize the Kanban board structure for a new user in Firestore
  const initializeKanbanBoard = async (userId) => {
    try {
      const collections = ["backlog", "todo", "in-progress", "complete"];
      const batch = writeBatch(db); // Start a batch write operation
      collections.forEach((collectionName) => {
        // Create a dummy document in each sub-collection to initialize them
        const docRef = doc(db, "users", userId, collectionName, "dummyDoc");
        batch.set(docRef, {});
      });
      await batch.commit(); // Commit the batch operation
    } catch (error) {
      console.error("Error initializing Kanban board: ", error);
    }
  };

  // Return the AuthContext.Provider component with the authentication functions and state passed in the value
  return (
    <AuthContext.Provider
      value={{
        user, // Current user object
        login, // Function to log in with email and password
        signUp, // Function to sign up with email and password
        loginWithGoogle, // Function to log in with Google
        logout, // Function to log out
      }}
    >
      {!loading && children}{" "}
      {/* Render children components only when not loading */}
    </AuthContext.Provider>
  );
};
