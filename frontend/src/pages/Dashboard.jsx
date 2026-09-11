import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [diet, setDiet] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("fittrack_token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [
          workoutResponse,
          dietResponse,
          progressResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/workouts/`, {
            headers,
          }),

          fetch(`${API_URL}/diet/`, {
            headers,
          }),

          fetch(`${API_URL}/progress/`, {
            headers,
          }),
        ]);

        // Session expired / unauthorized
        if (
          workoutResponse.status === 401 ||
          dietResponse.status === 401 ||
          progressResponse.status === 401
        ) {
          localStorage.removeItem("fittrack_token");
          localStorage.removeItem("fittrack_user");

          window.location.href = "/login";
          return;
        }

        const workoutData = await workoutResponse.json();
        const dietData = await dietResponse.json();
        const progressData = await progressResponse.json();

        setWorkouts(workoutData.workouts || []);
        setDiet(dietData.diet || []);
        setProgress(progressData.progress || []);

        // Get logged-in user from backend
        if (workoutData.user) {
          setUser(workoutData.user);
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Get stored user as fallback
  const storedUser = JSON.parse(
    localStorage.getItem("fittrack_user") || "null"
  );

  const displayUser = user || storedUser;

  // Total calories burned from all workouts
  const totalCaloriesBurned = workouts.reduce(
    (total, workout) =>
      total + Number(workout.calories || 0),
    0
  );

  // Total workout duration
  const totalWorkoutMinutes = workouts.reduce(
    (total, workout) =>
      total + Number(workout.duration || 0),
    0
  );

  // Total diet calories
  const totalDietCalories = diet.reduce(
    (total, item) =>
      total + Number(item.calories || 0),
    0
  );

  // Get the actual latest progress based on date
  const latestProgress =
    progress.length > 0
      ? [...progress].sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        )[0]
      : null;

  // Latest goal percentage
  const goalPercentage = latestProgress
    ? Number(latestProgress.goal_percentage || 0)
    : 0;

  // Latest weight
  const latestWeight = latestProgress
    ? Number(latestProgress.weight || 0)
    : 0;

  // Loading screen
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <h2>Loading FitTrack AI...</h2>
          <p>Getting your fitness data 🤖</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          FitTrack<span>AI</span>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="active"
          >
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

          <Link to="/settings">
            ⚙️ Settings
          </Link>

        </nav>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem(
              "fittrack_token"
            );

            localStorage.removeItem(
              "fittrack_user"
            );

            window.location.href = "/login";
          }}
        >
          🚪 Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-label">
              YOUR FITNESS DASHBOARD
            </p>

            <h1>
              Welcome back{" "}
              <span>
                {displayUser?.name || "User"} 👋
              </span>
            </h1>

            <p className="dashboard-subtitle">
              Here's your fitness overview for today.
            </p>

          </div>

          <Link
            to="/profile"
            className="profile-button"
          >
            👤 Profile
          </Link>

        </header>

        {/* ================= STATS ================= */}

        <section className="dashboard-stats">

          {/* Calories Burned */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              🔥
            </div>

            <div>

              <p>
                Calories Burned
              </p>

              <h2>
                {totalCaloriesBurned}
              </h2>

              <span>
                kcal
              </span>

            </div>

          </div>

          {/* Workout Time */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              🏋️
            </div>

            <div>

              <p>
                Workout Time
              </p>

              <h2>
                {totalWorkoutMinutes}
              </h2>

              <span>
                minutes
              </span>

            </div>

          </div>

          {/* Diet Calories */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              🥗
            </div>

            <div>

              <p>
                Diet Calories
              </p>

              <h2>
                {totalDietCalories}
              </h2>

              <span>
                kcal
              </span>

            </div>

          </div>

          {/* Goal Progress */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>

              <p>
                Goal Progress
              </p>

              <h2>
                {goalPercentage}%
              </h2>

              <span>
                completed
              </span>

            </div>

          </div>

        </section>

        {/* ================= CONTENT GRID ================= */}

        <section className="dashboard-grid">

          {/* ================= RECENT WORKOUTS ================= */}

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Recent Workouts
                </h2>

                <p>
                  Your latest workout activity
                </p>

              </div>

              <Link to="/workout">
                View All →
              </Link>

            </div>

            {workouts.length === 0 ? (

              <div className="empty-state">

                <div>
                  🏋️
                </div>

                <p>
                  No workouts available yet.
                </p>

                <Link to="/workout">
                  Add Workout
                </Link>

              </div>

            ) : (

              <div className="workout-list">

                {workouts
                  .slice(-4)
                  .reverse()
                  .map((workout) => (

                    <div
                      className="workout-item"
                      key={workout.id}
                    >

                      <div className="workout-icon">
                        🏋️
                      </div>

                      <div className="workout-info">

                        <h3>
                          {workout.name}
                        </h3>

                        <p>
                          {workout.duration} min
                        </p>

                      </div>

                      <strong>
                        {workout.calories} kcal
                      </strong>

                    </div>

                  ))}

              </div>

            )}

          </div>

          {/* ================= PROGRESS ================= */}

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Progress
                </h2>

                <p>
                  Your latest fitness progress
                </p>

              </div>

              <Link to="/progress">
                Details →
              </Link>

            </div>

            {latestProgress ? (

              <div className="progress-content">

                <div className="progress-circle">

                  <span>
                    {goalPercentage}%
                  </span>

                </div>

                <div className="progress-details">

                  {/* Current Weight */}

                  <div>

                    <span>
                      Current Weight
                    </span>

                    <strong>
                      {latestWeight} kg
                    </strong>

                  </div>

                  {/* Workouts */}

                  <div>

                    <span>
                      Workouts
                    </span>

                    <strong>
                      {latestProgress.workouts}
                    </strong>

                  </div>

                  {/* Calories Burned */}

                  <div>

                    <span>
                      Calories Burned
                    </span>

                    <strong>
                      {latestProgress.calories_burned} kcal
                    </strong>

                  </div>

                </div>

              </div>

            ) : (

              <div className="empty-state">

                <div>
                  📈
                </div>

                <p>
                  No progress data available.
                </p>

                <Link to="/progress">
                  View Progress
                </Link>

              </div>

            )}

          </div>

        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="quick-actions">

          <h2>
            Quick Actions
          </h2>

          <div className="quick-action-grid">

            {/* Workout */}

            <Link
              to="/workout"
              className="quick-action-card"
            >

              <span>
                🏋️
              </span>

              <div>

                <h3>
                  Start Workout
                </h3>

                <p>
                  Begin your training session
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            {/* Diet */}

            <Link
              to="/diet"
              className="quick-action-card"
            >

              <span>
                🥗
              </span>

              <div>

                <h3>
                  Check Diet
                </h3>

                <p>
                  View your nutrition plan
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            {/* AI Trainer */}

            <Link
              to="/ai-trainer"
              className="quick-action-card"
            >

              <span>
                🤖
              </span>

              <div>

                <h3>
                  Ask AI Trainer
                </h3>

                <p>
                  Get personalized fitness advice
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;