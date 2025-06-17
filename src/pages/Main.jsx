import { useEffect, useState } from "react";
import { getColor } from "../utils/colorFunc.js";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../utils/api"; 
import { useNavigate } from "react-router-dom";
import { useProblems } from "../context/ProblemContext";
import toast from "react-hot-toast";


const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

const Main = () => {
  const { problems, setProblems, setSelectedProblem } = useProblems();
  
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = auth?.user?.avatar || "https://i.pravatar.cc/40?img=3";

  useEffect(() => {
  const fetchProblems = async () => {
    try {
      const res = await axios.get("/problems");
      setProblems(res.data.data);
      setFiltered(res.data.data);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  };
  fetchProblems();
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
    const sorted = [...filtered].sort((a, b) =>
      sortAsc
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
    );
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  const handleLogout = () => {
     toast.success("Logged out successfully!");
    logout();
    navigate("/login");
  };

  return (



    <div className="fixed inset-0 bg-gray-950 text-white flex justify-center items-start overflow-hidden">

      <div className="w-full max-w-5xl">
        {/* Top Header Row */}
        <div className="flex items-center justify-end mb-6 sticky top-0 z-30 bg-gray-950 py-2 px-2 mt-10">
          
          <h1 className="text-4xl font-bold text-blue-400 ">AlgoCrack</h1>

          {/* Spacer to push to right */}
          <div className="flex-grow" />

          {/* Right section: Search | Logout | Avatar */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search problems..."
              className="px-3 py-1 rounded-lg bg-gray-800 text-white border border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
            <img
              src={ avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-400 cursor-pointer"
              onClick={() => navigate("/profile")}
            />
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
                    key={problem._id}
                    className="hover:bg-gray-800 border-b border-gray-800 cursor-pointer"
                    onClick={() => {
                        setSelectedProblem(problem);
                        navigate(`/problems/${problem._id}`);
                      }}
                  > 
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 text-blue-300 hover:underline">
                      {problem.title}
                    </td>
                    <td
                      className={`p-4 font-semibold ${getColor(problem.difficulty)}`}
                    >
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
