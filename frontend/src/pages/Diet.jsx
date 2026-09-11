import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Diet() {
  const [meals, setMeals] = useState([]);

  const [meal, setMeal] = useState("");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("fittrack_token");

  const fetchDiet = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/diet/",
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
          data.detail || "Failed to fetch diet"
        );
      }

      setMeals(data.diet || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiet();
  }, []);

  const resetForm = () => {
    setMeal("");
    setFood("");
    setCalories("");
    setEditingId(null);
  };

  const handleSaveMeal = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!meal.trim() || !food.trim() || !calories) {
      setError("Please fill all meal fields.");
      return;
    }

    if (Number(calories) <= 0) {
      setError("Calories must be greater than 0.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId
        ? `http://127.0.0.1:8000/diet/${editingId}`
        : "http://127.0.0.1:8000/diet/";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          meal: meal.trim(),
          food: food.trim(),
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
          data.detail ||
            (editingId
              ? "Failed to update meal"
              : "Failed to add meal")
        );
      }

      if (editingId) {
        setSuccess("Meal updated successfully! ✏️");
      } else {
        setSuccess("Meal added successfully! 🥗");
      }

      resetForm();
      await fetchDiet();
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
    setMeal(item.meal);
    setFood(item.food);
    setCalories(item.calories);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (dietId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meal?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/diet/${dietId}`,
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
          data.detail || "Failed to delete meal"
        );
      }

      if (editingId === dietId) {
        resetForm();
      }

      setSuccess("Meal deleted successfully! 🗑️");

      await fetchDiet();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const getIcon = (mealName) => {
    const value = mealName.toLowerCase();

    if (value.includes("breakfast")) return "🥣";
    if (value.includes("lunch")) return "🍗";
    if (value.includes("dinner")) return "🥗";

    return "🍎";
  };

  const totalCalories = meals.reduce(
    (total, item) =>
      total + Number(item.calories || 0),
    0
  );

  return (
    <div className="dashboard-page">

      {/* Sidebar */}

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

          <Link
            to="/diet"
            className="active"
          >
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

      {/* Main */}

      <main className="dashboard-main">

        <div className="dashboard-topbar">

          <div>
            <h1>
              Nutrition Planner 🥗
            </h1>

            <p>
              Your personalized nutrition plan for today.
            </p>
          </div>

          <div className="profile-avatar">
            J
          </div>

        </div>

        {/* AI Nutrition Recommendation */}

        <section className="diet-ai-banner">

          <div>

            <span>
              🤖 AI NUTRITION INSIGHT
            </span>

            <h2>
              High-Protein Balanced Plan
            </h2>

            <p>
              Your current goal requires a balanced
              calorie intake with enough protein to
              support recovery and muscle growth.
            </p>

          </div>

          <Link
            to="/ai-trainer"
            className="primary-button"
          >
            Ask Nutrition AI →
          </Link>

        </section>

        {/* Nutrition Stats */}

        <section className="stats-grid">

          <div className="fitness-stat">

            <div className="stat-icon">
              🔥
            </div>

            <div>

              <span>
                Calories
              </span>

              <h2>
                {totalCalories}
              </h2>

              <small>
                Today's total
              </small>

            </div>

          </div>

          <div className="fitness-stat">

            <div className="stat-icon">
              💪
            </div>

            <div>

              <span>
                Meals
              </span>

              <h2>
                {meals.length}
              </h2>

              <small>
                Recommended meals
              </small>

            </div>

          </div>

          <div className="fitness-stat">

            <div className="stat-icon">
              🍎
            </div>

            <div>

              <span>
                Plan
              </span>

              <h2>
                Balanced
              </h2>

              <small>
                Daily nutrition
              </small>

            </div>

          </div>

          <div className="fitness-stat">

            <div className="stat-icon">
              🥗
            </div>

            <div>

              <span>
                Status
              </span>

              <h2>
                Active
              </h2>

              <small>
                Today's plan
              </small>

            </div>

          </div>

        </section>

        {/* ADD / EDIT MEAL */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <span>
                {editingId ? "EDIT MEAL" : "ADD MEAL"}
              </span>

              <h2>
                {editingId
                  ? "Update Nutrition"
                  : "Add Nutrition"}
              </h2>
            </div>

          </div>

          <form
            onSubmit={handleSaveMeal}
            style={{
              display: "grid",
              gap: "12px",
              maxWidth: "600px",
            }}
          >

            <select
              value={meal}
              onChange={(e) =>
                setMeal(e.target.value)
              }
              required
            >
              <option value="">
                Select Meal
              </option>

              <option value="Breakfast">
                Breakfast
              </option>

              <option value="Lunch">
                Lunch
              </option>

              <option value="Dinner">
                Dinner
              </option>

              <option value="Snack">
                Snack
              </option>
            </select>

            <input
              type="text"
              placeholder="Food name"
              value={food}
              onChange={(e) =>
                setFood(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) =>
                setCalories(e.target.value)
              }
              min="1"
              required
            />

            {error && (
              <p style={{ color: "red" }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ color: "green" }}>
                {success}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? editingId
                    ? "Updating Meal..."
                    : "Adding Meal..."
                  : editingId
                  ? "✏️ Update Meal"
                  : "➕ Add Meal"}
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

        </section>

        {/* Meals */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span>
                TODAY'S MEALS
              </span>

              <h2>
                Recommended Meal Plan
              </h2>

            </div>

            <span>
              {meals.length} Meals
            </span>

          </div>

          {loading && (
            <p>
              Loading diet plan...
            </p>
          )}

          {!loading &&
            !error &&
            meals.length === 0 && (
              <p>
                No diet plan available.
              </p>
            )}

          {!loading &&
            meals.length > 0 && (

              <div className="meal-list">

                {meals
                  .slice()
                  .reverse()
                  .map((item) => (

                    <div
                      className="meal-card"
                      key={item.id}
                    >

                      <div className="meal-icon">
                        {getIcon(item.meal)}
                      </div>

                      <div className="meal-info">

                        <span className="meal-time">
                          {item.meal}
                        </span>

                        <h3>
                          {item.food}
                        </h3>

                        <p>
                          Recommended nutrition for
                          your daily fitness goal.
                        </p>

                      </div>

                      <div className="meal-nutrition">

                        <strong>
                          {item.calories} kcal
                        </strong>

                        <span>
                          Healthy meal
                        </span>

                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >

                        <button
                          className="meal-button"
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="meal-button"
                          type="button"
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

        </section>

      </main>

    </div>
  );
}

export default Diet;