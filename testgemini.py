from app.services.gemini_service import generate_ai_roadmap
from dotenv import load_dotenv
load_dotenv()
result = generate_ai_roadmap(
    "Machine Learning Engineer",
    ["Python"],
    14
)

print(result)