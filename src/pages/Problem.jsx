import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import axios from "../utils/api"; 
import confetti from 'canvas-confetti';

const DEFAULT_SIGNATURES = {
  javascript: "// Write your code here (JS)",
  python: "# Write your code here (Python)",
  cpp: "// Write your code here (C++)"
};


const Problem = () => {
  const { id } = useParams(); // _id from MongoDB
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState([]);
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");

  
  useEffect(() => {
    const fetchProblem = async () => {
      try {
       
        const res = await axios.get(`problems/details?ProblemId=${id}`);
        const data=res.data.data
        setProblem(data);

        const sig = data.functionSignatures?.[language] || DEFAULT_SIGNATURES[language];
        setCode(sig);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  // 🔄 Update code when language changes
  useEffect(() => {
    if (problem) {
      const sig = problem.functionSignatures?.[language] || DEFAULT_SIGNATURES[language];
      setCode(sig);
    }
  }, [language]);

  const handleRun = async () => {
    setOutput(["⏳ Running..."]);

    const accessToken = localStorage.getItem("accessToken"); // Adjust if stored elsewhere

    try {
      // Get the numeric languageId from your mapping
     

      // Step 1: Submit code
      const submitRes = await axios.post(
        `/submissions/${id}`, // Changed to /submissions to match common API design where problemId is in body
        {
          code,
          language: language, 
          problemId: problem._id,      // ✅ Send problem ID in the body
          // You might also send userId if it's not extracted from the JWT
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );


      console.log(submitRes.data.data)
      const submissionId = submitRes.data.data.submissionId; 
      console.log("✅ Submission ID:", submissionId);

      // Step 2: Poll result
     const pollResult = async (retry = 0) => {
          try {
            const res = await axios.get(`/submissions/${submissionId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });

            // Unwrap the actual data object from response
            const {
              status,
              testCaseResults,
              compileOutput,
              stderr,
            } = res.data.data; // <-- Note: response has 'data.data'

            // Handle retry loop
             if (status === "Pending" || status === "Processing") {
          if (retry < 10) {
            setTimeout(() => pollResult(retry + 1), 1500);
          } else {
            setOutput(["⏳ Timeout: Judging took too long."]);
          }
          return;
        }

        if (status === "Compilation Error") {
          setOutput([`❌ Compilation Error:\n${compileOutput || "No compilation output."}`]);
          return;
        }

        if (status === "Runtime Error") {
          setOutput([`❌ Runtime Error:\n${stderr || "No runtime error output."}`]);
          return;
        }

        if (status === "Accepted") {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });

      const formattedResults = testCaseResults.map((test, index) =>
            `Test Case ${index + 1}:\n  Input: ${test.input}\n  Expected: ${test.expectedOutput}\n  Output: ${test.actualOutput?.trim()}\n  Status: ${test.status}`
          );

          setOutput([
            `🎉 Accepted! All test cases passed.`,
            ...formattedResults
          ]);
          return;
        }

        if (Array.isArray(testCaseResults)) {
          const failedCase = testCaseResults.find(tc => tc.status !== "Passed");
          const formattedResults = testCaseResults.map((test, index) =>
            `Test Case ${index + 1}:\n  Input: ${test.input}\n  Expected: ${test.expectedOutput}\n  Output: ${test.actualOutput?.trim()}\n  Status: ${test.status}`
          );
          if (failedCase) {
            setOutput([
              `❌ ${status} on a test case:`,
              ...formattedResults
            ]);
          } else {
            setOutput([`❌ ${status}. No failed test case data available.`, ...formattedResults]);
          }
        } else {
          setOutput([`❌ ${status}. Test case results not available.`]);
        }
      } catch (err) {
        setOutput([`❌ Error while fetching result: ${err.response?.data?.message || err.message || 'Unknown error'}.`]);
      }
    };


      pollResult();
    } catch (err) {
      console.error("❌ Submission failed:", err);
      // More detailed error message from backend
      setOutput(`❌ Submission failed: ${err.response?.data?.message || err.message || 'Unknown error'}.`);
    }
  };



  const handleLogout = () => {
    alert("Logging out...");
    navigate("/login");
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading problem...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex justify-between items-center px-4 py-6">
        <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">
          ← Back
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem description */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-md overflow-auto max-h-[80vh]">
            <h2 className="text-3xl font-bold mb-4">{problem.title}</h2>
            <p className="mb-4 text-gray-300">{problem.description}</p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Examples:</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-gray-800 p-3 rounded mb-2">
                  <div><strong>Input:</strong> {ex.input}</div>
                  <div><strong>Output:</strong> {ex.output}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
              <ul className="list-disc list-inside text-gray-400">
                {problem.constraints
                  .split(/[|,\n]/) // handles delimiter splitting
                  .map((c, i) => (
                    <li key={i}>{c.trim()}</li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Code editor and output */}
          <CodeEditor
            code={code}
            setCode={setCode}
            handleRun={handleRun}
            output={output}
            language={language}
            setLanguage={setLanguage}
          />

        </div>
      </div>
    </div>
  );
};

export default Problem;
