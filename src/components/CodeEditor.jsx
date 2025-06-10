
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, handleRun, output, language, setLanguage }) => {
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" }
  ];

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
    <div className="bg-gray-900 p-4 rounded-xl text-green-400 font-mono shadow-inner overflow-auto max-h-64">
          <h4 className="font-bold mb-2 text-white">Output:</h4>
          {Array.isArray(output?.testCaseResults) ? (
            output.testCaseResults.map((test, index) => (
              <div key={test._id} className="mb-2">
                <div><span className="text-gray-400">Test Case {index + 1}:</span></div>
                <div><span className="text-blue-300">Input:</span> {test.input}</div>
                <div><span className="text-yellow-300">Expected:</span> {test.expectedOutput}</div>
                <div><span className="text-green-300">Output:</span> {test.actualOutput.trim()}</div>
                <div>
                  <span
                    className={`font-semibold ${
                      test.status === "Passed" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {test.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          )}
        </div>
      
    </div>
  );
};

export default CodeEditor;
