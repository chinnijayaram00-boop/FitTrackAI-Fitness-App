from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.workout import Workout
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/workouts",
    tags=["Workouts"]
)


# ================= REQUEST MODEL =================

class WorkoutRequest(BaseModel):
    name: str
    duration: int
    calories: int
    date: str | None = None


# ================= GET ALL WORKOUTS =================

@router.get("/")
def get_workouts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).all()

    return {
        "message": "Workouts fetched successfully!",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },
        "workouts": [
            {
                "id": workout.id,
                "name": workout.name,
                "duration": workout.duration,
                "calories": workout.calories,
                "date": workout.date
            }
            for workout in workouts
        ]
    }


# ================= CREATE WORKOUT =================

@router.post("/")
def create_workout(
    request: WorkoutRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workout_date = request.date or date.today().isoformat()

    workout = Workout(
        user_id=current_user.id,
        name=request.name,
        duration=request.duration,
        calories=request.calories,
        date=workout_date
    )

    db.add(workout)
    db.commit()
    db.refresh(workout)

    return {
        "message": "Workout created successfully!",
        "workout": {
            "id": workout.id,
            "user_id": workout.user_id,
            "name": workout.name,
            "duration": workout.duration,
            "calories": workout.calories,
            "date": workout.date
        }
    }


# ================= GET SINGLE WORKOUT =================

@router.get("/{workout_id}")
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    return {
        "id": workout.id,
        "name": workout.name,
        "duration": workout.duration,
        "calories": workout.calories,
        "date": workout.date
    }


# ================= UPDATE WORKOUT =================

@router.put("/{workout_id}")
def update_workout(
    workout_id: int,
    request: WorkoutRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    workout.name = request.name
    workout.duration = request.duration
    workout.calories = request.calories

    if request.date:
        workout.date = request.date

    db.commit()
    db.refresh(workout)

    return {
        "message": "Workout updated successfully!",
        "workout": {
            "id": workout.id,
            "user_id": workout.user_id,
            "name": workout.name,
            "duration": workout.duration,
            "calories": workout.calories,
            "date": workout.date
        }
    }


# ================= DELETE WORKOUT =================

@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    db.delete(workout)
    db.commit()

    return {
        "message": "Workout deleted successfully!"
    }