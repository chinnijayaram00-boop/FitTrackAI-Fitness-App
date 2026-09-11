from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.progress import Progress
from app.routes.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


class ProgressRequest(BaseModel):
    date: str
    weight: float
    calories_burned: int
    workouts: int
    goal_percentage: int


@router.get("/")
def get_progress(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    progress = (
        db.query(Progress)
        .filter(Progress.user_id == current_user.id)
        .all()
    )

    return {
        "message": "Progress fetched successfully!",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },
        "progress": [
            {
                "id": item.id,
                "date": item.date,
                "weight": item.weight,
                "calories_burned": item.calories_burned,
                "workouts": item.workouts,
                "goal_percentage": item.goal_percentage
            }
            for item in progress
        ]
    }


@router.post("/")
def create_progress(
    request: ProgressRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    progress = Progress(
        user_id=current_user.id,
        date=request.date,
        weight=request.weight,
        calories_burned=request.calories_burned,
        workouts=request.workouts,
        goal_percentage=request.goal_percentage
    )

    db.add(progress)
    db.commit()
    db.refresh(progress)

    return {
        "message": "Progress added successfully!",
        "progress": {
            "id": progress.id,
            "user_id": progress.user_id,
            "date": progress.date,
            "weight": progress.weight,
            "calories_burned": progress.calories_burned,
            "workouts": progress.workouts,
            "goal_percentage": progress.goal_percentage
        }
    }


@router.put("/{progress_id}")
def update_progress(
    progress_id: int,
    request: ProgressRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    progress = (
        db.query(Progress)
        .filter(
            Progress.id == progress_id,
            Progress.user_id == current_user.id
        )
        .first()
    )

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="Progress record not found"
        )

    progress.date = request.date
    progress.weight = request.weight
    progress.calories_burned = request.calories_burned
    progress.workouts = request.workouts
    progress.goal_percentage = request.goal_percentage

    db.commit()
    db.refresh(progress)

    return {
        "message": "Progress updated successfully!",
        "progress": {
            "id": progress.id,
            "user_id": progress.user_id,
            "date": progress.date,
            "weight": progress.weight,
            "calories_burned": progress.calories_burned,
            "workouts": progress.workouts,
            "goal_percentage": progress.goal_percentage
        }
    }


@router.delete("/{progress_id}")
def delete_progress(
    progress_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    progress = (
        db.query(Progress)
        .filter(
            Progress.id == progress_id,
            Progress.user_id == current_user.id
        )
        .first()
    )

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="Progress record not found"
        )

    db.delete(progress)
    db.commit()

    return {
        "message": "Progress deleted successfully!"
    }
