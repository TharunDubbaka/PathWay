from app.services.gemini_service import client
import json


def analyze_progress(roadmap):

    prompt = f"""
    You are an AI learning mentor.

    Analyze this student's roadmap progress.

    Roadmap:
    {roadmap}

    Provide recommendations.

    Return ONLY JSON.

    Format:

    {{
        "analysis": "...",
        "recommendations": [
            "...",
            "..."
        ],
        "adjustments": [
            {{
                "topic": "...",
                "action": "increase/decrease/keep",
                "reason": "..."
            }}
        ]
    }}
    """

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config={
        "response_mime_type": "application/json"
    }
    )
    print("Analyse Response")
    print(repr(response.text))

    return json.loads(response.text)