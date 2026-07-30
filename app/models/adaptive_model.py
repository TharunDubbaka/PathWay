from pydantic import BaseModel


class AdaptiveRequest(BaseModel):
    roadmap_id: str