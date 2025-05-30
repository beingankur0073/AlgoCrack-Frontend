import { useEffect, useState } from "react";
import sampleProblems from "../constants/sampleQuestion.js";
import { getColor } from "../utils/colorFunc.js";

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

const Main = () => {
  const [problems, setProblems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setProblems(sampleProblems);
    setFiltered(sampleProblems);
  }, []);

 useEffect(() => {
  if (searchTerm === "") {
    setFiltered(problems);
  } else {
    setFiltered(
      problems.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
}, [searchTerm, problems]);

  const sortByDifficulty = () => {
    const sorted = [...filtered].sort((a, b) => {
      return sortAsc
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    });
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-6 sticky top-0 z-30 bg-gray-950 py-2">
          <h1 className="text-4xl font-bold text-blue-400">AlgoCrack</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Filter by difficulty..."
              className="px-3 py-1 rounded-lg bg-gray-800 text-white border border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => alert("Logged out")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Problem Table */}
        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th
                    className="p-4 cursor-pointer hover:text-blue-400"
                    onClick={sortByDifficulty}
                  >
                    Difficulty {sortAsc ? "↑" : "↓"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((problem, index) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-gray-800 border-b border-gray-800 cursor-pointer"
                    onClick={() => (window.location.href = `/problems/${problem.id}`)}
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 text-blue-300 hover:underline">
                      {problem.title}
                    </td>
                    <td className={`p-4 font-semibold ${getColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center p-4 text-gray-400">No problems found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
