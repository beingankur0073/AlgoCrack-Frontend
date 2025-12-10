import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const languageMap = {
  "c++": "cpp",
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript",
  c: "c",
};

const LatestSubmissions = ({ submissions }) => {
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);
  const [copiedSubmissionId, setCopiedSubmissionId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="w-full">
     
      <div className="flex flex-col gap-2">
        {submissions.map((sub) => (
          <motion.div
            layout
            key={sub._id}
            title="Click to open problem"
            className="bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 p-2 rounded-md shadow border border-gray-700 transition-colors text-xs cursor-pointer"
            onClick={() => navigate(`/problems/${sub.problemId}`)}
            whileHover={{ scale: 1.01, translateY: -1 }} 
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-white truncate max-w-[150px]">{sub.problemTitle}</p>
              <span
                className={`px-1 py-0.5 text-xs rounded ${
                  sub.status === "Accepted" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {sub.status}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Difficulty:{" "}
              <span
                className={
                  sub.problemDifficulty === "Easy"
                    ? "text-green-400"
                    : sub.problemDifficulty === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {sub.problemDifficulty}
              </span>{" "}
              | Lang: <span className="uppercase">{sub.language}</span>
              <span className="hidden sm:inline"> | {new Date(sub.submittedAt).toLocaleDateString()}</span>
            </p>
            
            {/* Show Code Button */}
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedSubmissionId((prev) => (prev === sub._id ? null : sub._id));
                }}
                className="text-xs text-blue-400 hover:underline focus:outline-none"
              >
                {expandedSubmissionId === sub._id ? "Hide Code" : "Show Code"}
              </button>
              
              <AnimatePresence initial={false}>
                {expandedSubmissionId === sub._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-1"
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(sub.code);
                        setCopiedSubmissionId(sub._id);
                        setTimeout(() => setCopiedSubmissionId(null), 1500);
                      }}
                      className="absolute top-2 right-2 z-10 p-1 rounded bg-gray-700 hover:bg-gray-600 transition"
                      title="Copy to clipboard"
                    >
                      {copiedSubmissionId === sub._id ? (
                        <Check size={12} className="text-green-400" />
                      ) : (
                        <Copy size={12} className="text-white" />
                      )}
                    </button>
                    <SyntaxHighlighter
                      language={languageMap[sub.language.toLowerCase()] || "text"}
                      style={oneDark}
                      showLineNumbers={false}
                      wrapLongLines
                      customStyle={{
                        borderRadius: "0.4rem",
                        fontSize: "0.7rem",
                        padding: "0.5rem",
                        maxHeight: "200px", // Code block can scroll internally, that's fine
                        overflowY: "auto",
                        background: "#111",
                      }}
                    >
                      {sub.code}
                    </SyntaxHighlighter>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LatestSubmissions;