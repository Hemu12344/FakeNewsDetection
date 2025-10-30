import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Newspaper } from "lucide-react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", { text });
      setResult(res.data);
    } catch (err) {
      setResult({
        predicted_label: "❌ Error",
        message: "Backend not reachable. Please check FastAPI server.",
        confidence: 0,
        scores: {},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-3 mb-8"
      >
        <Newspaper className="text-blue-400 w-10 h-10" />
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Fake News Detector
        </h1>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xl bg-gray-800/60 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-lg"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="5"
          placeholder="📰 Enter a news headline or article..."
          className="w-full p-4 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2.5 rounded-lg font-semibold flex justify-center items-center gap-2 shadow-md"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Checking...
            </>
          ) : (
            "Check News"
          )}
        </motion.button>
      </motion.form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-gray-800/70 border border-gray-700 rounded-2xl w-full max-w-xl shadow-xl"
        >
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`text-3xl font-bold mb-3 ${
              result.predicted_label?.toLowerCase().includes("fake")
                ? "text-red-400"
                : result.predicted_label?.toLowerCase().includes("true")
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {result.predicted_label}
          </motion.h2>

          <p className="text-gray-300 text-sm">{result.message}</p>

          {result.confidence > 0 && (
            <p className="mt-3 text-sm text-gray-400">
              Confidence:{" "}
              <span className="font-semibold text-blue-400">
                {(result.confidence * 100).toFixed(2)}%
              </span>
            </p>
          )}

          {result.scores && Object.keys(result.scores).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <h3 className="font-semibold mb-2 text-gray-300">🔍 Score Breakdown:</h3>
              <ul className="space-y-2">
                {Object.entries(result.scores).map(([label, score]) => (
                  <li
                    key={label}
                    className="flex justify-between text-sm bg-gray-900/50 p-2 rounded-md"
                  >
                    <span className="capitalize text-gray-200">{label}</span>
                    <span className="text-blue-400 font-semibold">
                      {(score * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;
