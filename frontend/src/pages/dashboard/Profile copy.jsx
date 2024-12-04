import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserData, setEditMode } from "../../store/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status, isEditMode } = useSelector((state) => state.user);
  const token = useSelector((state) => state.misc.token);

  const [updatedUser, setUpdatedUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserData(token));
    }
  }, [dispatch, token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser((prevUser) => ({ ...prevUser, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSave = () => {
    if (!updatedUser.username || !updatedUser.username.trim()) {
      alert("Username cannot be empty!");
      return;
    }
    dispatch(updateUserData({ token, updatedUser, selectedFile }));
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl p-10 shadow-lg shadow-black">
        {/* Profile Details */}
        <div className="flex flex-col items-center lg:items-start flex-grow bg-white shadow-md rounded-lg p-10">
          <img
            src={user?.profilePicUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-40 h-40 rounded-full border border-gray-300 mb-4 object-cover"
          />
          <h1 className="text-3xl font-bold text-gray-800">{user?.username}</h1>
          <p className="text-gray-500 mt-2">{user?.email}</p>
          <p className="text-gray-700 text-center lg:text-left mt-4">
            {user?.bio || "No bio added yet."}
          </p>
          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => dispatch(setEditMode(true))}
          >
            Edit Profile
          </button>
        </div>

        {/* Edit Profile */}
        {isEditMode && (
          <div className="flex flex-col items-center lg:items-start flex-grow bg-white shadow-md rounded-lg p-10 ml-6">
            <input
              type="text"
              placeholder="Username"
              value={updatedUser.username || ""}
              onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
              className="mt-4 p-2 border border-gray-300 rounded w-full"
            />
            <textarea
              placeholder="Bio"
              value={updatedUser.bio || ""}
              onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}
              className="mt-4 p-2 border border-gray-300 rounded w-full"
            ></textarea>
            <div className="mt-4 w-full">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full"
                onChange={handleFileChange}
              />
              {updatedUser.profilePic && (
                <img
                  src={updatedUser.profilePic}
                  alt="Preview"
                  className="mt-4 w-32 h-32 rounded-full border border-gray-300 object-cover"
                />
              )}
            </div>
            <div className="flex justify-end gap-4 mt-4 w-full">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => dispatch(setEditMode(false))}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={onSave}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;