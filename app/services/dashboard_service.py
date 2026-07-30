from bson import ObjectId
from app.db.db import roadmaps_collection


def get_dashboard(roadmap_id: str):

    roadmap = roadmaps_collection.find_one(
        {"_id": ObjectId(roadmap_id)}
    )

    if not roadmap:
        return None

    current_phase = None
    current_topic = None

    total_topics = 0
    completed_topics = 0

    for phase in roadmap["phases"]:

        for topic in phase["topics"]:

            total_topics += 1

            if topic["completed"]:
                completed_topics += 1

            elif current_topic is None:
                current_phase = phase["title"]
                current_topic = topic["name"]

    return {
        "goal": roadmap["goal"],
        "progress": roadmap.get("progress", 0),
        "completed_topics": completed_topics,
        "total_topics": total_topics,
        "current_phase": current_phase,
        "current_topic": current_topic
    }