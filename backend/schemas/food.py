from pydantic import BaseModel
from typing import List

class DetectedFood(BaseModel):
    id: int
    name: str
    portion: str
    calories: float
    protein: float
    carbs: float
    fat: float
    emoji: str
    color: str
    confidence: int

class DetectionResponse(BaseModel):
    items: List[DetectedFood]
