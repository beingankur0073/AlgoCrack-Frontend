import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import toast from "react-hot-toast";
import backImg from "../assets/back.jpg";
import { Info, Copy, Check } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [rawJsonInput, setRawJsonInput] = useState("{}");
  const [showJsonExample, setShowJsonExample] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const LANGUAGE_COLORS = {
    'cpp': '#F34B7D',
    'python': '#3572A5',
    'javascript': '#F1E05A',
    'java': '#B07219'
  };

 

  const handleRawJsonSubmit = async () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      await axios.post("/problems/add", parsed);
      toast.success("Question added via JSON");
      setRawJsonInput("{}");
      fetchData();
    } catch (err) {
      toast.error("Invalid JSON or error adding question");
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const [problemRes, userRes,statRes] = await Promise.all([
        axios.get("/admin/problems"),
        axios.get("/admin/users"),
        axios.get("/stats"),
      ]);
      setQuestions(problemRes.data.data);
      setUsers(userRes.data.data);
      setStats(statRes.data.data);
     
    } catch (error) {
      toast.error("Failed to fetch admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`/problems/${id}`);
      toast.success("Question deleted");
      fetchData();
    } catch (err) {
      toast.error("Error deleting question");
    }
  };

  const deleteAllQuestions = async () => {
    try {
      await axios.delete("/admin/questions");
      toast.success("All questions deleted");
      fetchData();
    } catch (err) {
      toast.error("Error deleting all questions");
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!stats) return {};

    // Language distribution data
    const languageData = stats.submissionsPerLanguage.map(lang => ({
      name: lang._id,
      value: lang.count,
      color: LANGUAGE_COLORS[lang._id] || COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    // User signups over time
    const signupsData = stats.usersJoinedOverTime.map(item => ({
      date: item._id,
      users: item.count
    }));

    // Submission status distribution
    const statusData = stats.submissionStatusDistribution.map(status => ({
      name: status._id,
      value: status.count
    }));

    return { languageData, signupsData, statusData };
  };

  const { languageData = [], signupsData = [], statusData = [] } = prepareChartData();

  return (
    <div
      className="relative text-white min-h-screen"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/60 z-0" />
      <div className="relative z-10 pr-8 pl-8 pb-8 pt-0.5 space-y-8">
        <h1 className="text-4xl font-bold text-center text-emerald-400">Admin Dashboard</h1>

        {/* Stats Overview Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</p>
            </div>
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-400">Total Problems</h3>
              <p className="text-2xl font-bold text-amber-400">{stats.totalProblems}</p>
            </div>
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-400">Total Submissions</h3>
              <p className="text-2xl font-bold text-lime-400">{stats.totalSubmissions}</p>
            </div>
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-400">Acceptance Rate</h3>
              <p className="text-2xl font-bold text-green-400">
                {Math.round((stats.submissionStatusDistribution.find(s => s._id === "Accepted")?.count / stats.totalSubmissions) * 100)}%
              </p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Usage Pie Chart */}
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-center">Language Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Signups Bar Chart */}
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-center">User Signups Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={signupsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                    />
                    <Bar dataKey="users" fill="#8884d8" name="New Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Submission Status Pie Chart */}
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-center">Submission Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Solved Problems */}
            <div className="bg-gray-900/90 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-center">Most Solved Problems</h3>
              <ul className="space-y-2">
                {stats.mostSolvedProblems.map((problem, index) => (
                  <li key={problem.problemId} className="flex justify-between items-center">
                    <span className="text-sm">{index + 1}. {problem.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      problem.difficulty === "Easy" ? "bg-green-900 text-green-300" :
                      problem.difficulty === "Medium" ? "bg-yellow-900 text-yellow-300" :
                      "bg-red-900 text-red-300"
                    }`}>
                      {problem.solvedCount} solves
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-gray-900/90 p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-3">
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-emerald-300">Add via Raw JSON</h2>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowJsonExample(!showJsonExample)}
                  className="flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:underline"
                >
                  <Info size={16} /> Click to {showJsonExample ? "hide" : "view"} JSON format
                </button>

                <div className="relative group">
                  <button
                    title="Copy JSON"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(exampleQuestion, null, 2));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1 rounded hover:bg-gray-700 transition"
                  >
                    <span className="sr-only">Copy</span>
                    {copied ? (
                      <Check size={16} className="text-green-400 transition-all duration-200 ease-in-out scale-110 opacity-100" />
                    ) : (
                      <Copy size={16} className="text-white transition-all duration-200 ease-in-out hover:scale-105" />
                    )}
                  </button>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Copy JSON
                  </div>
                </div>
              </div>

              {showJsonExample && (
                <div className="bg-gray-800 p-4 rounded text-green-300 text-sm whitespace-pre-wrap max-h-72 overflow-y-auto border border-gray-700">
                  <pre>{JSON.stringify(exampleQuestion, null, 2)}</pre>
                </div>
              )}
            </div>

            <textarea
              value={rawJsonInput}
              onChange={(e) => setRawJsonInput(e.target.value)}
              placeholder="Paste your question JSON here..."
              rows={10}
              className="p-2 w-full bg-gray-800 border border-gray-700 rounded font-mono text-sm text-white"
            />

            <button
              onClick={handleRawJsonSubmit}
              className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Submit JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/90 p-3 rounded-lg shadow-md max-h-[500px] overflow-y-auto text-sm">
            <h2 className="text-lg font-semibold mb-2 text-cyan-300">Users ({users.length})</h2>
            <ul className="space-y-3">
              {users.map((u) => (
                <li key={u._id} className="flex flex-col gap-1 border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-2">
                    <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full border" />
                    <div>
                      <p className="text-sm font-semibold">{u.fullName} <span className="text-gray-400">({u.username})</span></p>
                      <p className="text-xs text-gray-400">Role: {u.role}</p>
                      <p className="text-xs text-gray-400">Created: {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/90 p-3 rounded-lg shadow-md max-h-[500px] overflow-y-auto text-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-amber-400">Questions ({questions.length})</h2>
              <button
                onClick={deleteAllQuestions}
                className="bg-red-600 px-3 py-1 rounded text-xs hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
            <ul className="space-y-2">
              {questions.map((q) => (
                <li key={q._id} className="border-b border-gray-700 pb-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-white text-sm break-words font-medium flex-1">{q.title}</p>
                    <span className={`text-xs ${q.difficulty === "Easy" ? "text-green-400" : q.difficulty === "Medium" ? "text-yellow-400" : "text-red-400"}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="text-red-400 hover:underline text-xs mt-1 cursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/90 p-3 rounded-lg shadow-md max-h-[500px] overflow-y-auto text-sm">
            <h2 className="text-lg font-semibold mb-2 text-lime-400">Submissions ({submissions.length})</h2>
            {submissions.length === 0 ? (
              <p className="text-sm text-gray-400">No submissions loaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {submissions.map((s) => (
                  <li key={s._id}>
                    {s.username} solved <strong>{s.problemTitle}</strong> on {new Date(s.submittedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
