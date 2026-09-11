import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import Diet from "./pages/Diet";
import Progress from "./pages/Progress";
import AITrainer from "./pages/AITrainer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";


/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("fittrack_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/* ================= NAVBAR ================= */

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        FitTrack<span>AI</span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>

        <Link to="/dashboard" className="nav-button">
          Dashboard
        </Link>

      </div>

    </nav>
  );
}


/* ================= HOME ================= */

function Home() {
  return (
    <div className="app-container">

      <Navbar />

      <main className="hero">

        <div className="hero-content">

          <div className="badge">
            🤖 AI Powered Fitness
          </div>

          <h1>
            Your Personal
            <br />
            <span>AI Fitness</span> Companion
          </h1>

          <p>
            Build healthier habits with personalized workouts,
            smart nutrition recommendations, progress tracking
            and your own AI fitness trainer.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-button"
            >
              Get Started →
            </Link>

            <Link
              to="/login"
              className="secondary-button"
            >
              Login
            </Link>

          </div>

        </div>


        <div className="hero-card">

          <h2>Today's Overview</h2>

          <div className="stat">
            <span>🔥 Calories</span>
            <span className="stat-value">
              1,850 kcal
            </span>
          </div>

          <div className="stat">
            <span>🏃 Workout</span>
            <span className="stat-value">
              32 min
            </span>
          </div>

          <div className="stat">
            <span>💧 Water</span>
            <span className="stat-value">
              2.1 L
            </span>
          </div>

          <div className="stat">
            <span>🎯 Goal Progress</span>
            <span className="stat-value">
              72%
            </span>
          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= APP ================= */

function App() {

  /* ================= GLOBAL DARK MODE ================= */

  useEffect(() => {

    const darkMode =
      localStorage.getItem("fittrack_dark_mode");

    if (darkMode === "true") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

  }, []);


  return (
    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diet"
          element={
            <ProtectedRoute>
              <Diet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-trainer"
          element={
            <ProtectedRoute>
              <AITrainer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
