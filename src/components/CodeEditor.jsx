import Editor from "@monaco-editor/react";
import axios from "../utils/api";
import { useEffect, useState } from "react";
import confetti from 'canvas-confetti';
import { formatInput } from "../utils/inputFormat.js";




const CodeEditor = ({ id,problem, language, setLanguage }) => {
   const [code, setCode] = useState("");
   const [output, setOutput] = useState([]);
  const [expandedTest, setExpandedTest] = useState(null);


  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" }
  ];
  const DEFAULT_SIGNATURES = {
  javascript: "// Write your code here (JS)",
  python: "# Write your code here (Python)",
  cpp: "// Write your code here (C++)"
};

   useEffect(() => {
      if (problem) {
        const sig =  DEFAULT_SIGNATURES[language];
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

  
  // Helper to check if output is empty
  const hasOutput = Array.isArray(output)
    ? output.length > 0 && output.some((item) => item && item.trim() !== "")
    : output && output.toString().trim() !== "";

  return (
    <div className="flex flex-col gap-4">
      {/* Language Selector */}
      <div className="flex items-center justify-between">
        <label htmlFor="language" className="text-sm text-gray-400 font-medium">
          Language:
        </label>
        <select
          id="language"
          className="bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none"
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

      {/* Editor - Uncommented */}
      <Editor
        height="400px"
       
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => {
          console.log("lopp")
          if (typeof value === "string") {
           
            setCode(value);
          } else {
          
            console.warn("Invalid code value from Monaco:", value);
          }
        }}

        // onMount={(editor) => {
        //   console.log("Editor mounted:", editor);
        // }}
        onValidate={(markers) => {
          if (markers.length > 0) console.warn("Validation errors:", markers);
        }}
        loading={<div className="text-white">Loading editor...</div>}
      />

      {/* Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={handleRun}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Submit
        </button>
      </div>

      {hasOutput && (
  <div className="bg-gray-900 p-4 rounded-xl shadow-inner overflow-auto max-h-64">
    <h4 className="font-bold mb-4 text-white text-lg">Output:</h4>
    {Array.isArray(output) && output.length > 1 ? (
      <>
        {/* Overall result */}
        <div className="mb-4 text-white font-semibold">{output[0]}</div>

        {/* Horizontal list of test cases */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {output.slice(1).map((test, index) => (
            <button
              key={index}
              className={`
                flex-shrink-0 px-4 py-2 rounded-t-lg font-semibold border-b-4
                transition-all duration-200
                ${
                  expandedTest === index
                    ? "bg-gray-800 text-emerald-300 border-emerald-400"
                    : "bg-gray-800 text-gray-200 border-transparent hover:bg-gray-700"
                }
              `}
              onClick={() => setExpandedTest(expandedTest === index ? null : index)}
            >
              Test Case {index + 1}
            </button>
          ))}
        </div>

        {/* Details panel for expanded test case */}
        {expandedTest !== null && (() => {
          const test = output[expandedTest + 1]; // +1 due to output[0] being summary
          const inputMatch = test.match(/Input:\s*(.*)/);
          const expectedMatch = test.match(/Expected:\s*(.*)/);
          const outputMatch = test.match(/Output:\s*(.*)/);
          const statusMatch = test.match(/Status:\s*(.*)/);

          const rawInput = inputMatch ? inputMatch[1] : "";
          let input = "";
          try {
            const parsedInput = JSON.parse(rawInput);
            if (typeof parsedInput === "object" && parsedInput !== null) {
              input = Object.values(parsedInput).join(" ");
            } else {
              input = parsedInput;
            }
          } catch {
            input = rawInput;
          }

          const expectedOutput = expectedMatch ? expectedMatch[1] : "";
          const actualOutput = outputMatch ? outputMatch[1] : "";
          const status = statusMatch ? statusMatch[1] : "";

          return (
            <div
              className={`
                rounded-b-lg p-4 shadow border-t-2 w-full
                ${status === "Passed" ?
                  "border-green-500 bg-gray-800/80"
                  : "border-red-500 bg-gray-800/80"}
                mt-0
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-300">
                  Test Case {expandedTest + 1}
                </span>
                <span className={`font-bold px-2 py-1 rounded
                  ${status === "Passed"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"}
                `}>
                  {status}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-blue-300 font-semibold">Input:</span>{" "}
                <span className="text-white">{input}</span>
              </div>
              <div className="mb-1">
                <span className="text-yellow-300 font-semibold">Expected:</span>{" "}
                <span className="text-white">{expectedOutput}</span>
              </div>
              <div>
                <span className="text-green-300 font-semibold">Output:</span>{" "}
                <span className="text-white">{actualOutput}</span>
              </div>
            </div>
          );
        })()}
      </>
    ) : (
      <pre className="whitespace-pre-wrap break-words bg-gray-800 rounded-lg p-4 text-green-400 font-mono">
        {output}
      </pre>
    )}
  </div>
)}




    </div>
  );
};

export default CodeEditor;