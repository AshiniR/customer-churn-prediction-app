# Customer Churn Prediction App

## Introduction
A full-stack web application that predicts customer churn probability using machine learning. Users can input customer data through a clean web interface and receive instant predictions from a trained gradient boosting model.

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 16+
- Git

### Backend Setup
1. **Create and activate virtual environment:**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. **Install dependencies:**
   ```powershell
   pip install -r app\backend\requirements.txt
   ```

3. **Run the backend:**
   ```powershell
   uvicorn app.backend.main:app --host 0.0.0.0 --port 8000
   ```
   
   Backend will be available at: `http://127.0.0.1:8000`

### Frontend Setup
1. **Navigate to frontend directory:**
   ```powershell
   cd app\frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Run development server:**
   ```powershell
   npm run dev
   ```
   
   Frontend will be available at: `http://localhost:3000/`

## Usage
1. Start both backend and frontend servers
2. Open `http://localhost:3000/` in your browser
3. Fill in customer information (or click "Fill example")
4. Click "Predict Churn" to get the prediction
5. View the churn probability and likelihood result

## Project Structure
```
customer-churn-prediction-app/
├── app/
│   ├── backend/
│   │   ├── main.py              # FastAPI application
│   │   ├── requirements.txt     # Python dependencies
│   │   ├── ml_models/          # Trained model files
│   │   ├── routers/            # API endpoints
│   │   ├── schemas/            # Pydantic models
│   │   └── services/           # Business logic
│   └── frontend/
│       ├── pages/              # Next.js pages
│       ├── package.json        # Node dependencies
│       └── package-lock.json
└── notebooks/                   # Jupyter notebooks
```