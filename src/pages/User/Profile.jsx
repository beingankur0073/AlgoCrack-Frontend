import { useEffect, useRef, useState } from "react";
import axios from "../../utils/api.js";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { updateUser as updateUserAuth } from "../../redux/authSlice.js";
import {
  fetchProfileData,
  updateUser as updateUserProfile,
  resetSubmissions,
} from "../../redux/profileSlice.js";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import LatestSubmissions from "../../components/profilePage/LatestSubmission.jsx";
import SubmissionMap from "../../components/profilePage/SubmissionMap.jsx";
import { FiLoader } from "react-icons/fi";

const getColor = (percentage) => {
  if (percentage >= 70) return "#22c55e";
  if (percentage >= 40) return "#eab308";
  return "#ef4444";
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user, submissions, pagination, problemStats, activityData, loading, error } =
    useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth.auth);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [page, setPage] = useState(1);

  const LIMIT = 4;

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 6);

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    dispatch(resetSubmissions());
    dispatch(fetchProfileData({ page: 1, limit: LIMIT }))
      .unwrap()
      .catch((err) => toast.error(err));
  }, [dispatch]);

  useEffect(() => {
    if (page > 1) dispatch(fetchProfileData({ page, limit: LIMIT }));
  }, [dispatch, page]);

  useEffect(() => {
    if (user && auth && user._id === auth.user?._id && user.avatar !== auth.user.avatar) {
      dispatch(updateUserAuth({ avatar: user.avatar }));
    }
  }, [dispatch, user]);

  const handleSubmissionScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (
      Math.ceil(scrollTop + clientHeight) >= scrollHeight - 20 &&
      !loading &&
      page < (pagination?.totalPages || 1)
    ) {
      setPage((p) => p + 1);
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
      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar update failed");
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
      toast.success("Cover updated");
    } catch {
      toast.error("Cover update failed");
    } finally {
      setCoverLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load profile
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-gradient-to-tr from-black via-stone-950 to-green-900 rounded-2xl shadow-lg overflow-hidden mb-6">

      {/* COVER */}
      <div
        className="h-40 sm:h-56 bg-cover bg-center cursor-pointer relative"
        style={{
          backgroundImage: `url(${user.coverImage ||
            "https://images.unsplash.com/photo-1503264116251-35a269479413"})`,
        }}
        onClick={() => coverInputRef.current.click()}
      >
        {coverLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="loader w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={coverInputRef} type="file" hidden onChange={handleCoverChange} />

      {/* PROFILE INFO */}
      <div className="px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col sm:flex-row gap-6 flex-1">
          {/* Avatar */}
          <div onClick={() => avatarInputRef.current.click()} className="relative self-center sm:self-start">
            <img
              src={user.avatar || "https://i.pravatar.cc/100"}
              className="w-28 h-28 rounded-full border-4 border-gray-900"
              alt="avatar"
            />
            {avatarLoading && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <div className="loader w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <input ref={avatarInputRef} type="file" hidden onChange={handleAvatarChange} />

          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-gray-400">@{user.username}</p>
            <p className="text-gray-300 mt-2 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Progress */}
        {problemStats && (
          <div className="w-28 h-28 self-center">
            <CircularProgressbar
              value={problemStats.solvedPercentage}
              text={`${problemStats.solvedProblems}/${problemStats.totalProblems}`}
              styles={buildStyles({
                pathColor: getColor(problemStats.solvedPercentage),
                textColor: "#fff",
                trailColor: "#444",
              })}
            />
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-6 pb-6">

        {/* SUBMISSIONS */}
        <div
          className="h-[300px] sm:h-[320px] bg-black/20 rounded-xl border border-gray-800 overflow-y-auto custom-scrollbar"
          onScroll={handleSubmissionScroll}
        >
          <h3 className="sticky top-0 bg-black/95 p-3 font-bold border-b border-gray-800">
            Latest Submissions
          </h3>
          <div className="p-3">
            <LatestSubmissions submissions={submissions} />
            {loading && (
              <div className="flex justify-center py-4 text-green-400">
                <FiLoader className="animate-spin mr-2" /> Loading...
              </div>
            )}
          </div>
        </div>

        {/* HEATMAP */}
        <div className="h-[300px] sm:h-[320px]">
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
