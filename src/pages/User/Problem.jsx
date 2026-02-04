import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CodeEditor from "../../components/problemPage/CodeEditor.jsx";
import axios from "../../utils/api.js";
import { motion } from "framer-motion";

// NEW: Standard I/O Starter Templates
const STARTER_TEMPLATES = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    // Read from stdin, write to stdout
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
    }
}`,
  python: `# Write your code here
# Read from stdin, print to stdout
import sys

def solve():
    # input_str = sys.stdin.read()
    pass

if __name__ == "__main__":
    solve()
`,
  javascript: `// Write your code here
// Read from stdin, print to stdout

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');

function solve() {
    // Process input
}

solve();
`
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
  
  // Initialize with C++ template
  const [code, setCode] = useState(STARTER_TEMPLATES.cpp);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`problems/details?ProblemId=${id}`);
        const data = res.data.data;
        setProblem(data);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  // Update code when language changes
  useEffect(() => {
     // If user switched lang, give them the fresh starter template for that lang
     // (You might want to save their progress per lang in a real app, but this is simple)
     setCode(STARTER_TEMPLATES[language] || "// Start coding");
  }, [language]);

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
          className="bg-gradient-to-tr from-slate-900 via-slate-950 to-rose-800 p-6 rounded-xl shadow-lg overflow-auto max-h-[80vh] custom-scrollbar"
          variants={fadeUp}
        >
          <div className="flex justify-between items-start mb-4">
             <h2 className={`text-3xl font-bold ${difficultyColors[problem.difficulty] || "text-amber-400"}`}>
                {problem.title}
             </h2>
             <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                Time: {problem.timeLimit}s | Mem: {problem.memoryLimit}MB
             </span>
          </div>

          <p className="mb-6 text-slate-300 leading-relaxed whitespace-pre-wrap">{problem.description}</p>

          {/* New: Input/Output Format Instructions */}
          <div className="mb-6 space-y-4">
             <div>
                <h3 className="text-lg font-semibold text-amber-300 mb-1">Input Format</h3>
                <p className="text-slate-400 text-sm whitespace-pre-wrap bg-black/20 p-2 rounded border-l-2 border-amber-500">
                    {problem.inputFormat}
                </p>
             </div>
             <div>
                <h3 className="text-lg font-semibold text-amber-300 mb-1">Output Format</h3>
                <p className="text-slate-400 text-sm whitespace-pre-wrap bg-black/20 p-2 rounded border-l-2 border-amber-500">
                    {problem.outputFormat}
                </p>
             </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-300">Examples:</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded mb-4 border border-slate-700">
                <div className="mb-2">
                    <strong className="text-slate-400 text-xs uppercase tracking-wider">Input:</strong>
                    {/* Use <pre> for raw string display */}
                    <pre className="bg-black/40 p-2 rounded mt-1 text-sm font-mono text-slate-200 overflow-x-auto">
                        {ex.input}
                    </pre>
                </div>
                <div>
                    <strong className="text-slate-400 text-xs uppercase tracking-wider">Output:</strong>
                    <pre className="bg-black/40 p-2 rounded mt-1 text-sm font-mono text-slate-200 overflow-x-auto">
                        {ex.output}
                    </pre>
                </div>
                {ex.explanation && (
                    <div className="mt-2 text-sm text-slate-400 italic">
                        <strong>Explanation:</strong> {ex.explanation}
                    </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-amber-300">Constraints:</h3>
            <ul className="list-disc list-inside text-slate-400 leading-relaxed font-mono text-sm">
              {(Array.isArray(problem.constraints) ? problem.constraints : String(problem.constraints).split(/[|,\n]/))
                .filter(Boolean)
                .map((c, i) => (
                  <li key={i}>{c.trim()}</li>
                ))}
            </ul>
          </div>
        </motion.div>

        {/* Code editor and output */}
        <motion.div variants={fadeUp} key={language} className="flex flex-col h-[80vh]">
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