import { useEffect, useRef, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { updateUser as updateUserAuth } from "../redux/authSlice";
import { fetchProfileData, updateUser as updateUserProfile } from "../redux/profileSlice";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format } from "date-fns";
import { Tooltip as ReactTooltip } from "react-tooltip";
import LatestSubmissions from "../components/profilePage/LatestSubmission.jsx";
import SubmissionMap from "../components/profilePage/SubmissionMap.jsx";


const getColor = (percentage) => {
  if (percentage >= 70) return "#22c55e"; // green
  if (percentage >= 40) return "#eab308"; // yellow
  return "#ef4444"; // red
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, submissions, problemStats, activityData, loading, error } = useSelector(
    (state) => state.profile
  );
  const auth = useSelector((state) => state.auth.auth);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 6);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfileData())
        .unwrap()
        .catch((err) => {
          toast.error(err);
        });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && auth && user._id === auth.user?._id) {
      if (user.avatar !== auth.user.avatar) {
        dispatch(updateUserAuth({ avatar: user.avatar }));
      }
    }
  }, [dispatch, user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarLoading(true);
      const res = await axios.patch("/users/updateAvatar", formData);
      dispatch(updateUserProfile({ avatar: res.data.data.avatar }));
      dispatch(updateUserAuth({ avatar: res.data.data.avatar }));
      toast.success("Avatar updated successfully");
    } catch (err) {
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
      dispatch(updateUserProfile({ coverImage: res.data.data.coverImage }));
      toast.success("Cover image updated successfully");
    } catch (err) {
      toast.error("Failed to update cover image");
    } finally {
      setCoverLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl text-red-400">Failed to load profile: {error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-tr from-black via-stone-950 to-green-900 rounded-2xl shadow-lg overflow-hidden select-none mb-5">
      {/* Cover Image */}
      <div
        className="h-56 w-full bg-cover bg-center cursor-pointer relative rounded-t-2xl"
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
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-t-2xl">
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
      <div className="px-6 pt-6 pb-4 flex items-center gap-6 relative">
        {/* Avatar */}
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onClick={() => avatarInputRef.current.click()}
          title="Click to change avatar"
        >
          <img
            src={user.avatar || "https://i.pravatar.cc/100?img=68"}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 z-40"
          />
          {avatarLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full z-10">
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

        {/* Name & Email */}
        <div>
          <h2 className="text-3xl font-bold text-white">{user.fullName}</h2>
          <p className="text-gray-400">@{user.username}</p>
          <p className="mt-2 text-gray-300">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mt-1 text-gray-300">
            <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Problem Solving Progress Circle */}
        {problemStats && (
          <div
            className="ml-auto w-28 h-28 rounded-full flex items-center justify-center relative group"
            title="Problem Solving Progress"
          >
            <CircularProgressbar
              value={parseFloat(problemStats.solvedPercentage)}
              text={`${problemStats.solvedProblems}/${problemStats.totalProblems}`}
              styles={buildStyles({
                pathColor: getColor(parseFloat(problemStats.solvedPercentage)),
                textColor: "#ffffff",
                trailColor: "#444444",
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

      {/* Bottom Section: Latest Submissions & Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-2">
        {/* Latest Submissions */}
         <LatestSubmissions submissions={submissions} />

        {/* Submission Map */}
        <SubmissionMap
      startDate={startDate}
        endDate={today}
        activityData={activityData}
      />`

      </div>
    </div>
  );
};

export default Profile;
