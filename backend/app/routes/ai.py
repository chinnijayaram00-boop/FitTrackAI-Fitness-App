from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import httpx

from app.database import get_db
from app.models.progress import Progress

router = APIRouter(
    prefix="/ai",
    tags=["AI Trainer"]
)


class ChatRequest(BaseModel):
    message: str


@router.get("/")
def ai_status():
    return {
        "message": "FitTrack AI Trainer is online!"
    }


@router.post("/chat")
async def ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    # Get progress data
    progress = (
        db.query(Progress)
        .order_by(Progress.id.asc())
        .all()
    )

    if not progress:
        database_summary = "No progress data available."

    else:
        first = progress[0]
        latest = progress[-1]

        weight_change = round(
            first.weight - latest.weight,
            1
        )

        total_calories = sum(
            item.calories_burned
            for item in progress
        )

        total_workouts = sum(
            item.workouts
            for item in progress
        )

        database_summary = f"""
VERIFIED FITNESS FACTS:

First recorded weight: {first.weight} kg
Latest recorded weight: {latest.weight} kg
Weight change: {weight_change} kg decrease
Total calories burned: {total_calories} kcal
Total workouts: {total_workouts}
Latest goal progress: {latest.goal_percentage}%

IMPORTANT:
These numbers are calculated by the FitTrack backend.
They are FACTS and MUST NOT be changed.
"""

    # Strong prompt
    prompt = f"""
You are FitTrack AI.

The backend has already calculated the user's fitness statistics.

{database_summary}

USER QUESTION:
{request.message}

STRICT RULES:

- Do NOT calculate numbers yourself.
- Do NOT modify any number.
- Do NOT estimate missing numbers.
- Do NOT invent statistics.
- Use the verified numbers exactly as provided.
- If a number is not provided, say that it is unavailable.
- Focus on explaining the facts and giving practical suggestions.
- Keep the response concise and easy to understand.
- Do not diagnose medical conditions.

Return a helpful fitness analysis based ONLY on the verified facts.
"""

    # Ollama request
    ollama_url = "http://127.0.0.1:11434/api/chat"

    payload = {
        "model": "llama3.2:1b",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a precise fitness assistant. "
                    "The backend provides verified numerical facts. "
                    "Never change those facts."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0
        }
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                ollama_url,
                json=payload
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail="Ollama request failed"
            )

        data = response.json()

        return {
            "reply": data["message"]["content"]
        }

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running."
        )