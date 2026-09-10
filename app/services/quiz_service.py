from bson import ObjectId
from app.db.db import roadmaps_collection
from app.services.gemini_service import client
import json


def generate_quiz(roadmap_id: str, user_id: str | None = None):

    query = {"_id": ObjectId(roadmap_id)}
    if user_id:
        query["user_id"] = user_id
    roadmap = roadmaps_collection.find_one(query)

    if not roadmap:
        return None

    current_topic = None

    for phase in roadmap["phases"]:
        for topic in phase["topics"]:
            if not topic["completed"]:
                current_topic = topic["name"]
                break

        if current_topic:
            break

    prompt = f"""
    Create a quiz on:

    {current_topic}

    Generate 5 multiple choice questions.

    Return ONLY JSON.

    {{
        "quiz": [
            {{
                "question": "...",
                "options": [
                    "...",
                    "...",
                    "...",
                    "..."
                ],
                "answer": "..."
            }}
        ]
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")

    return json.loads(text)