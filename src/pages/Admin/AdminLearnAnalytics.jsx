import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle2, XCircle, Trophy, BarChart2, PlusCircle, Trash2, GitPullRequest, Code, HardDrive, Database, Cpu, Network, Shield, BookOpen, GitFork, TrendingUp } from "lucide-react";

// A self-contained mock API to simulate backend calls.
const mockApi = {
  // Initial mock data for the problems and stats
  data: {
    subjects: [
      { id: 'data-structures', name: 'Data Structures', icon: HardDrive, color: 'bg-indigo-600', questions: [
        { id: "ds1", questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?', attemptedCount: 200, correctCount: 150 },
        { id: "ds2", questionText: 'What is the time complexity of searching for an element in a hash table?', attemptedCount: 180, correctCount: 175 },
      ]},
      { id: 'algorithms', name: 'Algorithms', icon: Code, color: 'bg-green-600', questions: [
        { id: "algo1", questionText: 'Which sorting algorithm has the best average-case time complexity?', attemptedCount: 250, correctCount: 240 },
        { id: "algo2", questionText: 'The process of a function calling itself is known as?', attemptedCount: 300, correctCount: 290 },
      ]},
      { id: 'os', name: 'Operating Systems', icon: Cpu, color: 'bg-blue-600', questions: [
        { id: "os1", questionText: 'What is the primary function of an operating system?', attemptedCount: 220, correctCount: 180 },
      ]},
      { id: 'databases', name: 'Databases', icon: Database, color: 'bg-amber-600', questions: [
        { id: "db1", questionText: 'Which of the following is a key characteristic of a relational database?', attemptedCount: 190, correctCount: 100 },
      ]},
      { id: 'oop', name: 'OOP', icon: GitFork, color: 'bg-purple-600', questions: [
        { id: "oop1", questionText: 'In object-oriented programming, what does encapsulation refer to?', attemptedCount: 150, correctCount: 145 },
      ]},
      { id: 'networking', name: 'Networking', icon: Network, color: 'bg-sky-600', questions: [
        { id: "net1", questionText: 'What protocol is used to resolve IP addresses to MAC addresses?', attemptedCount: 170, correctCount: 85 },
      ]},
      { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, color: 'bg-fuchsia-600', questions: [
        { id: "cs1", questionText: 'What is a firewall primarily used for?', attemptedCount: 210, correctCount: 205 },
      ]},
      { id: 'software-eng', name: 'Software Engineering', icon: BookOpen, color: 'bg-teal-600', questions: [
        { id: "se1", questionText: 'What does the acronym "API" stand for?', attemptedCount: 160, correctCount: 110 },
      ]},
    ],
    stats: {
      totalQuestionsAttempted: 500,
      totalCorrect: 350,
      totalIncorrect: 150,
      subjectsPerformance: [
        { name: "Data Structures", correct: 100, total: 150 },
        { name: "Algorithms", correct: 80, total: 100 },
        { name: "Operating Systems", correct: 90, total: 100 },
        { name: "Databases", correct: 50, total: 80 },
        { name: "OOP", correct: 30, total: 70 },
      ],
    },
  },
  // Simulate fetching data from a GET endpoint
  get(url) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes("/analytics")) {
          resolve({ data: this.data.stats });
        } else if (url.includes("/questions")) {
          resolve({ data: this.data.subjects });
        }
      }, 500);
    });
  },
  // Simulate a POST request for adding a new question
  post(url, payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes("/questions/add")) {
          const { questionText, topic } = payload;
          const subject = this.data.subjects.find(s => s.name === topic);
          if (subject) {
            subject.questions.push({
              id: Date.now().toString(),
              questionText,
              attemptedCount: 0,
              correctCount: 0,
            });
            resolve({ status: 200, message: "Question added successfully" });
          } else {
            resolve({ status: 404, message: "Topic not found" });
          }
        }
      }, 500);
    });
  },
  // Simulate a DELETE request for a single question
  delete(url, idToDelete) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let questionDeleted = false;
        this.data.subjects.forEach(subject => {
          const initialLength = subject.questions.length;
          subject.questions = subject.questions.filter(q => q.id !== idToDelete);
          if (subject.questions.length < initialLength) {
            questionDeleted = true;
          }
        });
        if (questionDeleted) {
          resolve({ status: 200, message: "Question deleted successfully" });
        } else {
          resolve({ status: 404, message: "Question not found" });
        }
      }, 500);
    });
  },
  // Simulate a DELETE request for all questions
  deleteAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.data.subjects.forEach(subject => {
          subject.questions = [];
        });
        resolve({ status: 200, message: "All questions deleted successfully" });
      }, 500);
    });
  },
};

