"use client";

import ChatMessage from "@/app/components/ChatMessage";
import React, { useState } from "react";
import { useTheme } from "next-themes"; // ✅ ShadCN hook

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("conceptual");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme(); // ✅ theme toggle

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center">Semantic Search Chat</h1>
        {/* <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border px-3 py-1 rounded-md text-sm dark:bg-white dark:text-black"
        >
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button> */}
      </div>

      {/* Mode Switcher */}
      <div className="flex space-x-4">
        {["conceptual", "keyword"].map((item) => (
          <label key={item}>
            <input
              type="radio"
              name="mode"
              value={item}
              checked={mode === item}
              onChange={() => setMode(item)}
              className="hidden"
            />
            <div
              className={`cursor-pointer px-4 py-2 rounded-md border transition-all ${
                mode === item
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </div>
          </label>
        ))}
      </div>

      {/* Query Box */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask something..."
          className="flex-grow rounded-md border px-4 py-2 dark:bg-gray-700 dark:text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          disabled={loading}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      {/* Results */}
      {response && (
        <ChatMessage query={response.query} summary={response.summary} results={response.results} />
      )}
    </main>
  );
}
