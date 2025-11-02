from fastapi import APIRouter

from app.backend.schemas.customerData import CustomerData
from app.backend.schemas.predictionData import PredictionData
from app.backend.services.predictService import predict_customer_churn

router = APIRouter()

@router.post("/churn", response_model=PredictionData)
def predict(customer_data: CustomerData):
    """Predict customer churn based on input data."""
    return predict_customer_churn(customer_data)