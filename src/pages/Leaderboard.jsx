import { useEffect, useState } from "react";
import axios from "../utils/api";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/leaderboard");
        setLeaders(res.data.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Solved</th>
                <th className="px-4 py-2 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user, index) => (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-gray-950" : "bg-gray-800"}
                >
                  <td className="px-4 py-2">#{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{user.username}</td>
                  <td className="px-4 py-2">{user.solved}</td>
                  <td className="px-4 py-2">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
