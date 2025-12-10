import { useState } from "react";
import { ChevronDown, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const QuestionList = ({ questions, onDelete, onDeleteAll }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const deleteQuestion = async (id) => {
    try {
      // Note: The base URL for API calls should be configured globally for axios
      const res = await axios.delete(`/api/question/${id}`);
      if (res.status === 200) {
        toast.success("Question deleted.");
        onDelete();
      } else {
        toast.error("Failed to delete question.");
      }
    } catch (err) {
      toast.error("Error deleting question.");
      console.error(err);
    }
  };

  const categories = [
    "DSA", "OS", "DBMS", "CN", "MATH",
    "OOP", "CYBER-SEC", "Misc"
  ];

  const getQuestionsByCategory = (cat) =>
    questions.filter((q) => q.topic === cat);

  const activeQuestions = selectedCategory
    ? getQuestionsByCategory(selectedCategory)
    : [];

  return (
    <div className="bg-slate-900 text-white  p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            {selectedCategory ? `Category: ${selectedCategory}` : "Question Bank"}
          </h1>
          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-sm font-semibold bg-slate-700/50 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>All Categories</span>
            </button>
          ) : (
            questions.length > 0 && (
              <button
                onClick={onDeleteAll}
                className="flex items-center gap-2 text-sm font-semibold bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg hover:bg-rose-500/20 transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete All</span>
              </button>
            )
          )}
        </div>

        {questions.length === 0 ? (
          <div className="text-center bg-slate-800/50 border border-slate-700 p-12 rounded-xl">
            <h2 className="text-2xl font-semibold text-slate-300">Your Question Bank is Empty!</h2>
            <p className="text-slate-400 mt-2 max-w-md mx-auto">
              It looks like there are no questions here yet. Add your first question to get started.
            </p>
          </div>
        ) : !selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const filteredQuestions = getQuestionsByCategory(cat);
              if (filteredQuestions.length === 0) return null;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left transition-all duration-300 hover:border-indigo-500 hover:-translate-y-1"
                >
                  <h3 className="font-bold text-xl text-slate-100">{cat}</h3>
                  <p className="mt-2 text-sm text-slate-400">{filteredQuestions.length} Questions</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {activeQuestions.map((q, qIndex) => {
              const isQuestionOpen = openQuestion === qIndex;

              return (
                <div key={q._id} className="bg-slate-800/80 rounded-lg border border-slate-700/80">
                  <button
                    onClick={() => setOpenQuestion(isQuestionOpen ? null : qIndex)}
                    className="w-full flex items-center p-4 text-left hover:bg-slate-800/60 rounded-t-lg transition-colors"
                  >
                    <div className="flex-shrink-0 bg-indigo-600 text-white w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm mr-4">
                      {qIndex + 1}
                    </div>
                    <span className="flex-grow text-slate-200">{q.questionText}</span>
                    <ChevronDown
                      className={`transform transition-transform duration-300 ml-4 flex-shrink-0 ${isQuestionOpen ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isQuestionOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                  >
                    <div className="px-4 pb-4 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium">
                          <span className="bg-slate-700 px-2 py-1 rounded">DIFFICULTY: {q.difficulty}</span>
                      </div>

                      <ul className="space-y-2 text-sm">
                        {q.options.map((opt, i) => {
                          const isCorrect = opt === q.correctAnswer;
                          return (
                            <li
                              key={i}
                              className={`flex items-center p-2 rounded-md ${isCorrect ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300'}`}
                            >
                              {isCorrect && <CheckCircle2 size={16} className="mr-2 text-emerald-400 flex-shrink-0" />}
                              <span>{opt}</span>
                            </li>
                          );
                        })}
                      </ul>

                      <button
                        onClick={() => deleteQuestion(q._id)}
                        className="mt-4 flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete Question</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;

