"use client";

import ChatMessage from "@/app/components/ChatMessage";
import AnimatedLoadingText from "@/app/components/AnimatedLoadingText";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { FiCornerUpRight, FiRefreshCw, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

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

  // const BASE_URL = "https://pdfreader2-imp3.onrender.com";
  const BASE_URL = "http://127.0.0.1:8000"; // Use this for local development

  const handleAsk = async (mode) => {
    if (!query.trim()) return;

    setLoading((prev) => ({ ...prev, [mode]: true }));

    try {
      const res = await fetch(`${BASE_URL}/semantic-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setResponses((prev) => ({ ...prev, [mode]: data }));
    } catch (error) {
      // alert("Error: " + error.message);
      toast.error("You've reached your token limit for today. Please come back tomorrow!", {
        duration: 7000,
        style: {
          background: '#ff4d4f',
          color: '#fff',
          fontWeight: 'bold',
        },
        icon: '🚫',
      });

    } finally {
      setLoading((prev) => ({ ...prev, [mode]: false }));
    }
  };

  const ScoreBar = ({ label, value }) => {
    // color coding based on score (low: red, med: yellow, high: green)
    let bgColor = "bg-red-500";
    if (value >= 0.7) bgColor = "bg-green-500";
    else if (value >= 0.4) bgColor = "bg-yellow-400";

    return (
      <div className="mb-3">
        <div className="flex justify-between items-center text-sm mb-1 font-semibold text-gray-700 dark:text-gray-300">
          <span>{label}</span>
          <span>{(value * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div className={`${bgColor} h-3 rounded-full transition-all duration-500`} style={{ width: `${value * 100}%` }} />
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-center md:text-left text-gray-900 dark:text-white">
          Bi Lingual Corpus Search
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/model-analysis")}
            className="inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
            aria-label="View Model Analysis"
            title="View Model Analysis"
          >
            View Analysis <FiCornerUpRight size={20} />
          </button>
          <button
            onClick={() => {
              setResponses({ conceptual: null, keyword: null });
              setQuery("");
            }}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 font-semibold shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            aria-label="Clear All"
            title="Clear All Inputs and Responses"
          >
            Clear <FiRefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Input Section */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Enter your query and press Enter or click Ask"
            className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 pr-12 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-500 transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk("conceptual");
                handleAsk("keyword");
              }
            }}
            aria-label="Query Input"
          />
          <FiSearch
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>

        <button
          onClick={() => {
            handleAsk("conceptual");
            handleAsk("keyword");
          }}
          disabled={loading.conceptual || loading.keyword || !query.trim()}
          className={`flex-shrink-0 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-blue-300`}
          aria-label="Ask Query"
        >
          {loading.conceptual || loading.keyword ? (
            <span className="flex items-center gap-2 animate-pulse">
              Asking...
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </span>
          ) : (
            "Ask"
          )}
        </button>
      </section>

      {/* View Mode Buttons */}
      <section className="flex items-center gap-4 justify-center md:justify-start">
        <button
          onClick={() => setViewMode("single")}
          className={`px-5 py-2 rounded-full font-semibold transition ${viewMode === "single"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          aria-label="Single View Mode"
          title="Single View Mode"
        >
          Single View
        </button>
        <button
          onClick={() => setViewMode("dual")}
          className={`px-5 py-2 rounded-full font-semibold transition ${viewMode === "dual"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          aria-label="Dual View Mode"
          title="Dual View Mode"
        >
          Dual View
        </button>

        {viewMode === "single" && (
          <select
            value={activeMode}
            onChange={(e) => setActiveMode(e.target.value)}
            className="ml-4 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-500 transition"
            aria-label="Select mode for single view"
            title="Select mode for single view"
          >
            <option value="conceptual">🧠 Conceptual</option>
            <option value="keyword">🔍 Keyword</option>
          </select>
        )}
      </section>

      {/* Loading Indicator */}
      {(loading.conceptual || loading.keyword) && (
        <div className="flex items-center justify-center gap-3 rounded-lg bg-yellow-100 p-4 text-yellow-800 shadow-md dark:bg-yellow-900 dark:text-yellow-300">
          <div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <AnimatedLoadingText />
        </div>
      )}

      {/* Results Section */}
      {viewMode === "dual" ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Conceptual */}
          <article className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md transition hover:shadow-xl">
            <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100 gap-2">
              🧠 Conceptual Mode
            </h2>
            {responses.conceptual ? (
              <>
                <ChatMessage
                  query={responses.conceptual.query}
                  summary={responses.conceptual.summary?.markdown}
                  results={responses.conceptual.results}
                />
                {responses.conceptual.metrics && (
                  <div className="mt-6 border-t border-gray-300 pt-4 dark:border-gray-700">
                    <ScoreBar label="Precision" value={responses.conceptual.metrics.precision} />
                    <ScoreBar label="Recall" value={responses.conceptual.metrics.recall} />
                    <ScoreBar label="F1 Score" value={responses.conceptual.metrics.f1_score} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No response yet.</p>
            )}
          </article>

          {/* Keyword */}
          <article className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md transition hover:shadow-xl">
            <h2 className="mb-4 flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100 gap-2">
              🔍 Keyword Mode
            </h2>
            {responses.keyword ? (
              <>
                <ChatMessage
                  query={responses.keyword.query}
                  summary={responses.keyword.summary?.markdown}
                  results={responses.keyword.results}
                />
                {responses.keyword.metrics && (
                  <div className="mt-6 border-t border-gray-300 pt-4 dark:border-gray-700">
                    <ScoreBar label="Precision" value={responses.keyword.metrics.precision} />
                    <ScoreBar label="Recall" value={responses.keyword.metrics.recall} />
                    <ScoreBar label="F1 Score" value={responses.keyword.metrics.f1_score} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No response yet.</p>
            )}
          </article>
        </section>
      ) : (
        <section className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md transition hover:shadow-xl">
          {responses[activeMode] ? (
            <>
              <ChatMessage
                query={responses[activeMode]?.query}
                summary={responses[activeMode]?.summary?.markdown}
                results={responses[activeMode]?.results}
              />
              {responses[activeMode]?.metrics && (
                <div className="mt-6 border-t border-gray-300 pt-4 dark:border-gray-700">
                  <ScoreBar label="Precision" value={responses[activeMode].metrics.precision} />
                  <ScoreBar label="Recall" value={responses[activeMode].metrics.recall} />
                  <ScoreBar label="F1 Score" value={responses[activeMode].metrics.f1_score} />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No response yet.</p>
          )}
        </section>
      )}
    </main>
  );
}
