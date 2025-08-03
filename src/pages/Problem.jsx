import { useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import axios from "../utils/api";
import toast from "react-hot-toast";
import { formatInput } from "../utils/inputFormat.js";






const Problem = () => {
  const { id } = useParams();
 
 
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`problems/details?ProblemId=${id}`);
        const data = res.data.data;
        setProblem(data);

        const sig = DEFAULT_SIGNATURES[language];
     //   console.log(sig);
      //  console.log ( typeof data.boilerplateCode['cpp'])
        setCode(sig);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  
 

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
            id={id}
            problem={problem}
            language={language}
            setLanguage={setLanguage}
          />
        </div>

      </div>
    </div>
  );
};

export default Problem;