// Example JSON format for adding a new question
const exampleQuestion = {
  "topic": "Algorithms",
  "questionText": "What is the time complexity of a binary search algorithm?",
  "answerOptions": [
    { "answerText": "O(n)", "isCorrect": false },
    { "answerText": "O(n log n)", "isCorrect": false },
    { "answerText": "O(log n)", "isCorrect": true },
    { "answerText": "O(1)", "isCorrect": false }
  ]
};

// Define colors for the PieChart
const COLORS = ["#4ade80", "#f87171"]; // Green for correct, Red for incorrect

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [questionsByTopic, setQuestionsByTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rawJsonInput, setRawJsonInput] = useState(JSON.stringify(exampleQuestion, null, 2));

  // Fetch all data from the mock API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const analyticsRes = await mockApi.get("/analytics");
      const questionsRes = await mockApi.get("/questions");
      setAnalyticsData(analyticsRes.data);
      setQuestionsByTopic(questionsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const overallPercentage = analyticsData ? (
    (analyticsData.totalCorrect / analyticsData.totalQuestionsAttempted) * 100
  ).toFixed(1) : 0;

  const pieChartData = analyticsData
    ? [
        { name: "Correct", value: analyticsData.totalCorrect },
        { name: "Incorrect", value: analyticsData.totalIncorrect },
      ]
    : [];

  const handleJsonSubmit = async () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      const res = await mockApi.post("/questions/add", {
        questionText: parsed.questionText,
        topic: parsed.topic,
      });
      if (res.status === 200) {
        toast.success("Question added successfully!");
        setRawJsonInput(JSON.stringify(exampleQuestion, null, 2)); // Reset to example
        fetchData(); // Refresh data
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Invalid JSON or error adding question.");
      console.error(err);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const res = await mockApi.delete("/questions", id);
      if (res.status === 200) {
        toast.success("Question deleted.");
        fetchData(); // Refresh data
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Error deleting question.");
      console.error(err);
    }
  };

  const deleteAllQuestions = async () => {
    if (window.confirm("Are you sure you want to delete all questions?")) {
      try {
        await mockApi.deleteAll();
        toast.success("All questions deleted!");
        fetchData(); // Refresh data
      } catch (err) {
        toast.error("Error deleting all questions.");
        console.error(err);
      }
    }
  };
  
  // Logic to find the most solved and mostly correct questions
  const getTopQuestions = () => {
    // Flatten all questions into a single array
    const allQuestions = questionsByTopic.flatMap(subject => 
      subject.questions.map(q => ({
        ...q,
        topicName: subject.name,
      }))
    );
    
    // Sort questions by number of attempts (descending)
    allQuestions.sort((a, b) => b.attemptedCount - a.attemptedCount);

    // Get the top 5 questions by attempts
    const topSolved = allQuestions.slice(0, 5);

    // Sort questions by correct count percentage (descending)
    allQuestions.sort((a, b) => {
      const aPercentage = a.attemptedCount > 0 ? a.correctCount / a.attemptedCount : 0;
      const bPercentage = b.attemptedCount > 0 ? b.correctCount / b.attemptedCount : 0;
      return bPercentage - aPercentage;
    });

    // Get the top 5 questions by correctness
    const topCorrect = allQuestions.slice(0, 5);

    return { topSolved, topCorrect };
  };

  const { topSolved, topCorrect } = getTopQuestions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-8 text-white font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center text-amber-400 mb-6">
        Admin Dashboard
      </h1>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-center mb-4">
          <BarChart2 size={32} className="text-blue-400 mr-2" />
          <h2 className="text-2xl font-semibold text-white">Quiz Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-center space-x-4">
            <Trophy size={32} className="text-yellow-400" />
            <div>
              <h3 className="text-md font-semibold text-gray-300">Overall Score</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {overallPercentage}%
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-center space-x-4">
            <CheckCircle2 size={32} className="text-green-400" />
            <div>
              <h3 className="text-md font-semibold text-gray-300">Correct</h3>
              <p className="text-2xl font-bold text-green-400">
                {analyticsData.totalCorrect}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-center space-x-4">
            <XCircle size={32} className="text-red-400" />
            <div>
              <h3 className="text-md font-semibold text-gray-300">Incorrect</h3>
              <p className="text-2xl font-bold text-red-400">
                {analyticsData.totalIncorrect}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-center mb-4">
              Correct vs. Incorrect
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-center mb-4">
              Performance by Subject
            </h3>
            <div className="space-y-3">
              {analyticsData.subjectsPerformance.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>{subject.name}</span>
                    <span className="font-semibold">
                      {((subject.correct / subject.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div
                      className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(subject.correct / subject.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Most Solved & Correct Questions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className=" p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center mb-4">
          <TrendingUp size={24} className="text-teal-400 mr-2" />
          <h2 className="text-2xl font-semibold text-white">Top Questions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Most Solved Questions */}
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Most Attempted</h3>
            <ul className="space-y-2">
              {topSolved.length > 0 ? (
                topSolved.map((q, index) => (
                  <li key={q.id} className="p-3 bg-gray-800 rounded-md">
                    <p className="text-sm font-semibold text-gray-200">
                      <span className="mr-2 text-cyan-300 font-bold">{index + 1}.</span> {q.questionText}
                    </p>
                    <div className="flex justify-between items-center text-xs mt-1 text-gray-400">
                      <span>Topic: {q.topicName}</span>
                      <span>{q.attemptedCount} attempts</span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No questions available to analyze.</p>
              )}
            </ul>
          </div>

          {/* Most Correct Questions */}
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">Mostly Correct</h3>
            <ul className="space-y-2">
              {topCorrect.length > 0 ? (
                topCorrect.map((q, index) => (
                  <li key={q.id} className="p-3 bg-gray-800 rounded-md">
                    <p className="text-sm font-semibold text-gray-200">
                      <span className="mr-2 text-emerald-300 font-bold">{index + 1}.</span> {q.questionText}
                    </p>
                    <div className="flex justify-between items-center text-xs mt-1 text-gray-400">
                      <span>Topic: {q.topicName}</span>
                      <span>
                        {q.correctCount} correct ({q.attemptedCount > 0 ? ((q.correctCount / q.attemptedCount) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No questions available to analyze.</p>
              )}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* API Endpoints Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center mb-4">
          <GitPullRequest size={24} className="text-cyan-400 mr-2" />
          <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>
        </div>
        <ul className="text-sm space-y-2 text-gray-300">
          <li className="p-2 bg-gray-700 rounded-md">
            <span className="font-mono text-cyan-300">GET /analytics</span> - Fetches overall quiz performance statistics.
          </li>
          <li className="p-2 bg-gray-700 rounded-md">
            <span className="font-mono text-cyan-300">GET /questions</span> - Fetches all questions, grouped by topic.
          </li>
          <li className="p-2 bg-gray-700 rounded-md">
            <span className="font-mono text-cyan-300">POST /questions/add</span> - Adds a new question via a JSON payload.
          </li>
          <li className="p-2 bg-gray-700 rounded-md">
            <span className="font-mono text-cyan-300">DELETE /questions/&#123;id&#125;</span> - Deletes a specific question.
          </li>
          <li className="p-2 bg-gray-700 rounded-md">
            <span className="font-mono text-cyan-300">DELETE /questions</span> - Deletes all questions.
          </li>
        </ul>
      </motion.div> */}

      {/* Question Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Code size={24} className="text-emerald-400 mr-2" />
            <h2 className="text-2xl font-semibold text-white">Question Management</h2>
          </div>
          <button
            onClick={deleteAllQuestions}
            className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-md text-sm text-white hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} /> Delete All Questions
          </button>
        </div>

        {/* Add Question via JSON */}
        <div className="p-4 bg-gray-700 rounded-lg mb-6">
          <h3 className="flex items-center text-lg font-semibold text-emerald-400 mb-2">
            <PlusCircle size={20} className="mr-2" /> Add New Question via JSON
          </h3>
          <textarea
            value={rawJsonInput}
            onChange={(e) => setRawJsonInput(e.target.value)}
            placeholder="Paste your question JSON here..."
            rows={8}
            className="p-3 w-full bg-gray-800 border border-gray-600 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJsonSubmit}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold transition-colors"
          >
            Submit Question
          </button>
        </div>

        {/* List of Questions by Topic */}
        <div className="space-y-6">
          {questionsByTopic.map((subject) => (
            <div key={subject.id} className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <subject.icon size={20} />
                {subject.name}
                <span className="text-gray-400 font-normal text-sm">({subject.questions.length})</span>
              </h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {subject.questions.map((question) => (
                  <li key={question.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-300">{question.questionText}</p>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default AdminDashboard;
