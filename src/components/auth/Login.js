import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import StylizedButton from "../ui/StylizedButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, signUp, loginWithGoogle } = useAuth(); // Fixed import
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(`Failed to ${isSignUp ? "sign up" : "log in"}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with Google");
    }
  };

  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.25,
          ease: "easeInOut",
        }}
        className="relative z-10 mx-auto w-full max-w-xl flex flex-col items-center justify-evenly p-4 h-[50%] bg-gray-950 bg-opacity-50 rounded-lg shadow-lg"
      >
        <h2 className="h2 text-center text-white">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 w-[100%] items-center"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded-lg bg-black text-white focus:outline-none w-[80%]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded-lg bg-black text-white focus:outline-none w-[80%]"
          />
          <StylizedButton type="submit">
            {isSignUp ? "Sign Up" : "Login"}
          </StylizedButton>
        </form>

        <div className=" flex justify-center items-center w-[100%]">
          <StylizedButton onClick={handleGoogleSignIn}>
            Sign in with Google
          </StylizedButton>
        </div>

        <div className="mt-4 text-center">
          <p className="text-white">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 cursor-pointer hover:text-blue-500 transition duration-300"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginPage;
