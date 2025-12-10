import { useEffect, useRef, useState } from "react";
import { getColor } from "../../utils/colorFunc.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProblems,
  setSelectedProblem,
  resetProblems, // Ensure you import resetProblems if it exists in your slice
} from "../../redux/problemSlice.js";
import { FiSearch, FiChevronUp, FiChevronDown, FiRefreshCw } from "react-icons/fi"; // Added FiRefreshCw
import axios from "../../utils/api.js"; // Added axios for lightweight polling
import "../../animations.css";

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { problems, totalPages, totalProblems, loading } = useSelector(
    (state) => state.problem
  );

  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  
  // --- NEW: State for update notification ---
  const [hasNewProblems, setHasNewProblems] = useState(false);

  const LIMIT = 10;

  // Ref for scroll container
  const tableRef = useRef(null);

  // Fetch problems
  useEffect(() => {
    // If we have a dedicated reset action, use it on mount or refresh
    // Otherwise, the slice logic handles page 1 replacement
    dispatch(fetchProblems({ page, limit: LIMIT, append: page > 1 }));
  }, [dispatch, page]);

  // --- NEW: Polling Logic to check for updates ---
  useEffect(() => {
    // Only poll if we have loaded initial data
    if (!totalProblems) return;

    const checkInterval = setInterval(async () => {
        try {
            // Lightweight check: just ask for metadata (1 item)
            const response = await axios.get(`/problems?page=1&limit=1`);
            const serverTotal = response.data.data.totalProblems;

            // If server has more problems than our Redux state, show notification
            if (serverTotal > totalProblems) {
                setHasNewProblems(true);
            }
        } catch (error) {
            console.error("Background update check failed", error);
        }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [totalProblems]);

  // --- NEW: Handle Manual Refresh ---
  const handleRefresh = () => {
      setHasNewProblems(false);
      setPage(1);
      // If you have a reset action in Redux, dispatch it here:
      // dispatch(resetProblems()); 
      
      // Re-fetch page 1 (this will replace existing list due to page logic)
      dispatch(fetchProblems({ page: 1, limit: LIMIT, append: false }));
      
      // Scroll to top
      if (tableRef.current) {
          tableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  // Update filtered list
  useEffect(() => {
    if (!problems) return;

    if (searchTerm === "") {
      setFiltered(problems);
    } else {
      setFiltered(
        problems.filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, problems]);

  // Infinite scroll INSIDE TABLE
  useEffect(() => {
    const container = tableRef.current;
    if (!container) return;

    const handleScroll = () => {
      const reachedBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 80;

      if (reachedBottom && !loading && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPages]);

  // Sort only current filtered list
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
    <div className="flex justify-center mb-5">
      <div className="w-full max-w-5xl">
        {/* Header + Search */}
        <div className="flex justify-between items-center mb-8 px-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-neutral-400 to-red-500 bg-clip-text text-transparent">
            Problems
          </h1>

          <div className="flex items-center gap-4">
             {/* --- NEW: Refresh Button --- */}
             <button 
                onClick={handleRefresh}
                className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition text-gray-400 hover:text-white"
                title="Refresh list"
            >
                <FiRefreshCw size={18} />
            </button>

            <div className="relative group">
                <FiSearch
                className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-green-400"
                size={20}
                />
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="pl-10 pr-3 py-2 rounded-full bg-neutral-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 border border-neutral-700 w-60"
                />
            </div>
          </div>
        </div>

        {/* --- NEW: Notification Banner --- */}
        {hasNewProblems && (
            <div 
                onClick={handleRefresh}
                className="mb-4 bg-green-900/50 border border-green-500/30 text-green-200 px-4 py-2 rounded-lg text-center cursor-pointer hover:bg-green-900/70 transition-all animate-fadeIn flex items-center justify-center gap-2"
            >
                <FiRefreshCw className="animate-spin-slow" />
                New problems added! Click here to refresh.
            </div>
        )}

        {/* Table Container (FIXED HEIGHT + SCROLL) */}
        <div className="bg-gradient-to-br from-black via-zinc-950 to-green-900 rounded-xl shadow-2xl overflow-hidden animate-fadeInUp flex flex-col">
          
          {/* 🔥 FIXED HEIGHT here */}
          <div
            className="flex-grow overflow-y-auto custom-scrollbar"
            style={{ height: "400px" }}
            ref={tableRef}
          >
            <table className="w-full table-auto text-left">
              <thead className="bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 sticky top-0 z-10">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th className="p-4 cursor-pointer" onClick={sortByDifficulty}>
                    Difficulty{" "}
                    {sortAsc ? (
                      <FiChevronUp className="inline" />
                    ) : (
                      <FiChevronDown className="inline" />
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className={`group border-b border-gray-800 cursor-pointer hover:bg-white/5 transition duration-200`}
                    onClick={() => {
                      dispatch(setSelectedProblem(problem));
                      navigate(`/problems/${problem._id}`);
                    }}
                  >
                    <td className="p-4 text-gray-400">{index + 1}</td>
                    <td className="p-4 text-blue-300 font-medium">
                      {problem.title}
                    </td>
                    <td className={`p-4 font-semibold ${getColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No results */}
            {!loading && filtered.length === 0 && (
              <p className="text-center p-4 text-gray-400">No problems found.</p>
            )}

            {/* Infinite scroll loader */}
            {loading && (
              <div className="py-4 text-center text-gray-400">Loading more...</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Main;