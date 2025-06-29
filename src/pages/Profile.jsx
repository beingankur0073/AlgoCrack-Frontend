import { useEffect, useRef, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from "lucide-react";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
 import { format } from 'date-fns';
 import { Tooltip as ReactTooltip } from 'react-tooltip'


const languageMap = {
  'c++': 'cpp',
  'cpp': 'cpp',
  'python': 'python',
  'java': 'java',
  'javascript': 'javascript',
  'c': 'c',
};

const getColor = (percentage) => {
  if (percentage >= 70) return "#22c55e"; // green
  if (percentage >= 40) return "#eab308"; // yellow
  return "#ef4444"; // red
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);
  const [problemStats, setProblemStats] = useState(null);
  const [activityData, setActivityData] = useState([]);


  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 6);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/getuser");
        setUser(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load profile");
      }
    };

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("/submissions/user-submissions");
        setSubmissions(res.data.data.submissions);
        setProblemStats(res.data.data.problemStats)
        setActivityData(res.data.data.submissionMapActivity);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        toast.error("Failed to load submissions");
      }
    };

    fetchUser();
    fetchSubmissions();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarLoading(true);
      const res = await axios.patch("/users/updateAvatar", formData);
      setUser((prev) => ({ ...prev, avatar: res.data.data.avatar }));
      toast.success("Avatar updated successfully");
      updateUser({ avatar: res.data.data.avatar });
    } catch (err) {
      console.error("Error updating avatar", err);
      toast.error("Failed to update avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      setCoverLoading(true);
      const res = await axios.patch("/users/updateCover", formData);
      setUser((prev) => ({ ...prev, coverImage: res.data.data.coverImage }));
      toast.success("Cover image updated successfully");
    } catch (err) {
      console.error("Error updating cover", err);
      toast.error("Failed to update cover image");
    } finally {
      setCoverLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="pt-3 ">
      <div className="max-w-4xl mx-auto bg-gradient-to-tr from-black via-stone-950 to-green-900 rounded-2xl shadow-lg">
        {/* Cover Image */}
        <div
          className="h-56 bg-cover bg-center cursor-pointer rounded-t-2xl relative"
          style={{
            backgroundImage: `url(${
              user.coverImage ||
              "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80"
            })`,
          }}
          onClick={() => coverInputRef.current.click()}
          title="Click to change cover image"
        >
          {coverLoading && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-t-2xl z-10">
              <div className="loader border-4 border-white border-t-transparent rounded-full w-10 h-10 animate-spin" />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={handleCoverChange}
        />

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-center gap-4 -mt-16 relative">
           <div
              onClick={() => avatarInputRef.current.click()}
              className="cursor-pointer relative"
              title="Click to change avatar"
             
            >
              <img
                src={user.avatar || "https://i.pravatar.cc/100?img=68"}
                alt="avatar"
               className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
               {avatarLoading && (
                  <div className="absolute top-0 left-0 w-32 h-32 flex items-center justify-center bg-black bg-opacity-50 rounded-full z-10">
                    <div className="loader border-4 border-white border-t-transparent rounded-full w-8 h-8 animate-spin" />
                  </div>
                )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />



            <div>
              <h2 className="text-3xl font-bold">{user.fullName}</h2>
              <p className="text-gray-400">@{user.username}</p>
            </div>

            
           {problemStats && (
              <div className="w-30 h-30 ml-auto rounded-full  flex items-center justify-center relative group transition-all mt-15" title="Problem Solving Progress">
                <CircularProgressbar
                  value={parseFloat(problemStats.solvedPercentage)}
                  text={`${problemStats.solvedProblems}/${problemStats.totalProblems}`}
                  styles={buildStyles({
                    pathColor: getColor(parseFloat(problemStats.solvedPercentage)),
                    textColor: "#ffffff",
                    trailColor: "#ffffff",
                    textSize: "12px",
                    pathTransitionDuration: 0.6,
                  })}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-75"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white text-sm font-semibold"
                  >
                    {problemStats.solvedPercentage}% Solved
                  </motion.p>
                </motion.div>
              </div>
            )}


          </div>

          
          <div className="mt-0.5">
            <p className="text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Member Since:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          

       






        </div>

        {/* Latest Submissions */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 px-6 pb-10 mb-8">
          {/* Latest Submissions */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Latest Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-gray-400 text-sm">No submissions yet.</p>
            ) : (
              <div
                className="w-full"
                style={{
                  maxWidth: "360px",
                  maxHeight: "260px",
                  minHeight: "120px",
                  overflowY: "auto",
                  background: "rgba(31,41,55,0.8)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.15)",
                }}
              >
                {submissions.map((sub) => (
                  <div
                    key={sub._id}
                    title="Click to open problem"
                    className="bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 p-2 rounded-md shadow border border-gray-700 transition-colors text-xs mb-2"
                  >
                    <div
                      onClick={() => navigate(`/problems/${sub.problemId}`)}
                      className="cursor-pointer hover:bg-green-950 p-1 rounded"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-white truncate">{sub.problemTitle}</p>
                        <span
                          className={`px-1 py-0.5 text-xs rounded ${
                            sub.status === "Accepted" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Difficulty: <span className={
                          sub.problemDifficulty === "Easy" ? "text-green-400" :
                          sub.problemDifficulty === "Medium" ? "text-yellow-400" : "text-red-400"
                        }>{sub.problemDifficulty}</span> |
                        Language: <span className="uppercase">{sub.language}</span> |
                        {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setExpandedSubmissionId((prev) => (prev === sub._id ? null : sub._id))
                        }
                        className="text-xs text-blue-400 hover:underline"
                      >
                        {expandedSubmissionId === sub._id ? "Hide Code" : "Show Code"}
                      </button>
                      {expandedSubmissionId === sub._id && (
                        <div className="relative mt-1">
                          <button
                            onClick={() => navigator.clipboard.writeText(sub.code)}
                            className="absolute top-1 right-1 z-10 p-1 rounded hover:bg-gray-700 transition"
                            title="Copy to clipboard"
                          >
                            <Copy size={14} className="text-white" />
                          </button>
                          <SyntaxHighlighter
                            language={languageMap[sub.language.toLowerCase()] || 'text'}
                            style={oneDark}
                            showLineNumbers={false}
                            wrapLongLines
                            customStyle={{
                              borderRadius: '0.4rem',
                              fontSize: '0.7rem',
                              padding: '0.5rem',
                              maxHeight: '8rem',
                              overflowY: 'auto',
                              background: '#1e1e2e',
                            }}
                          >
                            {sub.code}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Map Placeholder */}
         <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Submission Map</h3>
            <div className="bg-gray-900 rounded-md p-3 overflow-auto">
             <CalendarHeatmap
  startDate={startDate}
  endDate={today}
  values={activityData}
  classForValue={(value) => {
    if (!value) return 'color-empty';
    if (value.count >= 5) return 'color-scale-4';
    if (value.count >= 3) return 'color-scale-3';
    if (value.count >= 2) return 'color-scale-2';
    if (value.count >= 1) return 'color-scale-1';
    return 'color-empty';
  }}
  tooltipDataAttrs={(value) => {
    if (!value || !value.date) {
      return {
        'data-tooltip-id': 'heatmap-tooltip',
        'data-tooltip-content': 'No submissions',
      };
    }
    return {
      'data-tooltip-id': 'heatmap-tooltip',
      'data-tooltip-content': `${format(new Date(value.date), 'MMM d, yyyy')}: ${value.count} submission(s)`,
    };
  }}
  showWeekdayLabels
/>
<ReactTooltip id="heatmap-tooltip" effect="solid" place="top" />
              <div className="flex gap-2 mt-2 text-xs text-gray-400">
                <span>Less</span>
                <div className="w-4 h-4 bg-[#22c55e33] rounded" />
                <div className="w-4 h-4 bg-[#22c55e66] rounded" />
                <div className="w-4 h-4 bg-[#22c55e99] rounded" />
                <div className="w-4 h-4 bg-[#22c55e] rounded" />
                <span>More</span>
              </div>
              <style>{`
                .color-empty { fill: #1f2937; }
                .color-scale-1 { fill: #22c55e33; }
                .color-scale-2 { fill: #22c55e66; }
                .color-scale-3 { fill: #22c55e99; }
                .color-scale-4 { fill: #22c55e; }
              `}</style>
            </div>
          </div>


          
        </div>
     





      </div>
    </div>
  );
};

export default Profile;
