import { useEffect, useRef, useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const [user, setUser] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

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
        setSubmissions(res.data.data);
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
    <div className="bg-gray-950 text-white h-screen overflow-y-auto py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-lg">
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
          <div className="flex items-center gap-4 -mt-16">
            <div
              onClick={() => avatarInputRef.current.click()}
              className="cursor-pointer"
              title="Click to change avatar"
            >
              <img
                src={user.avatar || "https://i.pravatar.cc/100?img=68"}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
              {avatarLoading && (
                <div className="absolute top-0 left-0 w-32 h-32 flex items-center justify-center">
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
          </div>

          <div className="mt-6">
            <p className="text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Member Since:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Latest Submissions */}
        <div className="mt-1 flex flex-col items-center ">
          <h3 className="text-2xl font-semibold mb-4 text-center">Latest Submissions</h3>
          {submissions.length === 0 ? (
            <p className="text-gray-400 text-center">No submissions yet.</p>
          ) : (
            <div className="w-full max-w-xl mx-auto">
              <div
                className="space-y-4 w-full max-w-xl mx-auto overflow-y-auto bg-gray-800 bg-opacity-80 rounded-xl p-6 shadow-lg"
                style={{ maxHeight: "320px" }}
              >
                {submissions.map((sub) => (
                  <div
                      key={sub._id}
                      onClick={() => navigate(`/problems/${sub.problemId}`)}
                       title="Click to open problem"
                       className="bg-gray-900 p-4 rounded-lg shadow border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                    >
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-white">{sub.problemTitle}</p>
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          sub.status === "Accepted" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Difficulty:{" "}
                      <span
                        className={`${
                          sub.problemDifficulty === "Easy"
                            ? "text-green-400"
                            : sub.problemDifficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {sub.problemDifficulty}
                      </span>{" "}
                      | Language: <span className="uppercase">{sub.language}</span> | Submitted on:{" "}
                      {new Date(sub.submittedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10" /> {/* extra space after scroll area */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
