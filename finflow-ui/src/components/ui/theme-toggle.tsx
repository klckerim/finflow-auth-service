import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
