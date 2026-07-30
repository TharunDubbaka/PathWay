import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API")
)

def generate_ai_roadmap(
    goal: str,
    skill_level: str,
    current_skills: list[str],
    study_hours_per_week: int
):
    current_skills_text = ", ".join(current_skills) if current_skills else "None"
    prompt = f"""
    Create a learning roadmap.

    Goal: {goal}
    Skill Level: {skill_level}
    Current Skills: {current_skills_text}
    Study Hours Per Week: {study_hours_per_week}

    Return ONLY valid JSON.

    Provide study resources for each topic in order of priority:
    1. Videos
    2. Websites
    3. Articles
    4. Other links

    Format:

    {{
    "goal": "...",
    "phases": [
        {{
        "title": "...",
        "description": "...",
        "duration_weeks": 4,
        "topics": [
            {{
            "name": "...",
            "summary": "...",
            "completed": false,
            "resources": [
                {{
                "type": "Video",
                "title": "...",
                "url": "..."
                }},
                {{
                "type": "Website",
                "title": "...",
                "url": "..."
                }}
            ]
            }}
        ]
        }}
    ]
    }}

    Do not include markdown.
    Do not include explanations.
    Return JSON only.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        roadmap = json.loads(response.text)

        return roadmap

    except Exception as e:
        print("Gemini Error:", e)

        return {
            "goal": goal,
            "phases": [],
            "error": "Gemini unavailable"
        }