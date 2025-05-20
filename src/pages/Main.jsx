import { useEffect, useState } from "react";
import sampleProblems from "../constants/sampleQuestion.js";



const Main = () => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        // TODO: Replace with API call to get questions
        setProblems(sampleProblems);
    }, []);

   return (
  <div className="min-h-screen bg-gray-950 text-white px-4 py-10 flex justify-center">
    <div className="w-full max-w-4xl">
      {/* Fixed Title */}
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-400 sticky top-0 bg-gray-950 z-20 py-2">
        AlgoCrack Questions
      </h1>

      <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
        {/* Scrollable container for table body only */}
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full table-auto text-left">
            {/* Sticky table head */}
            <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Title</th>
                <th className="p-4">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr
                  key={problem.id}
                  className="hover:bg-gray-800 border-b border-gray-800 cursor-pointer"
                  onClick={() => window.location.href = `/problems/${problem.id}`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 text-blue-300 hover:underline">{problem.title}</td>
                  <td className={`p-4 font-semibold ${getColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

};

// Utility to get Tailwind color for difficulty
function getColor(difficulty) {
    switch (difficulty) {
        case "Easy":
            return "text-green-400";
        case "Medium":
            return "text-yellow-400";
        case "Hard":
            return "text-red-400";
        default:
            return "";
    }
}

export default Main;
