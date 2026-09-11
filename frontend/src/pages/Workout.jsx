import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Workout() {
  const [workouts, setWorkouts] = useState([]);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("fittrack_token");

  const fetchWorkouts = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/workouts/",
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
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch workouts"
        );
      }

      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !duration || !calories) {
      setError("Please fill all workout fields.");
      return;
    }

    if (Number(duration) <= 0 || Number(calories) <= 0) {
      setError("Duration and calories must be greater than 0.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId
        ? `http://127.0.0.1:8000/workouts/${editingId}`
        : "http://127.0.0.1:8000/workouts/";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          duration: Number(duration),
          calories: Number(calories),
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("fittrack_token");
        localStorage.removeItem("fittrack_user");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save workout"
        );
      }

      setSuccess(
        editingId
          ? "Workout updated successfully! ✏️"
          : "Workout added successfully! 🎉"
      );

      setName("");
      setDuration("");
      setCalories("");
      setEditingId(null);

      await fetchWorkouts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= EDIT =================

  const handleEdit = (workout) => {
    setEditingId(workout.id);
    setName(workout.name);
    setDuration(workout.duration);
    setCalories(workout.calories);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= CANCEL EDIT =================

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setDuration("");
    setCalories("");
    setError("");
    setSuccess("");
  };

  // ================= DELETE =================

  const handleDelete = async (workoutId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/workouts/${workoutId}`,
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
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete workout"
        );
      }

      setSuccess("Workout deleted successfully! 🗑️");

      if (editingId === workoutId) {
        handleCancelEdit();
      }

      await fetchWorkouts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("fittrack_token");
    localStorage.removeItem("fittrack_user");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>💪 Workouts</h1>

      <nav>
        <Link to="/dashboard">Dashboard</Link>{" "}
        |{" "}
        <Link to="/diet">Diet</Link>{" "}
        |{" "}
        <Link to="/progress">Progress</Link>{" "}
        |{" "}
        <Link to="/ai-trainer">AI Trainer</Link>{" "}
        |{" "}
        <Link to="/profile">Profile</Link>{" "}
        |{" "}
        <Link to="/settings">Settings</Link>
      </nav>

      <hr />

      {/* ADD / EDIT FORM */}

      <h2>
        {editingId
          ? "✏️ Edit Workout"
          : "➕ Add Workout"}
      </h2>

      <form onSubmit={handleSubmit}>

        <div>
          <input
            type="text"
            placeholder="Workout name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            min="1"
          />
        </div>

        <br />

        <div>
          <input
            type="number"
            placeholder="Calories burned"
            value={calories}
            onChange={(e) =>
              setCalories(e.target.value)
            }
            min="1"
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingId
            ? "💾 Update Workout"
            : "➕ Add Workout"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        )}

      </form>

      <br />

      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <hr />

      {/* WORKOUT HISTORY */}

      <h2>📋 Workout History</h2>

      {loading && (
        <p>Loading workouts...</p>
      )}

      {!loading &&
        !error &&
        workouts.length === 0 && (
          <p>
            No workouts found. Add your first workout!
          </p>
        )}

      {!loading &&
        workouts.length > 0 && (
          <div>

            {workouts
              .slice()
              .reverse()
              .map((workout) => (

                <div
                  key={workout.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                  }}
                >

                  <h2>
                    {workout.name}
                  </h2>

                  <p>
                    ⏱️ Duration:{" "}
                    {workout.duration} min
                  </p>

                  <p>
                    🔥 Calories:{" "}
                    {workout.calories} kcal
                  </p>

                  {/* ACTION BUTTONS */}

                  <button
                    onClick={() =>
                      handleEdit(workout)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(workout.id)
                    }
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    🗑️ Delete
                  </button>

                </div>

              ))}

          </div>
        )}

      <hr />

      <button onClick={handleLogout}>
        ← Logout
      </button>

    </div>
  );
}

export default Workout;