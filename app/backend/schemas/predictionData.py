from pydantic import BaseModel

class PredictionData(BaseModel):
    probability: float
    result: int