import { useEffect, useState } from "react";
import { getColor } from "../utils/colorFunc.js";
import axios from "../utils/api"; 
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems, setProblems, setSelectedProblem } from "../redux/problemSlice";
import { logout } from "../redux/authSlice";

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access problems and selectedProblem from Redux state
  const problems = useSelector((state) => state.problem.problems);
  // (no need to select selectedProblem here unless you want to display it)

  const auth = useSelector((state) => state.auth.auth);

  const avatarUrl = auth?.user?.avatar || "https://i.pravatar.cc/40?img=3";

  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    if (!problems || problems.length === 0) {
      dispatch(fetchProblems());
    }
  }, [dispatch, problems]);

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
    const sorted = [...filtered].sort((a, b) =>
      sortAsc
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
    );
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="text-white flex justify-center items-start ">
      <div className="w-full max-w-5xl pb-2">
        {/* You may add a search input here to update `searchTerm` */}
        {/* Problem Table */}
        <div className="bg-gradient-to-br from-black via-stone-950 to-green-900 rounded-xl shadow-md overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full table-auto text-left">
              <thead className="bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 sticky top-0 z-10">
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
                    key={problem._id}
                    className="hover:bg-gray-800 border-b border-gray-800 cursor-pointer"
                    onClick={() => {
                      dispatch(setSelectedProblem(problem));
                      navigate(`/problems/${problem._id}`);
                    }}
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
