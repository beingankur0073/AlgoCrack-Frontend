import { useEffect, useState } from "react";
import { getColor } from "../utils/colorFunc.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems, setSelectedProblem } from "../redux/problemSlice";
import { FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi"; // Make sure to install react-icons

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const problems = useSelector((state) => state.problem.problems);

  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch the problems if not already present
  useEffect(() => {
    if (!problems || problems.length === 0) {
      dispatch(fetchProblems());
    }
  }, [dispatch, problems]);

  // Update filtered list whenever problems or search term changes
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

  // Sorting handler
  const sortByDifficulty = () => {
    const sorted = [...filtered].sort((a, b) =>
      sortAsc
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
    );
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  // Animation control
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-center mb-5">
      <div className="w-full max-w-5xl">
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-8 px-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Problems
          </h1>
          <div className="relative group">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search problems"
              className="pl-10 pr-3 py-2 rounded-full bg-neutral-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all border border-neutral-700 shadow-md hover:shadow-lg duration-200 w-60 group"
              autoFocus
            />
          </div>
        </div>

        {/* Animated Problem Table */}
        <div className="bg-gradient-to-br from-black via-zinc-950 to-green-900 rounded-xl shadow-2xl overflow-hidden animate-fadeInUp">
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            <table className="w-full table-auto text-left">
              <thead className="bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 sticky top-0 z-10">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th
                    className="p-4 cursor-pointer select-none transition hover:text-blue-400 relative"
                    onClick={sortByDifficulty}
                  >
                    Difficulty{" "}
                    {sortAsc ? (
                      <FiChevronUp className="inline ml-1 mb-0.5" size={18} />
                    ) : (
                      <FiChevronDown className="inline ml-1 mb-0.5" size={18} />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className={`group border-b border-gray-800 cursor-pointer transition-colors duration-300
                    ${mounted ? "animate-fadeInRow" : ""}
                    hover:bg-gradient-to-r hover:from-[#132c21] hover:via-[#111821] hover:to-[#28131f] `}
                    style={{
                      animationDelay: `${index * 45}ms`
                    }}
                    onClick={() => {
                      dispatch(setSelectedProblem(problem));
                      navigate(`/problems/${problem._id}`);
                    }}
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 text-blue-300 hover:text-pink-400 font-medium transition duration-150">
                      {problem.title}
                    </td>
                    <td className={`p-4 font-semibold ${getColor(problem.difficulty)} transition-all duration-300`}>
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center p-4 text-gray-400 animate-fadeIn">No problems found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.55s cubic-bezier(0.33,1,0.68,1) both;
        }
        @keyframes fadeInRow {
          from { opacity: 0; transform: translateY(6px) scale(0.97);}
          to   { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fadeInRow {
          animation: fadeInRow 0.6s cubic-bezier(0.5,1.5,0.7,1) both;
        }
        @keyframes fadeIn {
          from {opacity:0}
          to {opacity:1}
        }
        .animate-fadeIn { animation: fadeIn 0.8s both; }
        /* Custom scrollbar for modern look */
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg,#444 45%,#0a451a, #411333);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default Main;
