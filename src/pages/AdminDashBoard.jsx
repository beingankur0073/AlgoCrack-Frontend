import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import toast from "react-hot-toast";
import backImg from "../assets/back.jpg";
import { exampleQuestion } from "../utils/constants.js";
import { Info, Copy, Check } from "lucide-react"; 

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [rawJsonInput, setRawJsonInput] = useState("");
  const [showJsonExample, setShowJsonExample] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRawJsonSubmit = async () => {
  try {
    const parsed = JSON.parse(rawJsonInput);
    await axios.post("/admin/questions", parsed);
    toast.success("Question added via JSON");
    setRawJsonInput("");
    fetchData();
  } catch (err) {
    toast.error("Invalid JSON or error adding question");
    console.error(err);
  }
};



  const fetchData = async () => {
    try {
      const [problemRes, userRes] = await Promise.all([
        axios.get("/admin/problems"),
        axios.get("/admin/users"),
      ]);
      setQuestions(problemRes.data.data);
      setUsers(userRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`/admin/questions/${id}`);
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
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/60 z-0" />

    {/* Main Content (Stacked on top of gradient) */}
    <div className="relative z-10 p-8 space-y-10">
      <h1 className="text-4xl font-bold text-center text-emerald-400">Admin Dashboard</h1>

    
      <div className="bg-gray-900/90 p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-3">
       

        {/* JSON Add Option */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-emerald-300">Add via Raw JSON</h2>

         <div className="relative">
  <div className="flex items-center justify-between mb-2">

    {/* Toggle JSON Preview */}
    <button
      onClick={() => setShowJsonExample(!showJsonExample)}
      className="flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:underline"
    >
      <Info size={16} /> Click to {showJsonExample ? "hide" : "view"} JSON format
    </button>

    {/* Copy JSON Button */}
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
          <Check
            size={16}
            className="text-green-400 transition-all duration-200 ease-in-out scale-110 opacity-100"
          />
        ) : (
          <Copy
            size={16}
            className="text-white transition-all duration-200 ease-in-out hover:scale-105"
          />
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Copy JSON
      </div>
    </div>
  </div>

  {/* Example JSON block */}
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

      {/* Grid for Users, Questions, Submissions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-gray-900/90 p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">Users ({users.length})</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u._id} className="flex items-center gap-2">
                <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full border" />
                <span className="text-sm">{u.fullName} ({u.username})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions */}
        <div className="bg-gray-900/90 p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-amber-400">Questions ({questions.length})</h2>
            <button
              onClick={deleteAllQuestions}
              className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Delete All
            </button>
          </div>
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q._id} className="text-sm">
                <strong>{q.title}</strong> ({q.difficulty})
                <button
                  onClick={() => deleteQuestion(q._id)}
                  className="ml-2 text-red-400 hover:underline text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submissions */}
        <div className="bg-gray-900/90 p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-2 text-lime-400">Submissions ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-400">No submissions loaded yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {submissions.map((s) => (
                <li key={s._id}>
                  {s.username} solved <strong>{s.problemTitle}</strong> on{" "}
                  {new Date(s.submittedAt).toLocaleDateString()}
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
