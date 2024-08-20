import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CardProvider } from "./components/context/CardContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CardProvider>
      <App />
    </CardProvider>
  </React.StrictMode>
);

reportWebVitals();
