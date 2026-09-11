from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.diet import Diet
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/diet",
    tags=["Diet"]
)


# ================= REQUEST MODEL =================

class DietRequest(BaseModel):
    meal: str
    food: str
    calories: int


# ================= GET ALL DIET =================

@router.get("/")
def get_diet(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    diets = db.query(Diet).filter(
        Diet.user_id == current_user.id
    ).all()

    return {
        "message": "Diet fetched successfully!",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },
        "diet": [
            {
                "id": item.id,
                "meal": item.meal,
                "food": item.food,
                "calories": item.calories
            }
            for item in diets
        ]
    }


# ================= CREATE DIET =================

@router.post("/")
def create_diet(
    request: DietRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    diet = Diet(
        user_id=current_user.id,
        meal=request.meal,
        food=request.food,
        calories=request.calories
    )

    db.add(diet)
    db.commit()
    db.refresh(diet)

    return {
        "message": "Diet added successfully!",
        "diet": {
            "id": diet.id,
            "user_id": diet.user_id,
            "meal": diet.meal,
            "food": diet.food,
            "calories": diet.calories
        }
    }


# ================= UPDATE DIET =================

@router.put("/{diet_id}")
def update_diet(
    diet_id: int,
    request: DietRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    diet = db.query(Diet).filter(
        Diet.id == diet_id,
        Diet.user_id == current_user.id
    ).first()

    if not diet:
        raise HTTPException(
            status_code=404,
            detail="Meal not found"
        )

    diet.meal = request.meal
    diet.food = request.food
    diet.calories = request.calories

    db.commit()
    db.refresh(diet)

    return {
        "message": "Meal updated successfully!",
        "diet": {
            "id": diet.id,
            "user_id": diet.user_id,
            "meal": diet.meal,
            "food": diet.food,
            "calories": diet.calories
        }
    }


# ================= DELETE DIET =================

@router.delete("/{diet_id}")
def delete_diet(
    diet_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    diet = db.query(Diet).filter(
        Diet.id == diet_id,
        Diet.user_id == current_user.id
    ).first()

    if not diet:
        raise HTTPException(
            status_code=404,
            detail="Meal not found"
        )

    db.delete(diet)
    db.commit()

    return {
        "message": "Meal deleted successfully!"
    }