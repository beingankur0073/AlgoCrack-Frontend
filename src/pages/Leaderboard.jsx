import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../redux/leaderboardSlice';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaders, loading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : (
        <div className="bg-gradient-to-br from-black via-stone-950 to-green-900 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Solved</th>
                <th className="px-4 py-2 text-left">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user, index) => (
                <tr
                  key={user.userId}
                  
                >
                  <td className="px-4 py-2">#{index + 1}</td>
                  <td className="px-4 py-2 font-medium flex items-center">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {user.username}
                  </td>
                  <td className="px-4 py-2">{user.solvedProblems}</td>
                  <td className="px-4 py-2">{user.totalSubmissions}</td>
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
