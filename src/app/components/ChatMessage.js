import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw';


export default function ChatMessage({ query, summary, results }) {

  const [reverseResults, setReverseResults] = React.useState([]);

  React.useEffect(() => {
    if (results && results.length > 0) {
      // Reverse the results array
      setReverseResults([...results].reverse());
    }
  }, [results]);


  return (
    <div className="space-y-4 rounded-xl border p-4 bg-gray-100 dark:bg-gray-800">
      <p>
        <strong>🙋‍♂️ You:</strong> {query}
      </p>

      <div>
        <strong>🤖 AI:</strong>
        <div className="prose prose-sm sm:prose-base dark:prose-invert mt-2">
          <div className="markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {summary}
            </ReactMarkdown>
          </div>

        </div>
      </div>

      {reverseResults?.length > 0 && (
        <div>
          <strong>📎 Related Docs:</strong>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {reverseResults.map((result, idx) => (
              <li key={idx}>
                <a
                  href={`https://drive.google.com/file/d/${result.file_id.replace(".pdf", "")}/view`}
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
