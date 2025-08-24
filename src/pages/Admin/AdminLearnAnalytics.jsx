import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "../../utils/api";
import AddQuestion from "../../components/AdminLearnAnalyticsPage/AddQuestion.jsx";
import QuestionList from "../../components/AdminLearnAnalyticsPage/QuestionList.jsx";

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/question/all");
      if (res.data?.success) {
        setQuestions(res.data.data || []);
      } else {
        toast.error("Failed to fetch questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Error fetching questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllQuestions = async () => {
    if (window.confirm("Are you sure you want to delete all questions?")) {
      try {
        await axios.delete("/question/delete-all");
        toast.success("All questions deleted!");
        fetchQuestions();
      } catch (err) {
        toast.error("Error deleting all questions.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-white font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center text-purple-400 mb-6">
        Learn Dashboard
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" p-6 rounded-lg shadow-lg"
      >
        <AddQuestion onQuestionAdded={fetchQuestions} />
        <QuestionList
          questions={questions}
          onDelete={fetchQuestions}
          onDeleteAll={deleteAllQuestions}
        />
      </motion.div>

      <Toaster />
    </div>
  );
};

export default AdminDashboard;
