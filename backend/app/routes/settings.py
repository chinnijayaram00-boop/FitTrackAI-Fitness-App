from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.settings import Settings
from app.routes.auth import get_current_user

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


class SettingsRequest(BaseModel):
    notifications: bool = True
    ai_recommendations: bool = True
    dark_mode: bool = False


@router.get("/")
def get_settings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    settings = db.query(Settings).filter(
        Settings.user_id == current_user.id
    ).first()

    if not settings:
        settings = Settings(
            user_id=current_user.id,
            notifications=True,
            ai_recommendations=True,
            dark_mode=False
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "id": settings.id,
        "user_id": settings.user_id,
        "notifications": settings.notifications,
        "ai_recommendations": settings.ai_recommendations,
        "dark_mode": settings.dark_mode,
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }


@router.put("/")
def update_settings(
    request: SettingsRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    settings = db.query(Settings).filter(
        Settings.user_id == current_user.id
    ).first()

    if not settings:
        settings = Settings(
            user_id=current_user.id
        )

    settings.notifications = request.notifications
    settings.ai_recommendations = request.ai_recommendations
    settings.dark_mode = request.dark_mode

    db.add(settings)
    db.commit()
    db.refresh(settings)

    return {
        "message": "Settings updated successfully!",
        "settings": {
            "id": settings.id,
            "user_id": settings.user_id,
            "notifications": settings.notifications,
            "ai_recommendations": settings.ai_recommendations,
            "dark_mode": settings.dark_mode
        },
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }