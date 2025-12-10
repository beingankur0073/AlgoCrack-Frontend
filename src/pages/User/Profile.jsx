import { useEffect, useRef, useState } from "react";
import axios from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { updateUser as updateUserAuth } from "../../redux/authSlice.js";
import { fetchProfileData, updateUser as updateUserProfile, resetSubmissions } from "../../redux/profileSlice.js";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import "react-calendar-heatmap/dist/styles.css";
import LatestSubmissions from "../../components/profilePage/LatestSubmission.jsx";
import SubmissionMap from "../../components/profilePage/SubmissionMap.jsx";
import { FiLoader } from "react-icons/fi"; 

const getColor = (percentage) => {
  if (percentage >= 70) return "#22c55e"; // green
  if (percentage >= 40) return "#eab308"; // yellow
  return "#ef4444"; // red
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select data from Redux
  const { user, submissions, pagination, problemStats, activityData, loading, error } = useSelector(
    (state) => state.profile
  );
  const auth = useSelector((state) => state.auth.auth);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  
  // Local state for pagination
  const [page, setPage] = useState(1);
  
  // --- CRITICAL CHANGE: INCREASE LIMIT ---
  // 5 items isn't enough to fill the 400px height, so no scrollbar appears.
  // 10 items ensures content overflows, allowing you to scroll.
  const LIMIT = 4; 

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 6);

  // 1. Initial Fetch: Reset submissions and load Page 1
  useEffect(() => {
    dispatch(resetSubmissions());
    dispatch(fetchProfileData({ page: 1, limit: LIMIT }))
      .unwrap()
      .catch((err) => toast.error(err));
  }, [dispatch]);

  // 2. Fetch Next Pages when 'page' increments
  useEffect(() => {
    if (page > 1) {
       dispatch(fetchProfileData({ page, limit: LIMIT }));
    }
  }, [dispatch, page]);

  // 3. Sync avatar changes with Auth slice
  useEffect(() => {
    if (user && auth && user._id === auth.user?._id) {
      if (user.avatar !== auth.user.avatar) {
        dispatch(updateUserAuth({ avatar: user.avatar }));
      }
    }
  }, [dispatch, user]);

  // --- ROBUST INFINITE SCROLL HANDLER ---
  const handleSubmissionScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    
    // Calculate precise bottom position
    const bottomPosition = Math.ceil(scrollTop + clientHeight);

    // Check if we are within 20px of the bottom
    // AND not currently loading
    // AND current page is less than total pages
    if (bottomPosition >= scrollHeight - 20 && !loading && page < (pagination?.totalPages || 1)) {
       setPage((prevPage) => prevPage + 1);
    }
  };

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

  // Loading state for initial load (when user is null)
  if (loading && page === 1 && !user) {
    return (
      <div className="bg-gray-950 text-white flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error && !user) {
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
          </div>
        )}
      </div>

      {/* Bottom Section: Latest Submissions & Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 h-[320px]">
        
        {/* --- LATEST SUBMISSIONS (Infinite Scroll) --- */}
      {/* --- LATEST SUBMISSIONS (Infinite Scroll) --- */}
<div 
    // CHANGE 1: Removed 'p-3' and added 'overflow-hidden' to clip corners correctly
    className="flex flex-col h-full overflow-y-auto custom-scrollbar relative bg-black/20 rounded-xl border border-gray-800"
    onScroll={handleSubmissionScroll}
>
    {/* CHANGE 2: Header is now full width with square corners at bottom and rounded at top */}
    <h3 className="text-xl font-bold text-white sticky top-0 bg-black/95 p-4 z-20 backdrop-blur-md border-b border-gray-800 shadow-md">
        Latest Submissions
    </h3>

    {/* CHANGE 3: Added a wrapper div with padding for the actual list content */}
    <div className="p-3">
        <LatestSubmissions submissions={submissions} />
        
        {loading && (
            <div className="p-4 text-center w-full flex justify-center items-center text-green-400">
                <FiLoader className="animate-spin mr-2" size={20} />
                <span>Loading...</span>
            </div>
        )}

        {!loading && submissions.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No submissions found.</p>
        )}

        {!loading && page >= (pagination?.totalPages || 1) && submissions.length > 0 && (
            <p className="text-center text-gray-600 text-xs mt-4 mb-2">End of submissions</p>
        )}
    </div>
</div>

        {/* --- SUBMISSION MAP (Heatmap) --- */}
        <div className="h-full flex flex-col">
           <SubmissionMap
             startDate={startDate}
             endDate={today}
             activityData={activityData}
           />
        </div>

      </div>
    </div>
  );
};

export default Profile;