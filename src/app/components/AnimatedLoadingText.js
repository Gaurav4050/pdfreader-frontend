import React, { useEffect, useState } from "react";
import clsx from "clsx";

const loadingMessages = [
  "🔄 Initializing...",
  "✅ Tokenization done",
  "✅ Stop words removed",
  "✅ Lemmatization complete",
  "🔍 Finding related content...",
  "🧠 Analyzing document context...",
  "✍️ Generating answer summary...",
  "🚀 Almost ready with results!",
];



export default function AnimatedLoadingText() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (index >= loadingMessages.length - 1) {
      setFade(false);
      return;
    }

    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setFade(false);
      }, 500);
    }, 2500); // cycle every 2.5s

    return () => clearInterval(interval);
  }, [index]);

  return (
    <p
      className={clsx(
        "text-base md:text-lg font-medium transition-all duration-500 ease-in-out",
        fade ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      )}
    >
      {loadingMessages[index]}
    </p>
  );
}
