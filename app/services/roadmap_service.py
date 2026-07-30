from app.db.db import roadmaps_collection
from bson import ObjectId
from app.services.gemini_service import generate_ai_roadmap


def create_roadmap(data):

    roadmap = generate_ai_roadmap(
        data.goal,
        data.skill_level,
        data.current_skills,
        data.study_hours_per_week
    )

    roadmap["skill_level"] = data.skill_level
    roadmap["current_skills"] = data.current_skills
    roadmap["study_hours_per_week"] = data.study_hours_per_week

    result = roadmaps_collection.insert_one(roadmap)

    roadmap.pop("_id", None)

    return {
        "roadmap_id": str(result.inserted_id),
        "roadmap": roadmap
    }


def get_roadmap_by_id(roadmap_id: str):

    roadmap = roadmaps_collection.find_one(
        {"_id": ObjectId(roadmap_id)}
    )

    if roadmap is None:
        return None


    roadmap["_id"] = str(roadmap["_id"])


    total_topics = 0
    completed_topics = 0
    next_topic = None
    current_phase = None


    for phase in roadmap["phases"]:

        phase_completed = True

        for topic in phase["topics"]:

            total_topics += 1

            if topic["completed"]:
                completed_topics += 1
            else:
                phase_completed = False

                if next_topic is None:
                    next_topic = topic["name"]


        if current_phase is None and not phase_completed:
            current_phase = phase["title"]


    progress = round(
        (completed_topics / total_topics) * 100,
        2
    )


    roadmap["statistics"] = {
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "remaining_topics": total_topics - completed_topics,
        "current_phase": current_phase,
        "next_topic": next_topic
    }


    roadmap["progress"] = progress


    return roadmap

