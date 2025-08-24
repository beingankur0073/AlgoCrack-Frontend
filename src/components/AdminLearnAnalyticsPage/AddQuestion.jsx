import { useState } from "react";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../utils/api";

const AddQuestion = ({ onQuestionAdded }) => {
  const [rawJsonInput, setRawJsonInput] = useState("");

  const handleRawJsonSubmit = async () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      await axios.post("/question/add", parsed);
      toast.success("Question added successfully!");
      setRawJsonInput("");
      onQuestionAdded();
    } catch (err) {
      toast.error("Invalid JSON or error adding question");
      console.error(err);
    }
  };

  return (
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
        onClick={handleRawJsonSubmit}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold transition-colors"
      >
        Submit Question
      </button>
    </div>
  );
};

export default AddQuestion;
