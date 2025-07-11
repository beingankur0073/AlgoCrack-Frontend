import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import toast from "react-hot-toast";
   import backImg from "../assets/back.jpg";
import { exampleQuestion } from "../utils/constants.js";

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", description: "", difficulty: "Easy" });
  const [rawJsonInput, setRawJsonInput] = useState("");

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

  const addQuestion = async () => {
    try {
      await axios.post("/admin/questions", newQuestion);
      toast.success("Question added");
      setNewQuestion({ title: "", description: "", difficulty: "Easy" });
      fetchData();
    } catch (err) {
      toast.error("Error adding question");
    }
  };

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

      {/* Add Question Section */}
      <div className="bg-gray-900/90 p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl font-semibold text-yellow-400">Add New Question</h2>
        <input
          type="text"
          value={newQuestion.title}
          onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <textarea
          value={newQuestion.description}
          onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <select
          value={newQuestion.difficulty}
          onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button
          onClick={addQuestion}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 mt-2"
        >
          Add Question
        </button>

        {/* JSON Add Option */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-emerald-300">Add via Raw JSON</h2>

          <details className="bg-gray-800 p-4 rounded mb-2 text-green-300 text-sm whitespace-pre-wrap max-h-72 overflow-y-auto border border-gray-700">
            <summary className="cursor-pointer text-yellow-400 font-semibold mb-2">
              ⓘ Click to view JSON format
            </summary>
            <pre>{JSON.stringify(exampleQuestion, null, 2)}</pre>
          </details>

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
