import { Link } from "react-router-dom";
import { useState } from "react";

function AITrainer() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text = message) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    const token = localStorage.getItem("fittrack_token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Please login first to use AI Trainer.",
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      if (response.status === 401) {
        throw new Error("AUTH_ERROR");
      }

      if (!response.ok) {
        throw new Error("AI_ERROR");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      let errorMessage =
        "Sorry, I couldn't connect to the AI server.";

      if (error.message === "AUTH_ERROR") {
        errorMessage =
          "Your session expired. Please login again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "💪 Create today's workout",
    "🥗 Suggest my diet",
    "🔥 How many calories should I eat?",
    "📈 Analyze my progress",
  ];

  return (
    <div className="ai-trainer-page">

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

          <Link
            to="/ai-trainer"
            className="active"
          >
            🤖 AI Trainer
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>

          <Link to="/settings">
            ⚙️ Settings
          </Link>

        </nav>

        <Link
          className="logout-button"
          to="/"
        >
          ← Logout
        </Link>

      </aside>

      <main className="ai-trainer-main">

        <header className="ai-header">

          <div>

            <span className="ai-badge">
              🤖 FITTRACK AI
            </span>

            <h1>
              Your Personal AI Fitness Trainer
            </h1>

            <p>
              Ask questions, get personalized recommendations
              and understand your fitness progress.
            </p>

          </div>

          <div className="ai-status">
            <span></span>
            AI Online
          </div>

        </header>

        <section className="ai-layout">

          <div className="chat-card">

            <div className="chat-header">

              <div className="trainer-avatar">
                🤖
              </div>

              <div>
                <h3>
                  FitTrack AI Trainer
                </h3>

                <p>
                  Personalized fitness assistant
                </p>
              </div>

            </div>

            <div className="chat-messages">

              <div className="message ai-message">

                <div className="message-avatar">
                  🤖
                </div>

                <div className="message-bubble">
                  Hi Jayaram! 👋 I'm your AI fitness trainer.
                  <br />
                  Tell me your goal and I'll help you create a
                  personalized fitness plan.
                </div>

              </div>

              {messages.map((item, index) => (

                <div
                  className={`message ${
                    item.sender === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                  key={index}
                >

                  <div className="message-avatar">
                    {item.sender === "user"
                      ? "👤"
                      : "🤖"}
                  </div>

                  <div className="message-bubble">
                    {item.text}
                  </div>

                </div>

              ))}

              {loading && (

                <div className="message ai-message">

                  <div className="message-avatar">
                    🤖
                  </div>

                  <div className="message-bubble">
                    Thinking... 🤔
                  </div>

                </div>

              )}

              <div className="quick-questions">

                {quickQuestions.map(
                  (question, index) => (

                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      disabled={loading}
                    >
                      {question}
                    </button>

                  )
                )}

              </div>

            </div>

            <div className="chat-input-area">

              <input
                type="text"
                placeholder="Ask your AI trainer anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button
                className="send-button"
                onClick={() => sendMessage()}
                disabled={loading || !message.trim()}
              >
                ➤
              </button>

            </div>

          </div>

          <aside className="ai-insights">

            <div className="insight-card">
              <span>🎯 YOUR GOAL</span>
              <h2>Build Muscle</h2>
              <p>Target: 72 kg</p>
            </div>

            <div className="insight-card">
              <span>🔥 DAILY TARGET</span>
              <h2>2,400 kcal</h2>
              <p>Based on your current profile</p>
            </div>

            <div className="insight-card">
              <span>🏋️ TODAY'S PLAN</span>
              <h2>Upper Body</h2>
              <p>30 minutes • Intermediate</p>
            </div>

            <div className="insight-card ai-tip">
              <span>💡 AI TIP</span>
              <p>
                Stay consistent with your protein intake
                and aim for at least 7–8 hours of sleep
                for better recovery.
              </p>
            </div>

          </aside>

        </section>

      </main>

    </div>
  );
}

export default AITrainer;