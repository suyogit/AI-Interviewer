"use client";
import { useState } from "react";

const FetchApiComponent = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      const startRes = await fetch("http://localhost:5000/api/start", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!startRes.ok) {
        throw new Error(
          `Start Interview Error: ${startRes.status} ${startRes.statusText}`
        );
      }

      const startData = await startRes.json();
      setResponse(startData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const nextRes = await fetch("http://localhost:5000/api/next", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "currentCategory": "css",
          "currentDifficulty": "Medium", 
          "lastAnswer": "CSS uses concepts like selectors, flexbox, grid, and responsive design to style web pages.",
          "askedQuestions": [
              "Can you explain the fundamentals of flexbox in CSS?"
          ],
          "remainingTime": 2600
      }
      ),
      });

      if (!nextRes.ok) {
        const errorText = await nextRes.text();
        throw new Error(`Next Question Error: ${nextRes.status} ${errorText}`);
      }

      const nextData = await nextRes.json();
      setResponse(nextData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleStartInterview}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Start Interview"}
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Loading..." : "Next Question"}
        </button>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
      {response && (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-black">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default FetchApiComponent;
