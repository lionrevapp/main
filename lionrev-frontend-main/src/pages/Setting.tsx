import { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [businessManagers, setBusinessManagers] = useState([]);
  const [selectedBusinessManager, setSelectedBusinessManager] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const userId = localStorage.getItem("token");

  // Load Facebook SDK
  useEffect(() => {
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "1250020949408627",
          autoLogAppEvents: true,
          xfbml: true,
          version: "v18.0",
        });
        setSdkLoaded(true);
      };
      (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    } else {
      setSdkLoaded(true);
    }
  }, []);

  // Fetch Business Managers Automatically When SDK is Loaded
  useEffect(() => {
    if (sdkLoaded && window.FB) {
      window.FB.api("/me/businesses", "GET", { access_token: localStorage.getItem("fbAccessToken") }, (response) => {
        if (response && response.data) {
          setBusinessManagers(response.data);
          if (response.data.length > 0) {
            setSelectedBusinessManager(response.data[0].id); // Select first by default
          }
        }
      });
    }
  }, [sdkLoaded]);

  // Update Profile
  const handleProfileUpdate = async () => {
    await axios.post("/api/api/facebook/updateProfile", { userId, ...profile });
    alert("Profile updated");
  };

  // Save Business Manager & Replace Old Data
  const saveBusinessManager = async () => {
    if (!selectedBusinessManager) {
      alert("No business manager selected");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/facebook/saveBusinessManager`, { userId, businessManagerId: selectedBusinessManager, fbAccessToken: localStorage.getItem("fbAccessToken") });
      alert("Business Manager Saved");
    } catch (error) {
      console.error("Error saving business manager", error);
      alert("Failed to save business manager");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Header />
        
        {/* Tabs */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-lg ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 text-lg ${activeTab === "integration" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("integration")}
            >
              Integration
            </button>
          </div>

          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="p-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />

              <label className="block text-gray-700 mt-2">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />

              <label className="block text-gray-700 mt-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded mt-1"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />

              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleProfileUpdate}>
                Update Profile
              </button>
            </div>
          )}

          {/* Facebook Integration */}
          {activeTab === "integration" && (
            <div className="p-4">
              <label className="block text-gray-700">Select Business Manager</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={selectedBusinessManager}
                onChange={(e) => setSelectedBusinessManager(e.target.value)}
              >
                {businessManagers.map((bm) => (
                  <option key={bm.id} value={bm.id}>{bm.name}</option>
                ))}
              </select>

              <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={saveBusinessManager}>
                Save Business Manager
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;