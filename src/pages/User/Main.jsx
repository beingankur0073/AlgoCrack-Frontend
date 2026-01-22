import { useEffect, useRef, useState } from "react";
import { getColor } from "../../utils/colorFunc.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProblems,
  setSelectedProblem,
} from "../../redux/problemSlice.js";
import {
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiRefreshCw,
} from "react-icons/fi";
import axios from "../../utils/api.js";
import "../../animations.css";

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
const LIMIT = 10;

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
  const [hasNewProblems, setHasNewProblems] = useState(false);

  const tableRef = useRef(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchProblems({ page, limit: LIMIT, append: page > 1 }));
  }, [dispatch, page]);

  /* ================= FILTER ================= */
  useEffect(() => {
    if (!problems) return;

    if (!searchTerm) {
      setFiltered(problems);
    } else {
      setFiltered(
        problems.filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, problems]);

  /* ================= SORT ================= */
  const sortByDifficulty = () => {
    const sorted = [...filtered].sort((a, b) =>
      sortAsc
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
    );
    setFiltered(sorted);
    setSortAsc(!sortAsc);
  };

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    const container = tableRef.current;
    if (!container) return;

    const onScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 80 &&
        !loading &&
        page < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [loading, page, totalPages]);

  /* ================= BACKGROUND POLLING ================= */
  useEffect(() => {
    if (!totalProblems) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/problems?page=1&limit=1`);
        const serverTotal = res.data?.data?.totalProblems;

        if (serverTotal > totalProblems) {
          setHasNewProblems(true);
        }
      } catch (err) {
        console.error("Polling failed");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [totalProblems]);

  /* ================= MANUAL REFRESH ================= */
  const handleRefresh = () => {
    setHasNewProblems(false);
    setPage(1);
    dispatch(fetchProblems({ page: 1, limit: LIMIT, append: false }));

    if (tableRef.current) {
      tableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center mb-5">
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 px-2 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-400 via-neutral-400 to-red-500 bg-clip-text text-transparent">
            Problems
          </h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Refresh hidden on mobile */}
            <button
              onClick={handleRefresh}
              className="hidden md:flex p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 text-gray-400 hover:text-white"
              title="Refresh"
            >
              <FiRefreshCw size={18} />
            </button>

            {/* Search */}
            <div className="relative w-full md:w-60">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problems"
                className="pl-9 pr-3 py-2 w-full rounded-full bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-green-400 border border-neutral-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* UPDATE BANNER */}
        {hasNewProblems && (
          <div
            onClick={handleRefresh}
            className="mb-4 bg-green-900/40 border border-green-500/30 text-green-200 px-4 py-2 rounded-lg text-center cursor-pointer hover:bg-green-900/60 transition animate-fadeIn flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="animate-spin-slow" />
            New problems added! Tap to refresh
          </div>
        )}

        {/* TABLE CONTAINER */}
        <div className="bg-gradient-to-br from-black via-zinc-950 to-green-900 rounded-xl shadow-2xl overflow-hidden">
          <div
            ref={tableRef}
            className="overflow-y-auto custom-scrollbar h-[320px] md:h-[400px]"
          >
            <table className="w-full table-auto text-left">
              <thead className="sticky top-0 bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 z-10">
                <tr>
                  <th className="hidden md:table-cell p-4">#</th>
                  <th className="p-4">Title</th>
                  <th className="p-4 cursor-pointer" onClick={sortByDifficulty}>
                    Difficulty
                    <span className="hidden md:inline ml-1">
                      {sortAsc ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className="border-b border-gray-800 hover:bg-white/5 cursor-pointer transition active:bg-white/10"
                    onClick={() => {
                      dispatch(setSelectedProblem(problem));
                      navigate(`/problems/${problem._id}`);
                    }}
                  >
                    <td className="hidden md:table-cell p-4 text-gray-400">
                      {index + 1}
                    </td>
                    <td className="p-4 text-blue-300 font-medium text-sm md:text-base">
                      {problem.title}
                    </td>
                    <td
                      className={`p-4 font-semibold text-sm md:text-base ${getColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EMPTY */}
            {!loading && filtered.length === 0 && (
              <p className="text-center py-6 text-gray-400">
                No problems found.
              </p>
            )}

            {/* LOADER */}
            {loading && (
              <div className="py-4 text-center text-gray-400 text-sm">
                Loading more…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
