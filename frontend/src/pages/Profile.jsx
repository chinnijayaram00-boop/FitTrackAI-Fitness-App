import API_URL from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // GET PROFILE
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("fittrack_token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/profile/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        // Profile does not exist yet
        if (response.status === 404) {
          setProfileExists(false);
          setProfile(null);
          setLoading(false);
          return null;
        }

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to fetch profile"
          );
        }

        return data;
      })
      .then((data) => {
        if (!data) return;

        setProfile(data);
        setProfileExists(true);

        setFormData({
          name: data.name || "",
          age: data.age || "",
          height: data.height || "",
          weight: data.weight || "",
          goal: data.goal || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };

  // =========================
  // CREATE / UPDATE PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("fittrack_token");

    if (!token) {
      setError("Please login first.");
      setSaving(false);
      return;
    }

    const requestBody = {
      name: formData.name.trim(),
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      goal: formData.goal.trim(),
    };

    try {
      const response = await fetch(
        `${API_URL}/profile/`,
        {
          method: profileExists ? "PUT" : "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            (profileExists
              ? "Failed to update profile"
              : "Failed to create profile")
        );
      }

      // =========================
      // CREATE SUCCESS
      // =========================
      if (!profileExists) {
        setProfile(data.profile);
        setProfileExists(true);

        setSuccess("Profile created successfully! 🎉");
      } else {
        // =========================
        // UPDATE SUCCESS
        // =========================
        setProfile({
          ...data.profile,
          user: data.user,
        });

        setSuccess("Profile updated successfully! ✅");
      }

      setFormData({
        name: data.profile.name,
        age: data.profile.age,
        height: data.profile.height,
        weight: data.profile.weight,
        goal: data.profile.goal,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("fittrack_token");
    localStorage.removeItem("fittrack_user");
    navigate("/");
  };

  return (
    <div className="dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          FitTrack<span>AI</span>
        </div>

        <nav className="sidebar-nav">

          <Link to="/dashboard">
            🏠 Dashboard
          </Link>

          <Link to="/workout">
            🏋️ Workout
          </Link>

          <Link to="/diet">
            🥗 Diet
          </Link>

          <Link to="/progress">
            📈 Progress
          </Link>

          <Link to="/ai-trainer">
            🤖 AI Trainer
          </Link>

          <Link
            to="/profile"
            className="active"
          >
            👤 Profile
          </Link>

          <Link to="/settings">
            ⚙️ Settings
          </Link>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          ← Logout
        </button>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <div className="dashboard-topbar">

          <div>
            <h1>
              My Profile 👤
            </h1>

            <p>
              Manage your personal fitness information.
            </p>
          </div>

          <div className="profile-avatar">
            {profile?.name
              ?.charAt(0)
              ?.toUpperCase() || "J"}
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <p>
            Loading profile...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p
            style={{
              color: "green",
              marginBottom: "15px",
            }}
          >
            {success}
          </p>
        )}

        {/* =========================
            PROFILE FORM
        ========================= */}
        {!loading && (

          <section className="profile-card">

            {/* PROFILE HEADER */}
            <div className="profile-header">

              <div className="profile-big-avatar">
                {formData.name
                  ?.charAt(0)
                  ?.toUpperCase() || "J"}
              </div>

              <div>
                <h2>
                  {profileExists
                    ? formData.name
                    : "Create Your Profile"}
                </h2>

                <p>
                  {profileExists
                    ? "FitTrack AI Member"
                    : "Add your fitness information to get started."}
                </p>
              </div>

            </div>

            {/* PROFILE FORM */}
            <form onSubmit={handleSubmit}>

              <div className="profile-info-grid">

                {/* NAME */}
                <div className="profile-info">

                  <span>
                    👤 Name
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />

                </div>

                {/* AGE */}
                <div className="profile-info">

                  <span>
                    🎂 Age
                  </span>

                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                    required
                  />

                </div>

                {/* HEIGHT */}
                <div className="profile-info">

                  <span>
                    📏 Height (cm)
                  </span>

                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="1"
                    step="0.1"
                    placeholder="Enter height"
                    required
                  />

                </div>

                {/* WEIGHT */}
                <div className="profile-info">

                  <span>
                    ⚖️ Weight (kg)
                  </span>

                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="1"
                    step="0.1"
                    placeholder="Enter weight"
                    required
                  />

                </div>

                {/* GOAL */}
                <div className="profile-info">

                  <span>
                    🎯 Fitness Goal
                  </span>

                  <input
                    type="text"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    placeholder="e.g. Build Muscle"
                    required
                  />

                </div>

              </div>

              {/* SAVE / CREATE BUTTON */}
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
                style={{
                  marginTop: "25px",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {saving
                  ? "Saving..."
                  : profileExists
                  ? "Save Changes 💾"
                  : "Create Profile ➕"}
              </button>

            </form>

          </section>

        )}

      </main>

    </div>
  );
}

export default Profile;
