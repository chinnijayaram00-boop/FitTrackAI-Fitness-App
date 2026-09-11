\# FitTrackAI 💪🤖



> An AI-powered full-stack fitness platform for personalized workouts, nutrition tracking, progress analytics, and intelligent fitness guidance.



\## 🚀 Overview



FitTrackAI is a full-stack AI fitness application designed to help users track and improve their fitness journey through a single platform.



The application combines secure user authentication, workout tracking, diet management, progress monitoring, profile management, personalized settings, and an AI-powered fitness trainer.



\## ✨ Key Features



\- 🔐 JWT-based user authentication

\- 🛡️ Protected routes and authorization

\- 👤 User-specific data isolation

\- 🏋️ Workout tracking

\- 🥗 Diet and meal tracking

\- 📈 Progress and weight tracking

\- 🤖 AI Fitness Trainer

\- 👤 Personalized user profiles

\- ⚙️ User settings and preferences

\- 🌙 Dark mode

\- 🔒 JWT token expiration

\- 📊 Dashboard with fitness insights

\- ⚡ Fast and responsive React interface

\- 🗄️ SQLite database integration

\- 🚀 Production-ready frontend build



\## 🧠 AI Fitness Trainer



FitTrackAI includes an AI-powered fitness assistant that provides fitness guidance based on user-related progress information.



The AI layer is powered through a locally running Ollama model, allowing the application to integrate AI capabilities without relying entirely on external AI APIs.



\## 🛠️ Tech Stack



\### Frontend

\- React

\- Vite

\- React Router

\- JavaScript

\- CSS



\### Backend

\- Python

\- FastAPI

\- SQLAlchemy

\- JWT Authentication

\- bcrypt



\### Database

\- SQLite



\### AI

\- Ollama

\- Llama 3.2 1B



\### Development Tools

\- Git

\- GitHub

\- VS Code



\## 🏗️ Architecture



```text

FitTrackAI

│

├── frontend/        # React + Vite frontend

│

├── backend/         # FastAPI backend

│   ├── app/

│   │   ├── models/

│   │   ├── routes/

│   │   ├── services/

│   │   └── utils/

│

├── ai/              # AI-related components

├── database/        # Database resources

├── docs/             # Project documentation

└── tests/            # Testing structure

