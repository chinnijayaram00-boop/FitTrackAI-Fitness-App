from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    date = Column(String, nullable=False)
    weight = Column(Float, nullable=False)
    calories_burned = Column(Integer, nullable=False)
    workouts = Column(Integer, nullable=False)
    goal_percentage = Column(Integer, nullable=False)