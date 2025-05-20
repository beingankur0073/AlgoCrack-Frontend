import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import sampleProblems from "../constants/sampleQuestion.js"; // ✅ Import list
import CodeEditor from "../components/CodeEditor.jsx";

const Problem = () => {
    const { id } = useParams();
    const [code, setCode] = useState("// Write your code here");
    const [output, setOutput] = useState("");
    const [problem, setProblem] = useState(null); // ✅ state for loaded problem
    const [language, setLanguage] = useState("javascript");

    useEffect(() => {
        // Simulate API call to fetch problem by id
        const found = sampleProblems.find((p) => p.id === parseInt(id));      
        setProblem(found);  
        if (found) {
            setCode(found.functionSignature || "// Write your code here");
        }
    }, [id]);

    const handleRun = () => {
        console.log("Running code:", code);
        setOutput("Mock output: [0, 1]"); // Replace with actual API result later
    };

    if (!problem) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading problem...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white px-4 py-6 ">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-9">
                {/* Problem description */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-md overflow-auto">
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
                            {problem.constraints.map((c, i) => (
                                <li key={i}>{c}</li>
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
    );
};

export default Problem;
