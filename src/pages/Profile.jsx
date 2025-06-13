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

    fetchUser();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.patch("/users/updateAvatar", formData);
      setUser((prev) => ({ ...prev, avatar: res.data.data.avatar }));
      toast.success("Avatar updated successfully");
      updateUser({ avatar: res.data.data.avatar });
    } catch (err) {
      console.error("Error updating avatar", err);
      toast.error("Failed to update avatar");
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const res = await axios.patch("/users/updateCover", formData);
      setUser((prev) => ({ ...prev, coverImage: res.data.data.coverImage }));
      toast.success("Cover image updated successfully");
    } catch (err) {
      console.error("Error updating cover", err);
      toast.error("Failed to update cover image");
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
    <div className="min-h-screen bg-gray-950 text-white py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div
          className="h-56 bg-cover bg-center cursor-pointer"
          style={{
            backgroundImage: `url(${
              user.coverImage ||
              "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80"
            })`,
          }}
          onClick={() => coverInputRef.current.click()}
          title="Click to change cover image
          "
        ></div>
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
                className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg"
              />
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
      </div>
    </div>
  );
};

export default Profile;
