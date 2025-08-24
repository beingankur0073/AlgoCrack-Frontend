import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Repeat, CheckCircle2, XCircle, HardDrive, Code, Database, BookOpen, GitFork, Network, Shield, Cpu } from 'lucide-react';
import axios from "../../utils/api.js";

const chartColors = ['#4ade80', '#ef4444']; // Green for Correct, Red for Incorrect

// Local topic list (no questions here)
const topics = [
  { id: 'data-structures', name: 'Data Structures', icon: HardDrive, color: 'bg-indigo-600',short_name:"DSA" },
  { id: 'algorithms', name: 'Algorithms', icon: Code, color: 'bg-green-600' },
  { id: 'os', name: 'Operating Systems', icon: Cpu, color: 'bg-blue-600' },
  { id: 'databases', name: 'Databases', icon: Database, color: 'bg-amber-600',short_name:"DBMS" },
  { id: 'oop', name: 'OOP', icon: GitFork, color: 'bg-purple-600' },
  { id: 'networking', name: 'Networking', icon: Network, color: 'bg-sky-600',short_name:"CN" },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, color: 'bg-fuchsia-600',short_name:"CYBER_SEC" },
  { id: 'software-eng', name: 'Software Engineering', icon: BookOpen, color: 'bg-teal-600',short_name:"" },
];

const Learn = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < selectedQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setQuizStarted(false);
    setSelectedQuestions([]);
  };

const fetchQuestions = async (topicName) => {
  try {
    setLoading(true);
    const res = await axios.get(`/question/topic/${topicName}`);

    // Assuming API response shape:
    // { success: true, data: [{ questionText, options: [...], correctIndex: 0 }] }
    if (res.data?.success && Array.isArray(res.data.data)) {
      const formattedQuestions = res.data.data.map(q => ({
        questionText: q.questionText,
        answerOptions: q.options.map((opt, idx) => ({
          answerText: opt,
          isCorrect: idx === q.correctIndex // Correct answer detection
        }))
      }));

      setSelectedQuestions(formattedQuestions);
      setQuizStarted(true);
    } else {
      console.error("Invalid data from API:", res.data);
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
  } finally {
    setLoading(false);
  }
};

  const renderHome = () => (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-green-600 via-zinc-950 to-red-900 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">Learn Computer Science</h2>
      <p className="text-red-300 text-center mb-6 max-w-lg">
        Select a subject to begin your quiz and test your knowledge of core computer science concepts.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {topics.map((topic) => {
          const IconComponent = topic.icon;
          return (
            <button
              key={topic.id}
              onClick={() => fetchQuestions(topic.short_name)}
              className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md transition transform hover:scale-105 duration-300 ease-in-out ${topic.color}`}
            >
              <IconComponent size={48} className="text-white mb-2" />
              <span className="text-xl font-semibold text-white">{topic.name}</span>
            </button>
          );
        })}
      </div>
      {loading && <p className="mt-4 text-gray-300">Loading questions...</p>}
    </div>
  );

  const renderQuiz = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
        <div
          className="bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentQuestionIndex + 1) / selectedQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="text-gray-400 text-sm mb-2">
          Question {currentQuestionIndex + 1}/{selectedQuestions.length}
        </div>
        <div className="text-white text-lg font-medium">
          {selectedQuestions[currentQuestionIndex].questionText}
        </div>
      </div>

      {/* Answers */}
      <div className="flex flex-col space-y-3">
        {selectedQuestions[currentQuestionIndex].answerOptions.map((answerOption, index) => (
          <button
            key={index}
            onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
            className="w-full py-3 px-4 text-left bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            {answerOption.answerText}
          </button>
        ))}
      </div>
    </div>
  );

  const renderScore = () => {
    const analyticsData = [
      { name: 'Correct', value: correctAnswers, color: chartColors[0] },
      { name: 'Incorrect', value: incorrectAnswers, color: chartColors[1] },
    ];

    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-amber-400 mb-4">Quiz Complete!</h2>
        <p className="text-xl text-gray-300 mb-6">
          You scored <span className="text-green-400 font-bold">{score}</span> out of{' '}
          <span className="font-bold">{selectedQuestions.length}</span>.
        </p>
        <div className="w-full flex justify-center mb-8">
          <ResponsiveContainer width="80%" height={250}>
            <PieChart>
              <Pie data={analyticsData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value">
                {analyticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
            <CheckCircle2 size={24} /> {correctAnswers} Correct
          </div>
          <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
            <XCircle size={24} /> {incorrectAnswers} Incorrect
          </div>
        </div>
        <button
          onClick={resetQuiz}
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Repeat size={20} /> Restart Quiz
        </button>
      </div>
    );
  };

  return (
    <div className="h-[80%] text-white flex items-center justify-center ">
      {quizStarted ? (showScore ? renderScore() : renderQuiz()) : renderHome()}
    </div>
  );
};

export default Learn;
