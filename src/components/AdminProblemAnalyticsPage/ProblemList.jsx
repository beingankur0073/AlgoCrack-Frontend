

const ProblemList = ({questions}) => {
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

  return (
     <div className="bg-gray-900/90 p-3 rounded-lg shadow-md max-h-[500px] overflow-y-auto text-sm mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-amber-400">
              Questions ({questions.length})
            </h2>
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
                  <span
                    className={`text-xs ${
                      q.difficulty === "Easy"
                        ? "text-green-400"
                        : q.difficulty === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
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
  )
}

export default ProblemList