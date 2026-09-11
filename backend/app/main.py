from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.workout import router as workout_router
from app.models.workout import Workout
from app.models.diet import Diet
from app.routes.diet import router as diet_router
from app.models.progress import Progress
from app.routes.progress import router as progress_router
from app.routes.ai import router as ai_router
from app.models.profile import Profile
from app.routes.profile import router as profile_router
from app.routes.settings import router as settings_router
app = FastAPI(
    title="FitTrack AI API",
    description="AI-powered fitness platform backend",
    version="1.0.0"
)


# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================= ROUTES =================

# Authentication routes
app.include_router(auth_router)

# Workout routes
app.include_router(workout_router)
app.include_router(diet_router)
app.include_router(progress_router)
app.include_router(ai_router)
app.include_router(profile_router)
app.include_router(settings_router)

# ================= DATABASE =================

Base.metadata.create_all(bind=engine)


# ================= BASIC APIs =================

@app.get("/")
def root():
    return {
        "message": "FitTrack AI Backend is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }