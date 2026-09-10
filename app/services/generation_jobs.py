import threading
import uuid

from app.services.goal_service import generate_goal

_jobs = {}


def start_goal_generation(data, user_id: str) -> str:
    job_id = str(uuid.uuid4())
    _jobs[job_id] = {"status": "queued", "user_id": user_id}

    def worker():
        _jobs[job_id] = {"status": "generating", "user_id": user_id}
        try:
            result = generate_goal(data, user_id)
            _jobs[job_id] = {"status": "complete", "user_id": user_id, **result}
        except Exception as error:
            _jobs[job_id] = {"status": "failed", "user_id": user_id, "error": str(error)}

    threading.Thread(target=worker, daemon=True).start()
    return job_id


def get_job(job_id: str):
    return _jobs.get(job_id)
