from pydantic import BaseModel


class TopicProgressRequest(BaseModel):
    phase_index: int
    topic_index: int