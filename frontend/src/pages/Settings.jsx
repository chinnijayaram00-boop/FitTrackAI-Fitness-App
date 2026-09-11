import API_URL from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    notifications: true,
    ai_recommendations: true,
    dark_mode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");


  /* =========================
     APPLY GLOBAL DARK MODE
  ========================= */

  useEffect(() => {

    if (settings.dark_mode) {

      document.body.classList.add("dark-mode");

      localStorage.setItem(
        "fittrack_dark_mode",
        "true"
      );

    } else {

      document.body.classList.remove("dark-mode");

      localStorage.setItem(
        "fittrack_dark_mode",
        "false"
      );

    }

  }, [settings.dark_mode]);


  /* =========================
     GET SETTINGS
  ========================= */

  useEffect(() => {

    const token =
      localStorage.getItem("fittrack_token");

    if (!token) {

      setMessage("Please login first.");
      setLoading(false);

      return;
    }


    fetch(
      `${API_URL}/settings/`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

      .then(async (response) => {

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Failed to fetch settings"
          );

        }

        return data;
      })

      .then((data) => {

        setSettings({

          notifications:
            data.notifications ?? true,

          ai_recommendations:
            data.ai_recommendations ?? true,

          dark_mode:
            data.dark_mode ?? false,

        });

        setLoading(false);

      })

      .catch((error) => {

        setMessage(error.message);

        setLoading(false);

      });

  }, []);


  /* =========================
     UPDATE SETTING
  ========================= */

  const updateSetting =
    async (field, value) => {

      const token =
        localStorage.getItem(
          "fittrack_token"
        );

      if (!token) {

        setMessage(
          "Please login first."
        );

        return;
      }


      const updatedSettings = {

        ...settings,

        [field]: value,

      };


      /* Update UI immediately */

      setSettings(
        updatedSettings
      );


      setSaving(true);

      setMessage("");


      try {

        const response =
          await fetch(
            `${API_URL}/settings/`,
            {
              method: "PUT",

              headers: {

                Accept:
                  "application/json",

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body:
                JSON.stringify(
                  updatedSettings
                ),

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Failed to update settings"
          );

        }


        setMessage(
          "Settings saved successfully! ✅"
        );

      } catch (error) {

        setMessage(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "fittrack_token"
    );

    localStorage.removeItem(
      "fittrack_user"
    );

    localStorage.removeItem(
      "fittrack_dark_mode"
    );

    document.body.classList.remove(
      "dark-mode"
    );

    navigate("/login");

  };


  /* =========================
     DELETE ACCOUNT
  ========================= */

  const handleDeleteAccount = () => {

    alert(
      "Delete Account feature will be connected to the backend next."
    );

  };


  return (

    <div className="settings-page">

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

          <Link to="/profile">
            👤 Profile
          </Link>

          <Link
            to="/settings"
            className="active"
          >
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
          MAIN
      ========================= */}

      <main className="settings-main">

        <header className="settings-header">

          <h1>
            Settings ⚙️
          </h1>

          <p>
            Customize your FitTrack AI experience.
          </p>

        </header>


        {/* LOADING */}

        {loading && (
          <p>
            Loading settings...
          </p>
        )}


        {!loading && (

          <>

            {/* =========================
                ACCOUNT SETTINGS
            ========================= */}

            <section className="settings-card">

              <div className="settings-title">

                <div className="settings-icon">
                  👤
                </div>

                <div>

                  <h2>
                    Account Settings
                  </h2>

                  <p>
                    Manage your notification preferences.
                  </p>

                </div>

              </div>


              {/* EMAIL NOTIFICATIONS */}

              <div className="settings-row">

                <div>

                  <strong>
                    Email Notifications
                  </strong>

                  <p>
                    Receive important fitness updates by email.
                  </p>

                </div>


                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.notifications
                    }
                    onChange={(e) =>
                      updateSetting(
                        "notifications",
                        e.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>


              {/* WORKOUT REMINDERS */}

              <div className="settings-row">

                <div>

                  <strong>
                    Workout Reminders
                  </strong>

                  <p>
                    Get reminders when it is time to exercise.
                  </p>

                </div>


                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.notifications
                    }
                    onChange={(e) =>
                      updateSetting(
                        "notifications",
                        e.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>

            </section>


            {/* =========================
                AI SETTINGS
            ========================= */}

            <section className="settings-card">

              <div className="settings-title">

                <div className="settings-icon">
                  🤖
                </div>

                <div>

                  <h2>
                    AI Trainer Settings
                  </h2>

                  <p>
                    Customize your AI fitness assistant.
                  </p>

                </div>

              </div>


              {/* AI RECOMMENDATIONS */}

              <div className="settings-row">

                <div>

                  <strong>
                    Personalized Recommendations
                  </strong>

                  <p>
                    Allow AI to analyze your fitness activity
                    and suggest plans.
                  </p>

                </div>


                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.ai_recommendations
                    }
                    onChange={(e) =>
                      updateSetting(
                        "ai_recommendations",
                        e.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>


              {/* PROGRESS ANALYSIS */}

              <div className="settings-row">

                <div>

                  <strong>
                    Progress Analysis
                  </strong>

                  <p>
                    Let AI analyze your progress and provide
                    insights.
                  </p>

                </div>


                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.ai_recommendations
                    }
                    onChange={(e) =>
                      updateSetting(
                        "ai_recommendations",
                        e.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>

            </section>


            {/* =========================
                PREFERENCES
            ========================= */}

            <section className="settings-card">

              <div className="settings-title">

                <div className="settings-icon">
                  🎨
                </div>

                <div>

                  <h2>
                    Preferences
                  </h2>

                  <p>
                    Customize how FitTrack AI looks and behaves.
                  </p>

                </div>

              </div>


              <div className="settings-form">

                <div>

                  <label>
                    Units
                  </label>

                  <select defaultValue="metric">

                    <option value="metric">
                      Metric (kg / cm)
                    </option>

                    <option value="imperial">
                      Imperial (lbs / ft)
                    </option>

                  </select>

                </div>


                <div>

                  <label>
                    Language
                  </label>

                  <select defaultValue="english">

                    <option value="english">
                      English
                    </option>

                    <option value="telugu">
                      Telugu
                    </option>

                  </select>

                </div>

              </div>

            </section>


            {/* =========================
                DARK MODE
            ========================= */}

            <section className="settings-card">

              <div className="settings-row">

                <div>

                  <strong>
                    Dark Mode
                  </strong>

                  <p>
                    Enable dark mode for the application.
                  </p>

                </div>


                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.dark_mode
                    }
                    onChange={(e) =>
                      updateSetting(
                        "dark_mode",
                        e.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>

            </section>


            {/* =========================
                ACCOUNT ACTIONS
            ========================= */}

            <section className="settings-card danger-card">

              <div className="settings-title">

                <div className="settings-icon danger-icon">
                  ⚠️
                </div>

                <div>

                  <h2>
                    Account Actions
                  </h2>

                  <p>
                    Manage your account.
                  </p>

                </div>

              </div>


              <div className="danger-actions">

                <button
                  className="logout-settings"
                  onClick={handleLogout}
                >
                  Logout
                </button>


                <button
                  className="delete-settings"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>

              </div>

            </section>


            {/* STATUS MESSAGE */}

            {message && (

              <p
                style={{
                  marginTop: "15px"
                }}
              >
                {saving
                  ? "Saving..."
                  : message}
              </p>

            )}

          </>

        )}

      </main>

    </div>

  );
}

export default Settings;