import API_URL from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Progress() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [workouts, setWorkouts] = useState("");
  const [goalPercentage, setGoalPercentage] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);

  const fetchProgress = async () => {
    const token = localStorage.getItem("fittrack_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
      `${API_URL}/progress/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("fittrack_token");
        localStorage.removeItem("fittrack_user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch progress");
      }

      const data = await response.json();

      setProgress(data.progress || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const resetForm = () => {
    setDate("");
    setWeight("");
    setCaloriesBurned("");
    setWorkouts("");
    setGoalPercentage("");
    setEditingId(null);
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("fittrack_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    if (
      !date.trim() ||
      weight === "" ||
      caloriesBurned === "" ||
      workouts === "" ||
      goalPercentage === ""
    ) {
      setError("Please fill all progress fields.");
      setSaving(false);
      return;
    }

    if (Number(weight) <= 0) {
      setError("Weight must be greater than 0.");
      setSaving(false);
      return;
    }

    if (Number(caloriesBurned) < 0) {
      setError("Calories burned cannot be negative.");
      setSaving(false);
      return;
    }

    if (Number(workouts) < 0) {
      setError("Workouts cannot be negative.");
      setSaving(false);
      return;
    }

    if (
      Number(goalPercentage) < 0 ||
      Number(goalPercentage) > 100
    ) {
      setError("Goal percentage must be between 0 and 100.");
      setSaving(false);
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/progress/${editingId}`
        : `${API_URL}/progress/${progressId}`      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: date.trim(),
          weight: Number(weight),
          calories_burned: Number(caloriesBurned),
          workouts: Number(workouts),
          goal_percentage: Number(goalPercentage),
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("fittrack_token");
        localStorage.removeItem("fittrack_user");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            (editingId
              ? "Failed to update progress"
              : "Failed to add progress")
        );
      }

      if (editingId) {
        setSuccess("Progress updated successfully! ✏️");
      } else {
        setSuccess("Progress added successfully! 🎉");
      }

      resetForm();

      await fetchProgress();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setError("");
    setSuccess("");

    setEditingId(item.id);
    setDate(item.date);
    setWeight(item.weight);
    setCaloriesBurned(item.calories_burned);
    setWorkouts(item.workouts);
    setGoalPercentage(item.goal_percentage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (progressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this progress record?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("fittrack_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/progress/${progressId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("fittrack_token");
        localStorage.removeItem("fittrack_user");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete progress"
        );
      }

      if (editingId === progressId) {
        resetForm();
      }

      setSuccess("Progress deleted successfully! 🗑️");

      await fetchProgress();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fittrack_token");
    localStorage.removeItem("fittrack_user");
    navigate("/login");
  };

  const latest =
    progress.length > 0
      ? progress[progress.length - 1]
      : null;

  const first =
    progress.length > 0
      ? progress[0]
      : null;

  const weightChange =
    latest && first
      ? Number(latest.weight) - Number(first.weight)
      : 0;

  const totalCalories = progress.reduce(
    (sum, item) =>
      sum + Number(item.calories_burned || 0),
    0
  );

  const totalWorkouts = progress.reduce(
    (sum, item) =>
      sum + Number(item.workouts || 0),
    0
  );

  return (
    <div className="app-container">
      <div className="dashboard-layout">

        {/* SIDEBAR */}

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

            <Link
              to="/progress"
              className="active"
            >
              📈 Progress
            </Link>

            <Link to="/ai-trainer">
              🤖 AI Trainer
            </Link>

            <Link to="/profile">
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

        {/* MAIN */}

        <main className="dashboard-main">

          {/* HEADER */}

          <div className="dashboard-header">

            <div>
              <h1>
                Progress Analytics 📈
              </h1>

              <p>
                Track your fitness journey and see your improvement.
              </p>
            </div>

            <select className="period-select">
              <option>Last 4 Weeks</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>

          </div>

          {/* ADD / EDIT PROGRESS */}

          <div className="progress-card">

            <div className="section-header">

              <div>

                <h2>
                  {editingId
                    ? "✏️ Edit Progress"
                    : "➕ Add Today's Progress"}
                </h2>

                <p>
                  {editingId
                    ? "Update your fitness progress."
                    : "Record your latest fitness activity."}
                </p>

              </div>

            </div>

            <form
              onSubmit={handleSaveProgress}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
                marginTop: "20px",
              }}
            >

              <input
                type="text"
                placeholder="Date (e.g. Week 5)"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                required
              />

              <input
                type="number"
                step="0.1"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
                min="0.1"
                required
              />

              <input
                type="number"
                placeholder="Calories Burned"
                value={caloriesBurned}
                onChange={(e) =>
                  setCaloriesBurned(e.target.value)
                }
                min="0"
                required
              />

              <input
                type="number"
                placeholder="Workouts"
                value={workouts}
                onChange={(e) =>
                  setWorkouts(e.target.value)
                }
                min="0"
                required
              />

              <input
                type="number"
                placeholder="Goal Progress %"
                value={goalPercentage}
                onChange={(e) =>
                  setGoalPercentage(e.target.value)
                }
                min="0"
                max="100"
                required
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                    ? "✏️ Update Progress"
                    : "Add Progress →"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

            {success && (
              <p
                style={{
                  color: "green",
                  marginTop: "15px",
                }}
              >
                {success}
              </p>
            )}

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "15px",
                }}
              >
                {error}
              </p>
            )}

          </div>

          {/* STATS */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                ⚖️
              </div>

              <div>

                <p>Current Weight</p>

                <h2>
                  {latest
                    ? latest.weight
                    : "--"}{" "}
                  kg
                </h2>

                <span>
                  {weightChange < 0
                    ? `↓ ${Math.abs(weightChange).toFixed(1)} kg`
                    : weightChange > 0
                    ? `↑ ${weightChange.toFixed(1)} kg`
                    : "No change"}
                </span>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🔥
              </div>

              <div>

                <p>Calories Burned</p>

                <h2>
                  {totalCalories.toLocaleString()}
                </h2>

                <span>
                  kcal total
                </span>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🏋️
              </div>

              <div>

                <p>Total Workouts</p>

                <h2>
                  {totalWorkouts}
                </h2>

                <span>
                  workouts completed
                </span>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🎯
              </div>

              <div>

                <p>Goal Progress</p>

                <h2>
                  {latest
                    ? latest.goal_percentage
                    : 0}
                  %
                </h2>

                <span>
                  towards your goal
                </span>

              </div>

            </div>

          </div>

          {/* WEIGHT PROGRESS */}

          <div className="progress-section">

            <div className="section-header">

              <div>

                <h2>
                  Weight Progress
                </h2>

                <p>
                  Your weight changes over time.
                </p>

              </div>

              {latest && (
                <div className="current-value">
                  {latest.weight} kg
                </div>
              )}

            </div>

            <div className="weight-chart">

              {loading ? (
                <p>
                  Loading progress...
                </p>
              ) : progress.length === 0 ? (
                <p>
                  No progress data available.
                  Add your first progress above.
                </p>
              ) : (
                <div className="chart-content">

                  {progress.map(
                    (item, index) => {

                      const weights =
                        progress.map(
                          (p) =>
                            Number(p.weight)
                        );

                      const minWeight =
                        Math.min(...weights);

                      const maxWeight =
                        Math.max(...weights);

                      const range =
                        maxWeight -
                        minWeight;

                      const height =
                        range === 0
                          ? 60
                          : 30 +
                            ((maxWeight -
                              Number(item.weight)) /
                              range) *
                              70;

                      return (
                        <div
                          className="progress-point"
                          key={
                            item.id ||
                            index
                          }
                        >

                          <div className="point-value">
                            {item.weight} kg
                          </div>

                          <div className="point-bar">

                            <div
                              className="point-fill"
                              style={{
                                height: `${height}%`,
                              }}
                            ></div>

                          </div>

                          <div className="point-label">
                            {item.date}
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>

          {/* GOAL + ACTIVITY */}

          <div className="progress-columns">

            {/* GOAL */}

            <div className="progress-card">

              <div className="section-header">

                <div>

                  <h2>
                    Goal Progress
                  </h2>

                  <p>
                    Keep pushing forward!
                  </p>

                </div>

              </div>

              <div className="goal-progress">

                <div className="goal-circle">

                  <div className="circle-inner">

                    <strong>
                      {latest
                        ? latest.goal_percentage
                        : 0}
                      %
                    </strong>

                    <span>
                      Completed
                    </span>

                  </div>

                </div>

                <div className="goal-details">

                  <div className="goal-row">

                    <span>
                      Current Weight
                    </span>

                    <strong>
                      {latest
                        ? latest.weight
                        : "--"}{" "}
                      kg
                    </strong>

                  </div>

                  <div className="goal-row">

                    <span>
                      Starting Weight
                    </span>

                    <strong>
                      {first
                        ? first.weight
                        : "--"}{" "}
                      kg
                    </strong>

                  </div>

                  <div className="goal-row">

                    <span>
                      Goal
                    </span>

                    <strong>
                      Fitness
                    </strong>

                  </div>

                </div>

              </div>

            </div>

            {/* ACTIVITY */}

            <div className="progress-card">

              <div className="section-header">

                <div>

                  <h2>
                    Workout Activity
                  </h2>

                  <p>
                    Your recent activity.
                  </p>

                </div>

              </div>

              <div className="activity-list">

                {progress.length === 0 ? (
                  <p>
                    No workout activity available.
                  </p>
                ) : (
                  [...progress]
                    .reverse()
                    .map(
                      (item, index) => (

                        <div
                          className="activity-row"
                          key={
                            item.id ||
                            index
                          }
                        >

                          <div className="activity-icon">
                            🏃
                          </div>

                          <div className="activity-info">

                            <strong>
                              {item.date}
                            </strong>

                            <span>
                              {item.workouts} workouts
                            </span>

                          </div>

                          <div className="activity-calories">
                            🔥{" "}
                            {item.calories_burned}{" "}
                            kcal
                          </div>

                        </div>

                      )
                    )
                )}

              </div>

            </div>

          </div>

          {/* AI INSIGHT */}

          <div className="ai-insight-card">

            <div className="ai-insight-icon">
              🤖
            </div>

            <div className="ai-insight-content">

              <h3>
                AI Fitness Insight
              </h3>

              <p>

                {latest && first
                  ? latest.weight <
                    first.weight
                    ? `Great progress! You have reduced your weight by ${Math.abs(
                        weightChange
                      ).toFixed(
                        1
                      )} kg. Keep following your workout and nutrition plan.`
                    : latest.weight >
                      first.weight
                    ? `Your weight has increased by ${Math.abs(
                        weightChange
                      ).toFixed(
                        1
                      )} kg. Stay consistent with your fitness plan!`
                    : "Your weight is stable. Keep maintaining your healthy routine!"
                  : "Start tracking your workouts and progress to receive personalized AI insights."}

              </p>

              <Link to="/ai-trainer">
                Ask AI Trainer →
              </Link>

            </div>

          </div>

          {/* PROGRESS RECORDS */}

          <div className="progress-card">

            <div className="section-header">

              <div>

                <h2>
                  Progress Records
                </h2>

                <p>
                  Manage your saved progress entries.
                </p>

              </div>

              <span>
                {progress.length} Records
              </span>

            </div>

            {loading ? (
              <p>
                Loading records...
              </p>
            ) : progress.length === 0 ? (
              <p>
                No progress records available.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >

                {[...progress]
                  .reverse()
                  .map((item) => (

                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "15px",
                        padding: "15px",
                        borderRadius: "12px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        flexWrap: "wrap",
                      }}
                    >

                      <div>

                        <strong>
                          {item.date}
                        </strong>

                        <p
                          style={{
                            margin: "5px 0 0",
                          }}
                        >
                          ⚖️ {item.weight} kg
                          {" • "}
                          🔥 {item.calories_burned} kcal
                          {" • "}
                          🏋️ {item.workouts} workouts
                          {" • "}
                          🎯 {item.goal_percentage}%
                        </p>

                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >

                        <button
                          type="button"
                          className="meal-button"
                          onClick={() =>
                            handleEdit(item)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="meal-button"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  ))}

              </div>
            )}

          </div>

        </main>

      </div>
    </div>
  );
}

export default Progress;

