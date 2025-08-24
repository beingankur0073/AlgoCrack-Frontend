import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../utils/api";

const QuestionList = ({ questions, onDelete, onDeleteAll }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const deleteQuestion = async (id) => {
    try {
      const res = await axios.delete(`/question/${id}`);
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

  // Example: Group questions into 8 categories (change logic as needed)
  const categories = [
    "DSA", "OS", "DBMS", "CN", "MATH",
    "OOP", "CYBER-SEC", "Misc"
  ];

  // Filter by search query inside each category
  const getFilteredQuestions = (cat) =>
    questions
      .filter((q) => q.topic === cat)
      .filter((q) =>
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-md">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-white"
        />
      </div>

      {/* Delete All */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onDeleteAll}
          className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-md text-sm text-white hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} /> Delete All Questions
        </button>
      </div>

      {/* Categories Accordion */}
      <div className="space-y-3">
        {categories.map((cat, catIndex) => {
          const filtered = getFilteredQuestions(cat);
          return (
            <div key={cat} className="bg-gray-800 rounded-lg">
              {/* Category Header */}
              <button
                onClick={() =>
                  setOpenCategory(openCategory === catIndex ? null : catIndex)
                }
                className="w-full flex justify-between items-center p-4 text-left text-gray-200 font-semibold"
              >
                <span>{cat} ({filtered.length})</span>
                {openCategory === catIndex ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {/* Questions inside Category */}
              {openCategory === catIndex && filtered.length > 0 && (
                <div className="pl-6 pr-4 pb-3 space-y-2">
                  {filtered.map((q, qIndex) => (
                    <div key={q._id} className="bg-gray-700 rounded-md">
                      <button
                        onClick={() =>
                          setOpenQuestion(
                            openQuestion === `${catIndex}-${qIndex}`
                              ? null
                              : `${catIndex}-${qIndex}`
                          )
                        }
                        className="w-full flex justify-between items-center p-3 text-left text-sm text-gray-300"
                      >
                        <span>
                          <span className="text-purple-400 mr-2">
                            {qIndex + 1}.
                          </span>
                          {q.questionText}
                        </span>
                        {openQuestion === `${catIndex}-${qIndex}` ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      {/* Question Details */}
                      {openQuestion === `${catIndex}-${qIndex}` && (
                        <div className="px-4 pb-4 text-xs text-gray-300">
                          <p className="text-gray-400">
                            Topic: {q.topic} | Difficulty: {q.difficulty}
                          </p>
                          <ul className="mt-2 list-disc list-inside">
                            {q.options.map((opt, i) => (
                              <li
                                key={i}
                                className={
                                  opt === q.correctAnswer
                                    ? "text-green-400 font-semibold"
                                    : ""
                                }
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => deleteQuestion(q._id)}
                            className="mt-2 text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete Question
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-gray-400 text-xs">No questions found.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default QuestionList;
