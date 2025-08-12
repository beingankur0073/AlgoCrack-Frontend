import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../../components/problemPage/CodeEditor.jsx";
import axios from "../../utils/api.js";
import { formatInput } from "../../utils/inputFormat.js";
import { motion } from "framer-motion";

const DEFAULT_SIGNATURES = {
  javascript: "// Write your code here (JS)",
  python: "# Write your code here (Python)",
  cpp: "// Write your code here (C++)"
};

const difficultyColors = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } }
};

const Problem = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_SIGNATURES.cpp);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`problems/details?ProblemId=${id}`);
        const data = res.data.data;
        setProblem(data);

        // Set starter code based on language and API boilerplate if available
        const sig = data.boilerplateCode?.[language] || DEFAULT_SIGNATURES[language] || "// Start coding";
        setCode(sig);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id, language]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-400">Loading problem...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col text-slate-100 overflow-auto px-4 py-8"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        {/* Problem description */}
        <motion.div
          className="bg-gradient-to-tr from-slate-900 via-slate-950 to-rose-800 p-6 rounded-xl shadow-lg overflow-auto max-h-[80vh] hover:shadow-2xl transition-shadow duration-300"
          variants={fadeUp}
        >
          <h2
            className={`text-3xl font-bold mb-6 ${
              difficultyColors[problem.difficulty] || "text-amber-400"
            }`}
          >
            {problem.title}
          </h2>

          <p className="mb-6 text-slate-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-300">Examples:</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded mb-4 select-text">
                <div><strong>Input:</strong> {formatInput(ex.input)}</div>
                <div><strong>Output:</strong> {ex.output}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-300">Constraints:</h3>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed">
              {(Array.isArray(problem.constraints) ? problem.constraints : String(problem.constraints).split(/[|,\n]/))
                .filter(Boolean)
                .map((c, i) => (
                  <li key={i}>{c.trim()}</li>
                ))}
            </ul>
          </div>
        </motion.div>

        {/* Code editor and output */}
        <motion.div variants={fadeUp} key={language} className="flex flex-col">
          <CodeEditor
            id={id}
            problem={problem}
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Problem;
