from app.db.db import roadmaps_collection
from bson import ObjectId


def calculate_progress(roadmap):

    total_topics = 0
    completed_topics = 0

    for phase in roadmap["phases"]:
        for topic in phase["topics"]:
            total_topics += 1

            if topic["completed"]:
                completed_topics += 1

    progress = (
        completed_topics / total_topics * 100
        if total_topics > 0 else 0
    )

    return {
        "progress": round(progress, 2),
        "completed_topics": completed_topics,
        "total_topics": total_topics,
        "remaining_topics": total_topics - completed_topics
    }
def complete_topic(
    roadmap_id: str,
    phase_index: int,
    topic_index: int
):

    roadmap = roadmaps_collection.find_one(
        {"_id": ObjectId(roadmap_id)}
    )

    if not roadmap:
        return None

    roadmap["phases"][phase_index]["topics"][topic_index]["completed"] = True

    stats = calculate_progress(roadmap)

    roadmaps_collection.update_one(
        {"_id": ObjectId(roadmap_id)},
        {
            "$set": {
                "phases": roadmap["phases"],
                "progress": stats["progress"]
            }
        }
    )

    return {
        "message": "Topic completed",
        "progress": stats["progress"]
    }
def get_progress_summary(roadmap_id: str):

    roadmap = roadmaps_collection.find_one(
        {"_id": ObjectId(roadmap_id)}
    )

    if not roadmap:
        return None

    stats = calculate_progress(roadmap)

    return {
        "goal": roadmap["goal"],
        **stats
    }

def get_current_topic(roadmap_id: str):

    roadmap = roadmaps_collection.find_one(
        {"_id": ObjectId(roadmap_id)}
    )

    if not roadmap:
        return None

    for phase_index, phase in enumerate(roadmap["phases"]):
        for topic_index, topic in enumerate(phase["topics"]):

            if not topic["completed"]:
                return {
                    "phase": phase["title"],
                    "topic": topic["name"],
                    "phase_index": phase_index,
                    "topic_index": topic_index
                }

    return {
        "message": "Roadmap completed"
    }