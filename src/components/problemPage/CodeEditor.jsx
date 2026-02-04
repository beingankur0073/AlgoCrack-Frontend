import Editor from "@monaco-editor/react";
import axios from "../../utils/api.js";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { fetchProfileData } from "../../redux/profileSlice.js";
import { FiLoader, FiCheckCircle, FiXCircle, FiAlertTriangle } from "react-icons/fi";

const languages = [
  { value: "cpp", label: "C++ (GCC)" },
  { value: "java", label: "Java (OpenJDK)" },
  { value: "python", label: "Python 3" },
  { value: "javascript", label: "JavaScript (Node.js)" },
];

function shootConfetti() {
  confetti({ particleCount: 120, spread: 70, origin: { x: 0.5, y: 0.7 } });
  confetti({ particleCount: 100, spread: 100, origin: { x: 0.2, y: 0.8 } });
  confetti({ particleCount: 100, spread: 100, origin: { x: 0.8, y: 0.8 } });
}

const CodeEditor = ({ id, problem, language, setLanguage, code, setCode }) => {
  const [outputStatus, setOutputStatus] = useState(null); // 'Running', 'Success', 'Error'
  const [outputMessage, setOutputMessage] = useState(""); // Top level message
  const [testResults, setTestResults] = useState([]); // Array of test case results
  const [expandedTest, setExpandedTest] = useState(0); // Default open first failed case or first case
  const dispatch = useDispatch();

  // Handle Code Execution
  const handleRun = async () => {
    setOutputStatus("Running");
    setOutputMessage("Running test cases...");
    setTestResults([]);
    setExpandedTest(null);

    const accessToken = localStorage.getItem("accessToken");

    try {
      // 1. Submit Code
      const submitRes = await axios.post(`/submissions/${id}`, {
        code,
        language,
        problemId: problem._id,
      });

      const submissionId = submitRes.data.data.submissionId;

      // 2. Poll for Results
      const pollResult = async (retry = 0) => {
        try {
          const res = await axios.get(`/submissions/${submissionId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const { status, testCaseResults, compileOutput, stderr } = res.data.data;

          if (status === "Pending" || status === "Processing") {
            if (retry < 20) { // Poll for up to 30 seconds
              setTimeout(() => pollResult(retry + 1), 1500);
            } else {
              setOutputStatus("Error");
              setOutputMessage("Timeout: Server took too long to respond.");
            }
            return;
          }

          // --- Finished Processing ---
          dispatch(fetchProfileData()); // Refresh profile stats

          // Handle Global Errors (Compilation / Runtime)
          if (status === "Compilation Error") {
            setOutputStatus("Error");
            setOutputMessage("Compilation Error");
            setTestResults([{ isError: true, title: "Compiler Output", content: compileOutput }]);
            return;
          }

          if (status === "Runtime Error") {
            setOutputStatus("Error");
            setOutputMessage("Runtime Error");
            setTestResults([{ isError: true, title: "Stderr", content: stderr }]);
            return;
          }

          // Handle Test Case Results
          setTestResults(testCaseResults || []);

          if (status === "Accepted") {
            shootConfetti();
            setOutputStatus("Success");
            setOutputMessage("Accepted! All test cases passed.");
            setExpandedTest(0); // Open first case
          } else {
            // Find first failed case to expand automatically
            const firstFailedIndex = testCaseResults.findIndex(tc => tc.status !== "Passed");
            setExpandedTest(firstFailedIndex !== -1 ? firstFailedIndex : 0);
            
            setOutputStatus("Error");
            setOutputMessage(`Wrong Answer on Test Case ${firstFailedIndex + 1}`);
          }

        } catch (err) {
          setOutputStatus("Error");
          setOutputMessage(`Error polling result: ${err.message}`);
        }
      };

      await pollResult();

    } catch (err) {
      setOutputStatus("Error");
      setOutputMessage(`Submission failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-t-lg border-b border-slate-700">
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 font-mono px-2">Language:</span>
            <select
            className="bg-slate-800 text-slate-200 px-3 py-1 rounded border border-slate-700 focus:border-amber-500 outline-none text-sm font-mono"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            >
            {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                {lang.label}
                </option>
            ))}
            </select>
        </div>
        
        <button
          onClick={handleRun}
          disabled={outputStatus === "Running"}
          className={`px-6 py-1.5 rounded font-semibold text-sm transition-all flex items-center gap-2
            ${outputStatus === "Running" 
                ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/20"
            }`}
        >
          {outputStatus === "Running" ? <FiLoader className="animate-spin" /> : "Run Code"}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-grow border border-slate-700 rounded-b-lg overflow-hidden shadow-2xl relative">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language} // Monaco uses 'cpp', 'java', 'python', 'javascript'
            value={code}
            theme="vs-dark"
            onChange={(val) => setCode(val || "")}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 }
            }}
            loading={<div className="bg-slate-900 h-full w-full flex items-center justify-center text-slate-400">Loading Editor...</div>}
          />
      </div>

      {/* Output Console */}
      {outputStatus && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col max-h-[300px]"
        >
            {/* Console Header */}
            <div className={`p-3 border-b border-slate-700 flex items-center gap-2 font-semibold
                ${outputStatus === "Success" ? "text-green-400 bg-green-900/20" : 
                  outputStatus === "Error" ? "text-red-400 bg-red-900/20" : "text-amber-400 bg-amber-900/20"}`}
            >
                {outputStatus === "Running" && <FiLoader className="animate-spin" />}
                {outputStatus === "Success" && <FiCheckCircle />}
                {outputStatus === "Error" && <FiXCircle />}
                {outputMessage}
            </div>

            {/* Test Case Tabs */}
            {testResults.length > 0 && !testResults[0].isError && (
                <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-950/50">
                    {testResults.map((result, idx) => (
                        <button
                            key={idx}
                            onClick={() => setExpandedTest(idx)}
                            className={`px-4 py-2 text-xs font-mono border-r border-slate-800 transition-colors flex items-center gap-2
                                ${expandedTest === idx ? "bg-slate-800 text-white border-b-2 border-b-amber-500" : "text-slate-400 hover:bg-slate-800/50"}
                            `}
                        >
                            Case {idx + 1}
                            {result.status === "Passed" 
                                ? <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                                : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        </button>
                    ))}
                </div>
            )}

            {/* Test Case Details / Compilation Output */}
            <div className="p-4 overflow-y-auto custom-scrollbar font-mono text-sm bg-slate-950">
                {/* Scenario A: Compilation Error or Global Error */}
                {testResults.length > 0 && testResults[0].isError && (
                    <pre className="text-red-300 whitespace-pre-wrap">{testResults[0].content}</pre>
                )}

                {/* Scenario B: Test Case Detail */}
                {testResults.length > 0 && !testResults[0].isError && expandedTest !== null && (
                    <div className="space-y-3 animate-fadeIn">
                        <div>
                            <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Input</span>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-wrap">
                                {testResults[expandedTest].input}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Expected Output</span>
                                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-wrap">
                                    {testResults[expandedTest].expectedOutput}
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Your Output</span>
                                <div className={`p-2 rounded border whitespace-pre-wrap
                                    ${testResults[expandedTest].status === "Passed" 
                                        ? "bg-green-900/10 border-green-900/30 text-green-300" 
                                        : "bg-red-900/10 border-red-900/30 text-red-300"}`}
                                >
                                    {testResults[expandedTest].actualOutput || <span className="text-slate-600 italic">No output</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
      )}
    </div>
  );
};

export default CodeEditor;