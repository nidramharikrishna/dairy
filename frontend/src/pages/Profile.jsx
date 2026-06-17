import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("profile/");
      setProfile(res.data);
    } catch (error) {
      console.log("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await API.put("profile/", {
        phone: profile.phone,
        address: profile.address,
      });

      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-softText">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-4xl font-bold mb-6">My Profile</h1>

          <form onSubmit={updateProfile}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Username
              </label>

              <input
                value={profile.username}
                disabled
                className="w-full border rounded-xl px-4 py-3 bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Email
              </label>

              <input
                value={profile.email}
                disabled
                className="w-full border rounded-xl px-4 py-3 bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Phone
              </label>

              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                Address
              </label>

              <textarea
                name="address"
                value={profile.address || ""}
                onChange={handleChange}
                rows="5"
                className="w-full border rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <button className="bg-sky text-white px-6 py-3 rounded-xl hover:shadow-md transition">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;