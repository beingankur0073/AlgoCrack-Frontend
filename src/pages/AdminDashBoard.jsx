import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", description: "", difficulty: "Easy" });

  const fetchData = async () => {
    try {
      const [ problemRes,userRes] = await Promise.all([
        axios.get("/admin/problems"),
        axios.get("/admin/users"),
        // axios.get("/admin/submissions"),
      ]);
      // setQuestions(questionRes.data.data);
      setQuestions(problemRes.data.data);
      setUsers(userRes.data.data);
      
      console.log("Users fetched:", userRes.data.data);
      // setSubmissions(submissionRes.data.data);
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
    
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add Question */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Question</h2>
        <input
          type="text"
          value={newQuestion.title}
          onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          placeholder="Title"
          className="p-2 bg-gray-800 border border-gray-700 rounded w-full mb-2"
        />
        <textarea
          value={newQuestion.description}
          onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
          placeholder="Description"
          className="p-2 bg-gray-800 border border-gray-700 rounded w-full mb-2"
        ></textarea>
        <select
          value={newQuestion.difficulty}
          onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
          className="p-2 bg-gray-800 border border-gray-700 rounded w-full mb-2"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button onClick={addQuestion} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
          Add Question
        </button>
      </div>

      {/* Questions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Questions ({questions.length})</h2>
        <button
          onClick={deleteAllQuestions}
          className="bg-red-600 px-4 py-2 rounded mb-2 hover:bg-red-700"
        >
          Delete All Questions
        </button>
        <ul className="list-disc pl-6">
          {questions.map((q) => (
            <li key={q._id} className="mb-1">
              <strong>{q.title}</strong> ({q.difficulty})
              <button onClick={() => deleteQuestion(q._id)} className="ml-4 text-red-400">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Users */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
        <ul className="list-disc pl-6">
          {users.map((u) => (
            <li key={u._id} className="mb-1">
              <div className="flex items-center gap-2">
                <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full border" />
                <span>{u.fullName} ({u.username}) - {u.email}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Submissions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Submissions ({submissions.length})</h2>
        <ul className="list-disc pl-6">
          {submissions.map((s) => (
            <li key={s._id}>{s.username} solved {s.problemTitle} on {new Date(s.submittedAt).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
