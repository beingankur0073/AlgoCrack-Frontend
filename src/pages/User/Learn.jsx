import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Repeat, CheckCircle2, XCircle, ChevronRight, HardDrive, Code, Database, BookOpen, GitFork, Network, Shield, Cpu } from 'lucide-react';

// Mock data for CS Fundamentals questions, organized by subject
const mockSubjects = [
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: HardDrive,
    color: 'bg-indigo-600',
    questions: [
      {
        questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
        answerOptions: [
          { answerText: 'Queue', isCorrect: false },
          { answerText: 'Stack', isCorrect: true },
          { answerText: 'Linked List', isCorrect: false },
          { answerText: 'Tree', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the time complexity of searching for an element in a hash table in the average case?',
        answerOptions: [
          { answerText: 'O(log n)', isCorrect: false },
          { answerText: 'O(n)', isCorrect: false },
          { answerText: 'O(1)', isCorrect: true },
          { answerText: 'O(n^2)', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    icon: Code,
    color: 'bg-green-600',
    questions: [
      {
        questionText: 'Which sorting algorithm has the best average-case time complexity?',
        answerOptions: [
          { answerText: 'Bubble Sort', isCorrect: false },
          { answerText: 'Quick Sort', isCorrect: true },
          { answerText: 'Insertion Sort', isCorrect: false },
          { answerText: 'Selection Sort', isCorrect: false },
        ],
      },
      {
        questionText: 'The process of a function calling itself is known as:',
        answerOptions: [
          { answerText: 'Iteration', isCorrect: false },
          { answerText: 'Recursion', isCorrect: true },
          { answerText: 'Encapsulation', isCorrect: false },
          { answerText: 'Polymorphism', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'os',
    name: 'Operating Systems',
    icon: Cpu,
    color: 'bg-blue-600',
    questions: [
      {
        questionText: 'What is the primary function of an operating system?',
        answerOptions: [
          { answerText: 'To run applications for the user', isCorrect: false },
          { answerText: 'To manage hardware and software resources', isCorrect: true },
          { answerText: 'To browse the internet', isCorrect: false },
          { answerText: 'To perform mathematical calculations', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: Database,
    color: 'bg-amber-600',
    questions: [
      {
        questionText: 'Which of the following is a key characteristic of a relational database?',
        answerOptions: [
          { answerText: 'Data is stored in key-value pairs', isCorrect: false },
          { answerText: 'Data is organized in tables with rows and columns', isCorrect: true },
          { answerText: 'Data is organized in a tree-like structure', isCorrect: false },
          { answerText: 'Data is stored in a distributed ledger', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'oop',
    name: 'OOP',
    icon: GitFork,
    color: 'bg-purple-600',
    questions: [
      {
        questionText: 'In object-oriented programming, what does encapsulation refer to?',
        answerOptions: [
          { answerText: 'Hiding data within a class, accessible only through methods', isCorrect: true },
          { answerText: 'Creating a new class from an existing one', isCorrect: false },
          { answerText: 'The ability of a single function to operate on multiple types', isCorrect: false },
          { answerText: 'Converting one data type to another', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: Network,
    color: 'bg-sky-600',
    questions: [
      {
        questionText: 'What protocol is used to resolve IP addresses to MAC addresses?',
        answerOptions: [
          { answerText: 'TCP', isCorrect: false },
          { answerText: 'UDP', isCorrect: false },
          { answerText: 'ARP', isCorrect: true },
          { answerText: 'DNS', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: Shield,
    color: 'bg-fuchsia-600',
    questions: [
      {
        questionText: 'What is a firewall primarily used for?',
        answerOptions: [
          { answerText: 'Speeding up internet traffic', isCorrect: false },
          { answerText: 'Filtering network traffic', isCorrect: true },
          { answerText: 'Encrypting data', isCorrect: false },
          { answerText: 'Managing user passwords', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'software-eng',
    name: 'Software Engineering',
    icon: BookOpen,
    color: 'bg-teal-600',
    questions: [
      {
        questionText: 'What does the acronym "API" stand for?',
        answerOptions: [
          { answerText: 'Application Program Interface', isCorrect: true },
          { answerText: 'Advanced Programming Instruction', isCorrect: false },
          { answerText: 'Automated Process Integration', isCorrect: false },
          { answerText: 'Application Protocol Integration', isCorrect: false },
        ],
      },
    ],
  },
];

// Define chart colors
const chartColors = ['#4ade80', '#ef4444']; // Green for Correct, Red for Incorrect

// Main App Component for the Quiz
const App = () => {
  // State for the quiz flow
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Handle a user's answer choice
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

  // Function to reset the quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setQuizStarted(false);
    setSelectedQuestions([]);
  };

  // JSX to render the home screen with subjects
  const renderHome = () => (
    <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">CS Fundamentals Quiz</h2>
      <p className="text-gray-300 text-center mb-6 max-w-lg">
        Select a subject to begin your quiz and test your knowledge of core computer science concepts.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {mockSubjects.map((subject) => {
          const IconComponent = subject.icon;
          return (
            <button
              key={subject.id}
              onClick={() => {
                setQuizStarted(true);
                setSelectedQuestions(subject.questions);
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md transition transform hover:scale-105 duration-300 ease-in-out ${subject.color}`}
            >
              <IconComponent size={48} className="text-white mb-2" />
              <span className="text-xl font-semibold text-white">{subject.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // JSX to render the quiz questions
  const renderQuiz = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
        <div
          className="bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentQuestionIndex + 1) / selectedQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question section */}
      <div className="mb-6">
        <div className="text-gray-400 text-sm mb-2">
          Question {currentQuestionIndex + 1}/{selectedQuestions.length}
        </div>
        <div className="text-white text-lg font-medium">
          {selectedQuestions[currentQuestionIndex].questionText}
        </div>
      </div>

      {/* Answer options */}
      <div className="flex flex-col space-y-3">
        {selectedQuestions[currentQuestionIndex].answerOptions.map((answerOption, index) => (
          <button
            key={index}
            onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
            className="w-full py-3 px-4 text-left bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {answerOption.answerText}
          </button>
        ))}
      </div>
    </div>
  );

  // JSX to render the final score and analytics
  const renderScore = () => {
    const totalQuestions = selectedQuestions.length;
    const analyticsData = [
      { name: 'Correct', value: correctAnswers, color: chartColors[0] },
      { name: 'Incorrect', value: incorrectAnswers, color: chartColors[1] },
    ];

    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-amber-400 mb-4">Quiz Complete!</h2>
        <p className="text-xl text-gray-300 mb-6">
          You scored <span className="text-green-400 font-bold">{score}</span> out of{' '}
          <span className="font-bold">{totalQuestions}</span>.
        </p>

        <div className="w-full flex justify-center mb-8">
          <ResponsiveContainer width="80%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
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
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          <Repeat size={20} /> Restart Quiz
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen  text-white flex items-center justify-center p-4 font-sans">
      {quizStarted ? (
        showScore ? renderScore() : renderQuiz()
      ) : (
        renderHome()
      )}
    </div>
  );
};

export default App;
