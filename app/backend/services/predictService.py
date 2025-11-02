import pickle
import pandas as pd

from app.backend.schemas.customerData import CustomerData
from app.backend.schemas.predictionData import PredictionData

# Load model once
model = pickle.load(open("app/backend/ml_models/best_GB_model.pkl", "rb"))

def predict_customer_churn(customer_data: CustomerData) -> PredictionData:
    """
    Predict customer churn based on input data.
    """
    try:
        # Create DataFrame with proper column names
        input_df = pd.DataFrame([{
            "gender": customer_data.gender,
            "SeniorCitizen": customer_data.SeniorCitizen,
            "Partner": customer_data.Partner,
            "Dependents": customer_data.Dependents,
            "tenure": customer_data.tenure,
            "PhoneService": customer_data.PhoneService,
            "MultipleLines": customer_data.MultipleLines,
            "InternetService": customer_data.InternetService,
            "OnlineSecurity": customer_data.OnlineSecurity,
            "OnlineBackup": customer_data.OnlineBackup,
            "DeviceProtection": customer_data.DeviceProtection,
            "TechSupport": customer_data.TechSupport,
            "StreamingTV": customer_data.StreamingTV,
            "StreamingMovies": customer_data.StreamingMovies,
            "Contract": customer_data.Contract,
            "PaperlessBilling": customer_data.PaperlessBilling,
            "PaymentMethod": customer_data.PaymentMethod,
            "MonthlyCharges": customer_data.MonthlyCharges,
            "TotalCharges": customer_data.TotalCharges
        }])

        # Predict churn probability
        prediction_probability = model.predict_proba(input_df)[0][1]
        result = int(prediction_probability >= 0.5)

        return PredictionData(
            probability=float(prediction_probability),
            result=result
        )

    except Exception as e:
        print(f"Error occurred during prediction: {e}")
        return PredictionData(probability=0.0, result=0)
