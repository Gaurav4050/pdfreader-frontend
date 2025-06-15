import React from "react";

export default function ChatMessage({ query, summary, results }) {
  return (
    <div className="space-y-4 rounded-xl border p-4 bg-gray-100 dark:bg-gray-800">
      <p>
        <strong>🙋‍♂️ You:</strong> {query}
      </p>
      <p>
        <strong>🤖 AI:</strong> {summary}
      </p>

      {results?.length > 0 && (
        <div>
          <strong>📎 Related Docs:</strong>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {results.map((result, idx) => (
              <li key={idx}>
                <a
                  href={`https://drive.google.com/file/d/${result.file_id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open Document {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
