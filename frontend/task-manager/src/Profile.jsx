import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPersonCircleOutline,
  IoSaveOutline,
  IoCloseOutline,
  IoLogOutOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";

// Decode the JWT to extract the user's email (no library needed — just base64)
function getEmailFromToken() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.name; // authServer stores email as 'name' in payload
  } catch {
    return null;
  }
}

function Profile({ onLogout }) {
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password change state
  const [pwSection, setPwSection] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwShow, setPwShow] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState(null); // { type: 'success'|'error', text }

  const userEmail = getEmailFromToken();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Fetch by email so we always get the right user's data
      const res = await fetch(`http://localhost:3000/profile/me?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:3000/profile/me?email=${encodeURIComponent(userEmail)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({ name: data.name || "", email: data.email || "", bio: data.bio || "", avatar: data.avatar || "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Password change
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    setPwMessage(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (pwForm.newPw.length < 8) {
      setPwMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    try {
      setPwLoading(true);
      setPwMessage(null);
      const res = await fetch("http://localhost:3000/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMessage({ type: "success", text: "Password updated successfully!" });
        setPwForm({ current: "", newPw: "", confirm: "" });
        setTimeout(() => setPwSection(false), 2000);
      } else {
        setPwMessage({ type: "error", text: data || "Failed to update password." });
      }
    } catch {
      setPwMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setPwLoading(false);
    }
  };

  const togglePwShow = (field) => setPwShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };

  if (loading) {
    return (
      <div className="ml-16 min-h-screen bg-[#0f1123] text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="ml-16 min-h-screen bg-[#0f1123] text-white p-8">
      <motion.div
        initial="initial" animate="in" exit="out"
        variants={pageVariants} transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            User Profile
          </h1>
          {!isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg border border-red-500/30 hover:shadow-red-500/20"
              >
                <IoLogOutOutline size={20} /> Logout
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                <BiEditAlt size={20} /> Edit Profile
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => { fetchProfile(); setIsEditing(false); }}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
              >
                <IoCloseOutline size={20} /> Cancel
              </button>
              <button
                onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
              >
                <IoSaveOutline size={20} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-[#1D1F49] rounded-3xl p-8 shadow-xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 flex items-center justify-center bg-[#282a57]">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <IoPersonCircleOutline size={100} className="text-gray-400" />
                )}
              </div>
              {isEditing && (
                <div className="w-full max-w-xs">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Avatar URL</label>
                  <input
                    type="text" name="avatar" value={profile.avatar} onChange={handleChange}
                    className="w-full bg-[#0f1123] border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-400">Username</label>
                  {isEditing ? (
                    <input
                      type="text" name="name" value={profile.name} onChange={handleChange}
                      className="w-full bg-[#0f1123] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div className="text-xl font-semibold text-white px-1 py-2">{profile.name || "No username set"}</div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-400">Email Address</label>
                  {/* Email is always read-only — it's the login identity */}
                  <div className="text-xl font-medium text-gray-300 px-1 py-2">{profile.email || "No email set"}</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-400">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio" value={profile.bio} onChange={handleChange} rows={4}
                    className="w-full bg-[#0f1123] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="text-lg text-gray-300 px-1 py-2 leading-relaxed whitespace-pre-wrap">
                    {profile.bio || "No bio provided."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Change Password Section ── */}
        <div className="bg-[#1D1F49] rounded-3xl shadow-xl border border-gray-700/50 overflow-hidden">
          {/* Toggle header */}
          <button
            onClick={() => { setPwSection((v) => !v); setPwMessage(null); setPwForm({ current: "", newPw: "", confirm: "" }); }}
            className="w-full flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
                <IoLockClosedOutline size={18} className="text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
            </div>
            <motion.div animate={{ rotate: pwSection ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <IoCloseOutline size={22} className={`transition-colors ${pwSection ? "text-white" : "text-gray-500 rotate-45"}`} />
            </motion.div>
          </button>

          <AnimatePresence>
            {pwSection && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <form onSubmit={handlePasswordSubmit} className="px-8 pb-8 pt-2 space-y-4 border-t border-gray-700/50">

                  {/* Feedback message */}
                  <AnimatePresence>
                    {pwMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                          pwMessage.type === "success"
                            ? "bg-green-500/10 border border-green-500/30 text-green-400"
                            : "bg-red-500/10 border border-red-500/30 text-red-400"
                        }`}
                      >
                        {pwMessage.type === "success"
                          ? <IoCheckmarkCircleOutline size={18} />
                          : <IoAlertCircleOutline size={18} />}
                        {pwMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Current Password */}
                  {[
                    { label: "Current Password", field: "current", placeholder: "Enter current password" },
                    { label: "New Password", field: "newPw", placeholder: "Min. 8 characters" },
                    { label: "Confirm New Password", field: "confirm", placeholder: "Repeat new password" },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-400">{label}</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                          <IoLockClosedOutline size={18} />
                        </div>
                        <input
                          type={pwShow[field] ? "text" : "password"}
                          name={field}
                          value={pwForm[field]}
                          onChange={handlePwChange}
                          required
                          placeholder={placeholder}
                          className="w-full bg-[#0f1123] border border-gray-600 rounded-xl py-3 pl-11 pr-11 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => togglePwShow(field)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {pwShow[field] ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Strength hint */}
                  {pwForm.newPw && (
                    <div className="flex gap-1 pt-1">
                      {[8, 12, 16].map((len, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            pwForm.newPw.length >= len
                              ? i === 0 ? "bg-red-500" : i === 1 ? "bg-yellow-500" : "bg-green-500"
                              : "bg-gray-700"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-2 self-center">
                        {pwForm.newPw.length < 8 ? "Too short" : pwForm.newPw.length < 12 ? "Fair" : pwForm.newPw.length < 16 ? "Good" : "Strong"}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit" disabled={pwLoading}
                    className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none border border-white/10"
                  >
                    {pwLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><IoSaveOutline size={18} /> Update Password</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
