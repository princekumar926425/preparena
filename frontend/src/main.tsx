import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 🔥 GLOBAL THEME APPLY
const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(
  <App />
);