from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    name = Column(String, nullable=False)

    duration = Column(
        Integer,
        nullable=False
    )

    calories = Column(
        Integer,
        nullable=False
    )

    date = Column(
        String,
        nullable=False
    )