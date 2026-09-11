from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database import get_db
from app.models.profile import Profile
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# =========================
# Request Model
# =========================

class ProfileRequest(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=1, le=120)
    height: float = Field(..., gt=0)
    weight: float = Field(..., gt=0)
    goal: str = Field(..., min_length=1)


# =========================
# GET PROFILE
# =========================

@router.get("/")
def get_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return {
        "id": profile.id,
        "name": profile.name,
        "age": profile.age,
        "height": profile.height,
        "weight": profile.weight,
        "goal": profile.goal,
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }


# =========================
# CREATE PROFILE
# =========================

@router.post("/")
def create_profile(
    request: ProfileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Profile already exists for this user"
        )

    profile = Profile(
        user_id=current_user.id,
        name=request.name,
        age=request.age,
        height=request.height,
        weight=request.weight,
        goal=request.goal
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return {
        "message": "Profile created successfully!",
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "name": profile.name,
            "age": profile.age,
            "height": profile.height,
            "weight": profile.weight,
            "goal": profile.goal
        },
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }


# =========================
# UPDATE PROFILE
# =========================

@router.put("/")
def update_profile(
    request: ProfileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    profile.name = request.name
    profile.age = request.age
    profile.height = request.height
    profile.weight = request.weight
    profile.goal = request.goal

    db.commit()
    db.refresh(profile)

    return {
        "message": "Profile updated successfully!",
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "name": profile.name,
            "age": profile.age,
            "height": profile.height,
            "weight": profile.weight,
            "goal": profile.goal
        },
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }