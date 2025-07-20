import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import axios from "../utils/api";
import confetti from 'canvas-confetti';
import toast from "react-hot-toast";

const DEFAULT_SIGNATURES = {
  javascript: "// Write your code here (JS)",
  python: "# Write your code here (Python)",
  cpp: "// Write your code here (C++)"
};

const formatInput = (input) => {
  if (typeof input === 'string') return input;

  try {
    const values = Object.values(input);
    if (values.length === 1) {
      return values[0]; // If only one key, show the inner value
    }
    return JSON.stringify(input, null, 2);
  } catch {
    return JSON.stringify(input);
  }
};


const Problem = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState([]);
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`problems/details?ProblemId=${id}`);
        const data = res.data.data;
        setProblem(data);

        const sig = data.boilerplateCode?.[language] || DEFAULT_SIGNATURES[language];
     //   console.log(sig);
      //  console.log ( typeof data.boilerplateCode['cpp'])
        setCode(sig);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      const sig = problem.boilerplateCode?.[language] || DEFAULT_SIGNATURES[language];
      setCode(sig);
    }
  }, [language]);

  const handleRun = async () => {
    setOutput(["⏳ Running..."]);
    const accessToken = localStorage.getItem("accessToken");
    console.log("Running code with access token:", accessToken);

    try {
      const submitRes = await axios.post(
        `/submissions/${id}`,
        {
          code,
          language: language,
          problemId: problem._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const submissionId = submitRes.data.data.submissionId;

      const pollResult = async (retry = 0) => {
        try {
          const res = await axios.get(`/submissions/${submissionId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          const {
            status,
            testCaseResults,
            compileOutput,
            stderr,
          } = res.data.data;

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
              `Test Case ${index + 1}:\n  Input: ${formatInput(test.input)}\n  Expected: ${test.expectedOutput}\n  Output: ${test.actualOutput?.trim()}\n  Status: ${test.status}`
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
              `Test Case ${index + 1}:\n  Input: ${formatInput(test.input)}\n  Expected: ${test.expectedOutput}\n  Output: ${test.actualOutput?.trim()}\n  Status: ${test.status}`
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
      setOutput(`❌ Submission failed: ${err.response?.data?.message || err.message || 'Unknown error'}.`);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-400">Loading problem...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-slate-100 overflow-auto">
      <div className="flex-1 px-4 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem description */}
          <div className="bg-gradient-to-tr from-slate-900 via-slate-950 to-rose-800 p-6 rounded-xl shadow-md overflow-auto max-h-[80vh]">
            <h2 className="text-3xl font-bold mb-4 text-amber-400">{problem.title}</h2>
            <p className="mb-4 text-slate-300">{problem.description}</p>

            <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-amber-300">Examples:</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-800 p-3 rounded mb-2">
                <div><strong>Input:</strong> {formatInput(ex.input)}</div>
                <div><strong>Output:</strong> {ex.output}</div>
              </div>
            ))}
          </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-amber-300">Constraints:</h3>
              <ul className="list-disc list-inside text-slate-400">
                {(Array.isArray(problem.constraints) ? problem.constraints : String(problem.constraints).split(/[|,\n]/))
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
