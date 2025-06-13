import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, handleRun, output, language, setLanguage }) => {
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" }
  ];

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

      {/* Editor */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-md flex-1">
        <Editor
          height="400px"
          defaultLanguage={language}
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleRun}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Run Code
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Submit
        </button>
      </div>

      {/* Output */}
      {hasOutput && (
        <div className="bg-gray-900 p-4 rounded-xl shadow-inner overflow-auto max-h-64">
          <h4 className="font-bold mb-4 text-white text-lg">Output:</h4>
          {Array.isArray(output) && output.length > 1 ? (
            <div className="flex flex-col gap-4">
              {/* Show the overall result */}
              <div className="mb-4 text-white font-semibold">
                {output[0]}
              </div>
              {/* Show each test case */}
              {output.slice(1).map((test, index) => {
                // Parse the string to extract test case details
                // Format: "Test Case 1:\n Input: 2\n Expected: 2\n Output: 2\n Status: Passed"
                const inputMatch = test.match(/Input:\s*(.*)/);
                const expectedMatch = test.match(/Expected:\s*(.*)/);
                const outputMatch = test.match(/Output:\s*(.*)/);
                const statusMatch = test.match(/Status:\s*(.*)/);

                const input = inputMatch ? inputMatch[1] : "";
                const expectedOutput = expectedMatch ? expectedMatch[1] : "";
                const actualOutput = outputMatch ? outputMatch[1] : "";
                const status = statusMatch ? statusMatch[1] : "";

                return (
                  <div
                    key={index}
                    className={`rounded-lg p-4 shadow transition-all border-2 w-full ${
                      status === "Passed"
                        ? "border-green-500 bg-gray-800/80"
                        : "border-red-500 bg-gray-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 font-semibold">
                        Test Case {index + 1}
                      </span>
                      <span
                        className={`font-bold px-2 py-1 rounded ${
                          status === "Passed"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
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
              })}
            </div>
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
