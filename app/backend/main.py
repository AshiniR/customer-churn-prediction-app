from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.backend.routers import predictionRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predictionRouter.router, prefix="/predict", tags=["Prediction"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Customer Churn Prediction API"}
