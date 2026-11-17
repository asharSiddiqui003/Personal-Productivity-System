import { useState, useEffect, useRef } from "react";
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
  IoCameraOutline,
} from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Profile({ onLogout }) {
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Password change state
  const [pwSection, setPwSection] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwShow, setPwShow] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState(null); // { type: 'success'|'error', text }

  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    fetchProfile();
    // Get the user's email from the JWT token via /me
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch(`${BASE_URL}/me`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data?.email) setUserEmail(data.email); })
        .catch(() => {});
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${BASE_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          id: data.id,
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
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${BASE_URL}/profile/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({ 
          id: data.id,
          name: data.name || "", 
          email: data.email || "", 
          bio: data.bio || "", 
          avatar: data.avatar || "" 
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => ({ ...prev, avatar: data.url }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
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
      const res = await fetch(`${BASE_URL}/profile/password`, {
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
      <div className="md:ml-20 min-h-screen bg-[var(--bg-canvas)] text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="md:ml-20 min-h-screen text-[var(--text)] p-4 md:p-8">
      <motion.div
        initial="initial" animate="in" exit="out"
        variants={pageVariants} transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto space-y-6 md:space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-normal font-heading text-[var(--text-strong)] mb-1">User Profile</h1>
            <p className="text-[var(--text-muted)] text-sm">Manage your account settings and security</p>
          </div>
          {!isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--oxblood)', border: '1px solid var(--danger)', color: 'var(--text-strong)' }}
              >
                <IoLogOutOutline size={20} /> Logout
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 text-[var(--on-accent)]"
                style={{ background: 'var(--accent)' }}
              >
                <BiEditAlt size={20} /> Edit Profile
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => { fetchProfile(); setIsEditing(false); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
              >
                <IoCloseOutline size={20} /> Cancel
              </button>
              <button
                onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                <IoSaveOutline size={20} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="rounded-[2rem] p-10 relative overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line-card)' }}>
          <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center relative z-10" style={{ border: '1px solid var(--line-card)', background: 'var(--raised)' }}>
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar.replace('http://localhost:3000', BASE_URL)} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <IoPersonCircleOutline size={120} className="text-[var(--text-subtle)]" />
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="w-full max-w-[240px] animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[var(--selected)] text-[var(--text)] disabled:opacity-50"
                      style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
                    >
                      <IoCameraOutline size={18} />
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-subtle)] mb-2 uppercase tracking-widest text-center">Or Avatar URL</label>
                    <input
                      type="text" name="avatar" value={profile.avatar} onChange={handleChange}
                      className="w-full rounded-xl px-4 py-2.5 text-sm text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all text-center"
                      style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
                      placeholder="https://example.com/photo.png"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-widest px-1">Username</label>
                  {isEditing ? (
                    <input
                      type="text" name="name" value={profile.name} onChange={handleChange}
                      className="w-full rounded-xl px-5 py-4 text-[var(--text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all"
                      style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-[var(--text-strong)] px-1 py-1">{profile.name || "No username set"}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-widest px-1">Email Address</label>
                  <div className="text-xl font-medium text-[var(--text-muted)] px-1 py-1 flex items-center gap-2">
                    {profile.email || "No email set"}
                    <IoCheckmarkCircleOutline className="text-[var(--accent)]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-widest px-1">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio" value={profile.bio} onChange={handleChange} rows={4}
                    className="w-full rounded-xl px-5 py-4 text-[var(--text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all resize-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="text-lg text-[var(--text-muted)] px-1 py-1 leading-relaxed whitespace-pre-wrap max-w-2xl">
                    {profile.bio || "No bio provided."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Change Password Section ── */}
        <div className="rounded-[2rem] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line-card)' }}>
          {/* Toggle header */}
          <button
            onClick={() => { setPwSection((v) => !v); setPwMessage(null); setPwForm({ current: "", newPw: "", confirm: "" }); }}
            className="w-full flex items-center justify-between px-10 py-6 hover:bg-[var(--hover)] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--accent-tint)] border border-[var(--accent)]/30 flex items-center justify-center transition-colors">
                <IoLockClosedOutline size={20} className="text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <p className="font-bold text-[var(--text-strong)] text-lg">Change Password</p>
                <p className="text-sm text-[var(--text-muted)]">Keep your account secure</p>
              </div>
            </div>
            <motion.div animate={{ rotate: pwSection ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <IoCloseOutline size={28} className={`transition-colors ${pwSection ? "text-[var(--text-strong)]" : "text-[var(--text-muted)] rotate-45"}`} />
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
                <form onSubmit={handlePasswordSubmit} className="px-10 pb-10 pt-4 space-y-6 border-t border-[var(--line-card)]">

                  {/* Feedback message */}
                  <AnimatePresence>
                    {pwMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${pwMessage.type === "success"
                            ? "bg-[var(--accent-tint)] border border-[var(--accent)]/30 text-[var(--accent)]"
                            : "bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)]"
                          }`}
                      >
                        {pwMessage.type === "success"
                          ? <IoCheckmarkCircleOutline size={18} />
                          : <IoAlertCircleOutline size={18} />}
                        {pwMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Password inputs */}
                  {[
                    { label: "Current Password", field: "current", placeholder: "Enter current password" },
                    { label: "New Password", field: "newPw", placeholder: "Min. 8 characters" },
                    { label: "Confirm New Password", field: "confirm", placeholder: "Repeat new password" },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-xs font-bold text-[var(--text-subtle)] uppercase tracking-widest px-1">{label}</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors">
                          <IoLockClosedOutline size={20} />
                        </div>
                        <input
                          type={pwShow[field] ? "text" : "password"}
                          name={field}
                          value={pwForm[field]}
                          onChange={handlePwChange}
                          required
                          placeholder={placeholder}
                          className="w-full rounded-xl py-4 pl-12 pr-12 text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all"
                          style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
                        />
                        <button
                          type="button"
                          onClick={() => togglePwShow(field)}
                          className="absolute inset-y-0 right-0 pr-5 flex items-center text-[var(--text-subtle)] hover:text-[var(--text-strong)] transition-colors"
                        >
                          {pwShow[field] ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
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
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${pwForm.newPw.length >= len
                              ? i === 0 ? "bg-[var(--danger)]" : "bg-[var(--accent)]"
                              : "bg-[var(--line-control)]"
                            }`}
                        />
                      ))}
                      <span className="text-xs text-[var(--text-subtle)] ml-2 self-center font-mono tabular-nums">
                        {pwForm.newPw.length < 8 ? "Too short" : pwForm.newPw.length < 12 ? "Fair" : pwForm.newPw.length < 16 ? "Good" : "Strong"}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit" disabled={pwLoading}
                    className="w-full mt-4 text-[var(--on-accent)] font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                    style={{ background: 'var(--accent)' }}
                  >
                    {pwLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><IoSaveOutline size={20} /> Update Password</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] p-10 shadow-2xl"
              style={{ 
                background: 'var(--raised)', 
                border: '1px solid var(--danger)'
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-[var(--danger)]/15 border border-[var(--danger)]/30 flex items-center justify-center mb-6">
                  <IoLogOutOutline size={40} className="text-[var(--danger)]" />
                </div>
                <h2 className="text-2xl font-normal font-heading text-[var(--text-strong)] mb-2">Confirm Logout</h2>
                <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
                  Are you sure you want to sign out? You'll need to enter your credentials to access your tasks again.
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={onLogout}
                    className="w-full py-4 rounded-2xl font-bold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'var(--oxblood)', border: '1px solid var(--danger)', color: 'var(--text-strong)' }}
                  >
                    Yes, Logout
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-full py-4 rounded-2xl font-bold text-[var(--text)] transition-all hover:bg-[var(--hover)] border border-[var(--line-control)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;
