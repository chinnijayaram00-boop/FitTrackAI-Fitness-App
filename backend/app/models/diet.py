from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Diet(Base):
    __tablename__ = "diets"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    meal = Column(String, nullable=False)
    food = Column(String, nullable=False)
    calories = Column(Integer, nullable=False)