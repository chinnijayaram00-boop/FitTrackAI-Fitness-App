from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True
    )

    notifications = Column(Boolean, default=True)
    ai_recommendations = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=False)