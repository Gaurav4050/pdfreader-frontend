"use client";

import ChatMessage from "@/app/components/ChatMessage";
import AnimatedLoadingText from "@/app/components/AnimatedLoadingText";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  FiCornerUpRight,
  FiRefreshCw,
  FiSearch,
  FiMoon,
  FiSun,
  FiZap,
  FiColumns,
  FiArrowUp,
  FiTrendingUp
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState({
    conceptual: null,
    keyword: null,
  });
  const [loading, setLoading] = useState({ conceptual: false, keyword: false });
  const [viewMode, setViewMode] = useState("dual");
  const [activeMode, setActiveMode] = useState("conceptual");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const BASE_URL = "https://pdfreader2-imp3.onrender.com";
  // const BASE_URL = "http://127.0.0.1:8000";

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const includeInHistory = (newQuery) => {
    setQueryHistory((prev) => {
      const updatedHistory = [newQuery, ...prev.filter(q => q !== newQuery)];
      return updatedHistory.slice(0, 5); // Keep only last 5 unique queries
    });
  }

  const handleAsk = async (mode) => {
    if (!query.trim()) {
      toast.error("Please enter a query first!");
      inputRef.current?.focus();
      return;
    }

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

      toast.success(`Search completed!`);
      // setTimeout(() => scrollToResults(), 300);

    } catch (error) {
      toast.error("Token limit reached. Please try again tomorrow.");
    } finally {
      setLoading((prev) => ({ ...prev, [mode]: false }));
    }
  };

  const handleClear = () => {
    setResponses({ conceptual: null, keyword: null });
    setQuery("");
    setQueryHistory([]);
    toast.success("Cleared!");
    inputRef.current?.focus();
  };

  const handleQuickSearch = (historyQuery) => {
    setQuery(historyQuery);
    inputRef.current?.focus();
  };

  const ScoreBar = ({ label, value }) => {
    let colorClass = "bg-red-500";
    if (value >= 0.7) colorClass = "bg-green-500";
    else if (value >= 0.4) colorClass = "bg-yellow-500";

    return (
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className={`${colorClass} h-1 rounded-full transition-all duration-500`}
              style={{ width: `${value * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono w-10 text-right">
            {(value * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="max-w-6xl mx-auto p-4 space-y-4">

        {/* Compact Header */}
        <header className="relative mb-5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-2">
                Bi-Lingual Corpus Search
              </h1>
              <p className="text-md text-gray-600 dark:text-gray-400 font-medium">
                Advanced semantic and keyword search powered by AI
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-3 py-2 font-medium rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <FiSun className="text-yellow-500" size={20} /> : <FiMoon className="text-gray-700" size={20} />}
              </button> */}

              <button
                onClick={() => router.push("/model-analysis")}
                className="group inline-flex items-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 "
                aria-label="View Model Analysis"
              >
                <FiTrendingUp size={20} />
                View Analysis
                <FiCornerUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-2 text-gray-700 dark:text-gray-300 font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400"
                aria-label="Clear All"
              >
                <FiRefreshCw size={18} />
                Clear
              </button>
            </div>
          </div>
        </header>

        {/* Compact Search */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter your search query..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    
                      handleAsk("conceptual");
                      handleAsk("keyword");
                      includeInHistory(query.trim());
                }
                }}
               
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <button
              onClick={() => {

                handleAsk("conceptual");
                handleAsk("keyword");
                includeInHistory(query.trim());
              }}
              disabled={loading.conceptual || loading.keyword || !query.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${loading.conceptual || loading.keyword || !query.trim()
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {loading.conceptual || loading.keyword ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Compact Query History */}
          {queryHistory.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                {queryHistory.map((historyQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(historyQuery)}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {historyQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Compact View Mode */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("single")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewMode === "single"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
                  }`}
              >
                Single
              </button>
              <button
                onClick={() => setViewMode("dual")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewMode === "dual"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
                  }`}
              >
                Dual
              </button>
            </div>
          </div>

          {viewMode === "single" && (
            <select
              value={activeMode}
              onChange={(e) => setActiveMode(e.target.value)}
              className="text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-gray-900 dark:text-white"
            >
              <option value="conceptual">🧠 Conceptual</option>
              <option value="keyword">🔍 Keyword</option>
            </select>
          )}
        </section>

        {/* Compact Loading */}
        {(loading.conceptual || loading.keyword) && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <AnimatedLoadingText />
          </div>
        )}

        {/* Compact Results */}
        <div ref={resultsRef}>
          {viewMode === "dual" ? (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Conceptual Results */}
              <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 gap-2 mb-3">
                  🧠 Conceptual
                </h2>
                {responses.conceptual ? (
                  <>
                    <ChatMessage
                      query={responses.conceptual.query}
                      summary={responses.conceptual.summary?.markdown}
                      results={responses.conceptual.results}
                    />
                    {responses.conceptual.metrics && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">
                          Metrics
                        </h3>
                        <ScoreBar label="Precision" value={responses.conceptual.metrics.precision} />
                        <ScoreBar label="Recall" value={responses.conceptual.metrics.recall} />
                        <ScoreBar label="F1 Score" value={responses.conceptual.metrics.f1_score} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-2 opacity-30">🧠</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Ready for conceptual search
                    </p>
                  </div>
                )}
              </article>

              {/* Keyword Results */}
              <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 gap-2 mb-3">
                  🔍 Keyword
                </h2>
                {responses.keyword ? (
                  <>
                    <ChatMessage
                      query={responses.keyword.query}
                      summary={responses.keyword.summary?.markdown}
                      results={responses.keyword.results}
                    />
                    {responses.keyword.metrics && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">
                          Metrics
                        </h3>
                        <ScoreBar label="Precision" value={responses.keyword.metrics.precision} />
                        <ScoreBar label="Recall" value={responses.keyword.metrics.recall} />
                        <ScoreBar label="F1 Score" value={responses.keyword.metrics.f1_score} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-2 opacity-30">🔍</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Ready for keyword search
                    </p>
                  </div>
                )}
              </article>
            </section>
          ) : (
            <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 gap-2 mb-3">
                {activeMode === "conceptual" ? "🧠 Conceptual" : "🔍 Keyword"}
              </h2>

              {responses[activeMode] ? (
                <>
                  <ChatMessage
                    query={responses[activeMode]?.query}
                    summary={responses[activeMode]?.summary?.markdown}
                    results={responses[activeMode]?.results}
                  />
                  {responses[activeMode]?.metrics && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-sm mb-3 text-gray-800 dark:text-gray-200">
                        Metrics
                      </h3>
                      <ScoreBar label="Precision" value={responses[activeMode].metrics.precision} />
                      <ScoreBar label="Recall" value={responses[activeMode].metrics.recall} />
                      <ScoreBar label="F1 Score" value={responses[activeMode].metrics.f1_score} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-3xl mb-2 opacity-30">
                    {activeMode === "conceptual" ? "🧠" : "🔍"}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Ready for {activeMode} search
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Compact Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all"
        >
          <FiArrowUp size={16} />
        </button>
      )}
    </main>
  );
}