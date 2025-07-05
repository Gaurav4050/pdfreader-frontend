"use client";

import ChatMessage from "@/app/components/ChatMessage";
import AnimatedLoadingText from "@/app/components/AnimatedLoadingText";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { FiCornerUpRight } from "react-icons/fi";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState({
    conceptual: null,
    keyword: null,
  });
  const [loading, setLoading] = useState({ conceptual: false, keyword: false });
  const { theme, setTheme } = useTheme();
  const [viewMode, setViewMode] = useState("dual");
  const [activeMode, setActiveMode] = useState("conceptual");
  const router = useRouter();

  const handleAsk = async (mode) => {
    if (!query.trim()) return;

    setLoading((prev) => ({ ...prev, [mode]: true }));

    try {
      const res = await fetch("http://127.0.0.1:8000/semantic-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setResponses((prev) => ({ ...prev, [mode]: data }));
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [mode]: false }));
    }
  };

  const ScoreBar = ({ label, value }) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center w-full">Semantic Search Comparison</h1>
      </div>

      {/* NLP Pipeline Steps */}
      {/* <div className="flex items-center space-x-4 mb-2">
        {["Tokenization", "Stop Word Removal", "Stemming & Lemmatization"].map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <span className="text-sm">{step}</span>
            {index !== 2 && <div className="w-6 h-px bg-gray-400" />}
          </div>
        ))}
      </div> */}

      {/* Input and View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4">
        <div className="flex flex-grow space-x-2">
          <input
            type="text"
            placeholder="Ask something..."
            className="flex-grow rounded-md border px-4 py-2 dark:bg-gray-700 dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk("conceptual");
                handleAsk("keyword");
              }
            }}
          />
          <button
            onClick={() => {
              handleAsk("conceptual");
              handleAsk("keyword");
            }}
            disabled={loading.conceptual || loading.keyword}
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            {loading.conceptual || loading.keyword ? "Asking..." : "Ask"}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("single")}
            className={`px-3 py-1 rounded-md  cursor-pointer border ${viewMode === "single" ? "bg-blue-500 text-white" : ""}`}
          >
            Single View
          </button>
          <button
            onClick={() => setViewMode("dual")}
            className={`px-3 py-1 cursor-pointer rounded-md border ${viewMode === "dual" ? "bg-blue-500 text-white" : ""}`}
          >
            Dual View
          </button>
          <button
            onClick={() => {
              router.push("/model-analysis") }}
            className={`px-3 py-1 cursor-pointer rounded-md border  text-white`}
          >
            <div className="flex items-center gap-1">
              View Analysis <FiCornerUpRight size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Animated Loading Text */}
      {(loading.conceptual || loading.keyword) && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 rounded-md">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <AnimatedLoadingText />
          </div>
        </div>
      )}

      {/* Mode Dropdown (for single view) */}
      {viewMode === "single" && (
        <div className="mt-2">
          <select
            value={activeMode}
            onChange={(e) => setActiveMode(e.target.value)}
            className="rounded-md border px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            <option value="conceptual">🧠 Conceptual</option>
            <option value="keyword">🔍 Keyword</option>
          </select>
        </div>
      )}

      {/* Results Section */}
      {viewMode === "dual" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conceptual */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border p-4">
            <h2 className="text-xl font-semibold mb-2">🧠 Conceptual Mode</h2>
            {responses.conceptual ? (
              <>
                <ChatMessage
                  query={responses.conceptual.query}
                  summary={responses.conceptual.summary?.markdown}
                  results={responses.conceptual.results}
                />
                {responses.conceptual.metrics && (
                  <div className="mt-4">
                    <ScoreBar label="Precision" value={responses.conceptual.metrics.precision} />
                    <ScoreBar label="Recall" value={responses.conceptual.metrics.recall} />
                    <ScoreBar label="F1 Score" value={responses.conceptual.metrics.f1_score} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No response yet.</p>
            )}
          </div>

          {/* Keyword */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border p-4">
            <h2 className="text-xl font-semibold mb-2">🔍 Keyword Mode</h2>
            {responses.keyword ? (
              <>
                <ChatMessage
                  query={responses.keyword.query}
                  summary={responses.keyword.summary?.markdown}
                  results={responses.keyword.results}
                />
                {responses.keyword.metrics && (
                  <div className="mt-4">
                    <ScoreBar label="Precision" value={responses.keyword.metrics.precision} />
                    <ScoreBar label="Recall" value={responses.keyword.metrics.recall} />
                    <ScoreBar label="F1 Score" value={responses.keyword.metrics.f1_score} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No response yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {responses[activeMode] ? (
            <>
              <ChatMessage
                query={responses[activeMode]?.query}
                summary={responses[activeMode]?.summary?.markdown}
                results={responses[activeMode]?.results}
              />
              {responses[activeMode]?.metrics && (
                <div className="mt-4">
                  <ScoreBar label="Precision" value={responses[activeMode].metrics.precision} />
                  <ScoreBar label="Recall" value={responses[activeMode].metrics.recall} />
                  <ScoreBar label="F1 Score" value={responses[activeMode].metrics.f1_score} />
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No response yet.</p>
          )}
        </div>
      )}
    </main>
  );
}
